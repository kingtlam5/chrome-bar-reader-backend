# Stealth Reader 後端開發計劃

**狀態：** 待產品負責人（Tsz）審閱確認。未獲書面同意前，不安裝第三方 SDK、不接駁真實會員／付款、不改閱讀器核心。

**準則：** 資料安全與網頁安全永遠優先。功能方便、價錢、開發速度均為次要。優先用第三方接入現有頁面；我方自養的伺服器與敏感資料愈少愈好。

**產品契約：** 本 repo 的靜態頁面視為 UI 合約。不重新設計產品、不加 PWA／`manifest.json`／service worker、不改斷句／偽裝背景／Panic Button／EPUB·TXT 解析／快捷鍵。Windows `--app=` 捷徑只可出現於 Pro 會員中心。

---

## 0. 現況核對（已完成）

已對照本 duplicate repo（`kingtlam5/chrome-bar-reader-backend`）與產品合約。結論：**靜態 frontend 合約一致，尚未有真實後端。**

| 項目 | 現況 | 與合約 |
| --- | --- | --- |
| 官網／登入／註冊／付款／兩個會員中心／兩個閱讀器／使用說明 | 齊全 | 一致 |
| `js/auth.js` | `{ email, username, plan, nextPaymentAt? }` 存 `sessionStorage`，key `stealthReader.auth` | 示範用，非正式身份 |
| `js/login.js` | 不核對密碼；任何有效電郵都寫成 `free` | 待接駁 |
| 登入頁「預覽 Dashboard」 | 強制寫入 free／pro session | 正式環境必須移除 |
| `js/register.js` 免費 | 彈「未能成功註冊／未連接會員 API」 | 待接駁 |
| `js/register.js` Pro | `localStorage` `stealthReader.pendingSignup`（**未寫入密碼**）→ `payment.html` | 正確（密碼不可進 localStorage） |
| `payment.html` | 「確認付款」只改提示，不收費 | 待接駁 Stripe Checkout |
| 會員中心 `data-require-plan` | `free`／`pro` | 一致 |
| 啟動行為 `js/dashboard.js` | Free：`reader-free-version.html` 一般分頁；Pro：`window.open` → `reader-pro-version.html?popup=1` | 一致 |
| 免費進度 | `stealthMemoReader.free.v1` | 一致 |
| Pro 本機進度／雲端示範 | 閱讀器：`stealthMemoReader.v1` + `stealthMemoReader.cloud.v1`（後者仍寫 localStorage）；會員中心進度卡讀 `stealthMemoReader.v1` | 雲端仍為本機示範，符合「尚未接駁」 |
| 閱讀器閘門 | CSS overlay + **頁內 inline JS**；帳密寫死 `testing`／`testing`；**未接** `StealthAuth` | 接駁時必須保留 overlay 在閱讀器 HTML 內 |
| `--app=` 捷徑 | 只在 `dashboard-pro-version.html` | 一致；網址仍指向 GitHub Pages frontend，正式 domain 之後才改文案 |
| PWA | 沒有 `manifest.json`、沒有 service worker。Pro 閱讀器以 `display-mode: standalone` 偵測 Chrome `--app=` 視窗，**不是** PWA 安裝 | 不改 |
| 公開文案 | 已說明原生網址列仍然會顯示 | 一致 |

**刻意不改的範圍：** 閱讀器核心、公開頁／免費會員頁的啟動說明、設計風格（白底藍、Bricolage Grotesque + Noto Sans TC、藍色 header）、香港繁體中文產品文案。

---

## 1. 建議總覽（首選堆疊）

以「第三方持有敏感資料、我方只接現有頁面」為目標。唯一允許的自營例外，是極少量 **Cloudflare Worker**（秘密金鑰、webhook 驗簽、之後的雲端進度 API）。第一階段連 Worker 都不需要。

