# Readbar

辦公室隱蔽閱讀器：偽裝成 Chrome 工具列的 Web 閱讀器。

## 專案結構

- `index.html` — 產品官網 Landing Page
- `login.html` — 會員登入（Clerk 電郵／密碼）
- `register.html` — 免費／Pro 註冊（Clerk 建立帳號；Pro 付款閘道仍為參考頁）
- `payment.html` — Pro 付款閘道參考頁（尚未接駁真實付款）
- `dashboard-free-version.html` — 免費會員中心
- `dashboard-pro-version.html` — Pro 付費會員中心
- `reader-free-version.html` — 免費版閱讀器（TXT、2 張背景、本機進度；開啟時須以 testing / testing 登入）
- `reader-pro-version.html` — 付費版閱讀器（EPUB、簡轉繁、20 張背景、Panic Button 等；開啟時須以 testing / testing 登入）
- `guide.html` — 免費版 / Pro 版閱讀器使用說明
- `js/landing.js` — Landing Page 互動
- `js/clerk-client.js` — 載入 Clerk（使用 Publishable Key）
- `js/auth.js` — 會員狀態（Clerk session 同步免費 / Pro）
- `js/login.js` — 登入表單（Clerk 電郵／密碼）
- `js/register.js` — 註冊表單（Clerk 建立帳號／Pro 前往付款頁）
- `js/dashboard.js` — 啟動閱讀視窗（Free 一般分頁 / Pro 獨立彈出視窗）
- `js/guide.js` — 使用說明頁 Free / Pro 切換
- `css/style.css` — 共用樣式

## 本機測試

```bash
git clone https://github.com/kingtlam5/chrome-bar-reader-frontend.git
cd chrome-bar-reader-frontend
python3 -m http.server 8765
```

瀏覽器開：

- 官網：http://localhost:8765/index.html
- 登入：http://localhost:8765/login.html
- 註冊：http://localhost:8765/register.html
- 免費會員：http://localhost:8765/dashboard-free-version.html
- Pro 會員：http://localhost:8765/dashboard-pro-version.html
- 使用說明：http://localhost:8765/guide.html

請以本地伺服器開啟，請勿直接雙擊 HTML。免費會員由免費會員中心以一般分頁啟動閱讀器；Pro 由付費會員中心以獨立彈出視窗啟動。閱讀器僅供電腦瀏覽器使用，流動裝置會顯示提示並無法開啟。

## 點樣分辨 Free trial 同 Pro 申請

註冊時會把方案寫入 Clerk user 的 **Unsafe metadata**（付款接通前，Pro 只代表「申請咗」，未代表已付款）：

| 欄位 | Free trial | 申請咗 Pro（未付款） | 已是 Pro（付款接通後） |
|------|------------|----------------------|------------------------|
| `signupPlan` | `"free"` | `"pro"` | `"pro"` |
| `plan` | `"free"` | `"free"` | `"pro"` |
| `proRequestedAt` | （無） | ISO 時間 | 保留申請時間 |

喺 [Clerk Dashboard](https://dashboard.clerk.com) → **Users** → 打開該用戶 → 向下捲到 **Metadata** → **Unsafe**。

第一版 Clerk 接駁只寫咗 `name` 同 `plan`，所以舊用戶而家會睇唔到 `signupPlan`／`proRequestedAt`。合併呢次改動之後，佢哋下一次登入會員中心就會自動補上；新註冊會即時寫入。

- `signupPlan = free`：純粹 free trial
- `signupPlan = pro` 且 `plan = free`：申請咗 Pro，付款尚未完成
- `plan = pro`：已有 Pro 權限（而家付款閘道未接，所以新註冊唔會出現呢個狀態）

Clerk 用戶列表本身冇按 metadata 過濾。要一次過列出全部申請者，需要 `CLERK_SECRET_KEY` 用 [Backend API 拉 users](https://clerk.com/docs/reference/backend-api/tag/users/get/users)，再篩 `unsafe_metadata.signupPlan === "pro"`。

## 上傳偽裝背景

1. 免費版最多 **2 張**；Pro 最多 **20 張**全螢幕截圖
2. 按右上角紫色 **B** 按鈕（或 Shift + ↻）
3. 一次選取圖片（按選取順序填入第 1 至第 N 格）
4. 未上傳任何圖片時，下方顯示空白畫面
5. 以 **↻** 按鈕切換已上傳的背景

## 基本操作

| 操作 | 方法 | 方案 |
|------|------|------|
| 匯入 TXT | ★ 按鈕 | Free / Pro |
| 匯入 EPUB | ★ 按鈕 | Pro |
| 上一句 / 下一句 | Free：← / →；Pro：Q / R 或 ← / →（可自訂） | Free / Pro |
| 簡轉繁 | ⇄ 按鈕（Pro 可自訂快捷鍵） | Pro |
| Panic Button | 空白鍵（Pro 可自訂） | Pro |
| 自訂快捷鍵 | B 按鈕右側三條橫線選單（設定會自動保存） | Pro |
| 上傳背景 | B 按鈕 | Free 2 張 / Pro 20 張 |
| 切換背景 | ↻ 按鈕 | Free / Pro |
