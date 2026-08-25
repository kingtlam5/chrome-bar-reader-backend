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
git clone https://github.com/kingtlam5/chrome-bar-reader-backend.git
cd chrome-bar-reader-backend
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

線上網站（已接 Clerk）係 https://kingtlam5.github.io/chrome-bar-reader-backend/ 。舊網址 https://kingtlam5.github.io/chrome-bar-reader-frontend/ 仲係未接會員系統嘅舊版，喺嗰度改密碼會永遠顯示「尚未接駁會員資料庫」。

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
- `signupPlan = pro` 且 `plan = free`：申請咗 Pro，付款尚未完成。**唔會**進入 Pro 會員中心
- Public metadata `plan = pro`：已有 Pro 權限（而家要喺 Clerk Dashboard 人手改；付款接通後先會自動寫入）

已存在、Unsafe `plan` 仍係 `"pro"` 嘅申請者：下一次登入會把 Unsafe `plan` 改返 `"free"`，並保留原有 `proRequestedAt`（冇先先補上）。之後只會進入免費會員中心。

## Admin：點樣改用戶帳號類型（必須改 Public）

網站只認 **Public metadata** 嘅 `plan` 決定進免費定 Pro 會員中心。Unsafe 可以由瀏覽器改，**唔好**當已付款／帳號類型。

1. 開 [Clerk Dashboard](https://dashboard.clerk.com)，揀 Readbar 呢個 app
2. 左側撳 **Users**，打開要改嘅用戶
3. 向下捲到 **User metadata**
4. 搵 **Public**（唔好改旁邊嘅 **Unsafe**）
5. 撳 Edit／鉛筆，把 JSON 改成其中一種，然後 **Save**

升級做 Pro：

```json
{
  "plan": "pro"
}
```

降返 Free trial：

```json
{
  "plan": "free"
}
```

6. 叫用戶重新整理會員中心，或者登出再登入。之後會自動去對應嘅 dashboard

注意：

- 只改 Unsafe 嘅 `plan` **唔會**開到 Pro。申請 Pro 而未付款嘅人，Unsafe 應該維持 `signupPlan: "pro"`、`plan: "free"`
- Public 設咗 `"pro"` 之後，用戶下次登入會把 Unsafe 嘅 `plan` 鏡像成 `"pro"`（方便你對照，但權限仍然只睇 Public）
- 會員中心「更改密碼」會呼叫 Clerk `user.updatePassword()`；新密碼最少 **15** 個字元（同註冊規則）。要用電郵／密碼正式登入，預覽 Dashboard 改唔到。登入超過約 10 分鐘後，會用你填嘅目前密碼再驗證一次 session，然後先改密碼。

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
