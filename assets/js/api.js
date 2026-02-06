let courses = [];
let users = [];

export function getCourses() { return Promise.resolve(courses); }
export function getCourseById(id) { return Promise.resolve(courses.find(c=>c.id===id)); }
export function addCourse(course) { course.id='c_'+Date.now(); courses.push(course); return course; }
export function updateCourse(updated) { courses=courses.map(c=>c.id===updated.id?updated:c); return updated; }
export function deleteCourse(id){ courses=courses.filter(c=>c.id!==id); }
export function getUsers(){ return Promise.resolve(users); }
export function updateUserRole(id, role){ const u=users.find(u=>u.id===id||u.phone===id); if(u){u.role=role; return true} return false; }
export function toggleUserBan(id,banned){ const u=users.find(u=>u.id===id||u.phone===id); if(u){u.banned=banned; return true} return false; }
