import CourseService from './api/CourseService.js';

document.addEventListener("DOMContentLoaded", () => {
    const likeBtn = document.querySelector('.like-btn');
    if (!likeBtn) return;

    const likesSpan = document.getElementById(`likes-${likeBtn.dataset.id}`);
    const service = new CourseService();

    likeBtn.addEventListener('click', async () => {
        const id = Number(likeBtn.dataset.id);
        const currentLikes = Number(likesSpan.textContent);

        likesSpan.textContent = currentLikes + 1;

        try {
            await service.likeCourse(id, currentLikes);
        } catch (err) {
            console.error(err);
            alert('Не вдалося поставити лайк');
            likesSpan.textContent = currentLikes; // rollback
        }
    });
});
