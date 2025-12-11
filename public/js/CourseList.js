import CourseService from './api/CourseService.js';

export default class CourseList {
    constructor({ container, filtersForm, searchInput }) {
        this.container = container;
        this.filtersForm = filtersForm;
        this.searchInput = searchInput;
        this.service = new CourseService();

        this.allCourses = [];
        this.filteredCourses = [];
        this.limit = 6;
        this.offset = 0;
        this.loading = false;

        this.init();
    }

    async init() {
        try {
            this.allCourses = await this.service.getCourses();
            this.filteredCourses = [...this.allCourses];
    
            this.renderNextBatch();
    
            // Фільтри
            this.filtersForm.addEventListener("change", () => this.updateCourses());
    
            // Пошук по кнопці
            const searchBtn = document.querySelector("header button[aria-label='submit']");
            if (searchBtn) {
                searchBtn.addEventListener("click", e => {
                    e.preventDefault();
                    this.applySearch();
                });
            }

            const params = new URLSearchParams(window.location.search);
            const searchValue = params.get("submit");
            if (searchValue) {
                this.searchInput.value = searchValue;
                this.updateCourses();
            }

            window.addEventListener("scroll", () => this.onScroll());
    
        } catch (err) {
            console.error(err);
            this.container.innerHTML = "<p>Не вдалося завантажити курси.</p>";
        }
    }

    applySearch() {
        const value = this.searchInput.value.trim();

        const params = new URLSearchParams(window.location.search);
        if (value) params.set("submit", value);
        else params.delete("submit");

        window.history.replaceState({}, "", `${window.location.pathname}?${params}`);

        this.updateCourses();
    }

    updateCourses() {
        this.offset = 0;

        let list = [...this.allCourses];

        list = this.filterCourses(list);

        list = this.searchCourses(list, this.searchInput.value);

        this.filteredCourses = list;
        this.container.innerHTML = "";
        this.renderNextBatch();
    }

    filterCourses(courses) {
        const checked = this.filtersForm.querySelectorAll("input[type='checkbox']:checked");

        const filters = {};
        checked.forEach(input => {
            const name = input.name;
            const value = input.parentElement.textContent.trim();
            if (!filters[name]) filters[name] = [];
            filters[name].push(value);
        });

        return courses.filter(course => {
            for (let key in filters) {
                if (key === "level" && !filters[key].includes(course.level)) return false;

                if (key === "price") {
                    const priceLabel = course.price || "Free";
                    if (!filters[key].includes(priceLabel)) return false;
                }

                if (key === "topic" && !filters[key].includes(course.topic)) return false;

                if (key === "technology" && !course.technology?.some(t => filters[key].includes(t))) return false;

                if (key === "time") {
                    const duration = parseInt(course.duration);
                    if (filters[key].includes("Less than 5 hours") && duration >= 5) return false;
                    if (filters[key].includes("5-10 hours") && (duration < 5 || duration > 10)) return false;
                    if (filters[key].includes("10-20 hours") && (duration < 10 || duration > 20)) return false;
                    if (filters[key].includes("20-60 hours") && (duration < 20 || duration > 60)) return false;
                    if (filters[key].includes("More than 60 hours") && duration <= 60) return false;
                }
            }
            return true;
        });
    }

    searchCourses(courses, query) {
        if (!query) return courses;

        const q = query.trim().toLowerCase();
        return courses.filter(course =>
            course.title.toLowerCase().includes(q) ||
            course.description.toLowerCase().includes(q) ||
            course.topic.toLowerCase().includes(q) ||
            (course.technology?.some(t => t.toLowerCase().includes(q)))
        );
    }

    renderNextBatch() {
        if (this.loading) return;
        this.loading = true;
    
        const start = this.offset;
        const end = this.offset + this.limit;
        const batch = this.filteredCourses.slice(start, end);
    
        if (!batch.length) {
            this.loading = false;
            return;
        }
    
        batch.forEach(course => {
            const div = document.createElement("div");
            div.className = "course-card";
            div.innerHTML = `
                <div class="course-topic">
                    <img src="/label.png" alt="Topic icon">
                    <span>${course.topic}</span>
                </div>
                <div class="course-content">
                    <h2><a href="/courses/${course.id}">${course.title}</a></h2>
                    <p>${course.description}</p>
                </div>
                <div class="course-bottom">
                    <div class="course-price">${course.price || 'Free'}</div>
                    <div class="course-divider"></div>
                    <div class="course-footer">
                        <strong class="time">${course.duration}</strong>
                        <div class="course-meta">
                            <img src="/level.png" alt="Level">
                            <span>${course.level}</span>
                        </div>
                    </div>
                </div>
            `;
            this.container.appendChild(div);
        });
    
        this.offset += batch.length;
        this.loading = false;
    }    

    onScroll() {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
            this.renderNextBatch();
        }
    }
}
