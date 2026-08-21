# Stealth Reader

辦公室隱蔽閱讀器：偽裝成 Chrome 工具列的 Web 閱讀器。

## 專案結構

- `index.html` — 產品官網 Landing Page
- `login.html` — 會員登入
- `register.html` — 免費／Pro 註冊（示範；尚未接駁會員資料庫）
- `payment.html` — Pro 付款閘道參考頁（尚未接駁真實付款）
- `dashboard-free-version.html` — 免費會員中心
- `dashboard-pro-version.html` — Pro 付費會員中心
- `reader-free-version.html` — 免費版閱讀器（TXT、2 張背景、本機進度）
- `reader-pro-version.html` — 付費版閱讀器（EPUB、簡轉繁、20 張背景、Panic Button 等）
- `guide.html` — 免費版 / Pro 版閱讀器使用說明
- `js/landing.js` — Landing Page 互動
- `js/auth.js` — 靜態示範用會員狀態（免費 / Pro）
- `js/login.js` — 登入表單
- `js/register.js` — 註冊表單（免費顯示未接 API 提示／Pro 前往付款頁）
- `js/dashboard.js` — 啟動閱讀視窗（Free 一般分頁 / Pro 獨立彈出視窗）
- `js/pro-reader-login.js` — Pro 閱讀器開啟時的登入彈窗（示範帳密：testing / testing）
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

請以本地伺服器開啟，請勿直接雙擊 HTML。免費會員由免費會員中心以一般分頁啟動閱讀器；Pro 由付費會員中心以獨立彈出視窗啟動。

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
