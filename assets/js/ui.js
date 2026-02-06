// ui.js - بناء مكونات الواجهة ديناميكياً

export function createCourseCard(course) {
  const el = document.createElement('article');
  el.className = 'course-card';
  el.innerHTML = `
    <img src="${course.image}" alt="${escapeHtml(course.title)}" loading="lazy" />
    <div class="info">
      <div class="title">${escapeHtml(course.title)}</div>
      <div class="meta">
        <span>المحاضر: ${escapeHtml(course.instructor)}</span>
        <span>التقييم: ⭐ ${Number(course.rating).toFixed(1)}</span>
        <span>السعر: ${Number(course.price).toFixed(2)} ج.م</span>
      </div>
      <p class="desc">${escapeHtml(course.description).slice(0, 160)}...</p>
      <div class="actions">
        <a class="btn primary" href="course-details.html?id=${encodeURIComponent(course.id)}">تفاصيل</a>
        <a class="btn" href="learning.html?id=${encodeURIComponent(course.id)}">ابدأ التعلم</a>
      </div>
    </div>
  `;
  return el;
}

export function createLessonItem(lesson) {
  const el = document.createElement('div');
  el.className = 'item';
  el.innerHTML = `
    <div class="title">${escapeHtml(lesson.title)}</div>
    <div class="meta">مدة: ${escapeHtml(lesson.duration || 'غير محددة')}</div>
  `;
  return el;
}

export function escapeHtml(str) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}