# Stealth Reader

辦公室隱蔽閱讀器：偽裝成 Chrome 工具列的 Web 閱讀器。

## 專案結構

- `index.html` — 產品官網 Landing Page
- `login.html` — 會員登入
- `free.html` — 免費會員中心
- `dashboard.html` — Pro 付費會員中心
- `reader.html` — 核心隱蔽閱讀器（登入後由會員中心啟動）
- `js/landing.js` — Landing Page 互動
- `js/auth.js` — 靜態示範用會員狀態（免費 / Pro）
- `js/login.js` — 登入表單
- `js/dashboard.js` — 啟動閱讀視窗（Free 一般視窗 / Pro 無邊框 Popup）
- `css/style.css` — 共用樣式

## 本機測試

```bash
git clone https://github.com/kingtlam5/chrome-bar-reader-saas.git
cd chrome-bar-reader-saas
python3 -m http.server 8765
```

瀏覽器開：

- 官網：http://localhost:8765/index.html
- 登入：http://localhost:8765/login.html
- 免費會員：http://localhost:8765/free.html
- Pro 會員：http://localhost:8765/dashboard.html

## 上傳偽裝背景

1. 準備最多 **20 張**全螢幕截圖
2. 撳右上角紫色 **B** 掣（或 Shift + ↻）
3. 一次過選取圖片（按選取順序填入第 1 至第 N 格）
4. 未上傳任何圖片時，下方顯示空白畫面
5. 用 **↻** 掣切換已上傳嘅背景

## 基本操作

| 操作 | 方法 |
|------|------|
| 匯入書 | ★ 掣 |
| 上一句 / 下一句 | Q / R 或 ← / → |
| 簡轉繁 | ⇄ 掣 |
| 老闆模式 | 空白鍵 |
| 全螢幕彈出視窗 | 拼圖掣 |
| 上傳背景 | B 掣 |
| 切換背景 | ↻ 掣 |
