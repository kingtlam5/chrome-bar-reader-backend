(() => {
  "use strict";

  const STORAGE_KEY = "readbar.lang";
  const listeners = [];

  const STRINGS = {
    "lang.aria": { "zh-Hant": "語言", "en": "Language" },

    "nav.pain": { "zh-Hant": "安心閱讀", "en": "Read at ease" },
    "nav.features": { "zh-Hant": "核心功能", "en": "Features" },
    "nav.guide": { "zh-Hant": "使用說明", "en": "User guide" },
    "nav.faq": { "zh-Hant": "常見問題", "en": "FAQ" },
    "nav.loginCta": { "zh-Hant": "登入", "en": "Log in" },
    "nav.login": { "zh-Hant": "登入", "en": "Log in" },
    "nav.home": { "zh-Hant": "產品官網", "en": "Product site" },
    "nav.register": { "zh-Hant": "註冊", "en": "Sign up" },
    "nav.logout": { "zh-Hant": "登出", "en": "Log out" },
    "nav.account": { "zh-Hant": "會員資料", "en": "Account" },
    "nav.tip": { "zh-Hant": "請杯咖啡", "en": "Buy us a coffee" },
    "nav.menu": { "zh-Hant": "開啟選單", "en": "Open menu" },
    "footer.backHome": { "zh-Hant": "← 返回產品官網", "en": "← Back to product site" },
    "common.close": { "zh-Hant": "關閉", "en": "Close" },
    "common.gotIt": { "zh-Hant": "知道了", "en": "Got it" },
    "common.done": { "zh-Hant": "完成", "en": "Done" },
    "common.username": { "zh-Hant": "用戶名稱", "en": "Username" },
    "common.password": { "zh-Hant": "密碼", "en": "Password" },
    "common.email": { "zh-Hant": "電郵", "en": "Email" },
    "common.name": { "zh-Hant": "姓名", "en": "Name" },
    "common.yes": { "zh-Hant": "有", "en": "Yes" },
    "common.no": { "zh-Hant": "無", "en": "No" },

    "meta.index.title": { "zh-Hant": "Readbar｜辦公室隱蔽閱讀器", "en": "Readbar | Stealth office web reader" },
    "meta.index.description": {
      "zh-Hant": "專為上班族設計的偽裝式網頁閱讀器。讓閱讀藏進日常工作的樣子裡，在辦公室也能安心讀完屬於自己的那幾頁。",
      "en": "A fake web reader designed for office workers. Hide the book in the look of ordinary work, and read a few pages of your own in the office."
    },
    "meta.login.title": { "zh-Hant": "會員登入｜Readbar", "en": "Member login | Readbar" },
    "meta.login.description": {
      "zh-Hant": "登入 Readbar 會員中心。訪客須先登入，方可開啟閱讀器。",
      "en": "Log in to the Readbar member centre. Guests must sign in before opening the reader."
    },
    "meta.register.title": { "zh-Hant": "註冊｜Readbar", "en": "Sign up | Readbar" },
    "meta.register.description": {
      "zh-Hant": "註冊 Readbar 會員。填寫姓名、電郵及密碼即可使用全部閱讀功能。",
      "en": "Create a Readbar account. Enter your name, email, and password to use every reading feature."
    },
    "meta.guide.title": { "zh-Hant": "使用說明｜Readbar", "en": "User guide | Readbar" },
    "meta.guide.description": {
      "zh-Hant": "Readbar 閱讀器使用說明。匯入書本、切換偽裝背景、偽裝網址鍵與自訂快捷鍵。",
      "en": "How to use the Readbar reader: import a book, switch fake backgrounds, use the Fake URL Key, and set custom shortcuts."
    },
    "meta.dash.title": { "zh-Hant": "會員中心｜Readbar", "en": "Member centre | Readbar" },
    "meta.dash.description": {
      "zh-Hant": "啟動隱蔽閱讀器、查看閱讀進度，並管理偽裝設定。",
      "en": "Launch the stealth reader, check reading progress, and manage fake settings."
    },

    "index.badge": { "zh-Hant": "辦公室隱蔽閱讀器 · 免安裝", "en": "Stealth office reader · No install" },
    "index.hero.h1": {
      "zh-Hant": "在辦公室<wbr>安心享受<wbr>你專屬的<wbr>閱讀時光",
      "en": "Enjoy your own reading time at the office"
    },
    "index.hero.lead": {
      "zh-Hant": "專為上班族設計的偽裝式網頁閱讀器。<br>Readbar 讓書藏進日常工作的樣子裡，讓你在辦公室也能安心、自在地讀完屬於自己的那幾頁。",
      "en": "A fake web reader designed for office workers.<br>Readbar hides the book in the look of everyday work, so you can finish a few pages of your own in the office, calmly and at ease."
    },
    "index.hero.ctaLogin": { "zh-Hant": "登入會員中心", "en": "Log in to the member centre" },
    "index.hero.ctaRegister": { "zh-Hant": "立即註冊", "en": "Sign up" },
    "index.hero.ctaTip": { "zh-Hant": "請杯咖啡", "en": "Buy us a coffee" },
    "index.hero.pointFree": { "zh-Hant": "🎁 完全免費", "en": "🎁 Completely free" },
    "index.hero.point1": { "zh-Hant": "🌐 免安裝", "en": "🌐 No install" },
    "index.hero.point2": { "zh-Hant": "🕵️ 完美融入瀏覽器 增加隱蔽性", "en": "🕵️ Blends into the browser for more stealth" },
    "index.mock.url": {
      "zh-Hant": "面對絕對的困境，唯一的辦法就是讓自己變得絕對強大。",
      "en": "In absolute hardship, the only way out is to become absolutely strong."
    },
    "index.mock.kicker": { "zh-Hant": "上司接近時", "en": "When your boss approaches" },
    "index.mock.title": { "zh-Hant": "空白鍵即可換成偽裝網址", "en": "Press Space to switch to a fake URL" },
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
      "zh-Hant": "一般電子書介面遠看就像一塊招牌。Readbar 把句子放進看起來像網址列的位置，畫面其餘部分仍像你日常的工作視窗，讓閱讀不必從工作裡抽離出來。",
      "en": "A typical e-book screen looks like a sign from across the room. Readbar puts the sentence where an address bar would be, and keeps the rest of the window looking like everyday work, so reading does not have to step out of the workday."
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
    "index.pain.good2Label": { "zh-Hant": "偽裝網址列", "en": "Fake address bar" },
    "index.pain.good2": { "zh-Hant": "：句子顯示於 Chrome 工具列，下方可放工作截圖", "en": ": sentences sit in the Chrome toolbar; a work screenshot can sit below" },
    "index.pain.good3Label": { "zh-Hant": "獨立彈出視窗", "en": "Standalone popup" },
    "index.pain.good3": { "zh-Hant": "：以免安裝方式開啟獨立視窗，減少分頁列干擾", "en": ": opens a separate window without installing, with fewer tab bars" },
    "index.pain.good4Label": { "zh-Hant": "偽裝網址鍵", "en": "Fake URL Key" },
    "index.pain.good4": { "zh-Hant": "：一鍵將網址列改為自訂假文字", "en": ": one key turns the address bar into custom fake text" },

    "index.features.kicker": { "zh-Hant": "Features", "en": "Features" },
    "index.features.h2": {
      "zh-Hant": "核心功能：<wbr>打造沉浸式<wbr>辦公室閱讀體驗",
      "en": "Core features: an immersive office reading experience"
    },
    "index.features.lead": {
      "zh-Hant": "八項功能互相配合，讓閱讀藏進日常工作畫面，在辦公室也能專注、自在地讀下去。",
      "en": "Eight features work together so reading hides in the look of everyday work. You can keep reading at the office with focus and ease."
    },
    "index.features.f1h": { "zh-Hant": "EPUB 檔案支援", "en": "EPUB file support" },
    "index.features.f1p": {
      "zh-Hant": "可匯入 EPUB 電子書，亦支援 TXT。句子會逐句出現在偽裝網址列，讓你在工位上慢慢讀，不必打開顯眼的電子書介面。",
      "en": "Import EPUB e-books, or TXT files. Sentences appear one by one in the fake address bar, so you can read at your desk without opening an obvious e-book screen."
    },
    "index.features.f2h": { "zh-Hant": "簡體轉繁體", "en": "Simplified-to-Traditional Chinese" },
    "index.features.f2p": {
      "zh-Hant": "書本若是簡體，可一鍵轉為繁體。轉換在此瀏覽器完成，讀起來更順，也少一次切換視窗的風險。",
      "en": "If the book is Simplified Chinese, convert it to Traditional with one tap. It happens in this browser, so reading feels smoother and you switch windows less often."
    },
    "index.features.f3h": { "zh-Hant": "偽裝背景上限 20 張", "en": "Up to 20 fake backgrounds" },
    "index.features.f3p": {
      "zh-Hant": "上傳工作截圖作為畫面背景，最多 20 張。遠看像在處理公事，切換時仍維持同一套工作畫面。",
      "en": "Upload work screenshots as the page background, up to 20. From a distance it looks like office work. Switching keeps the same work screen."
    },
    "index.features.f4h": { "zh-Hant": "獨立彈出視窗", "en": "Standalone popup" },
    "index.features.f4p": {
      "zh-Hant": "由會員中心以獨立視窗開啟，減少分頁列。看起來更像一份正在進行的工作，而不是另開一個閱讀分頁。",
      "en": "Open a standalone window from the member centre, with fewer tab bars. A glance looks more like work in progress than a reading tab."
    },
    "index.features.f5h": { "zh-Hant": "偽裝網址鍵", "en": "Fake URL Key" },
    "index.features.f5p": {
      "zh-Hant": "有人走近時，一鍵把網址列的書本句子換成預設或自訂的偽裝網址。背景維持工作截圖，閱讀可隨時藏起來。",
      "en": "When someone walks over, one key replaces the book sentence in the address bar with your default or custom fake URL. The work-screenshot background stays, so reading can hide at any moment."
    },
    "index.features.f6h": { "zh-Hant": "本機進度保存", "en": "Local reading progress" },
    "index.features.f6p": {
      "zh-Hant": "進度保存在此瀏覽器，下次打開可接續來讀。書本內容不會上傳到我們的伺服器。",
      "en": "Progress stays in this browser, so you can pick up next time. Book content is not uploaded to our servers."
    },
    "index.features.f7h": { "zh-Hant": "自訂快捷鍵", "en": "Custom shortcuts" },
    "index.features.f7p": {
      "zh-Hant": "可自行設定上一句、下一句、偽裝網址鍵等按鍵。手不離鍵盤，也不必在畫面上尋找按鈕。",
      "en": "Set your own keys for previous sentence, next sentence, and the Fake URL Key. Hands stay on the keyboard — no hunting for on-screen buttons."
    },
    "index.features.f8h": { "zh-Hant": "自訂偽裝網址文字", "en": "Custom fake URL text" },
    "index.features.f8p": {
      "zh-Hant": "預先寫好偽裝網址模式下要顯示的假網址或文字，讓畫面更像你日常會開啟的頁面。",
      "en": "Write the fake URL or text for fake URL mode in advance, so the bar looks like a page you would open in ordinary work."
    },

    "index.faq.h2": { "zh-Hant": "常見問題", "en": "FAQ" },
    "index.faq.q1": { "zh-Hant": "上司經過時會被發現嗎？", "en": "Will I be caught if my boss walks by?" },
    "index.faq.a1": {
      "zh-Hant": "閱讀內容顯示於偽裝網址列，畫面其餘部分可放置工作截圖。搭配偽裝網址鍵，上司走近時只需一鍵，網址列的書本句子即改為預設或自訂的偽裝網址，背景維持工作截圖。",
      "en": "Reading sits in the fake address bar; the rest of the screen can show a work screenshot. With the Fake URL Key, one press replaces the book sentence with a default or custom fake URL. The background stays."
    },
    "index.faq.q2": { "zh-Hant": "閱讀器如何開啟？", "en": "How do I open the reader?" },
    "index.faq.a2": {
      "zh-Hant": "免安裝。由會員中心以獨立彈出視窗開啟閱讀器，減少分頁列。閱讀內容顯示於我們繪製的偽裝工具列，畫面可放置工作截圖。",
      "en": "No install. Launch a standalone popup from the member centre, with fewer tab bars. Reading sits in our drawn fake toolbar; the page can show a work screenshot."
    },
    "index.faq.q3": { "zh-Hant": "需要安裝 Extension 或下載 App 嗎？", "en": "Do I need an extension or app?" },
    "index.faq.a3": {
      "zh-Hant": "不需要。Readbar 為純網頁應用，使用公司電腦的瀏覽器即可，避免安裝紀錄及額外權限審查。",
      "en": "No. Readbar is a web app. Use the browser on a work computer — no install history and no extra permission review."
    },
    "index.faq.q4": { "zh-Hant": "Readbar 需要付款嗎？", "en": "Do I need to pay for Readbar?" },
    "index.faq.a4": {
      "zh-Hant": "不需要。註冊帳號後即可使用全部功能，包括 EPUB、簡轉繁、20 張背景、獨立彈出視窗、偽裝網址鍵與自訂快捷鍵。若想支持 Readbar，可自願打賞，不會解鎖額外功能。",
      "en": "No. After you sign up, every feature is available — EPUB, Simplified-to-Traditional Chinese, 20 backgrounds, a standalone popup, the Fake URL Key, and custom shortcuts. If you want to support Readbar, you can leave a tip. Tipping does not unlock extra features."
    },
    "index.faq.q5": { "zh-Hant": "可以用手機開啟閱讀器嗎？", "en": "Can I open the reader on a phone?" },
    "index.faq.a5": {
      "zh-Hant": "不可以。閱讀器專為辦公室電腦瀏覽器而設，流動裝置會顯示提示並無法開啟。請以電腦瀏覽器登入後再啟動。",
      "en": "No. The reader is built for office computer browsers. Phones and tablets show a notice and cannot open it. Log in from a computer, then launch."
    },
    "index.faq.q6": { "zh-Hant": "書本內容會上傳到伺服器嗎？", "en": "Is book content uploaded to a server?" },
    "index.faq.a6": {
      "zh-Hant": "書本內容不會上傳到我們的伺服器。閱讀進度保存在你的瀏覽器。",
      "en": "Book content is not uploaded to our servers. Reading progress stays in your browser."
    },

    "login.kicker": { "zh-Hant": "Member Login", "en": "Member Login" },
    "login.h1": { "zh-Hant": "登入後即可開啟閱讀器", "en": "Log in to open the reader" },
    "login.lead": {
      "zh-Hant": "訪客無法直接進入程式。登入後即可使用全部閱讀功能：TXT 與 EPUB、簡轉繁、20 張偽裝背景、獨立彈出視窗與偽裝網址鍵。",
      "en": "Guests cannot enter the app directly. After login you can use every reading feature: TXT and EPUB, Simplified-to-Traditional Chinese, 20 fake backgrounds, a standalone popup, and the Fake URL Key."
    },
    "login.point1": { "zh-Hant": "登入後進入會員中心，再啟動隱蔽閱讀器", "en": "Log in to the member centre, then launch the stealth reader" },
    "login.point2": { "zh-Hant": "全部功能均可使用，無需升級或付款", "en": "Every feature is included — no upgrade and no payment" },
    "login.h2": { "zh-Hant": "登入會員中心", "en": "Log in to the member centre" },
    "login.formLead": { "zh-Hant": "請使用已註冊的電郵及密碼登入。", "en": "Use the email and password you registered with." },
    "login.submit": { "zh-Hant": "登入", "en": "Log in" },
    "login.code": { "zh-Hant": "驗證碼", "en": "Verification code" },
    "login.codePlaceholder": { "zh-Hant": "6 位數字", "en": "6-digit code" },
    "login.verifyLead": { "zh-Hant": "請輸入寄到你電郵的驗證碼。", "en": "Enter the verification code sent to your email." },
    "login.verifySubmit": { "zh-Hant": "驗證並登入", "en": "Verify and log in" },
    "login.resend": { "zh-Hant": "重發驗證碼", "en": "Resend code" },
    "login.codeRequired": { "zh-Hant": "請輸入驗證碼。", "en": "Enter the verification code." },
    "login.needMoreSteps": { "zh-Hant": "此登入還需要其他驗證步驟，暫時未能在此頁完成。", "en": "This sign-in needs another verification step that is not available here." },
    "login.noAccount": { "zh-Hant": "還沒有帳號？", "en": "No account yet?" },
    "login.registerLink": { "zh-Hant": "註冊", "en": "Sign up" },
    "login.preview": { "zh-Hant": "預覽會員中心", "en": "Preview the member centre" },
    "login.previewDash": { "zh-Hant": "預覽會員中心", "en": "Preview member centre" },

    "register.kicker": { "zh-Hant": "Create Account", "en": "Create Account" },
    "register.h1": { "zh-Hant": "註冊後即可開始閱讀", "en": "Sign up, then start reading" },
    "register.lead": {
      "zh-Hant": "請填寫姓名、電郵及密碼。註冊後即可使用全部閱讀功能，無需選擇方案或付款。",
      "en": "Enter your name, email, and password. After sign-up you can use every reading feature — no plan to choose and no payment."
    },
    "register.point1": { "zh-Hant": "填寫姓名、電郵及密碼（最少 8 個字元）", "en": "Enter your name, email, and password (at least 8 characters)" },
    "register.point2": { "zh-Hant": "驗證電郵後進入會員中心，即可啟動閱讀器", "en": "After email verification you enter the member centre and can launch the reader" },
    "register.h2": { "zh-Hant": "建立帳號", "en": "Create an account" },
    "register.formLead": { "zh-Hant": "請填寫姓名、電郵及密碼。完成驗證後即可開始閱讀。", "en": "Enter your name, email, and password. After verification you can start reading." },
    "register.submitCta": { "zh-Hant": "註冊", "en": "Sign up" },
    "register.code": { "zh-Hant": "驗證碼", "en": "Verification code" },
    "register.codePlaceholder": { "zh-Hant": "6 位數字", "en": "6-digit code" },
    "register.verifyLead": { "zh-Hant": "請輸入寄到你電郵的驗證碼，以完成註冊。", "en": "Enter the verification code sent to your email to finish signing up." },
    "register.verifySubmit": { "zh-Hant": "驗證並完成註冊", "en": "Verify and finish sign-up" },
    "register.resend": { "zh-Hant": "重發驗證碼", "en": "Resend code" },
    "register.codeRequired": { "zh-Hant": "請輸入驗證碼。", "en": "Enter the verification code." },
    "register.needMoreSteps": { "zh-Hant": "此註冊還需要其他步驟，暫時未能在此頁完成。", "en": "Sign-up needs another step that is not available here." },
    "register.captchaHint": { "zh-Hant": "如出現驗證框，請先完成驗證再繼續。", "en": "If a verification box appears, complete it to continue." },
    "register.captchaTimeout": { "zh-Hant": "驗證等候過久。請完成驗證框後再試一次。", "en": "Verification took too long. Complete the checkbox and try again." },
    "register.namePlaceholder": { "zh-Hant": "陳大文", "en": "Alex Chan" },
    "register.passwordPlaceholder": { "zh-Hant": "最少 8 個字元", "en": "At least 8 characters" },
    "register.hasAccount": { "zh-Hant": "已有帳號？", "en": "Already have an account?" },
    "register.loginLink": { "zh-Hant": "登入", "en": "Log in" },
    "register.modalBrand": { "zh-Hant": "註冊", "en": "Sign up" },
    "register.failKicker": { "zh-Hant": "未能完成", "en": "Could not finish" },
    "register.failTitle": { "zh-Hant": "未能成功註冊", "en": "Sign-up could not complete" },
    "register.failBody": {
      "zh-Hant": "暫時未能完成註冊。請檢查電郵與密碼，或稍後再試。",
      "en": "Sign-up could not complete. Check the email and password, or try again later."
    },
    "clerk.unavailable": { "zh-Hant": "暫時未能連接會員系統，請稍後再試。", "en": "The member system could not load. Please try again later." },
    "clerk.errorGeneric": { "zh-Hant": "未能完成驗證，請稍後再試。", "en": "Could not complete authentication. Please try again later." },

    "guide.kicker": { "zh-Hant": "User Guide", "en": "User Guide" },
    "guide.h1": { "zh-Hant": "如何使用 Readbar", "en": "How to use Readbar" },
    "guide.lead": {
      "zh-Hant": "Readbar 是偽裝成 Chrome 工具列的閱讀器：句子顯示於網址列，下方可放置工作截圖。由會員中心以獨立彈出視窗啟動。",
      "en": "Readbar is a fake Chrome toolbar reader: sentences appear in the address bar, and a work screenshot can sit below. Launch it as a standalone popup from the member centre."
    },
    "guide.before": { "zh-Hant": "開始之前", "en": "Before you start" },
    "guide.launchH2": { "zh-Hant": "由會員中心啟動", "en": "Launch from the member centre" },
    "guide.launch1": { "zh-Hant": "登入後進入會員中心。", "en": "After login you enter the member centre." },
    "guide.launch2": {
      "zh-Hant": "按「啟動隱蔽閱讀器」，會以獨立彈出視窗開啟。視窗內請用 Clerk 電郵及密碼登入。",
      "en": "Tap “Launch stealth reader” to open a standalone popup. Sign in with your Clerk email and password."
    },
    "guide.launch3": { "zh-Hant": "如彈出視窗被攔截，請允許此網站的彈出視窗後再試。", "en": "If the popup is blocked, allow pop-ups for this site and try again." },
    "guide.toolbarH2": { "zh-Hant": "工具列按鈕", "en": "Toolbar buttons" },
    "guide.colButton": { "zh-Hant": "按鈕", "en": "Button" },
    "guide.colUse": { "zh-Hant": "用途", "en": "Use" },
    "guide.srPrevNext": { "zh-Hant": "上一句／下一句", "en": "Previous / next sentence" },
    "guide.srBg": { "zh-Hant": "切換偽裝背景", "en": "Switch fake background" },
    "guide.prevNext": { "zh-Hant": "上一句 / 下一句", "en": "Previous / next sentence" },
    "guide.bg": { "zh-Hant": "切換偽裝背景（最多 20 張）", "en": "Switch fake backgrounds (up to 20)" },
    "guide.convert": { "zh-Hant": "簡體轉繁體", "en": "Simplified-to-Traditional Chinese" },
    "guide.import": { "zh-Hant": "匯入 TXT 或 EPUB", "en": "Import TXT or EPUB" },
    "guide.progress": { "zh-Hant": "顯示進度，按一下即可跳轉句子", "en": "Shows progress; tap to jump to a sentence" },
    "guide.upload": { "zh-Hant": "上傳偽裝背景", "en": "Upload fake backgrounds" },
    "guide.settings": { "zh-Hant": "自訂快捷鍵及偽裝網址文字", "en": "Custom shortcuts and fake URL text" },
    "auth.planMember": { "zh-Hant": "會員（全部功能）", "en": "Member (all features)" },
    "auth.member": { "zh-Hant": "會員中心", "en": "Member centre" },

    "dash.accountKicker": { "zh-Hant": "Member Account", "en": "Member Account" },
    "dash.accountH2": { "zh-Hant": "會員資料", "en": "Account" },
    "dash.accountLead": { "zh-Hant": "可在此查看用戶名稱，以及更改密碼。", "en": "View your username and change your password." },
    "dash.username": { "zh-Hant": "用戶名稱", "en": "Username" },
    "dash.status": { "zh-Hant": "帳號類型", "en": "Account" },
    "dash.changePassword": { "zh-Hant": "更改密碼", "en": "Change password" },

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
    "dash.shortcut4": { "zh-Hant": "按「下一步」，為捷徑命名，例如 Readbar。", "en": "Click Next and name the shortcut, for example Readbar." },
    "dash.shortcut5": { "zh-Hant": "按「完成」。", "en": "Click Finish." },
    "dash.shortcut6": { "zh-Hant": "其後以該捷徑啟動。Chrome 會以應用程式視窗開啟，原生網址列不會顯示。閱讀器內的登入畫面請輸入 Clerk 電郵及密碼。", "en": "Launch with that shortcut. Chrome opens as an app window without the real address bar. The in-reader login requires your Clerk email and password." },
    "dash.shortcutNote": { "zh-Hant": "若 Chrome 安裝於其他資料夾，請把路徑改為你電腦上的 chrome.exe 位置。", "en": "If Chrome is installed in another folder, change the path to chrome.exe on your computer." },
    "dash.featuresKicker": { "zh-Hant": "Included", "en": "Included" },
    "dash.featuresH2": { "zh-Hant": "全部功能均可使用", "en": "Every feature is available" },
    "dash.featuresLead": {
      "zh-Hant": "EPUB、簡轉繁、20 張偽裝背景、獨立彈出視窗、偽裝網址鍵、本機進度、自訂快捷鍵及偽裝網址文字均已可以使用。如仍需要其他功能，可以提出請求。",
      "en": "EPUB, Simplified-to-Traditional Chinese, 20 fake backgrounds, standalone popup, Fake URL Key, local progress, custom shortcuts, and fake URL text are all available. If you still need something else, send a request."
    },
    "dash.included": { "zh-Hant": "已包含", "en": "Included" },

    "dash.featEpub": { "zh-Hant": "EPUB 檔案支援", "en": "EPUB file support" },
    "dash.featConvert": { "zh-Hant": "簡體轉繁體", "en": "Simplified-to-Traditional Chinese" },
    "dash.featBg": { "zh-Hant": "偽裝背景上限 20 張", "en": "Up to 20 fake backgrounds" },
    "dash.featPopup": { "zh-Hant": "獨立彈出視窗", "en": "Standalone popup" },
    "dash.featPanic": { "zh-Hant": "偽裝網址鍵", "en": "Fake URL Key" },
    "dash.featLocal": { "zh-Hant": "本機進度保存", "en": "Local reading progress" },
    "dash.featShortcuts": { "zh-Hant": "自訂快捷鍵", "en": "Custom shortcuts" },
    "dash.featPanicText": { "zh-Hant": "自訂偽裝網址文字", "en": "Custom fake URL text" },
    "dash.requestCta": { "zh-Hant": "提出功能請求", "en": "Request a feature" },
    "dash.requestHint": { "zh-Hant": "提交後會有專人透過你提供的電郵聯絡跟進。", "en": "After you submit, someone will follow up using the email you provide." },

    "dash.requestBrand": { "zh-Hant": "功能請求", "en": "Feature request" },
    "dash.requestTitle": { "zh-Hant": "想要其他功能？告訴我們", "en": "Want another feature? Tell us" },
    "dash.requestLead": { "zh-Hant": "請填寫你的資料及需求。提交後會有專人聯絡你，跟進可行性及時間表。", "en": "Enter your details and what you need. Someone will follow up on feasibility and timing." },
    "dash.requestMessage": { "zh-Hant": "功能請求", "en": "Feature request" },
    "dash.requestPlaceholder": { "zh-Hant": "例如：希望支援 PDF、或者可以自訂偽裝網址列字型……", "en": "For example: PDF support, or a custom font for the fake address bar…" },
    "dash.requestSubmit": { "zh-Hant": "提交請求", "en": "Submit request" },
    "dash.requestOkKicker": { "zh-Hant": "已收到", "en": "Received" },
    "dash.requestOkTitle": { "zh-Hant": "我們會有專人與你聯絡", "en": "Someone will contact you" },
    "dash.requestOkBody": { "zh-Hant": "多謝你的功能請求。團隊會以你提供的電郵跟進，了解你需要的功能及使用場景。", "en": "Thanks for the request. The team will follow up by email to understand the feature and how you would use it." },

    "tip.kicker": { "zh-Hant": "一點心意", "en": "A little thanks" },
    "tip.h2": { "zh-Hant": "若這段閱讀時光對你有幫助", "en": "If this reading time has meant something to you" },
    "tip.lead": { "zh-Hant": "Readbar 會一直免費。願意的話，請我們一杯咖啡就好。", "en": "Readbar will stay free. If you like, buy us a coffee — that is more than enough." },
    "tip.cta": { "zh-Hant": "請杯咖啡", "en": "Buy us a coffee" },
    "tip.brand": { "zh-Hant": "一點心意", "en": "A little thanks" },
    "tip.title": { "zh-Hant": "謝謝你把這段時光留給自己", "en": "Thank you for keeping this time for yourself" },
    "tip.body": { "zh-Hant": "Readbar 會一直免費。若它曾陪你度過幾頁安靜的書，歡迎請我們一杯咖啡——純粹是心意，不會解鎖任何功能。", "en": "Readbar will stay free. If it has sat with you through a few quiet pages, you are welcome to buy us a coffee. It is only a gesture of thanks, and it does not unlock any extra features." },
    "tip.hkd20": { "zh-Hant": "HK$20", "en": "HK$20" },
    "tip.hkd50": { "zh-Hant": "HK$50", "en": "HK$50" },
    "tip.hkd100": { "zh-Hant": "HK$100", "en": "HK$100" },
    "tip.okKicker": { "zh-Hant": "收到了", "en": "Received with thanks" },
    "tip.okTitle": { "zh-Hant": "謝謝你的一杯咖啡", "en": "Thank you for the coffee" },
    "tip.okBody": { "zh-Hant": "你的心意我們收到了。繼續安心讀你的那幾頁吧。Readbar 依然完全免費。", "en": "We received your kindness. Keep those pages of your own. Readbar stays completely free." },

    "dash.pwBrand": { "zh-Hant": "更改密碼", "en": "Change password" },
    "dash.pwTitle": { "zh-Hant": "更新登入密碼", "en": "Update login password" },
    "dash.pwLead": { "zh-Hant": "請輸入目前密碼及新密碼。新密碼最少 8 個字元，儲存後會即時寫入你的 Clerk 帳號。", "en": "Enter your current password and a new one. The new password must be at least 8 characters. It is saved to your Clerk account immediately." },
    "dash.pwCurrent": { "zh-Hant": "目前密碼", "en": "Current password" },
    "dash.pwNew": { "zh-Hant": "新密碼", "en": "New password" },
    "dash.pwConfirm": { "zh-Hant": "確認新密碼", "en": "Confirm new password" },
    "dash.pwSave": { "zh-Hant": "儲存新密碼", "en": "Save new password" },
    "dash.pwMismatch": { "zh-Hant": "兩次輸入的新密碼不一致。", "en": "The new passwords do not match." },
    "dash.pwTooShort": { "zh-Hant": "新密碼最少要有 8 個字元。", "en": "The new password must be at least 8 characters." },
    "dash.pwWrongCurrent": { "zh-Hant": "目前密碼不正確。", "en": "The current password is incorrect." },
    "dash.pwPwned": { "zh-Hant": "這個新密碼不夠安全，請換一組。", "en": "Please choose a different, more secure password." },
    "dash.pwTooWeak": { "zh-Hant": "新密碼未符合規則（最少 8 個字元）。", "en": "The new password does not meet the password rules (at least 8 characters)." },
    "dash.pwNeedReverify": { "zh-Hant": "登入已超過一段時間，請登出後重新登入，再更改密碼。", "en": "This sign-in is too old to change the password. Log out, sign in again, then retry." },
    "dash.pwNeedSignInTitle": { "zh-Hant": "需要正式登入", "en": "Sign in required" },
    "dash.pwNeedSignInBody": { "zh-Hant": "預覽會員中心或未登入 Clerk 時無法更改密碼。請用電郵／密碼登入後再試。", "en": "Password changes need a Clerk session. Sign in with your email and password, then try again. Preview dashboards cannot change a password." },
    "dash.pwOkKicker": { "zh-Hant": "已更新", "en": "Updated" },
    "dash.pwOkTitle": { "zh-Hant": "密碼已更改", "en": "Password changed" },
    "dash.pwOkBody": { "zh-Hant": "新密碼已寫入你的帳號。其他裝置的登入階段已被登出，本機這次登入仍然有效。", "en": "Your new password is saved. Other devices have been signed out; this session stays signed in." },
    "dash.pwFailKicker": { "zh-Hant": "未能完成", "en": "Could not finish" },
    "dash.pwFailTitle": { "zh-Hant": "未能更改密碼", "en": "Could not change password" },
    "dash.pwFailBody": { "zh-Hant": "暫時未能更改密碼。請確認已登入會員帳號後再試。", "en": "The password could not be changed. Sign in to your member account and try again." },
    "dash.pwRetry": { "zh-Hant": "返回表格", "en": "Back to form" },

    "reader.noticeKicker": { "zh-Hant": "Office desktop", "en": "Office desktop" },
    "reader.noticeH1": { "zh-Hant": "請改用電腦<wbr>開啟閱讀器", "en": "Open the reader on a computer" },
    "reader.noticeP1": {
      "zh-Hant": "Readbar 專為辦公室電腦瀏覽器而設，讓閱讀融入工作畫面。手機或平板的螢幕與操作方式並不適用，因此無法在流動裝置開啟閱讀器。",
      "en": "Readbar is built for office computer browsers so reading can blend into a work screen. Phone and tablet layouts do not fit, so the reader cannot open on mobile."
    },
    "reader.noticeP2": { "zh-Hant": "請改以電腦登入會員中心後再啟動。", "en": "Log in to the member centre on a computer, then launch." },
    "reader.noticeHome": { "zh-Hant": "返回產品官網", "en": "Back to product site" },
    "reader.noticeLogin": { "zh-Hant": "前往登入", "en": "Go to login" },
    "reader.loginKicker": { "zh-Hant": "Login", "en": "Login" },
    "reader.loginH1": { "zh-Hant": "登入後即可使用閱讀器", "en": "Log in to use the reader" },
    "reader.loginLead": { "zh-Hant": "請輸入 Clerk 會員電郵及密碼。", "en": "Enter your Clerk email and password." },
    "reader.loginSubmit": { "zh-Hant": "登入", "en": "Log in" },
    "reader.loginError": { "zh-Hant": "電郵或密碼不正確。", "en": "Incorrect email or password." },
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

    scope.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (key) el.setAttribute("alt", t(key));
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
