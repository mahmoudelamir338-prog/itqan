// api.js - جلب البيانات من ملفات JSON

export async function getCourses() {
  const res = await fetch('./data/courses.json');
  if (!res.ok) throw new Error('فشل في تحميل المساقات');
  return res.json();
}

export async function getCourseById(id) {
  const courses = await getCourses();
  return courses.find(c => String(c.id) === String(id));
}

export async function getUsers() {
  const res = await fetch('./data/users.json');
  if (!res.ok) throw new Error('فشل في تحميل المستخدمين');
  return res.json();
}