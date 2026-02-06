export function createLessonItem(lesson) {
  const li = document.createElement('div');
  li.className = 'item';
  li.textContent = lesson.title;
  return li;
}
export function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
