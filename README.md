# Stealth Memo Reader

偽裝成 Chrome 工具列的隱蔽閱讀器。

## 測試最新版本

### 方法 A：GitHub Pages（最簡單）

1. 合併 PR [#10](https://github.com/kingtlam5/memo-reader/pull/10) 到 `main`
2. 等 1–2 分鐘
3. 開啟：https://kingtlam5.github.io/memo-reader/

> 未合併 PR 前，GitHub Pages 仍係舊版 `main`。

### 方法 B：本機測試（唔使合併 PR）

```bash
git clone https://github.com/kingtlam5/memo-reader.git
cd memo-reader
git checkout cursor/fake-chrome-toolbar-7fb4
python3 -m http.server 8765
```

瀏覽器開：**http://localhost:8765/index.html**

> 必須用 local server，直接雙擊 `index.html` 可能無法載入 `assets/` 圖片。

## 上傳自訂偽裝背景（唔使改 assets 資料夾）

1. 準備好 6 張截圖（Outlook、Trello、Excel、PIM、Shopify、Colourliving）
2. 開啟 reader 後，撳右上角紫色 **B** 掣
3. 一次過選 6 張圖（順序同上）
4. 圖片會儲存在瀏覽器 IndexedDB，重新整理後仍然有效
5. 用 **↻** 掣切換背景

快捷方式：按住 **Shift** 再撳 **↻** 亦可上傳背景。

## 基本操作

| 操作 | 方法 |
|------|------|
| 匯入書 | ★ 掣 |
| 上一句 / 下一句 | Q / R 或 ← / → |
| 簡轉繁 | ⇄ 掣 |
| 老闆模式 | 空白鍵 |
| 全螢幕彈出視窗 | 拼圖掣 |
| 切換背景 | ↻ 掣 |