```text
瀏覽器（現有 HTML／JS）
    │  publishable key only
    ├─ Clerk  ── 註冊、登入、改密碼、電郵驗證、session cookie、username
    ├─ Stripe（經 Clerk Billing 或 Checkout）── 卡資料、每月 $2.99 訂閱、Customer Portal
    └─ Cloudflare Pages ── 靜態托管、HTTPS、WAF、CSP
            │
            └─ Cloudflare Worker（第二階段才加）
                 ├─ 建立 Checkout Session／轉發 webhook（若不用 Clerk Billing）
                 └─ 雲端進度：只存檔名 + 進度，永不存整本書
```

| 類別 | 首選 | 備選 | 否決 |
| --- | --- | --- | --- |
| 會員／身份 | **Clerk** | Firebase Identity Platform；Auth0（僅網站登入，不適閱讀器 overlay） | 自製密碼資料庫、Supabase 自管 Postgres 當主身份庫、Auth0 ROPG |
| 付款／訂閱 | **Stripe Billing + Checkout + Customer Portal**（優先經 Clerk Billing 以免我方持有 Stripe secret） | Paddle（Merchant of Record） | 前端寫死 secret、自收卡號、PayPal 作主閘道 |
| Domain／DNS／HTTPS | **Cloudflare Registrar + DNS + Universal SSL** | 其他註冊商 + Cloudflare DNS | 裸 HTTP、把 DNS 放在無 MFA 的註冊商 |
| 托管 | **Cloudflare Pages** | Netlify | 正式環境繼續用 GitHub Pages |
| 電郵驗證／重設密碼 | **Clerk 內建交易電郵** | Postmark（僅當 Clerk 不夠用） | 自架 SMTP、把重設連結做開放轉址 |
| 防濫用 | **Cloudflare Turnstile + WAF + Clerk 暴力破解防護** | Cloudflare Bot Fight | 無驗證的公開註冊 API、把 secret 放前端 |
| 雲端進度（後期） | **Cloudflare Worker + KV**，只存 `{ fileName, index, updatedAt }` | Clerk `privateMetadata`（容量小、不宜頻繁寫） | 上傳整本書、把書文明文存任何伺服器 |

---

## 2. 會員系統／身份驗證

### 2.1 首選：Clerk

**用來做甚麼**

- 免費註冊、電郵＋密碼登入、更改密碼、電郵驗證、忘記密碼
- 官方支援 **username**（網站用電郵登入；閱讀器用「用戶名稱」登入；同一套帳）
- Session：長效 `__client` 為 HttpOnly cookie（Clerk Frontend API domain）；應用程式 domain 的 `__session` JWT 壽命約 60 秒，降低 XSS 偷 token 的價值
- 用戶欄位建議只存：姓名、電郵、username、方案（`free`／`pro`）、Stripe customer／subscription id（如需要）
- 管理後台：停用帳號、審計、可選 TOTP 2FA（後期）
- 匯出／刪除：Clerk Dashboard + API，配合日後「刪除帳號」

**如何接入現有頁面（不改 UX 骨架）**

| 現有位置 | 接駁方式 |
| --- | --- |
| `register.html` 免費註冊 | 表單 submit → `Clerk.client.signUp.create({ emailAddress, password, username, firstName })` → 電郵驗證（若開啟）→ 寫 `publicMetadata.plan = "free"` → 轉 `dashboard-free-version.html`。成功後不再彈「未連接會員 API」。 |
| `register.html` 前往付款 | 先建立 Clerk 用戶（plan 仍為 free），**密碼只送去 Clerk，永不寫入 `pendingSignup`**。`pendingSignup` 只保留非敏感摘要（或改為 Clerk user id）。然後去 `payment.html`。 |
| `login.html` | 核對真實帳密；按 `publicMetadata.plan`（或 Clerk Billing 訂閱狀態）轉去 free／pro 會員中心。 |
| `js/auth.js` | 不再以 `sessionStorage` 為真相來源。改為讀 Clerk session；保留 `StealthAuth.get()` 形狀，以免大改會員中心 DOM。 |
| 更改密碼 modal | `user.updatePassword({ currentPassword, newPassword })`，成功文案改為香港繁體中文。 |
| 閱讀器 overlay | **閘門 HTML／inline JS 留在閱讀器檔案內。** 頁內載入 `clerk-js`，overlay submit 呼叫 `signIn.create({ identifier: username 或 email, password })`。成功後再檢查方案：free 閱讀器拒 Pro 以外？不——免費閱讀器給 free 會員；Pro 閱讀器必須 `plan === "pro"`。訪客未登入不能用。 |
| 登入頁預覽按鈕 | 開發／靜態示範可留；**正式環境必須刪除**（見第 8 節）。 |

