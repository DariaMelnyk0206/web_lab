export default class CourseService {
    constructor() {
        this.baseUrl = "/data/db.json";
        this.cache = null; // in-memory кеш
    }

    async getCourses() {
        if (this.cache) return this.cache; // повертаємо кеш, якщо він є

        const res = await axios.get(this.baseUrl);
        this.cache = res.data.courses;
        return this.cache;
    }

    async getCourseById(id) {
        if (this.cache) {
            return this.cache.find(c => c.id === id);
        }

        const res = await axios.get(this.baseUrl);
        this.cache = res.data.courses;
        return this.cache.find(c => c.id === id);
    }

    async likeCourse(id) {
        const res = await axios.patch(`/api/courses/${id}`, {});
        // оновлюємо кеш після лайку
        if (this.cache) {
            const course = this.cache.find(c => c.id === id);
            if (course) course.likes = (course.likes || 0) + 1;
        }
        return res.data;
    }
}
