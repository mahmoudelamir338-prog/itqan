// firebase.js - تهيئة Firebase مع آلية آمنة لقراءة الإعدادات بدون تضمين أسرار داخل المستودع
// طريقة الإعداد:
// 1) قبل النشر/أثناء التطوير ضع كائن الإعدادات في:
//    window.itqanFirebaseConfig = { apiKey: "...", authDomain: "...", projectId: "...", appId: "..." };
//    أو خزّنه في localStorage تحت المفتاح "itqan_firebase_config" كنص JSON.
// 2) سيتم تحميل وحدات Firebase عبر CDN بشكل ديناميكي.

export async function initFirebase() {
  try {
    const raw = localStorage.getItem('itqan_firebase_config');
    let config = null;
    if (typeof window.itqanFirebaseConfig === 'object' && window.itqanFirebaseConfig) {
      config = window.itqanFirebaseConfig;
    } else if (raw) {
      try { config = JSON.parse(raw); } catch { config = null; }
    }

    if (!config) {
      console.warn('Firebase config not found. Set window.itqanFirebaseConfig or localStorage "itqan_firebase_config".');
      window.itqanFirebaseReady = false;
      return;
    }

    // تحميل وحدات Firebase الحديثة (Modular SDK) عبر CDN
    const appModule = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const authModule = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
    // يمكن إضافة خدمات أخرى لاحقاً مثل firestore/analytics إن لزم

    const app = appModule.initializeApp(config);
    const auth = authModule.getAuth(app);

    // جعل المراجع متاحة عالمياً لاستخدامها من الصفحات الأخرى إن لزم
    window.itqanFirebaseApp = app;
    window.itqanAuth = auth;
    window.itqanFirebaseReady = true;

    console.info('[Itqan] Firebase initialized successfully');
  } catch (e) {
    console.warn('[Itqan] Failed to initialize Firebase, falling back to local-only mode.', e);
    window.itqanFirebaseReady = false;
  }
}