export default class EnrollForm {
  constructor(formSelector, courseId, isFree = false) {
    this.form = formSelector ? document.querySelector(formSelector) : null;
    this.courseId = courseId;
    this.isFree = isFree;

    this.init();
  }

  init() {
    const enrolledKey = `enrolled_${this.courseId}`;
    const isEnrolled = localStorage.getItem(enrolledKey);

    if (isEnrolled) {
      this.hideFormOrButton();
      this.showMessage();
      return;
    }

    if (this.isFree) {
      // Безкоштовний курс — кнопка під лівою колонкою
      const container = document.querySelector('.enroll-container .col:first-child');
      const btn = document.createElement('button');
      btn.textContent = 'Enroll';
      btn.className = 'btn solid-purple';
      container.appendChild(btn);

      btn.addEventListener('click', () => {
        localStorage.setItem(enrolledKey, true);
        btn.style.display = 'none';
        this.showMessage();
      });
    } else if (this.form) {
      const savedPlan = localStorage.getItem(`selectedPlan_${this.courseId}`);
      if (savedPlan) {
        const radio = this.form.querySelector(`input[name="plan"][value="${savedPlan}"]`);
        if (radio) radio.checked = true;
      }

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const plan = this.form.plan.value;
        if (!plan) {
          alert('Please select a plan!');
          return;
        }

        localStorage.setItem(`selectedPlan_${this.courseId}`, plan);
        localStorage.setItem(enrolledKey, true);
        this.hideFormOrButton();

        fetch(`/enroll/${this.courseId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan }),
        })
          .then(res => res.json())
          .then(() => {
            this.showMessage();
          })
          .catch(err => {
            console.error(err);
            alert('Failed to enroll, please try again.');
          });
      });
    }
  }

  hideFormOrButton() {
    if (this.isFree) {
      // Для безкоштовного курсу кнопка в лівій колонці
      const btn = document.querySelector('.enroll-container .col:first-child button');
      if (btn) btn.style.display = 'none';
    } else {
      // Для платного курсу ховаємо всю праву колонку
      const rightCol = document.querySelector('.enroll-container .col:last-child');
      if (rightCol) rightCol.style.display = 'none';
    }
  }

  showFormOrButton() {
    if (this.isFree) {
      const btn = document.querySelector('.enroll-container .col:first-child button');
      if (btn) btn.style.display = 'block';
    } else {
      const rightCol = document.querySelector('.enroll-container .col:last-child');
      if (rightCol) rightCol.style.display = 'flex';
    }
  }

  showMessage() {
    const messageContainer = document.getElementById('enroll-message-container');
    if (!messageContainer) return;

    messageContainer.textContent = 'You are enrolled in this course!';
    messageContainer.style.color = 'green';
    messageContainer.style.fontWeight = 'bold';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Скинути записування';
    resetBtn.className = 'btn';
    resetBtn.style.marginTop = '10px';
    messageContainer.appendChild(resetBtn);

    resetBtn.addEventListener('click', () => {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('enrolled_') || key.startsWith('selectedPlan_')) {
          localStorage.removeItem(key);
        }
      });

      alert('Записування скинуто!');

      messageContainer.textContent = '';

      this.showFormOrButton();
    });
  }
}
