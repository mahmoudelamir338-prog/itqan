// auth.js - نظام المستخدمين والحماية باستخدام localStorage
import { getUsers } from './api.js';

export function restoreThemePreference() {
  const pref = localStorage.getItem('itqan_theme');
  if (pref === 'light') {
    document.body.classList.add('light');
  } else {
    document.body.classList.remove('light');
  }
}

export function initAuthGuards() {
  // أي لينك عليه data-protected=true، لو المستخدم مش داخل نحوله للوجين
  document.querySelectorAll('[data-protected="true"]').forEach(a => {
    a.addEventListener('click', (e) => {
      if (!isLoggedIn()) {
        e.preventDefault();
        window.location.href = 'login.html';
      }
    });
  });
}

export function isLoggedIn() {
  return localStorage.getItem('itqan_isLoggedIn') === 'true';
}

export function getCurrentUser() {
  const raw = localStorage.getItem('itqan_currentUser');
  return raw ? JSON.parse(raw) : null;
}

export async function signup({ name, role, nationalId, phone, password, linkedStudents = [] }) {
  if (!name || !role || !password) throw new Error('الرجاء إدخال جميع الحقول المطلوبة');
  if (role === 'student' && !nationalId) throw new Error('الطالب يجب أن يُدخل الرقم القومي');
  if (!phone) throw new Error('رقم الموبايل مطلوب للتحقق عبر الرسائل القصيرة');
  await ensureUsersLoaded();
  const users = JSON.parse(localStorage.getItem('itqan_users') || '[]');
  const exists = users.find(u =>
    u.role === role &&
    ((role === 'student' && u.nationalId === nationalId) || (role !== 'student' && u.phone === phone))
  );
  if (exists) throw new Error('يوجد حساب بهذا المُعرّف بالفعل');
  // إرسال OTP تجريبي (يستبدل لاحقاً باستدعاء Serverless Function)
  sendOtpDev(phone);
  const input = prompt('أدخل كود التحقق المرسل عبر SMS');
  if (!input || !verifyOtpDev(phone, input.trim())) {
    throw new Error('فشل التحقف من كود OTP');
  }
  const user = {
    id: 'u_' + Date.now(),
    name,
    role,
    nationalId: role === 'student' ? nationalId : undefined,
    phone,
    passwordHash: simpleHash(password),
    xp: 0,
    badges: [],
    enrolledCourses: [],
    completedLessons: [],
    linkedStudents: role === 'parent' ? linkedStudents : undefined,
  };
  users.push(user);
  localStorage.setItem('itqan_users', JSON.stringify(users));
  localStorage.setItem('itqan_currentUser', JSON.stringify(user));
  localStorage.setItem('itqan_isLoggedIn', 'true');
  return user;
}

export function logout() {
  localStorage.setItem('itqan_isLoggedIn', 'false');
  localStorage.removeItem('itqan_currentUser');
}

export function protectPage() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

export function completeLesson(lessonId) {
  const user = getCurrentUser();
  if (!user) return;
  if (!user.completedLessons.includes(lessonId)) {
    user.completedLessons.push(lessonId);
    user.xp += 10;
    checkAchievements(user);
    persistUser(user);
  }
}

export function persistUser(updated) {
  localStorage.setItem('itqan_currentUser', JSON.stringify(updated));
  // تحديث نسخة المستخدم داخل مصفوفة المستخدمين
  const users = JSON.parse(localStorage.getItem('itqan_users') || '[]');
  const idx = users.findIndex(u => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = updated;
    localStorage.setItem('itqan_users', JSON.stringify(users));
  }
}

export function checkAchievements(user) {
  const earned = new Set(user.badges || []);
  const lessonsCount = (user.completedLessons || []).length;
  if (lessonsCount >= 1 && !earned.has('first-lesson')) {
    user.badges.push('first-lesson');
  }
  if (user.xp >= 100 && !earned.has('hundred-xp')) {
    user.badges.push('hundred-xp');
  }
}

function simpleHash(str) {
  // تشفير بسيط تجريبي - غير مناسب للإنتاج الحقيقي
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0; // 32bit
  }
  return 'h_' + Math.abs(h);
}

export async function login({ role, nationalId, phone, password }) {
  if (!role || !password) throw new Error('يرجى إدخال الدور وكلمة المرور');
  await ensureUsersLoaded();
  const users = JSON.parse(localStorage.getItem('itqan_users') || '[]');
  let user;
  if (role === 'student') {
    if (!nationalId) throw new Error('يرجى إدخال الرقم القومي للطالب');
    user = users.find(u => u.role === 'student' && u.nationalId === nationalId);
  } else {
    if (!phone) throw new Error('يرجى إدخال رقم الموبايل');
    user = users.find(u => u.role === role && u.phone === phone);
  }
  if (!user) throw new Error('لا يوجد مستخدم مطابق للمدخلات');
  if (user.passwordHash !== simpleHash(password)) throw new Error('كلمة المرور غير صحيحة');
  localStorage.setItem('itqan_currentUser', JSON.stringify(user));
  localStorage.setItem('itqan_isLoggedIn', 'true');
  return user;
}

export async function ensureUsersLoaded() {
  const existing = localStorage.getItem('itqan_users');
  if (existing && existing !== '[]') return;
  try {
    const users = await getUsers();
    localStorage.setItem('itqan_users', JSON.stringify(users));
  } catch (e) {
    // لا نوقف التنفيذ؛ يمكن أن يبدأ بدون بيانات خارجية
    localStorage.setItem('itqan_users', '[]');
  }
}

export function guardRole(requiredRole) {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  if (user.role !== requiredRole) {
    // منع الوصول لغير المصرح لهم
    window.location.href = 'index.html';
    return;
  }
}

export function routeToDashboardByRole(userOrNull = null) {
  const user = userOrNull || getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  // تحويل حسب الدور
  if (user.role === 'owner') {
    window.location.href = 'dashboard.html';
  } else {
    window.location.href = 'index.html';
  }
}

export function sendOtpDev(phone) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  sessionStorage.setItem(`otp_${phone}`, code);
  console.warn('OTP (DEV ONLY):', code);
  return code;
}

export function verifyOtpDev(phone, code) {
  return sessionStorage.getItem(`otp_${phone}`) === code;
}