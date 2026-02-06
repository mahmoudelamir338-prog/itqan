export async function login({role,nationalId,phone,password}) {
  if(!role) throw new Error('اختر الدور');
  return { id:'u_'+Date.now(), name:'مستخدم تجريبي', role, phone };
}
export async function signup({name,role,nationalId,phone,password}) {
  if(!name||!role) throw new Error('الاسم والدور مطلوب');
  return { id:'u_'+Date.now(), name, role, phone };
}
export function routeToDashboardByRole(user){
  if(user.role==='owner') window.location.href='dashboard.html';
  else window.location.href='index.html';
}
export function restoreThemePreference() {
  const t=localStorage.getItem('itqan_theme'); if(t==='light') document.body.classList.add('light');
}
export function initAuthGuards(){ const user=JSON.parse(localStorage.getItem('itqan_currentUser')||'null'); if(user && user.role==='owner'){}}
export function initFirebase(){ console.log('Firebase initialized'); }
export function completeLesson(lessonId){ console.log('درس مكتمل', lessonId); }
