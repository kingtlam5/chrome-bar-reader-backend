# Stealth Reader 後端開發計劃

**狀態：** 待產品負責人（Tsz）審閱確認。未獲書面同意前，不安裝第三方 SDK、不接駁真實會員／付款、不改閱讀器核心。

**準則：** 資料安全與網頁安全永遠優先。功能方便、價錢、開發速度均為次要。優先用第三方接入現有頁面；我方自養的伺服器與敏感資料愈少愈好。

**產品契約：** 本 repo 的靜態頁面視為 UI 合約。不重新設計產品、不加 PWA／`manifest.json`／service worker、不改斷句／偽裝背景／Panic Button／EPUB·TXT 解析／快捷鍵。Windows `--app=` 捷徑只可出現於 Pro 會員中心。

**點樣讀呢份文件：** 第 A、B 節用現有頁面解釋（適合審閱）。第 0 節之後係技術附錄。

---

## A. 用現有頁面理解：其實改緊咩

而家成個網站已經有齊畫面，只係按鈕多數係「假動作」。後端工作**不是**再做一套新網站，而係令現有掣按下去之後，真正記得你係邊個、免費定 Pro、有冇俾過錢。

可以想像成三間外包公司，各自專責一件客人睇得到嘅事：

| 客人見到嘅事 | 而家發生咩 | 接駁後發生咩 | 建議交俾邊間公司 |
| --- | --- | --- | --- |
| 註冊、登入、改密碼、閱讀器遮罩登入 | 不查密碼；閱讀器只認 `testing` | 同一套真實帳密 | 會員系統（首選 Clerk） |
| 「確認付款」「升級至 Pro」「管理訂閱」 | 彈「尚未接駁」 | 去安全結帳頁／管理訂閱頁，每月 $2.99 自動續訂 | 付款公司（首選 Stripe） |
| 網址列出現咩網址、網站放邊 | GitHub Pages 示範網址 | 自己嘅網址 + 鎖頭（HTTPS） | 托管／域名（首選 Cloudflare） |

密碼同信用卡**唔會**經我哋自己寫嘅資料庫。我負責改現有 HTML／JS 嘅按鈕接駁；你負責開嗰啲公司嘅帳戶、開雙重驗證、同試一次「當普通客人」嘅流程。

---

## B. 其他選擇，同點解揀呢幾個

揀平台時，只問三條「前端」問題：

1. **客人喺邊度輸入密碼／信用卡？** 愈唔經我哋自己嘅伺服器愈安全。
2. **可唔可以沿用而家嘅頁同按鈕？** 唔好跳去另一套完全唔同嘅畫面（尤其閱讀器遮罩）。
3. **我哋要額外保管嘅資料愈少愈好。**

### B1. 會員系統（註冊／登入／改密碼／閱讀器遮罩）

閱讀器有一個硬限制：登入畫面一定要留喺閱讀器頁入面嗰層遮罩（以前試過拎去另一個彈出視窗，會顯示唔到）。所以「整頁跳去別人公司嘅登入頁」呢類做法，**網站登入得，閱讀器唔得**。

| 選擇 | 客人體驗（你而家啲頁） | 安全 | 點解揀／唔揀 |
| --- | --- | --- | --- |
| **Clerk（首選）** | `register.html`／`login.html` 表單可以留低；閱讀器遮罩都用同一套電郵或用戶名稱＋密碼 | 密碼由 Clerk 保管，我哋睇唔到明文；有現成改密碼、驗證電郵、忘記密碼 | **最啱現有畫面。** 網站用電郵登入、閱讀器用「用戶名稱」登入，Clerk 兩樣都支援，唔使我哋另開名單記「邊個電郵對應邊個用戶名稱」 |
| **Firebase（Google）（備選）** | 同樣可以留現有表單同遮罩 | Google 基礎設施好成熟；但登入狀態預設較易留喺瀏覽器可讀位置 | 穩陣，可是 **無「用戶名稱」呢個現成欄**。網站電郵、閱讀器用戶名稱就要我哋另外記一份對照表，等於多管一堆會員資料，同「少自己養資料」相反 |
| **Auth0（Okta）（備選，但閱讀器不合）** | 通常會離開 `login.html`，跳去 Auth0 自己個登入頁（可以做成好似我哋風格） | 企業合規證書最齊；密碼可以完全唔喺我哋網址出現 | **官網登入好安全，閱讀器遮罩唔啱。** 遮罩唔可以整頁跳走；Auth0 官方亦不鼓勵喺網頁直接用密碼去問佢哋。若網站跳 Auth0、閱讀器另一套，變成兩條登入路徑，較易出事 |
| **Supabase** | 可以接表單 | 密碼都唔明文，但等於我哋自己多一個資料庫要睇住 | 同「唔想自己養後端」相反，**唔用** |
| **自己寫會員表** | 完全控制畫面 | 我哋要保管密碼（即使加密都係我哋責任） | **否決** |

