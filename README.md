# Readbar

辦公室隱蔽閱讀器：偽裝成 Chrome 工具列的 Web 閱讀器。註冊後即可使用全部功能，沒有 Free / Pro 方案。

本 repo 為後端工作用 duplicate。靜態頁面視為 UI 合約。後端接駁計劃見 [`BACKEND_DEVELOPMENT_PLAN.md`](./BACKEND_DEVELOPMENT_PLAN.md)（待審閱；未確認前不接駁真實會員／付款）。平台選擇同按功能分工見該文件第 A～C 節。

## 專案結構

- `index.html` — 產品官網 Landing Page
- `login.html` — 會員登入（Clerk 電郵／密碼）
- `register.html` — 註冊（Clerk 建立帳號）
- `dashboard.html` — 會員中心（啟動閱讀器、更改密碼）
- `reader.html` — 閱讀器（TXT／EPUB、20 張背景、Panic Button 等；須用 Clerk 電郵／密碼登入）
- `guide.html` — 閱讀器使用說明
- `dashboard-free-version.html`、`dashboard-pro-version.html` — 轉去 `dashboard.html`
- `reader-free-version.html`、`reader-pro-version.html` — 轉去 `reader.html`
- `payment.html` — 轉去 `dashboard.html`（舊付款頁已取消）
- `js/landing.js` — Landing Page 互動
- `js/clerk-client.js` — 載入 Clerk（使用 Publishable Key）
- `js/auth.js` — 會員狀態（Clerk session）
- `js/login.js` — 登入表單
- `js/register.js` — 註冊表單
- `js/reader-auth.js` — 閱讀器登入閘
- `js/dashboard.js` — 以獨立彈出視窗啟動閱讀器
- `css/style.css` — 共用樣式

## 本機測試

```bash
git clone https://github.com/kingtlam5/chrome-bar-reader-backend.git
cd chrome-bar-reader-backend
python3 -m http.server 8765
```

瀏覽器開：

- 官網：http://localhost:8765/index.html
- 登入：http://localhost:8765/login.html
- 註冊：http://localhost:8765/register.html
- 會員中心：http://localhost:8765/dashboard.html
- 使用說明：http://localhost:8765/guide.html

請以本地伺服器開啟，請勿直接雙擊 HTML。會員中心以獨立彈出視窗啟動閱讀器。閱讀器僅供電腦瀏覽器使用，流動裝置會顯示提示並無法開啟。

線上網站（已接 Clerk）係 https://kingtlam5.github.io/chrome-bar-reader-backend/ 。舊網址 https://kingtlam5.github.io/chrome-bar-reader-frontend/ 仲係未接會員系統嘅舊版。

閱讀器登入用 Clerk 電郵／密碼。若瀏覽器已有 Clerk session，從會員中心啟動閱讀器時會自動放行。

## 會員帳號

網站只要求已登入 Clerk 帳號，不再用 Public metadata 的 `plan` 分免費／Pro。舊帳號無論以前係 free trial 定申請過 Pro，登入後都進入同一個會員中心，並可使用全部閱讀功能。

會員中心「更改密碼」會呼叫 Clerk `user.updatePassword()`；新密碼最少 **15** 個字元（同註冊規則）。要用電郵／密碼正式登入，預覽會員中心改唔到。登入超過約 10 分鐘後，會用你填嘅目前密碼再驗證一次 session，然後先改密碼。

## 上傳偽裝背景

1. 最多 **20 張**全螢幕截圖
2. 按右上角紫色 **B** 按鈕（或 Shift + ↻）
3. 一次選取圖片（按選取順序填入第 1 至第 N 格）
4. 未上傳任何圖片時，下方顯示空白畫面
5. 以 **↻** 按鈕切換已上傳的背景

## 基本操作

| 操作 | 方法 |
|------|------|
| 匯入 TXT 或 EPUB | ★ 按鈕 |
| 上一句 / 下一句 | Q / R 或 ← / →（可自訂） |
| 簡轉繁 | ⇄ 按鈕（可自訂快捷鍵） |
| Panic Button | 空白鍵（可自訂） |
| 自訂快捷鍵 | B 按鈕右側三條橫線選單（設定會自動保存） |
| 上傳背景 | B 按鈕（最多 20 張） |
| 切換背景 | ↻ 按鈕 |
