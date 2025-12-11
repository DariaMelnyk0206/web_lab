// main.js
import CourseList from './CourseList.js';
import CourseService from './api/CourseService.js';

const service = new CourseService();

function renderList() {
    const container = document.getElementById("courses-col");
    const filtersForm = document.querySelector(".filters-col form");
    const searchInput = document.querySelector("header input[type='text']");

    container.innerHTML = '';
    new CourseList({ container, filtersForm, searchInput });
}

async function renderItem(id) {
    const course = await service.getCourseById(Number(id));
    const container = document.getElementById("courses-col");

    container.innerHTML = `
        <h1>${course.title}</h1>
        <p>${course.description}</p>
        <div>Duration: ${course.duration}</div>
        <div>Price: ${course.price || 'Free'}</div>
        <button class="btn start" onclick="window.location.href='/enroll/${course.id}'">
            Start
        </button>
    `;
}

function router() {
    const hash = window.location.hash || '#/list';
    const [route, id] = hash.slice(2).split('/'); // видаляємо "#/"

    if (route === 'list') renderList();
    else if (route === 'item' && id) renderItem(id);
    // enroll тепер обробляє сервер, JS тут не потрібен
}

// слухаємо зміни hash та DOMContentLoaded
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);