**一句 justification：** 唔係因為 Clerk 最平或者最好寫，而係 **唯一可以同時滿足「現有表單唔改版」「閱讀器遮罩唔跳頁」「網站電郵＋閱讀器用戶名稱同一套帳」「我哋唔保管密碼」** 嘅成熟服務。Firebase 第二；Auth0 只適合你肯改閱讀器登入方式嗰陣（而家唔建議）。

### B2. 付款（Pro $2.99／月、升級、取消）

`payment.html` 而家已經寫住之後會去 Stripe 或其他結帳頁。客人唔應該喺我哋頁面輸入卡號。

| 選擇 | 客人按掣之後 | 安全 | 點解揀／唔揀 |
| --- | --- | --- | --- |
| **Stripe Checkout + 顧客入口（首選）** | 「確認付款」離開我哋頁，去 Stripe 結帳；「管理訂閱」去 Stripe 幫你準備好嘅頁（改卡、取消、發票） | 卡號只喺 Stripe 出現，我哋連睇都睇唔到。行業標準 | **畫面契約已預留 Stripe。** 月費自動續訂、升級、取消都有現成頁，唔使我哋自製「信用卡表格」 |
| **Clerk Billing（包住 Stripe）** | 看起來仍係「確認付款」去結帳，背後用你嘅 Stripe 帳戶 | 同上；好處係「已付款＝Pro」由 Clerk 記住，減少我哋自己對帳 | **優先試呢條。** 少一層我哋要保管嘅付款密鑰。生產仍要你開 Stripe 帳戶 |
| **Paddle（備選）** | 同樣跳去 Paddle 結帳頁 | 卡亦唔經我哋；Paddle 代當賣方、代收稅 | 歐盟稅務較省事，但同現有「Stripe」文案唔一致，同會員狀態對帳較迂迴。若日後主要賣歐洲再考慮 |
| **PayPal 訂閱（不選作主閘道）** | 好多時要有 PayPal 戶口；返回網站後「到底有冇訂到」較易對唔齊 | 卡可以唔經我哋，但訂閱狀態同會員中心較易脫節 | 取消訂閱、失敗扣款、升級按鈕難以對應而家兩個 modal。**可作 Stripe 入面一個付款方式，唔好當主系統** |
| **喺 payment.html 加卡號欄** | 客人以為方便 | 我哋要跟信用卡合規，風險極高 | **否決** |

**一句 justification：** Stripe 係「客人按現有付款掣 → 去一頁唔屬於我哋嘅結帳 → 成功先變 Pro」。Paddle 係稅務替代方案，唔係更安全。PayPal 單獨做主閘道會令「升級／管理訂閱」兩個現有掣難以對應真實狀態。

### B3. 網站放邊、網址、鎖頭（HTTPS）

| 選擇 | 客人網址列 | 安全 | 點解揀／唔揀 |
| --- | --- | --- | --- |
| **GitHub Pages（而家）** | `xxx.github.io/...` | 得示範；好似把舖擺喺共用走廊，安全門同門鎖選擇好少 | **示範可以，收錢同真登入唔好留喺度** |
| **Cloudflare Pages + DNS（首選）** | 之後你自己嘅域名，例如 `https://你嘅域名/` | 網址、鎖頭、防火牆同一間公司；可以禁止其他人把我哋網站嵌進別頁 | 少一個「帳戶被盜入口」。Pages 仍然只係放而家呢堆 HTML／CSS／JS，**唔改版面** |
| **Netlify（備選）** | 都可以用自己域名 | 靜態托管成熟；防火牆多要加錢 | 得，但域名／防火牆／之後小功能要拆去第二間 |
| **Vercel（備選）** | 同上 | 偏重 React／Next 專案 | 我哋係靜態 HTML，用唔着佢最強嗰邊；唔值得為咁多一個帳戶 |