Username 對應現有合約：註冊沒有獨立「用戶名稱」欄，現有 `auth.js` 用電郵 `@` 前面一段。接駁時沿用此規則寫入 Clerk username。若發生碰撞（兩個不同電郵同一 local-part），Clerk 會拒絕；屆時只在註冊失敗提示請改用另一電郵，不另加欄位，除非你要求。閱讀器「用戶名稱」欄同時接受 username **或** 完整電郵，減少客服摩擦。

**安全性優點**

- 我方**永不接觸、永不儲存明文密碼**；Clerk 以 salted hash 保存
- 正式環境不把 session 當成長效 `localStorage` token
- 前端只准出現 **Publishable Key**；`CLERK_SECRET_KEY` 只存在 Clerk Dashboard／Worker secrets
- SOC 2 Type II、GDPR DPA、可刪除／匯出用戶
- 內建洩漏密碼偵測、暴力破解限制、電郵驗證
- 與現有 **CSS overlay 閱讀器閘門**相容（不需 redirect 到第三方登入頁，避免 `window.open` popup 遺失 overlay）

**風險與緩解**

| 風險 | 緩解 |
| --- | --- |
| 密碼仍在我方頁面輸入，XSS 可即時偷到 | 嚴格 CSP、禁止 `eval`、不把用戶書文插入 HTML、Turnstile、短命 session JWT；後期可開 TOTP |
| `__session` cookie **不是** HttpOnly（約 60 秒） | 不把此 JWT 複製到 `localStorage`；依賴短 TTL |
| 會員資料主要由美國區處理 | 簽署 Clerk DPA；只收集姓名＋電郵＋username；不收集身分證、地址、書本內容 |
| clerk-js CDN 供應鏈 | 釘死版本、Subresource Integrity、只用 Clerk 官方 Frontend API domain |
| 生產／開發 instance 混用 | 分開 `pk_test_`／`pk_live_`；禁止 live key 出現在 Git |

**與產品合約**

- 無衝突：沿用現有表單與 overlay，不要求安裝 App，不改閱讀器核心
- 必須保留：閱讀器閘門在 **popup 視窗內的 overlay**（歷史上獨立 dialog 視窗會顯示不到）
- 訪客不可讀：會員中心已有 `data-require-plan`；閱讀器改為真認證後，沒有 session／驗證失敗則保持 locked

### 2.2 備選 A：Google Cloud Identity Platform（Firebase Auth）

- 密碼由 Google 處理，歷史悠久，App Check 防濫用
- **缺點（因此不作首選）：** 沒有一等 username（要另開資料庫對應，增加我方持有的資料）；預設 persistence 偏向 IndexedDB／localStorage，較易被 XSS 讀取；閱讀器 overlay 仍可呼叫 `signInWithEmailAndPassword`，但身份模型較不合現有「用戶名稱」欄

### 2.3 備選 B：Auth0（Okta）

- 合規證書最齊（SOC 2、ISO 27001、PCI 等），Universal Login 可令密碼**永不出現在我方 origin**（對官網登入最安全）
- **缺點（因此不作首選）：** 官方不鼓勵 SPA 使用 Resource Owner Password Grant。閱讀器 overlay **不能**改成整頁跳去 Auth0，否則離開閱讀器頁、popup 體驗破壞，亦違反「閘門留在閱讀器 HTML」的已驗證做法。若只把網站登入改成 Universal Login、閱讀器另用 ROPG，會做成兩套登入路徑，增加攻擊面。

### 2.4 否決

- 自製會員表＋bcrypt：我方直接持有密碼雜湊與重設流程，違反「少自養敏感資料」
- 把密碼寫入 `pendingSignup`／`sessionStorage`：明文或可還原秘密
- 前端寫死 `CLERK_SECRET_KEY`／Admin SDK

---

## 3. 付款閘道／訂閱

