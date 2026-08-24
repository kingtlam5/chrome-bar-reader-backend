(() => {
  "use strict";

  const STORAGE_KEY = "readbar.lang";
  const listeners = [];

  const STRINGS = {
    "lang.aria": { "zh-Hant": "語言", "en": "Language" },

    "nav.pain": { "zh-Hant": "安心閱讀", "en": "Read at ease" },
    "nav.features": { "zh-Hant": "核心功能", "en": "Features" },
    "nav.pricing": { "zh-Hant": "價格方案", "en": "Pricing" },
    "nav.guide": { "zh-Hant": "使用說明", "en": "User guide" },
    "nav.faq": { "zh-Hant": "常見問題", "en": "FAQ" },
    "nav.loginCta": { "zh-Hant": "免費試用／登入", "en": "Try free / Log in" },
    "nav.login": { "zh-Hant": "登入", "en": "Log in" },
    "nav.home": { "zh-Hant": "產品官網", "en": "Product site" },
    "nav.register": { "zh-Hant": "註冊", "en": "Sign up" },
    "nav.logout": { "zh-Hant": "登出", "en": "Log out" },
    "nav.account": { "zh-Hant": "會員資料", "en": "Account" },
    "nav.menu": { "zh-Hant": "開啟選單", "en": "Open menu" },
    "nav.backRegister": { "zh-Hant": "返回註冊", "en": "Back to sign up" },
    "footer.backHome": { "zh-Hant": "← 返回產品官網", "en": "← Back to product site" },
    "footer.pricing": { "zh-Hant": "價格", "en": "Pricing" },
    "common.close": { "zh-Hant": "關閉", "en": "Close" },
    "common.gotIt": { "zh-Hant": "知道了", "en": "Got it" },
    "common.done": { "zh-Hant": "完成", "en": "Done" },
    "common.username": { "zh-Hant": "用戶名稱", "en": "Username" },
    "common.password": { "zh-Hant": "密碼", "en": "Password" },
    "common.email": { "zh-Hant": "電郵", "en": "Email" },
    "common.name": { "zh-Hant": "姓名", "en": "Name" },
    "common.plan": { "zh-Hant": "方案", "en": "Plan" },
    "common.yes": { "zh-Hant": "有", "en": "Yes" },
    "common.no": { "zh-Hant": "無", "en": "No" },

    "meta.index.title": { "zh-Hant": "Readbar｜辦公室隱蔽閱讀器", "en": "Readbar | Stealth office web reader" },
    "meta.index.description": {
      "zh-Hant": "專為上班族設計的偽裝式網頁閱讀器。句子顯示於 Chrome 網址列，畫面可呈現工作截圖，讓閱讀融入日常操作。",
      "en": "A camouflaged web reader for office workers. Sentences appear in the Chrome address bar, and the page can show a work screenshot so reading blends into everyday work."
    },
    "meta.login.title": { "zh-Hant": "會員登入｜Readbar", "en": "Member login | Readbar" },
    "meta.login.description": {
      "zh-Hant": "登入 Readbar 會員中心。訪客須先登入，方可開啟閱讀器。",
      "en": "Log in to the Readbar member centre. Guests must sign in before opening the reader."
    },
    "meta.register.title": { "zh-Hant": "免費註冊｜Readbar", "en": "Free sign-up | Readbar" },
    "meta.register.description": {
      "zh-Hant": "註冊 Readbar 免費或 Pro 會員。填寫姓名、電郵、密碼並選擇方案。",
      "en": "Create a free or Pro Readbar account. Enter your name, email, and password, then choose a plan."
    },
    "meta.payment.title": { "zh-Hant": "付款｜Readbar", "en": "Payment | Readbar" },
    "meta.payment.description": {
      "zh-Hant": "Readbar Pro 付款閘道示範頁。尚未接駁真實付款服務。",
      "en": "Readbar Pro payment-gateway preview. Live payment is not connected yet."
    },
    "meta.guide.title": { "zh-Hant": "使用說明｜Readbar", "en": "User guide | Readbar" },
    "meta.guide.description": {
      "zh-Hant": "Readbar 免費版與 Pro 版閱讀器使用說明。匯入書本、切換偽裝背景、Panic Button 與自訂快捷鍵。",
      "en": "How to use the free and Pro Readbar readers: import a book, switch camouflage backgrounds, Panic Button, and custom shortcuts."
    },
    "meta.dashFree.title": { "zh-Hant": "免費會員中心｜Readbar", "en": "Free member centre | Readbar" },
    "meta.dashFree.description": {
      "zh-Hant": "免費會員可進行基本 TXT 閱讀。升級 Pro 即可解鎖偽裝主題、Panic Button 與雲端同步。",
      "en": "Free members can read TXT files. Upgrade to Pro to unlock camouflage tools, Panic Button, and cloud sync."
    },
    "meta.dashPro.title": { "zh-Hant": "付費會員中心｜Readbar", "en": "Pro member centre | Readbar" },
    "meta.dashPro.description": {
      "zh-Hant": "Pro 會員專用：啟動隱蔽閱讀器、查看閱讀進度，並管理偽裝設定。",
      "en": "For Pro members: launch the stealth reader, check reading progress, and manage camouflage settings."
    },

    "index.badge": { "zh-Hant": "辦公室隱蔽閱讀器 · 免安裝", "en": "Stealth office reader · No install" },
    "index.hero.h1": {
      "zh-Hant": "在辦公室<wbr>安心享受<wbr>你專屬的<wbr>閱讀時光",
      "en": "Enjoy your own reading time at the office"
    },
    "index.hero.lead": {
      "zh-Hant": "專為上班族設計的偽裝式網頁閱讀器。句子顯示於 Chrome 網址列，畫面可呈現工作截圖；Pro 可以獨立彈出視窗開啟。Panic Button 一鍵將書本句子換成預設或自訂的偽裝網址，背景維持工作截圖。閱讀器僅供電腦瀏覽器使用。",
      "en": "A camouflaged web reader for office workers. Sentences appear in the Chrome address bar, and the page can show a work screenshot. Pro can open in a standalone popup. Panic Button replaces the book sentence with a default or custom disguised URL; the background stays. The reader is for computer browsers only."
    },
    "index.hero.ctaLogin": { "zh-Hant": "免費試用／登入", "en": "Try free / Log in" },
    "index.hero.ctaPricing": { "zh-Hant": "查看價格方案", "en": "See pricing" },
    "index.hero.point1": { "zh-Hant": "🌐 免安裝，瀏覽器即用", "en": "🌐 No install — use it in the browser" },
    "index.hero.point2": { "zh-Hant": "🕵️ Pro 獨立彈出視窗，減少分頁列", "en": "🕵️ Pro standalone popup, fewer tab bars" },
    "index.hero.point3": { "zh-Hant": "⚡ Panic Button 一鍵換成偽裝網址", "en": "⚡ Panic Button swaps in a disguised URL" },
    "index.mock.url": {
      "zh-Hant": "面對絕對的困境，唯一的辦法就是讓自己變得絕對強大。",
      "en": "In absolute hardship, the only way out is to become absolutely strong."
    },
    "index.mock.kicker": { "zh-Hant": "上司接近時", "en": "When your boss approaches" },
    "index.mock.title": { "zh-Hant": "空白鍵即可換成偽裝網址", "en": "Press Space to switch to a disguised URL" },
    "index.mock.body": {
      "zh-Hant": "網址列的書本句子會改為預設或自訂文字，背景維持工作截圖。",
      "en": "The sentence in the address bar becomes default or custom text. The work-screenshot background stays."
    },

    "index.pain.kicker": { "zh-Hant": "Read at Ease", "en": "Read at Ease" },
    "index.pain.h2": {
      "zh-Hant": "安心閱讀：<wbr>看起來像工作，<wbr>實際在閱讀",
      "en": "Read at ease: looks like work, actually reading"
    },
    "index.pain.lead": {
      "zh-Hant": "一般電子書應用、瀏覽器分頁或額外套層，都容易露出閱讀痕跡。Readbar 以偽裝網址列、工作截圖背景，以及 Pro 的獨立彈出視窗與 Panic Button，讓閱讀融入日常操作。",
      "en": "E-book apps, browser tabs, or extra overlays are easy to spot. Readbar uses a camouflaged address bar, a work-screenshot background, and — on Pro — a standalone popup and Panic Button, so reading blends into everyday work."
    },
    "index.pain.badKicker": { "zh-Hant": "一般閱讀方式", "en": "Typical reading" },
    "index.pain.badH3": { "zh-Hant": "容易露出破綻", "en": "Easy to get caught" },
    "index.pain.bad1": { "zh-Hant": "電子書應用的圖示與排版，遠看即可辨識", "en": "E-book app icons and layouts are obvious from a distance" },
    "index.pain.bad2": { "zh-Hant": "在瀏覽器再套一層閱讀介面，會出現雙重網址列", "en": "Layering a reader on the browser creates a double address bar" },
    "index.pain.bad3": { "zh-Hant": "上司走近才切換視窗，往往已經太遲", "en": "Switching windows only when someone walks over is usually too late" },
    "index.pain.bad4": { "zh-Hant": "安裝擴充功能或應用程式，會留下權限與安裝紀錄", "en": "Installing an extension or app leaves permissions and install history" },
    "index.pain.goodKicker": { "zh-Hant": "Readbar", "en": "Readbar" },
    "index.pain.goodH3": { "zh-Hant": "融入日常工作畫面", "en": "Blends into everyday work" },
    "index.pain.good1Label": { "zh-Hant": "免安裝", "en": "No install" },
    "index.pain.good1": { "zh-Hant": "：純網頁即可使用，不留下桌面圖示", "en": ": a web page only — no desktop icon left behind" },
    "index.pain.good2Label": { "zh-Hant": "偽裝網址列", "en": "Camouflaged address bar" },
    "index.pain.good2": { "zh-Hant": "：句子顯示於 Chrome 工具列，下方可放工作截圖", "en": ": sentences sit in the Chrome toolbar; a work screenshot can sit below" },
    "index.pain.good3Label": { "zh-Hant": "Pro 獨立彈出視窗", "en": "Pro standalone popup" },
    "index.pain.good3": { "zh-Hant": "：以免安裝方式開啟獨立視窗，減少分頁列干擾", "en": ": opens a separate window without installing, with fewer tab bars" },
    "index.pain.good4Label": { "zh-Hant": "Panic Button", "en": "Panic Button" },
    "index.pain.good4": { "zh-Hant": "：一鍵將網址列改為自訂假文字（Pro）", "en": ": one key turns the address bar into custom fake text (Pro)" },

    "index.features.kicker": { "zh-Hant": "Features", "en": "Features" },
    "index.features.h2": {
      "zh-Hant": "核心功能：<wbr>對應實際產品能力",
      "en": "Core features, matched to the real product"
    },
    "index.features.lead": {
      "zh-Hant": "免費版可開始 TXT 閱讀與兩張偽裝背景；Pro 解鎖 EPUB、簡轉繁、二十張背景、獨立彈出視窗、Panic Button、雲端進度與自訂快捷鍵。",
      "en": "Free starts you with TXT reading and two camouflage backgrounds. Pro unlocks EPUB, Simplified-to-Traditional Chinese, twenty backgrounds, a standalone popup, Panic Button, cloud progress, and custom shortcuts."
    },
    "index.features.f1h": { "zh-Hant": "偽裝 Chrome 工具列", "en": "Camouflaged Chrome toolbar" },
    "index.features.f1p": {
      "zh-Hant": "閱讀句子顯示於網址列，並可顯示進度、跳轉句子。遠看如同日常瀏覽網頁，而非電子書介面。",
      "en": "Reading sentences appear in the address bar, with progress and sentence jump. From a distance it looks like ordinary browsing, not an e-book."
    },
    "index.features.f2h": { "zh-Hant": "工作截圖偽裝背景", "en": "Work-screenshot backgrounds" },
    "index.features.f2p": {
      "zh-Hant": "上傳 PNG、JPG 或 WEBP 工作截圖，讓畫面下方呈現日常工作內容。免費版最多 2 張，Pro 最多 20 張，並可隨時切換。",
      "en": "Upload PNG, JPG, or WEBP work screenshots so the area below looks like everyday work. Free allows 2; Pro allows 20. Switch anytime."
    },
    "index.features.f3h": { "zh-Hant": "Pro 辦公室防禦", "en": "Pro office defence" },
    "index.features.f3p": {
      "zh-Hant": "以獨立彈出視窗開啟閱讀器，無須安裝。Panic Button 可自訂快捷鍵與顯示文字。另支援 EPUB、簡體轉繁體、雲端進度與自訂快捷鍵。",
      "en": "Open the reader in a standalone popup — no install. Panic Button lets you customise the shortcut and display text. Also includes EPUB, Simplified-to-Traditional Chinese, cloud progress, and custom shortcuts."
    },

    "index.pricing.kicker": { "zh-Hant": "Pricing", "en": "Pricing" },
    "index.pricing.h2": { "zh-Hant": "定價簡單，可先免費使用", "en": "Simple pricing. Start free." },
    "index.pricing.lead": {
      "zh-Hant": "Free 即可開始基本 TXT 閱讀。如需 EPUB、簡轉繁、獨立彈出視窗與 Panic Button，可以 $2.99／月升級 Pro。",
      "en": "Free covers basic TXT reading. For EPUB, Simplified-to-Traditional Chinese, a standalone popup, and Panic Button, upgrade to Pro at $2.99 / month."
    },
    "index.pricing.freeBlurb": { "zh-Hant": "永久免費，適合先體驗基本功能", "en": "Free forever — try the basics first" },
    "index.pricing.free1": { "zh-Hant": "基本閱讀體驗", "en": "Basic reading" },
    "index.pricing.free2": { "zh-Hant": "TXT 檔案支援", "en": "TXT file support" },
    "index.pricing.free3": { "zh-Hant": "偽裝背景上限 2 個", "en": "Up to 2 camouflage backgrounds" },
    "index.pricing.free4": { "zh-Hant": "本機閱讀進度保存", "en": "Local reading progress" },
    "index.pricing.freeCta": { "zh-Hant": "免費開始", "en": "Start free" },
    "index.pricing.popular": { "zh-Hant": "最受歡迎", "en": "Most popular" },
    "index.pricing.perMonth": { "zh-Hant": "/ 月", "en": "/ month" },
    "index.pricing.proBlurb": {
      "zh-Hant": "包含所有免費功能，再解鎖 EPUB、簡轉繁、獨立彈出視窗與 Panic Button。",
      "en": "Everything in Free, plus EPUB, Simplified-to-Traditional Chinese, a standalone popup, and Panic Button."
    },
    "index.pricing.pro1": { "zh-Hant": "所有免費版功能", "en": "Everything in Free" },
    "index.pricing.pro2": { "zh-Hant": "EPUB 檔案支援", "en": "EPUB file support" },
    "index.pricing.pro3": { "zh-Hant": "簡體轉繁體中文", "en": "Simplified-to-Traditional Chinese" },
    "index.pricing.pro4": { "zh-Hant": "偽裝背景上限 20 個", "en": "Up to 20 camouflage backgrounds" },
    "index.pricing.pro5": { "zh-Hant": "獨立彈出視窗", "en": "Standalone popup window" },
    "index.pricing.pro6": { "zh-Hant": "Panic Button 一鍵轉換", "en": "Panic Button one-key swap" },
    "index.pricing.pro7": { "zh-Hant": "雲端進度同步", "en": "Cloud progress sync" },
    "index.pricing.pro8": { "zh-Hant": "自訂快捷鍵", "en": "Custom shortcuts" },
    "index.pricing.proCta": { "zh-Hant": "升級 Pro", "en": "Upgrade to Pro" },

    "index.faq.h2": { "zh-Hant": "常見問題", "en": "FAQ" },
    "index.faq.q1": { "zh-Hant": "上司經過時會被發現嗎？", "en": "Will I be caught if my boss walks by?" },
    "index.faq.a1": {
      "zh-Hant": "閱讀內容顯示於偽裝網址列，畫面其餘部分可放置工作截圖。搭配 Pro 的 Panic Button，上司走近時只需一鍵，網址列的書本句子即改為預設或自訂的偽裝網址，背景維持工作截圖。",
      "en": "Reading sits in the camouflaged address bar; the rest of the screen can show a work screenshot. With Pro Panic Button, one key replaces the book sentence with a default or custom disguised URL. The background stays."
    },
    "index.faq.q2": { "zh-Hant": "Pro 視窗與免費版有何不同？", "en": "How is the Pro window different from Free?" },
    "index.faq.a2": {
      "zh-Hant": "兩者都免安裝。免費版以一般瀏覽器分頁開啟。Pro 以獨立彈出視窗開啟，減少分頁列。閱讀內容顯示於我們繪製的偽裝工具列，畫面可放置工作截圖。",
      "en": "Neither version needs installing. Free opens as a normal browser tab. Pro opens as a standalone popup with fewer tab bars. Reading sits in our drawn camouflage toolbar; the page can show a work screenshot."
    },
    "index.faq.q3": { "zh-Hant": "需要安裝 Extension 或下載 App 嗎？", "en": "Do I need an extension or app?" },
    "index.faq.a3": {
      "zh-Hant": "不需要。Readbar 為純網頁應用，使用公司電腦的瀏覽器即可，避免安裝紀錄及額外權限審查。",
      "en": "No. Readbar is a web app. Use the browser on a work computer — no install history and no extra permission review."
    },
    "index.faq.q4": { "zh-Hant": "Free 與 Pro 有何分別？", "en": "What is the difference between Free and Pro?" },
    "index.faq.a4": {
      "zh-Hant": "Free 支援基本閱讀、TXT、2 張偽裝背景與本機進度。Pro（$2.99／月）另加 EPUB、簡轉繁、20 張背景、獨立彈出視窗、Panic Button、雲端同步與自訂快捷鍵。",
      "en": "Free covers basic reading, TXT, 2 camouflage backgrounds, and local progress. Pro ($2.99 / month) adds EPUB, Simplified-to-Traditional Chinese, 20 backgrounds, a standalone popup, Panic Button, cloud sync, and custom shortcuts."
    },
    "index.faq.q5": { "zh-Hant": "可以用手機開啟閱讀器嗎？", "en": "Can I open the reader on a phone?" },
    "index.faq.a5": {
      "zh-Hant": "不可以。閱讀器專為辦公室電腦瀏覽器而設，流動裝置會顯示提示並無法開啟。請以電腦瀏覽器登入後再啟動。",
      "en": "No. The reader is built for office computer browsers. Phones and tablets show a notice and cannot open it. Log in from a computer, then launch."
    },
    "index.faq.q6": { "zh-Hant": "書本內容會上傳到伺服器嗎？", "en": "Is book content uploaded to a server?" },
    "index.faq.a6": {
      "zh-Hant": "Free 進度僅保存在你的瀏覽器。Pro 雲端同步只傳送閱讀進度與檔名，不會把整本書以明文儲存到我們的伺服器。",
      "en": "Free progress stays in your browser. Pro cloud sync sends only reading progress and the file name — not the full book in plaintext to our servers."
    },

    "login.kicker": { "zh-Hant": "Member Login", "en": "Member Login" },
    "login.h1": { "zh-Hant": "登入後即可開啟閱讀器", "en": "Log in to open the reader" },
    "login.lead": {
      "zh-Hant": "訪客無法直接進入程式。登入後將以免費會員開始：TXT 閱讀、2 張偽裝背景、本機進度。如需 EPUB、簡轉繁、獨立彈出視窗、Panic Button 及雲端同步，可再升級 Pro。",
      "en": "Guests cannot enter the app directly. After login you start as a free member: TXT reading, 2 camouflage backgrounds, and local progress. Upgrade to Pro for EPUB, Simplified-to-Traditional Chinese, a standalone popup, Panic Button, and cloud sync."
    },
    "login.point1": { "zh-Hant": "免費會員：基本閱讀、TXT、2 張背景、本機進度", "en": "Free: basic reading, TXT, 2 backgrounds, local progress" },
    "login.point2": { "zh-Hant": "Pro 會員：$2.99／月，解鎖 EPUB、簡轉繁、獨立彈出視窗與 Panic Button", "en": "Pro: $2.99 / month — EPUB, Simplified-to-Traditional, standalone popup, and Panic Button" },
    "login.h2": { "zh-Hant": "登入會員中心", "en": "Log in to the member centre" },
    "login.formLead": { "zh-Hant": "請使用電郵及密碼登入。此為靜態示範，任何有效電郵格式均可進入。", "en": "Use your email and password. This is a static demo — any valid email format will sign you in." },
    "login.submit": { "zh-Hant": "登入免費會員", "en": "Log in as free member" },
    "login.noAccount": { "zh-Hant": "還沒有帳號？", "en": "No account yet?" },
    "login.registerLink": { "zh-Hant": "免費註冊", "en": "Sign up free" },
    "login.preview": { "zh-Hant": "預覽 Dashboard", "en": "Preview dashboard" },
    "login.previewFree": { "zh-Hant": "免費版本", "en": "Free version" },
    "login.previewPro": { "zh-Hant": "Pro版本", "en": "Pro version" },

    "register.kicker": { "zh-Hant": "Create Account", "en": "Create Account" },
    "register.h1": { "zh-Hant": "註冊後即可開始閱讀", "en": "Sign up, then start reading" },
    "register.lead": {
      "zh-Hant": "請填寫姓名、電郵及密碼，再選擇免費或 Pro 方案。會員 API 及付款閘道稍後接駁。",
      "en": "Enter your name, email, and password, then choose Free or Pro. The member API and payment gateway will be connected later."
    },
    "register.point1": { "zh-Hant": "免費方案：按「免費註冊」。尚未連接會員 API 時，會提示未能成功註冊", "en": "Free plan: tap “Sign up free”. Until the member API is connected, sign-up will show that it could not complete." },
    "register.point2": { "zh-Hant": "Pro 方案：$2.99／月，按「前往付款」前往付款閘道參考頁", "en": "Pro plan: $2.99 / month. Tap “Continue to payment” for the payment-gateway preview." },
    "register.h2": { "zh-Hant": "建立帳號", "en": "Create an account" },
    "register.formLead": { "zh-Hant": "此為靜態示範，尚未連接會員資料庫或付款閘道。", "en": "This is a static demo. The member database and payment gateway are not connected yet." },
    "register.namePlaceholder": { "zh-Hant": "陳大文", "en": "Alex Chan" },
    "register.passwordPlaceholder": { "zh-Hant": "最少 8 個字元", "en": "At least 8 characters" },
    "register.choosePlan": { "zh-Hant": "選擇方案", "en": "Choose a plan" },
    "register.freeDetail": { "zh-Hant": "TXT、2 張背景、本機進度", "en": "TXT, 2 backgrounds, local progress" },
    "register.proPerMonth": { "zh-Hant": "／月", "en": "/ mo" },
    "register.proDetail": { "zh-Hant": "EPUB、簡轉繁、Panic Button", "en": "EPUB, CJK convert, Panic Button" },
    "register.freeCta": { "zh-Hant": "免費註冊", "en": "Sign up free" },
    "register.payCta": { "zh-Hant": "前往付款", "en": "Continue to payment" },
    "register.hasAccount": { "zh-Hant": "已有帳號？", "en": "Already have an account?" },
    "register.loginLink": { "zh-Hant": "登入", "en": "Log in" },
    "register.modalBrand": { "zh-Hant": "註冊", "en": "Sign up" },
    "register.failKicker": { "zh-Hant": "未能完成", "en": "Could not finish" },
    "register.failTitle": { "zh-Hant": "未能成功註冊", "en": "Sign-up could not complete" },
    "register.failBody": {
      "zh-Hant": "未連接會員 API，暫時未能完成註冊。接駁會員系統之後，此按鈕會將資料傳送至資料庫。",
      "en": "The member API is not connected, so sign-up cannot complete yet. After it is connected, this button will send the details to the database."
    },

    "payment.kicker": { "zh-Hant": "Payment Gateway", "en": "Payment Gateway" },
    "payment.h1": { "zh-Hant": "確認 Pro 訂閱", "en": "Confirm Pro subscription" },
    "payment.lead": {
      "zh-Hant": "此頁僅為付款閘道參考頁。接駁 Stripe 或其他閘道之後，此按鈕將引導你前往真實結帳。",
      "en": "This page is a payment-gateway preview. After Stripe or another gateway is connected, this button will take you to real checkout."
    },
    "payment.summary": { "zh-Hant": "訂單摘要", "en": "Order summary" },
    "payment.monthly": { "zh-Hant": "每月", "en": "Monthly" },
    "payment.confirm": { "zh-Hant": "確認付款", "en": "Confirm payment" },
    "payment.note": { "zh-Hant": "付款閘道尚未接駁，此按鈕暫時只作介面參考。", "en": "The payment gateway is not connected yet. This button is an interface preview only." },
    "payment.noteClicked": { "zh-Hant": "付款閘道尚未接駁。接駁後，此按鈕會開啟真實結帳頁。", "en": "The payment gateway is not connected yet. After it is, this button will open real checkout." },
    "payment.backRegister": { "zh-Hant": "← 返回註冊", "en": "← Back to sign up" },

    "guide.kicker": { "zh-Hant": "User Guide", "en": "User Guide" },
    "guide.h1": { "zh-Hant": "如何使用 Readbar", "en": "How to use Readbar" },
    "guide.lead": {
      "zh-Hant": "兩個版本均為偽裝成 Chrome 工具列的閱讀器：句子顯示於網址列，下方可放置工作截圖。請使用下方按鈕切換免費版與 Pro 版說明。",
      "en": "Both versions are readers camouflaged as a Chrome toolbar: sentences appear in the address bar, and a work screenshot can sit below. Use the buttons below to switch between Free and Pro instructions."
    },
    "guide.tabAria": { "zh-Hant": "選擇閱讀器版本", "en": "Choose reader version" },
    "guide.tabFree": { "zh-Hant": "免費版", "en": "Free" },
    "guide.tabPro": { "zh-Hant": "Pro 版", "en": "Pro" },
    "guide.before": { "zh-Hant": "開始之前", "en": "Before you start" },
    "guide.freeH2": { "zh-Hant": "由免費會員中心啟動", "en": "Launch from the free member centre" },
    "guide.free1": { "zh-Hant": "登入後將進入免費會員中心。", "en": "After login you enter the free member centre." },
    "guide.free2": { "zh-Hant": "按「啟動免費閱讀器」，會以一般瀏覽器分頁開啟。頁面內會先出現登入畫面，輸入用戶名稱及密碼後才可使用閱讀器。", "en": "Tap “Launch free reader” to open a normal browser tab. A login screen appears first; enter the username and password before using the reader." },
    "guide.free3": { "zh-Hant": "免費版以一般瀏覽器分頁開啟，適合先熟悉操作。", "en": "Free opens as a normal browser tab — a good way to learn the controls first." },
    "guide.toolbarH2": { "zh-Hant": "工具列按鈕", "en": "Toolbar buttons" },
    "guide.colButton": { "zh-Hant": "按鈕", "en": "Button" },
    "guide.colUse": { "zh-Hant": "用途", "en": "Use" },
    "guide.srPrevNext": { "zh-Hant": "上一句／下一句", "en": "Previous / next sentence" },
    "guide.srBg": { "zh-Hant": "切換偽裝背景", "en": "Switch camouflage background" },
    "guide.freePrevNext": { "zh-Hant": "上一句 / 下一句（鍵盤僅可使用 ← / →）", "en": "Previous / next sentence (keyboard: ← / → only)" },
    "guide.freeBg": { "zh-Hant": "切換已上傳的偽裝背景", "en": "Switch uploaded camouflage backgrounds" },
    "guide.freeImport": { "zh-Hant": "匯入 TXT 書本", "en": "Import a TXT book" },
    "guide.progress": { "zh-Hant": "顯示進度，按一下即可跳轉句子", "en": "Shows progress; tap to jump to a sentence" },
    "guide.freeUpload": { "zh-Hant": "上傳偽裝背景（免費版最多 2 張）", "en": "Upload camouflage backgrounds (Free: up to 2)" },
    "guide.proH2": { "zh-Hant": "由付費會員中心啟動", "en": "Launch from the Pro member centre" },
    "guide.pro1": { "zh-Hant": "使用 Pro 帳號登入付費會員中心。", "en": "Log in to the Pro member centre with a Pro account." },
    "guide.pro2": { "zh-Hant": "按「啟動隱蔽閱讀器」，會以獨立彈出視窗開啟，並減少分頁列。Chrome 原生網址列仍然會顯示。視窗內會先出現登入畫面，輸入用戶名稱及密碼後才可使用閱讀器。", "en": "Tap “Launch stealth reader” to open a standalone popup with fewer tab bars. Chrome’s real address bar still shows. A login screen appears first; enter the username and password before using the reader." },
    "guide.pro3": { "zh-Hant": "如彈出視窗被攔截，請允許此網站的彈出視窗後再試。", "en": "If the popup is blocked, allow pop-ups for this site and try again." },
    "guide.proPrevNext": { "zh-Hant": "上一句 / 下一句", "en": "Previous / next sentence" },
    "guide.proBg": { "zh-Hant": "切換偽裝背景（最多 20 張）", "en": "Switch camouflage backgrounds (up to 20)" },
    "guide.proConvert": { "zh-Hant": "簡體轉繁體", "en": "Simplified-to-Traditional Chinese" },
    "guide.proImport": { "zh-Hant": "匯入 TXT 或 EPUB", "en": "Import TXT or EPUB" },
    "guide.proUpload": { "zh-Hant": "上傳偽裝背景", "en": "Upload camouflage backgrounds" },
    "guide.proSettings": { "zh-Hant": "自訂快捷鍵及 Panic 顯示文字", "en": "Custom shortcuts and Panic display text" },

    "auth.planFree": { "zh-Hant": "免費計劃", "en": "Free plan" },
    "auth.planPro": { "zh-Hant": "Pro 計劃（每月 $2.99，自動續訂）", "en": "Pro plan ($2.99 / month, auto-renew)" },
    "auth.nextPaymentNA": { "zh-Hant": "不適用", "en": "Not applicable" },
    "auth.memberFree": { "zh-Hant": "免費會員", "en": "Free member" },
    "auth.memberPro": { "zh-Hant": "付費會員中心", "en": "Pro member centre" },

    "dash.accountKicker": { "zh-Hant": "Member Account", "en": "Member Account" },
    "dash.accountH2": { "zh-Hant": "會員資料", "en": "Account" },
    "dash.accountLeadFree": { "zh-Hant": "可在此查看用戶名稱、訂閱狀態，以及更改密碼或計劃。", "en": "View your username and subscription, and change your password or plan." },
    "dash.accountLeadPro": { "zh-Hant": "可在此查看用戶名稱、訂閱狀態，以及更改密碼或管理訂閱。", "en": "View your username and subscription, and change your password or manage billing." },
    "dash.username": { "zh-Hant": "用戶名稱", "en": "Username" },
    "dash.status": { "zh-Hant": "訂閱狀態", "en": "Subscription" },
    "dash.nextPay": { "zh-Hant": "下次自動扣款", "en": "Next auto-charge" },
    "dash.changePassword": { "zh-Hant": "更改密碼", "en": "Change password" },
    "dash.upgradePro": { "zh-Hant": "升級至 Pro", "en": "Upgrade to Pro" },
    "dash.manageSub": { "zh-Hant": "管理訂閱", "en": "Manage subscription" },

    "dash.freeBadge": { "zh-Hant": "免費會員 · TXT", "en": "Free member · TXT" },
    "dash.freeH1": { "zh-Hant": "啟動免費閱讀器", "en": "Launch the free reader" },
    "dash.freeLead": { "zh-Hant": "以一般視窗開啟閱讀器，可匯入 TXT、上傳最多 2 張偽裝背景，進度會保存在本機。", "en": "Opens in a normal window. Import TXT, upload up to 2 camouflage backgrounds, and keep progress on this device." },
    "dash.launchFree": { "zh-Hant": "啟動免費閱讀器", "en": "Launch free reader" },
    "dash.guide": { "zh-Hant": "使用說明", "en": "User guide" },
    "dash.progressH2": { "zh-Hant": "書本進度", "en": "Book progress" },
    "dash.progressLead": { "zh-Hant": "以下進度僅保存在你的瀏覽器，不會同步到其他裝置。", "en": "This progress stays in your browser and does not sync to other devices." },
    "dash.currentBook": { "zh-Hant": "當前書本", "en": "Current book" },
    "dash.localProgress": { "zh-Hant": "本機進度", "en": "Local progress" },
    "dash.lastRead": { "zh-Hant": "上次閱讀", "en": "Last read" },
    "dash.sampleBook": { "zh-Hant": "《三體》", "en": "The Three-Body Problem" },
    "dash.sampleLastRead": { "zh-Hant": "今天 14:32", "en": "Today 14:32" },
    "dash.todayTime": { "zh-Hant": "今天 {time}", "en": "Today {time}" },
    "dash.unnamed": { "zh-Hant": "未命名文件", "en": "Untitled file" },
    "dash.popupBlocked": { "zh-Hant": "無法開啟彈出視窗。請允許此網站的彈出視窗後再試。", "en": "Could not open the popup. Allow pop-ups for this site and try again." },

    "dash.upgradeKicker": { "zh-Hant": "Pro 會員升級", "en": "Upgrade to Pro" },
    "dash.upgradeH2": { "zh-Hant": "若要在辦公室真正隱蔽閱讀，請升級 Pro", "en": "For real stealth reading at the office, upgrade to Pro" },
    "dash.upgradeLead": { "zh-Hant": "$2.99／月即可解鎖 EPUB、簡轉繁、20 張偽裝背景、獨立彈出視窗、Panic Button、雲端同步與自訂快捷鍵。", "en": "$2.99 / month unlocks EPUB, Simplified-to-Traditional Chinese, 20 camouflage backgrounds, a standalone popup, Panic Button, cloud sync, and custom shortcuts." },
    "dash.upgradeCta": { "zh-Hant": "升級至 Pro · $2.99／月", "en": "Upgrade to Pro · $2.99 / month" },
    "dash.compareH2": { "zh-Hant": "Pro 會員與免費會員的分別", "en": "Pro vs Free" },
    "dash.compareLead": { "zh-Hant": "同一套閱讀介面，Pro 解鎖辦公室隱蔽所需的全部功能。", "en": "The same reading interface. Pro unlocks everything needed for office stealth." },
    "dash.colFeature": { "zh-Hant": "功能", "en": "Feature" },
    "dash.colFree": { "zh-Hant": "免費會員", "en": "Free" },
    "dash.colPro": { "zh-Hant": "Pro 會員", "en": "Pro" },
    "dash.rowBasic": { "zh-Hant": "基本閱讀體驗", "en": "Basic reading" },
    "dash.rowTxt": { "zh-Hant": "TXT 檔案支援", "en": "TXT file support" },
    "dash.rowBg": { "zh-Hant": "偽裝背景上限", "en": "Camouflage background limit" },
    "dash.rowBgFree": { "zh-Hant": "2 張", "en": "2" },
    "dash.rowBgPro": { "zh-Hant": "20 張", "en": "20" },
    "dash.rowProgress": { "zh-Hant": "閱讀進度保存", "en": "Reading progress" },
    "dash.rowProgressFree": { "zh-Hant": "本機", "en": "This device" },
    "dash.rowProgressPro": { "zh-Hant": "本機 + 雲端同步", "en": "This device + cloud sync" },
    "dash.rowEpub": { "zh-Hant": "EPUB 檔案支援", "en": "EPUB file support" },
    "dash.rowConvert": { "zh-Hant": "簡體轉繁體", "en": "Simplified-to-Traditional Chinese" },
    "dash.rowPopup": { "zh-Hant": "獨立彈出視窗", "en": "Standalone popup" },
    "dash.rowPanic": { "zh-Hant": "Panic Button 一鍵轉換", "en": "Panic Button one-key swap" },
    "dash.rowShortcuts": { "zh-Hant": "自訂快捷鍵", "en": "Custom shortcuts" },

    "dash.proBadge": { "zh-Hant": "獨立彈出視窗", "en": "Standalone popup" },
    "dash.proH1": { "zh-Hant": "準備進入隱蔽閱讀模式", "en": "Ready for stealth reading" },
    "dash.proLead": { "zh-Hant": "按「啟動隱蔽閱讀器」會以獨立彈出視窗開啟，並減少分頁列。Chrome 原生網址列仍然會顯示。此方式無須安裝應用程式。", "en": "“Launch stealth reader” opens a standalone popup with fewer tab bars. Chrome’s real address bar still shows. No app install is required." },
    "dash.launchPro": { "zh-Hant": "啟動隱蔽閱讀器", "en": "Launch stealth reader" },
    "dash.currentProgress": { "zh-Hant": "當前進度", "en": "Current progress" },
    "dash.shortcutKicker": { "zh-Hant": "進階啟動方式", "en": "Advanced launch" },
    "dash.shortcutH2": { "zh-Hant": "以 Windows 桌面捷徑隱藏網址列", "en": "Hide the address bar with a Windows desktop shortcut" },
    "dash.shortcutLead": { "zh-Hant": "上方啟動按鈕無法隱藏 Chrome 原生網址列。如需沒有原生網址列的視窗，可在 Windows 桌面建立專屬啟動捷徑。此方法使用 Chrome 的應用程式視窗（", "en": "The launch button above cannot hide Chrome’s real address bar. For a window without that bar, create a dedicated Windows desktop shortcut. This uses Chrome’s app window (" },
    "dash.shortcutLead2": { "zh-Hant": "），並非在本網站安裝應用程式。", "en": ") — it does not install an app from this site." },
    "dash.shortcut1": { "zh-Hant": "在桌面空白處按滑鼠右鍵。", "en": "Right-click an empty area on the desktop." },
    "dash.shortcut2": { "zh-Hant": "選擇「新增」→「捷徑」。", "en": "Choose New → Shortcut." },
    "dash.shortcut3": { "zh-Hant": "在「輸入物件的位置」欄位貼上以下內容：", "en": "Paste the following into the location field:" },
    "dash.shortcut4": { "zh-Hant": "按「下一步」，為捷徑命名，例如 Readbar Pro。", "en": "Click Next and name the shortcut, for example Readbar Pro." },
    "dash.shortcut5": { "zh-Hant": "按「完成」。", "en": "Click Finish." },
    "dash.shortcut6": { "zh-Hant": "其後以該捷徑啟動。Chrome 會以應用程式視窗開啟，原生網址列不會顯示。閱讀器內的登入畫面仍然需要輸入用戶名稱及密碼。", "en": "Launch with that shortcut. Chrome opens as an app window without the real address bar. The in-reader login still requires the username and password." },
    "dash.shortcutNote": { "zh-Hant": "若 Chrome 安裝於其他資料夾，請把路徑改為你電腦上的 chrome.exe 位置。", "en": "If Chrome is installed in another folder, change the path to chrome.exe on your computer." },

    "dash.proSettingsKicker": { "zh-Hant": "Pro 專屬設定", "en": "Pro settings" },
    "dash.proSettingsH2": { "zh-Hant": "你已解鎖全部 Pro 功能", "en": "All Pro features are unlocked" },
    "dash.proSettingsLead": { "zh-Hant": "EPUB、簡轉繁、20 張偽裝背景、獨立彈出視窗、Panic Button、雲端同步、自訂快捷鍵及 Panic 顯示文字均已可以使用。如仍需要其他功能，可以提出請求，我們會有專人聯絡你跟進。", "en": "EPUB, Simplified-to-Traditional Chinese, 20 camouflage backgrounds, standalone popup, Panic Button, cloud sync, custom shortcuts, and Panic display text are all available. If you still need something else, send a request and someone will follow up." },
    "dash.unlocked": { "zh-Hant": "已全部解鎖", "en": "Fully unlocked" },
    "dash.featEpub": { "zh-Hant": "EPUB 檔案支援", "en": "EPUB file support" },
    "dash.featConvert": { "zh-Hant": "簡體轉繁體", "en": "Simplified-to-Traditional Chinese" },
    "dash.featBg": { "zh-Hant": "偽裝背景上限 20 張", "en": "Up to 20 camouflage backgrounds" },
    "dash.featPopup": { "zh-Hant": "獨立彈出視窗", "en": "Standalone popup" },
    "dash.featPanic": { "zh-Hant": "Panic Button 一鍵轉換", "en": "Panic Button one-key swap" },
    "dash.featCloud": { "zh-Hant": "雲端進度同步", "en": "Cloud progress sync" },
    "dash.featShortcuts": { "zh-Hant": "自訂快捷鍵", "en": "Custom shortcuts" },
    "dash.featPanicText": { "zh-Hant": "自訂 Panic 顯示文字", "en": "Custom Panic display text" },
    "dash.requestCta": { "zh-Hant": "提出功能請求", "en": "Request a feature" },
    "dash.requestHint": { "zh-Hant": "提交後會有專人透過你提供的電郵聯絡跟進。", "en": "After you submit, someone will follow up using the email you provide." },

    "dash.requestBrand": { "zh-Hant": "功能請求", "en": "Feature request" },
    "dash.requestTitle": { "zh-Hant": "想要其他功能？告訴我們", "en": "Want another feature? Tell us" },
    "dash.requestLead": { "zh-Hant": "請填寫你的資料及需求。提交後會有專人聯絡你，跟進可行性及時間表。", "en": "Enter your details and what you need. Someone will follow up on feasibility and timing." },
    "dash.requestMessage": { "zh-Hant": "功能請求", "en": "Feature request" },
    "dash.requestPlaceholder": { "zh-Hant": "例如：希望支援 PDF、或者可以自訂偽裝網址列字型……", "en": "For example: PDF support, or a custom font for the camouflage address bar…" },
    "dash.requestSubmit": { "zh-Hant": "提交請求", "en": "Submit request" },
    "dash.requestOkKicker": { "zh-Hant": "已收到", "en": "Received" },
    "dash.requestOkTitle": { "zh-Hant": "我們會有專人與你聯絡", "en": "Someone will contact you" },
    "dash.requestOkBody": { "zh-Hant": "多謝你的功能請求。團隊會以你提供的電郵跟進，了解你需要的功能及使用場景。", "en": "Thanks for the request. The team will follow up by email to understand the feature and how you would use it." },

    "dash.pwBrand": { "zh-Hant": "更改密碼", "en": "Change password" },
    "dash.pwTitle": { "zh-Hant": "更新登入密碼", "en": "Update login password" },
    "dash.pwLead": { "zh-Hant": "請輸入目前密碼及新密碼。接駁會員系統之後，更改會寫入你的帳號。", "en": "Enter your current password and a new one. After the member system is connected, the change will be saved to your account." },
    "dash.pwCurrent": { "zh-Hant": "目前密碼", "en": "Current password" },
    "dash.pwNew": { "zh-Hant": "新密碼", "en": "New password" },
    "dash.pwConfirm": { "zh-Hant": "確認新密碼", "en": "Confirm new password" },
    "dash.pwSave": { "zh-Hant": "儲存新密碼", "en": "Save new password" },
    "dash.pwFailKicker": { "zh-Hant": "未能完成", "en": "Could not finish" },
    "dash.pwFailTitle": { "zh-Hant": "尚未接駁會員資料庫", "en": "Member database not connected" },
    "dash.pwFailBody": { "zh-Hant": "暫時未能更改密碼。接駁會員系統之後，此表格會將新密碼寫入你的帳號。", "en": "Password changes are not available yet. After the member system is connected, this form will save the new password to your account." },

    "dash.payBrand": { "zh-Hant": "付款閘道", "en": "Payment gateway" },
    "dash.payKicker": { "zh-Hant": "尚未接駁", "en": "Not connected" },
    "dash.payTitle": { "zh-Hant": "尚未連接付款閘道", "en": "Payment gateway not connected" },
    "dash.payBody": { "zh-Hant": "付款閘道尚未接駁。接駁之後，此按鈕會前往外部付款頁，供你升級或管理訂閱。", "en": "The payment gateway is not connected yet. After it is, this button will open the external payment page to upgrade or manage your subscription." },

    "reader.noticeKicker": { "zh-Hant": "Office desktop", "en": "Office desktop" },
    "reader.noticeH1": { "zh-Hant": "請改用電腦<wbr>開啟閱讀器", "en": "Open the reader on a computer" },
    "reader.noticeP1": {
      "zh-Hant": "Readbar 專為辦公室電腦瀏覽器而設，讓閱讀融入工作畫面。手機或平板的螢幕與操作方式並不適用，因此無法在流動裝置開啟閱讀器。",
      "en": "Readbar is built for office computer browsers so reading can blend into a work screen. Phone and tablet layouts do not fit, so the reader cannot open on mobile."
    },
    "reader.noticeP2": { "zh-Hant": "請改以電腦登入會員中心後再啟動。", "en": "Log in to the member centre on a computer, then launch." },
    "reader.noticeHome": { "zh-Hant": "返回產品官網", "en": "Back to product site" },
    "reader.noticeLogin": { "zh-Hant": "前往登入", "en": "Go to login" },
    "reader.loginFreeKicker": { "zh-Hant": "Free Login", "en": "Free Login" },
    "reader.loginProKicker": { "zh-Hant": "Pro Login", "en": "Pro Login" },
    "reader.loginH1": { "zh-Hant": "登入後即可使用閱讀器", "en": "Log in to use the reader" },
    "reader.loginLead": { "zh-Hant": "每次開啟均須輸入用戶名稱及密碼。此為靜態示範，用戶名稱與密碼均為 testing。", "en": "Each launch requires a username and password. This is a static demo — both are testing." },
    "reader.loginSubmit": { "zh-Hant": "登入", "en": "Log in" },
    "reader.loginError": { "zh-Hant": "用戶名稱或密碼不正確。", "en": "Incorrect username or password." }
  };

  let currentLang = null;

  function normalize(lang) {
    if (!lang) return null;
    const lower = String(lang).toLowerCase();
    if (lower === "en" || lower.startsWith("en-")) return "en";
    if (lower === "zh-hant" || lower === "zh-tw" || lower === "zh-hk" || lower === "zh") return "zh-Hant";
    return null;
  }

  function readQueryLang() {
    try {
      return normalize(new URLSearchParams(window.location.search).get("lang"));
    } catch (error) {
      return null;
    }
  }

  function readStoredLang() {
    try {
      return normalize(localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return null;
    }
  }

  function persist(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Ignore quota / private-mode failures.
    }
  }

  function resolveInitialLang() {
    const queryLang = readQueryLang();
    if (queryLang) {
      persist(queryLang);
      return queryLang;
    }
    return readStoredLang() || "zh-Hant";
  }

  function getLang() {
    if (!currentLang) currentLang = resolveInitialLang();
    return currentLang;
  }

  function applyLangClass(lang) {
    const html = document.documentElement;
    html.lang = lang;
    html.classList.toggle("lang-en", lang === "en");
  }

  function interpolate(str, vars) {
    if (!vars) return str;
    return String(str).replace(/\{(\w+)\}/g, (_, key) => (
      vars[key] != null ? String(vars[key]) : ""
    ));
  }

  function t(key, vars) {
    const lang = getLang();
    const entry = STRINGS[key];
    const text = (entry && (entry[lang] || entry["zh-Hant"])) || key;
    return interpolate(text, vars);
  }

  function apply(root) {
    const scope = root || document;
    const lang = getLang();
    applyLangClass(lang);

    scope.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key) el.textContent = t(key);
    });

    scope.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (key) el.innerHTML = t(key);
    });

    scope.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) el.setAttribute("placeholder", t(key));
    });

    scope.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key) el.setAttribute("aria-label", t(key));
    });

    scope.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (key) el.setAttribute("title", t(key));
    });

    scope.querySelectorAll("[data-i18n-content]").forEach((el) => {
      const key = el.getAttribute("data-i18n-content");
      if (key) el.setAttribute("content", t(key));
    });

    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) document.title = t(titleEl.getAttribute("data-i18n"));

    document.querySelectorAll("[data-set-lang]").forEach((btn) => {
      const target = normalize(btn.getAttribute("data-set-lang"));
      btn.setAttribute("aria-pressed", String(target === lang));
    });
  }

  function setLang(next) {
    currentLang = normalize(next) || "zh-Hant";
    persist(currentLang);
    apply();
    listeners.forEach((fn) => {
      try {
        fn(currentLang);
      } catch (error) {
        // Keep remaining listeners running.
      }
    });
  }

  function onChange(fn) {
    if (typeof fn === "function") listeners.push(fn);
  }

  function bindSwitcher() {
    document.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-set-lang]");
      if (!btn) return;
      event.preventDefault();
      setLang(btn.getAttribute("data-set-lang"));
    });
  }

  window.ReadbarI18n = { getLang, setLang, t, apply, onChange };

  currentLang = resolveInitialLang();
  applyLangClass(currentLang);

  function boot() {
    apply();
    bindSwitcher();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