**一句 justification：** 唔係因為 Cloudflare 最平，而係 **真登入之後需要自己嘅網址同鎖門**；GitHub Pages 做唔到呢層。Cloudflare 可以域名、網站、防火牆一齊管，減少你要記住嘅後台。

### B4. 驗證電郵、忘記密碼、防機械人

| 選擇 | 客人見到咩 | 點解 |
| --- | --- | --- |
| **Clerk 內建電郵（首選）** | 註冊後收到驗證信；登入頁可加「忘記密碼」 | 我哋唔使自己開 Gmail 代寄，避免把郵箱密碼放喺專案 |
| **Postmark／Resend（備選）** | 自訂信件外觀 | 只當 Clerk 信件到達率唔夠，或者之後「功能建議」要回條 |
| **Cloudflare Turnstile（首選防 bot）** | 註冊／登入可能見到一個輕量勾選（好似 captcha，但較少追蹤） | 防止機械人大量開假帳。Google reCAPTCHA 亦得，但會把行為資料交俾 Google，次選 |
| **自己 SMTP／私人 Gmail** | 看似免費 | **否決**：郵箱被盜＝所有重設密碼信落入人手 |

### B5. 你若想換首選，可以點改

- 會員改 Firebase：得，但閱讀器「用戶名稱」要額外設計，我會先同你確認點顯示。
- 付款改 Paddle：得，`payment.html` 文案要改「Stripe」做「Paddle」；升級／管理訂閱仍然對住兩個現有掣。
- 托管改 Netlify：得，安全上可接受，只係域名同防火牆要另外管。
- 堅持 Auth0 Universal Login：只適合你肯把閱讀器遮罩改成「先返網站登入再啟動」。呢個會改 UX，**而家唔建議**。

---

## C. 按功能嘅執行計劃（邊樣先做；你負責／我負責）

原則：跟住客人由官網行到閱讀器嘅順序。**每一個功能做完，網站都仲係而家呢套畫面**，只係掣由假變真。未輪到嘅掣維持而家嘅提示。

圖例： **你**＝要喺瀏覽器開帳戶、撳後台、用自己電郵試一次。 **我**＝改現有頁嘅按鈕同提示文案，唔改閱讀器斷句／偽裝／Panic。

### 總順序

| 次序 | 功能（客人角度） | 做完之後你可以點試 | 依賴 |
| --- | --- | --- | --- |
| 0 | 開帳戶同鎖好後台 | 三個網站登入得到、已開雙重驗證 | 無 |
| 1 | 免費註冊 | 填 `register.html` → 唔再彈失敗 → 進入免費會員中心，見到自己電郵 | 0 |
| 2 | 真登入＋會員中心守衛 | 錯密碼入唔到；free 唔可以開 Pro 會員中心；預覽後門唔再公開 | 1 |
| 3 | 更改密碼 | 會員中心「更改密碼」真係改到，再用新密碼登入 | 2 |
| 4 | 閱讀器遮罩用同一套帳 | 唔再用 `testing`；未登入／錯密碼睇唔到書；Pro 閱讀器要 Pro | 2 |
| 5 | 驗證電郵＋忘記密碼 | 信箱收到信；未驗證唔好當已登入；忘記密碼可重設 | 1 |
| 6 | Pro 註冊 → 付款頁 → 真結帳 | 「前往付款」→「確認付款」去結帳頁 → 成功後係 Pro 會員中心 | 2 |
| 7 | 免費會員「升級至 Pro」 | 免費會員中心個掣去同一結帳，唔再彈「尚未連接」 | 6 |
| 8 | Pro「管理訂閱」（改卡／取消） | 去官方管理頁；取消後到期變回免費 | 6 |
| 9 | 自己嘅域名同正式網站位置 | 網址列唔再係 github.io；Pro 捷徑說明只改網址 | 2（付款可已完成） |
| 10 | 雲端進度（最後，要再批准） | Pro 換裝置只同步檔名同進度，**唔上傳整本書** | 4、9 |