收費契約：Free $0；Pro **每月 USD $2.99，自動續訂**。

### 3.1 首選：Stripe Checkout + Billing + Customer Portal

**用來做甚麼**

- Pro 首次付款：Stripe-hosted Checkout（訂閱模式、自動續訂）
- 卡號、CVC、錢包只在 Stripe 頁面輸入（PCI DSS Level 1；我方 **SAQ-A** 等級，不碰卡資料）
- 免費會員「升級至 Pro」：同一 Checkout
- Pro「管理訂閱」：Stripe Customer Portal（更新卡、取消、發票）
- Webhook：`checkout.session.completed`、`customer.subscription.updated`、`customer.subscription.deleted`、`invoice.payment_failed` → 更新 Clerk 的 plan

**方案狀態（必須伺服器端／Clerk 端，不可只信前端）**

| Stripe 狀態 | 產品 plan |
| --- | --- |
| `active`、`trialing` | `pro` |
| `past_due`（寬限期） | 暫維持 `pro`，會員中心提示更新付款 |
| `canceled`、`unpaid`、`incomplete_expired` | `free`；已開的 Pro 閱讀器下次閘門核對時拒絕 |

**如何接入現有頁面**

| 現有位置 | 接駁方式 |
| --- | --- |
| `payment.html`「確認付款」 | 改為 redirect 到 Stripe Checkout（或 Clerk Billing checkout）。成功 URL 回 `dashboard-pro-version.html`；取消回 `payment.html`。文案已預留 Stripe。 |
| `register.html`「前往付款」 | 先有 Clerk 帳（free）再進付款頁，Checkout 的 `client_reference_id`／metadata 帶 Clerk `userId` |
| 免費會員「升級至 Pro」 | 關閉「尚未連接付款閘道」modal，改開 Checkout |
| Pro「管理訂閱」 | 關閉同一 modal，改開 Customer Portal |
| 成功後 | **只**由 webhook／Clerk Billing 把 plan 改成 `pro`。禁止前端自己 `StealthAuth.set({ plan: "pro" })` |

**優先用 Clerk Billing 包住 Stripe 的原因**

- Checkout／Portal 可由已登入 Clerk session 啟動，**我方不必持有 `STRIPE_SECRET_KEY`**
- 訂閱狀態寫在 Clerk 用戶上，會員中心與閱讀器閘門讀同一來源
- 生產仍要你連接自己的 Stripe 帳戶（Clerk 文件規定），卡資料仍只經 Stripe

若 Clerk Billing 的結帳 UI 無法自然塞進現有 `payment.html`，則退回「Cloudflare Worker 建立 Checkout Session」：Worker 持有 Stripe secret，瀏覽器只拿到 session URL。這是允許的最小後端例外。

**安全性優點**

- 完整卡資料永不經過我方伺服器或 repo
- Webhook 必須驗簽（`Stripe-Signature` 或 Clerk Billing signing secret），拒絕假付款通知
- 不在前端顯示可猜的「已付款所以是 Pro」
- Stripe 不把卡資料提供給我方作訓練用途；我方亦不把書本上傳 Stripe

**風險與緩解**

| 風險 | 緩解 |
| --- | --- |
| 假 webhook 把人升級成 Pro | 驗簽、拒絕 unsigned、endpoint 只接受 POST、冪等處理 event id |
| success URL 被當成已付款 | success 頁只顯示「正在確認」；plan 以 Clerk／Stripe 為準 |
| Checkout `success_url` 開放轉址 | 白名單只准本站 origin |
| $2.99 貨幣／稅 | Stripe 商品明確 USD；稅務日後再談，不因此自收卡 |

**與產品合約：** 無衝突。維持「註冊 Pro → 付款頁 → 會員中心」。不要求安裝 App。不把 `--app=` 放到付款頁。

### 3.2 備選：Paddle（Merchant of Record）

Paddle 代收稅、代當賣方，合規負擔較低。卡資料同樣不經我方。不作首選，是因為與 Clerk 用戶的 webhook 對帳較間接，而且本產品已在 `payment.html` 預留 Stripe。若你日後主要賣往歐盟、希望 MoR 處理 VAT，可再評估，不影響第一階段。