功能 1～4 係「免費會員行得通」。功能 6～8 係「收錢」。功能 10 先會掂閱讀器儲存，所以放到最後。

---

### 功能 0 — 開帳戶（先做；幾乎全係你）

**客人仲見唔到任何分別。** 只係準備後台。

| 任務 | 邊個 | 你要做嘅具體動作（非工程術語） |
| --- | --- | --- |
| 開 Clerk 帳戶，建立一個應用程式（Development） | **你** | 用你電郵註冊 [clerk.com](https://clerk.com)，開雙重驗證。應用名稱可叫 Stealth Reader。喺設定打開 Email＋Password，以及 Username |
| 開 Stripe 帳戶（測試模式即可） | **你** | 註冊 [stripe.com](https://stripe.com)，開雙重驗證。暫時唔使開真收款 |
| 開 Cloudflare 帳戶 | **你** | 註冊 [cloudflare.com](https://cloudflare.com)，開雙重驗證。域名可以遲啲先買 |
| 把「可以公開」嘅 Clerk 鑰匙交俾我 | **你** | Clerk 後台 API Keys 有一條 **Publishable Key**（公開用，可以放網站）。**Secret Key 唔好貼上 GitHub、唔好公開聊天傳送。** 用 Cursor／GitHub secrets 或私下安全通道 |
| 寫頁面接駁 | 我 | 等你確認本計劃同交到 publishable key 之後先開始 |
| 買正式域名 | **你（可稍後）** | 功能 9 先需要。建議 Cloudflare 買，或者而家註冊商轉 DNS 去 Cloudflare |

---

### 功能 1 — 免費註冊（第一個客人功能）

**頁面：** `register.html` 揀 Free →「免費註冊」

**而家：** 彈「未能成功註冊／未連接會員 API」。  
**做完：** 真係開到免費會員，然後去免費會員中心，右上角顯示你嘅電郵。版面、藍色 header、欄位（姓名／電郵／密碼／Free·Pro）唔改。

| 任務 | 邊個 |
| --- | --- |
| 改「免費註冊」掣：成功就去免費會員中心；失敗就用而家個 modal 講清楚原因（例如電郵已註冊） | **我** |
| 用戶名稱沿用而家規則（電郵 `@` 前面），唔加新欄 | **我** |
| 密碼只送去 Clerk，唔寫入瀏覽器暫存 | **我** |
| 用一個你平時用嘅電郵試註冊，睇會員中心係咪你嘅電郵 | **你** |
| 去 Clerk 後台 Users 確認出現咗嗰個用戶 | **你** |
| 確認香港繁體中文提示（成功／電郵已被使用）得唔得 | **你** |

**未做：** Pro 付款、閱讀器、驗證電郵（功能 5 先強制）。

---

### 功能 2 — 真登入＋會員中心守衛

**頁面：** `login.html`；`dashboard-free-version.html`／`dashboard-pro-version.html`

**而家：** 任何有效電郵都當免費；下面「預覽 Dashboard」可以扮 Pro。  
**做完：** 要真密碼；免費會員開 Pro 會員中心會被送返正確頁；未登入會去登入頁。登入頁「預覽 Dashboard」喺正式環境刪走（開發預覽可另開方法，唔好公開）。

| 任務 | 邊個 |
| --- | --- |
| 登入表單改為核對真實帳密；按免費／Pro 開對應會員中心 | **我** |
| 會員中心繼續用而家嘅 `data-require-plan` 守衛，但改睇真身份，唔再信瀏覽器隨便寫嘅 plan | **我** |
| 登出掣真係登出 | **我** |
| 生產環境移除「預覽 Dashboard」兩個連結 | **我** |
| 試：錯密碼、對密碼、未登入直接開 dashboard 網址、免費帳開 Pro 頁 | **你** |

呢個功能完咗，官網 → 登入 → 免費會員中心 呢條路先算「真」。

---

### 功能 3 — 更改密碼

**頁面：** 兩個會員中心「更改密碼」modal

**而家：** 提交後話尚未接駁會員資料庫。  
**做完：** 填而家密碼＋新密碼，真係改到；之後用新密碼先登入到。Modal 外觀唔改，只改結果提示。

| 任務 | 邊個 |
| --- | --- |
| 接駁現有表單 | **我** |
| 用功能 1 開嘅帳試改密碼，登出再用新密碼入 | **你** |

---

### 功能 4 — 閱讀器遮罩（同一套會員；訪客唔用得）

**頁面：** `reader-free-version.html`、`reader-pro-version.html` 打開時嗰層登入遮罩。  
**啟動方式唔改：** 免費＝一般分頁；Pro＝彈出視窗。

**而家：** 用戶名稱／密碼都係 `testing`。  
**做完：** 要用註冊時嗰套（用戶名稱或電郵＋密碼）。錯就顯示而家句「用戶名稱或密碼不正確」。**遮罩仍然留喺閱讀器入面**，唔會改斷句、背景、Panic、EPUB。Pro 彈出視窗要真係試過遮罩顯示得到。

| 任務 | 邊個 |
| --- | --- |
| 只改遮罩「登入」掣同示範文案；刪 `testing` | **我** |
| 免費閱讀器：已登入會員用得；Pro 閱讀器：要 Pro | **我** |
| 未登入／訪客：遮罩唔打開閱讀器 | **我** |
| 由免費會員中心啟動，確認一般分頁遮罩；由 Pro（付款後）確認彈出視窗遮罩 | **你**（Pro 彈窗可喺功能 6 後再驗一次） |
| 確認我冇改閱讀器核心（睇書、切背景、Panic） | **你** |

功能 2 完之前唔做呢項，否則未有真帳。

---

### 功能 5 — 驗證電郵、忘記密碼、防機械人

**頁面：** 註冊後提示查收電郵；登入頁可加返「忘記密碼」（而家未有呢條連結，會用細字加喺表單下，唔改版面風格）。

| 任務 | 邊個 |
| --- | --- |
| 開 Clerk 電郵範本，寄件者名稱改 Stealth Reader；信件用香港繁體中文（Clerk 後台可改） | **你** 改範本；**我** 提供建議文案 |
| 未驗證電郵：註冊後提示去查信，唔好直接當已入會員中心（若你想註冊完即入，話我知，安全會較弱） | **你** 揀規則；**我** 跟規則接掣 |
| 忘記密碼信只可以返回我哋網站，唔可以跳去任意網址 | **我** |
| Turnstile 加喺註冊／登入（盡量隱形） | **我** 接；**你** 喺 Cloudflare 開 Turnstile 網站 key |
| 用你電郵睇信有冇入垃圾箱 | **你** |

---

### 功能 6 — Pro 付款（第二組客人功能）

**頁面：** `register.html` 揀 Pro →「前往付款」→ `payment.html`「確認付款」

**而家：** 暫存姓名電郵（無密碼）→ 確認付款只改一句「尚未接駁」。  
**做完：** 先開好會員（仍然未當 Pro）→ 付款頁顯示姓名電郵同 $2.99 → 去 Stripe 結帳 → 成功先進入 **Pro 會員中心**。取消付款就返付款頁。唔會喺我哋頁要你輸入卡號。

| 任務 | 邊個 |
| --- | --- |
| Stripe 後台新增產品：Pro，每月 USD 2.99，自動續訂 | **你**（我可以逐步話你撳邊） |
| 「確認付款」改去官方結帳頁；成功／取消返回現有頁 | **我** |
| 確保未成功付款唔可以靠改瀏覽器變 Pro | **我** |
| 用 Stripe 測試卡（例如 `4242…`）走一次，確認去到 Pro 會員中心、見到下次扣款日 | **你** |
| `payment.html` 香港繁體中文提示確認 | **你** |

---

### 功能 7 — 免費「升級至 Pro」

**頁面：** 免費會員中心而家個藍色掣／modal「尚未連接付款閘道」。

**做完：** 已登入免費會員撳掣 → 同一 Stripe 結帳 → 成功後改去 Pro 會員中心。唔另開新流程。

| 任務 | 邊個 |
| --- | --- |
| 換掉 modal 行為，對住功能 6 同一條結帳 | **我** |
| 用免費試帳走一次升級 | **你** |

---

### 功能 8 — Pro「管理訂閱」

**頁面：** Pro 會員中心同一款 modal，而家話尚未連接付款閘道。

**做完：** 去 Stripe 顧客入口：改卡、取消自動續訂、睇發票。取消後，到期日前仍可 Pro；到期後變免費會員中心。

| 任務 | 邊個 |
| --- | --- |
| 掣改去官方管理頁 | **我** |
| 取消後到期，確認網站跟住降回免費（唔好永遠 Pro） | **我** 接狀態；**你** 用測試訂閱取消一次驗收 |

---

### 功能 9 — 正式網址同托管

**客人見到：** 網址列換成你嘅域名；鎖頭；Pro 會員中心 `--app=` 說明入面嗰條網址要改（**只改呢段，而且只喺 Pro 頁**）。

| 任務 | 邊個 |
| --- | --- |
| 買域名或把 DNS 指去 Cloudflare | **你** |
| 把而家靜態網站接到 Cloudflare Pages | **我** 可代設定 repo；**你** 喺 Cloudflare 授權 GitHub |
| 安全門（只准 HTTPS、減少惡意嵌入） | **我** |
| 更新 Pro 捷徑範例網址 | **我** |
| 用新網址行一次註冊／登入／付款測試 | **你** |

---

### 功能 10 — 雲端進度（最後；要你再批准）

**客人承諾：** 只同步檔名同讀到第幾句，**唔上傳整本書、唔上傳偽裝截圖。**  
免費版繼續只存你部瀏覽器。

| 任務 | 邊個 |
| --- | --- |
| 批准先至改閱讀器「儲存進度」嗰層（核心斷句仍然唔改） | **你** |
| 接駁；拒絕任何書文上載 | **我** |
| 兩部瀏覽器試：只見到同一檔名同百分比 | **你** |

---

### 每段功能完成時，我會點交俾你驗

1. 改現有掣，唔開新頁取代 UX。  
2. 用香港繁體中文提示。  
3. 話你知要撳邊個後台、用邊個測試電郵／測試卡。  
4. 等你話「呢個功能 OK」先做下一個。  

**而家仍然停喺計劃。** 你確認第 B 節首選（或講想換邊個），同完成功能 0 嘅帳戶之後，我先做功能 1。

---

## D. 興趣項目預算：免費計劃、會員上限、回本

數字以 2026 年 8 月公開價目為準（[Clerk](https://clerk.com/pricing)、[Stripe 香港](https://stripe.com/en-hk/pricing)、[Cloudflare Pages](https://developers.cloudflare.com/pages/platform/limits/)、[Turnstile](https://developers.cloudflare.com/turnstile/plans/)）。匯率按 **1 USD ≈ 7.8 HKD** 估算。正式開 Stripe 帳戶後以後台顯示為準。

### D1. 首選平台有冇免費計劃？

**有。興趣項目可以全程唔交月費給 Clerk／Cloudflare。** 唯一幾乎一定會扣嘅，係有人真係俾 Pro 嗰陣，Stripe（同 Clerk Billing）抽每筆手續費。冇人付費＝平台月費可以係 $0。

| 平台 | 免費計劃 | 興趣項目夠唔夠 | 最平要畀錢嘅計劃 |
| --- | --- | --- | --- |
| **Clerk 會員** | Hobby **$0**，每應用最多 50,000 個「每月回頭用戶」 | 夠。免費＋Pro 加埋都好難去到呢個數 | Pro **US$25／月**（年繳約 $20） |
| **Clerk Billing** | 所有 Clerk 計劃都包住，**無月費** | 夠 | 只抽成交額 **0.7%**（同自己開 Stripe Billing 一樣，唔係雙重加價） |
| **Stripe 收款** | **無月費、無開戶費** | 夠 |  succed 一筆先抽一筆。香港標準：**本地卡 3.4% + HK$2.35**；若以 **USD 結算：3.4% + US$0.30**。海外卡再 +0.5%；要換匯再 +2% |
| **Cloudflare Pages 托管** | Free：**無限流量**、每月 500 次網站更新、可綁自己域名 | 夠。我哋呢堆靜態頁好細 | Pro **US$25／月**（興趣項目唔需要） |
| **Turnstile 防機械人** | Free，驗證次數不限（個人／中小企用途） | 夠 | 企業先至要傾 |
| **域名（可選）** | 唔買都可以用 `*.pages.dev` | 收錢建議買自己域名 | 普通 `.com` 大約 **US$10–15／年**（約每月 US$1） |

用現有畫面、自己寫表單嘅話，Clerk Hobby 唔顯示品牌都無問題（品牌限制主要係佢哋預製登入元件）。Hobby **無 MFA、無自訂電郵範本、登入狀態固定 7 日**。興趣項目可以接受：閱讀器本身每次打開都要再入密碼。

**若你想驗證信一定係香港繁體中文：** Clerk 免費計劃唔可以自訂電郵範本，信件可能係英文。要中文範本先至需要 Clerk Pro（US$25／月）。呢樣可以遲啲先升，唔影響先做免費註冊。

### D2. 免費／最平計劃可以撐幾多會員？幾時要升級？

「會員」要分開兩種，因為兩間公司計法唔同：

- **註冊人數（免費＋Pro）：** Clerk 先至理。而且只計 **註冊超過 24 小時之後仲有返嚟** 嘅人（試完唔返嘅免費客唔計）。
- **付費 Pro 人數：** Stripe 先至理。免費會員 **$0 手續費**。

| 情況 | 免費計劃撐唔撐到 | 幾時先要俾月費 |
| --- | --- | --- |
| 幾十、幾百、甚至幾千個註冊（大多數免費） | 完全喺 Clerk Hobby 內 | 唔使 |
| 每月回頭用戶去到 **50,000** | Hobby 硬上限；有一個月寬限 | 升 Clerk Pro US$25／月，超出部分約 US$0.02／人 |
| 想開 MFA、自訂中文電郵、封鎖特定用戶 | Hobby 無呢啲 | 升 Clerk Pro（同人數無關） |
| 網站流量好大 | Cloudflare Pages 免費流量已標無限 | 呢個專案唔使升 Cloudflare |
| 之後先做雲端進度 | Cloudflare Worker 免費額對「只存檔名＋句序」通常夠 | 先至到每日極大量請求先考慮 Workers 付費（而家唔使預） |
| 有人取消訂閱、退款、拒付 | Stripe 跟每單計 | 香港爭議費約 **HK$85／單**，同月費無關；興趣項目量少 |

**粗略感覺：** 呢個興趣產品，你 visitable 嘅上限係「Clerk 5 萬回頭客」，唔係「Stripe 要你交月費」。未去到呢個規模之前，**平台月費可以維持 $0**（域名除外）。

### D3. 而家 $2.99 可唔可以回本？要收幾錢？要幾多 Pro 先抵銷開支？

先講結論（客人角度）：

1. **平台本身可以 $0／月。** 所以「回本」唔係要賺返一筆大月費，而係每一個 Pro 扣完信用卡手續費之後，仲有冇剩。
2. **$2.99 仍然賺到**（有人付費就有淨收入），但細額月費俾 Stripe 嗰筆「每單固定費」食得好勁，大約一成四手續費。
3. **若重新定價，興趣項目較健康嘅地板大約係每月 US$4.99～6.99**（約 HK$39～55）。唔係平台逼你加價，而係 $2.99 太細，固定手續費占比高。
4. **抵銷每月營運：** 維持免費平台 → **0 個 Pro 都得**（或者 1 個 Pro 就夠一年域名）。只有你選擇升 Clerk Pro（中文電郵／MFA）嗰陣，先至要用幾個付費會員去填 US$25。

#### 每收一個 Pro，扣完手續費剩幾多？

假設：香港 Stripe、價錢以 **USD 結算**（3.4% + US$0.30）＋ Clerk／Stripe Billing **0.7%**。未計海外卡 +0.5%、換匯 +2%、USD 出糧去港銀可能再 1%。

| 你向客人標價（每月） | 約合港幣 | 大約手續費 | 你實收 | 手續費占比 |
| --- | --- | --- | --- | --- |
| **US$2.99**（而家） | HK$23 | ≈ US$0.42 | ≈ **US$2.57** | ≈ 14% |
| US$3.99 | HK$31 | ≈ US$0.46 | ≈ US$3.53 | ≈ 12% |
| **US$4.99** | HK$39 | ≈ US$0.50 | ≈ **US$4.49** | ≈ 10% |
| US$5.99 | HK$47 | ≈ US$0.55 | ≈ US$5.44 | ≈ 9% |
| **US$6.99** | HK$55 | ≈ US$0.59 | ≈ **US$6.40** | ≈ 8% |
| US$9.99 | HK$78 | ≈ US$0.71 | ≈ US$9.28 | ≈ 7% |

若改為 **港幣標價、本地卡**（3.4% + HK$2.35 + 0.7%），$2.99 等值約 HK$23 同樣大約扣 **HK$3.3、實收 HK$20**，比例相近。細價單最大敵人係嗰筆固定費（US$0.30 或 HK$2.35），所以愈平占比愈高。

#### 要幾多個付費會員先填到一個月開支？

| 你選擇嘅營運方式 | 每月固定開支 | $2.99 要幾個 Pro | $4.99 要幾個 Pro | $6.99 要幾個 Pro |
| --- | --- | --- | --- | --- |
| **興趣／免費平台**（建議而家咁） | **US$0** | **0** | 0 | 0 |
| 另加自己域名 | ≈ US$1 | **1** | 1 | 1 |
| 升 Clerk Pro（中文電郵／MFA） | US$25 | ≈ **10** | ≈ **6** | ≈ **4** |
| Clerk Pro + 域名 | ≈ US$26 | ≈ **11** | ≈ **6** | ≈ **5** |
| 再加 Cloudflare Pro（唔建議） | 再 +US$25 | 興趣項目唔需要 |  |  |

免費會員 **唔會**幫你交 Stripe 費，亦幾乎 **唔會**令你要交 Clerk 月費（除非回頭客去到 5 萬）。所以回本只計 **Pro 付費人數**。

#### 定價建議（仍然等你決定，未改官網）

- **想盡量唔使自己貼錢：** 維持免費平台；Pro 可以暫留 **$2.99**。第一個付費客人已經係正數。
- **想手續費看起來合理、又唔想做成「貴版」：** 改去 **US$4.99／月**（約 HK$39）。畫面仍然係而家個 Pro 卡，只改標價。
- **想少幾個付費客就填到將來 Clerk Pro：** **US$6.99／月**（約 HK$55）大約 4 個 Pro 就填到 US$25。
- **唔建議低過 $2.99：** 固定手續費會再食多一截；亦容易俾人覺得係「唔認真嘅訂閱」，拒付風險相對高（單次爭議約 HK$85，已經大過一個月 Pro）。

官網而家寫住 Free $0、Pro $2.99。若你決定改價，等確認後我先改文案同 Stripe 產品，唔會自己改。

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

客人角度嘅執行順序、你／我分工以 **第 C 節** 為準。以下係對應關係：功能 0＝階段 0；功能 1～3＝階段 1；功能 4＝階段 3 提前（真登入後盡快收起 `testing`）；功能 5 可同 3～4 重疊；功能 6～8＝階段 2；功能 9＝階段 4；功能 10＝階段 5。

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

請回覆是否同意以下首選（可改用第 B 節備選）：

1. **會員：Clerk**（現有表單 + 閱讀器遮罩；唔用 Auth0 跳頁）
2. **付款：Stripe**（優先 Clerk Billing）
3. **托管／DNS：Cloudflare Pages + Cloudflare DNS**
4. **電郵：Clerk 內建；防 bot：Turnstile**
5. **執行順序跟第 C 節：** 功能 0（你開帳戶）→ 功能 1 免費註冊 → 功能 2 真登入 → 功能 3 改密碼 → 功能 4 閱讀器同一套帳 → 之後先做付款
6. 正式環境刪除登入頁預覽 Dashboard 與 `testing`／`testing`
7. 雲端進度只存檔名＋句序；整本書永不上傳

確認後先做功能 1。在此之前不會安裝 SDK、不會改閱讀器核心、不會把 `--app=` 放到公開頁或免費會員頁。