### 3.3 否決

- 在 `payment.html` 放卡號欄
- Lemon Squeezy／自製週期扣款而把 secret 寫進 JS
- 只改 `sessionStorage.plan = "pro"` 而無 webhook

---

## 4. Domain／DNS／HTTPS

### 4.1 首選：Cloudflare Registrar + Cloudflare DNS + Universal SSL

**用來做甚麼：** 離開 `*.github.io` 預設網址；全站 HTTPS；DNSSEC；較少中間商。

**接入：** 不改頁面流程。正式 origin 例如 `https://<your-domain>/`。Pro 會員中心 `--app=` 範例指令改為此 origin 的 `reader-pro-version.html`（只改 Pro 頁該段文案，不改閱讀器核心）。

**安全性優點：** 免費 Universal SSL、強制 HTTPS、DNSSEC、Registrar lock、帳戶應開 MFA。Cloudflare 作 DNS 時可一併開 WAF。

**風險：** 網域與 DNS 在同一供應商，帳戶被盜影響面較大 → 強制 MFA、把帳戶電郵放在獨立密碼箱。這仍比「註冊商無 MFA + 另家 DNS 設錯」安全。

**備選：** 網域留在現有註冊商，**DNS 改指向 Cloudflare**（同樣能 HTTPS／WAF）。只要 NS 不放在無 2FA 的面板即可。

**否決：** 正式環境繼續用 `github.io`（共用 origin 生態、安全標頭能力弱、無法當 webhook 終端）。

**CORS 白名單（Worker 用，第二階段）：** 正式 domain、`http://localhost:8765`（與現有 README 本機測試一致）。不准 `*`。

---

## 5. 網站托管

### 5.1 首選：Cloudflare Pages

**用來做甚麼：** 繼續托管這套靜態 HTML／CSS／JS；自動 HTTPS；可設安全標頭；同帳戶加 Worker。

**接入：** 現有檔案結構不變（`index.html`、`login.html`…）。GitHub repo 連接 Pages 作 CI 發布。本機仍可用 `python3 -m http.server 8765`。

**安全性優點**

| 標頭 | 用途 |
| --- | --- |
| `Strict-Transport-Security` | 只走 HTTPS |
| `Content-Security-Policy` | 限制腳本來源（Clerk、Stripe、現有 Google Fonts／Tailwind CDN），減輕 XSS |
| `frame-ancestors 'none'` | 防 clickjacking（閱讀器 overlay 在本頁，不需被 iframe） |
| `Referrer-Policy: strict-origin-when-cross-origin` | 減少電郵／token 經 Referer 洩漏 |
| `Permissions-Policy` | 關閉相機／咪高峰等 |

另可開 Cloudflare WAF 規則：對 `/js/*` 以外的可疑 POST 限速；封鎖已知 bot。

**風險：** 現時各頁用 `cdn.tailwindcss.com` 瀏覽器端編譯，屬供應鏈風險。第一階段不改設計；硬化階段應改為建置時編譯並加上 SRI。這不是產品改版，只是發布方式。

### 5.2 備選：Netlify

類似靜態托管＋函式。WAF 多在付費方案。若已有 Netlify 帳戶可用，但安全控制面不如 Cloudflare 一個帳戶打通 DNS＋WAF＋Pages＋Worker。

### 5.3 否決作正式托管：GitHub Pages

適合而家靜態示範，不適合收錢與真登入。

---

## 6. 電郵驗證、密碼重設、防濫用

### 6.1 首選：Clerk 內建電郵 + Cloudflare Turnstile

| 功能 | 做法 |
| --- | --- |
| 驗證電郵 | Clerk 發驗證信；未驗證不可進會員中心（免費註冊完成後先驗證） |
| 重設密碼 | Clerk 重設信；連結只回本站 `login.html` 相關路徑，**禁止開放 `redirect_url`** |
| 註冊／登入 bot | Turnstile 放在現有表單（隱形或 checkbox）；Clerk 後台開 bot／leaked password 防護 |
| 閱讀器閘門 | 同一 Turnstile 或依賴 Clerk 的 rate limit，避免 `testing` 被換成真 API 後被撞庫 |

**安全性：** 交易電郵由 Clerk 送，我方不持有 SMTP 密碼。Turnstile 比 reCAPTCHA 少把行為資料交給 Google。

**備選電郵：** 若要自訂「功能建議」回條，用 **Postmark**（交易電郵、DMARC）。不要用私人 Gmail。

**與產品合約：** 註冊頁可加一句「請查收驗證電郵」，不改版面骨架。

---

## 7. 雲端進度（後期；不是第一階段）

產品承諾：**只傳送閱讀進度與檔名，不可以將整本書以明文存去伺服器。**

免費版維持本機 `stealthMemoReader.free.v1`。

Pro 現時把「雲端」示範寫入本機 `stealthMemoReader.cloud.v1`。接駁時：

- API 允許欄位：`fileName`（檔名）、`index`（句序）、`total?`、`updatedAt`
- **拒絕** body 內的書文、EPUB、TXT、背景圖
- 以 Clerk session JWT 識別用戶；KV key = `progress:{userId}`
- 閱讀器核心同步邏輯可留到你明確批准後才改；即便改，也只換 storage adapter，不改斷句／Panic／偽裝

**否決：** Firebase Storage／S3 放整本書「方便多機」。

---

## 8. 網頁安全對照清單

實作時必須滿足；方便與否不作取捨。

| 威脅 | 做法 |
| --- | --- |
| XSS | CSP；不把書文當 HTML insert；不把 token 放 `localStorage` |
| CSRF | Clerk cookie SameSite；改變狀態的 Worker 要求 Bearer JWT 或驗簽 webhook，不靠「純 cookie + 無 CSRF token」的跨站 POST |
| Session 劫持 | HTTPS、短命 `__session`、登出呼叫 Clerk `signOut` 並清示範用 storage |
| 開放轉址 | Checkout／登入 redirect 白名單 |
| CORS | 只准正式 origin + 本機測試 origin |
| 安全 cookie | 依賴 Clerk／Stripe 托管 cookie 的 Secure／HttpOnly 設定；我方不自製 session cookie |
| Webhook 假通知 | 簽名驗證，失敗回 400 |
| Popup 與網站共用身份 | 同一 origin，才能共用 Clerk cookie。**禁止**用 query string 把 JWT 傳進 `window.open` URL |
| `--app=` 捷徑 | 仍要過閱讀器 overlay；不可做成「捷徑即免登入」 |
| 前端秘密 | 只准 publishable key |
| 示範後門 | 正式環境移除登入頁「預覽 Dashboard」、移除 `testing`／`testing` |
| 供應商 | Clerk／Stripe／Cloudflare 帳戶開 MFA；API key 權限最小化；定期看審計日誌 |
| PCI | 永遠 hosted Checkout／Portal，永不自收卡 |

**閱讀器 popup 特別約束**

已驗證可行做法：閘門 = 閱讀器 HTML 內 CSS overlay + inline JS。未在真實 `window.open` popup 驗證前，**不把閘門搬去 `js/auth.js` 或獨立頁。** 只在 overlay 的 submit handler 改為呼叫 Clerk。

---

## 9. 資料最少化

我方（及我方可讀的第三方欄位）只應有：

- 姓名、電郵、username、plan、訂閱到期日、Stripe 顧客／訂閱 id
- Pro 雲端進度：檔名＋句序（後期）
- 功能建議（後期才離開 `localStorage`）

不應有：明文密碼、完整信用卡、書本文本、偽裝背景圖上傳到伺服器、政府身分證件。

香港《個人資料（私隱）條例》：我方是資料使用者；Clerk／Stripe／Cloudflare 是處理者。上線前準備簡短私隱說明（香港繁體中文）與各供應商 DPA。本計劃不是法律意見。

Clerk／Stripe 合約下，顧客內容不作我方模型訓練用途；我方亦承諾不把用戶書文送去任何 AI 或日誌。Webhook 日誌不可 dump 書文（本來就不應收到）。

---

## 10. 現有頁面對接流程（確認後才做）

維持：

```text
官網 → 註冊（免費或 Pro）→（Pro）付款 → 會員中心 → 啟動閱讀器
官網 → 登入 → 按方案進入對應會員中心 → 啟動閱讀器
```

| 步驟 | 現在 | 接駁後 |
| --- | --- | --- |
| 免費註冊 | 失敗 modal | Clerk 建立 free 會員 →（驗證電郵）→ 免費會員中心 |
| Pro「前往付款」 | `pendingSignup` 無密碼 | Clerk 建立帳後去 `payment.html` |
| 確認付款 | 提示未接駁 | Stripe Checkout；webhook 把 plan 設為 pro |
| 登入 | 不查密碼、一律 free | 真帳密；按 plan 分流 |
| 更改密碼 | 「尚未接駁會員資料庫」 | Clerk updatePassword |
| 升級／管理訂閱 | 「尚未連接付款閘道」 | Checkout／Customer Portal |
| 閱讀器閘門 | `testing`／`testing` | 同一套會員；訪客不可用 |
| 預覽 Dashboard | 示範後門 | 正式環境刪除 |

---

## 11. 分階段（獲確認後）

### 階段 0 — 你需要開的帳戶（無程式碼）

1. Clerk 應用程式（分開 Development／Production）
2. Stripe 帳戶（生產要連 Clerk Billing 或單獨用）
3. Cloudflare 帳戶（Pages + 之後 Worker）
4. 正式 domain（可稍後；開發先用 Pages `*.pages.dev` 並鎖 CORS）
5. 所有帳戶開 MFA

此階段仍不寫業務程式，直到本計劃獲你確認。

### 階段 1 — 最小可用切片（你指定的第一刀）

**只做：** 免費註冊 → 真登入 → 受保護會員中心 session。

- 接 `register.html` 免費路徑
- 接 `login.html`（按 plan 分流；新註冊者為 free）
- `auth.js` 改讀 Clerk；`data-require-plan` 繼續有效
- 更改密碼接 Clerk
- 開發模式才顯示預覽按鈕；文件標明生產必須刪
- **不做：** Stripe、雲端進度、改閱讀器斷句／偽裝／Panic、PWA

付款閘道明確列為階段 2。

### 階段 2 — 付款

- Stripe 產品 Price = USD 2.99／月
- `payment.html`、升級、管理訂閱
- Webhook／Clerk Billing 更新 plan
- Pro 會員中心「下次自動扣款」改讀真實週期完結日

### 階段 3 — 閱讀器同一套帳密

- 只改兩個閱讀器 **overlay 文案與 submit 邏輯**（仍 inline）
- 刪 `DEMO_USERNAME`／`DEMO_PASSWORD`
- Pro 閱讀器要求 `plan === "pro"`；free 閱讀器給已登入會員（免費功能限制維持現有前端契約）
- 在真實 `window.open` popup 驗證 overlay 仍可見、Clerk 可登入

### 階段 4 — 硬化與 domain

- 自訂 domain、`--app=` 範例 URL 更新（只 Pro 會員中心）
- CSP、HSTS、Turnstile
- 移除預覽後門與所有 `testing` 文案
- Tailwind 改建置時編譯（不改外觀）

### 階段 5 — 雲端進度（需你再批准改閱讀器儲存層）

- Worker + KV；欄位白名單；永不存書文

---

## 12. 需要你確認的事項

請回覆是否同意以下首選（可逐項改）：

1. **會員：Clerk**（現有表單 + 閱讀器 overlay 內呼叫；username + email）
2. **付款：Stripe**（優先 Clerk Billing；否則 Worker 建 Checkout Session）
3. **托管／DNS／HTTPS：Cloudflare Pages + Cloudflare DNS**
4. **電郵：Clerk 內建；防 bot：Turnstile**
5. **第一刀只做階段 1**（免費註冊／真登入／會員中心 session），付款留待下一階段
6. 正式環境刪除登入頁預覽 Dashboard 與 `testing`／`testing`
7. 雲端進度只存檔名＋句序；整本書永不上傳

確認後才開始階段 1 實作。在此之前不會安裝 SDK、不會改閱讀器核心、不會把 `--app=` 放到公開頁或免費會員頁。
