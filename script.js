/**
 * AYMS Conf 2026 — Desktop Interactive Features & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Sticky Navbar Dynamic Shadow & ScrollSpy ---
  const desktopNav = document.getElementById('desktop-nav');
  const sections = document.querySelectorAll('.vh-section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.getElementById('mobile-menu-toggle');

  if (mobileToggle && desktopNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = desktopNav.classList.toggle('nav-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  window.addEventListener('scroll', () => {
    // Nav bar scrolled state
    if (window.scrollY > 40) {
      desktopNav?.classList.add('scrolled');
    } else {
      desktopNav?.classList.remove('scrolled');
    }

    // ScrollSpy active link tracking
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentId && link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // --- 2. Smooth Scrolling for Internal Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        desktopNav?.classList.remove('nav-open');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // --- 3. Interactive Modal Content & Management ---
  const modalContainer = document.getElementById('modal-container');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalConfirmBtn = document.getElementById('modal-confirm-btn');

  const modalData = {
    theses: {
      title: 'Вимоги до оформлення тез',
      content: `
        <p><strong>Шановні учасники та автори досліджень!</strong> Будь ласка, дотримуйтесь офіційних стандартів подання тез до наукового збірника AYMS Conf 2026:</p>
        <h4>1. Загальні технічні параметри:</h4>
        <ul>
          <li><strong>Обсяг тез:</strong> до 1-2 сторінок друкованого тексту формату А4 (до 3500-4000 знаків з урахуванням пробілів).</li>
          <li><strong>Шрифт та параметри:</strong> Times New Roman, кегль 14 pt, міжрядковий інтервал 1.5, поля з усіх боків — по 20 мм.</li>
          <li><strong>Робочі мови:</strong> українська або англійська.</li>
        </ul>
        <h4>2. Обов'язкова структура тез (для оригінальних досліджень):</h4>
        <ul>
          <li><strong>Вступ</strong> — актуальність дослідження, невирішені аспекти проблеми.</li>
          <li><strong>Мета дослідження</strong> — чітке формулювання наукової мети.</li>
          <li><strong>Матеріали та методи</strong> — критерії відбору, обсяг вибірки, статистичні методи.</li>
          <li><strong>Результати</strong> — власні отримані дані з числовими та статистичними показниками (p-value, 95% ДІ).</li>
          <li><strong>Висновки</strong> — чіткі відповіді на поставлену мету без голослівних тверджень.</li>
        </ul>
        <h4>3. Клінічні випадки (Clinical Case Reports):</h4>
        <ul>
          <li>Вступ, Опис клінічного випадку, Обговорення та практична цінність, Висновки.</li>
        </ul>
        <p style="font-size: 13px; color: #9CA3AF; margin-top: 14px;">* Збірник матеріалів вийде з присвоєнням офіційного ISBN та індексацією.</p>
      `
    },
    sample: {
      title: 'Зразок оформлення роботи',
      content: `
        <p>Для швидкого оформлення роботи скористайтеся типовим шаблоном:</p>
        <div style="background: rgba(255,255,255,0.05); border-left: 3px solid #436AEE; padding: 18px; border-radius: 10px; margin: 16px 0; font-family: monospace; font-size: 13px; line-height: 1.6;">
          <p style="color: #FFFFFF;"><strong>СУЧАСНІ ПІДХОДИ ДО ДІАГНОСТИКИ ГОСТРОГО КОРОНАРНОГО СИНДРОМУ У МОЛОДИХ ПАЦІЄНТІВ</strong></p>
          <p style="margin-top: 8px; color: #91E0FD;">Іваненко О. В.<sup>1</sup>, Петренко М. І.<sup>2</sup></p>
          <p style="color: #9CA3AF;">Науковий керівник: д.мед.н., проф. Сидоренко К. П.<sup>1</sup></p>
          <p style="color: #6B7280; font-size: 12px; margin-top: 6px;">
            <sup>1</sup> Кафедра внутрішньої медицини №1, Національний медичний університет імені О.О. Богомольця, м. Київ<br>
            <sup>2</sup> Студентське наукове товариство імені О.А. Киселя
          </p>
        </div>
        <h4>Рекомендації до шапки:</h4>
        <ul>
          <li>Назва роботи друкується напівжирними великими літерами по центру, без крапки в кінці.</li>
          <li>Прізвища авторів вказуються з ініціалами та курсом/факультетом.</li>
          <li>Обов'язково зазначати вчений ступінь та наукове звання наукового керівника.</li>
        </ul>
      `
    },
    presentation: {
      title: 'Вимоги до виступу й слайдів',
      content: `
        <p><strong>Регламент виступу на засіданнях секцій та технічні вимоги до слайдів:</strong></p>
        <h4>Таймінг доповідача:</h4>
        <ul>
          <li><strong>Тривалість усної доповіді:</strong> до 7 хвилин.</li>
          <li><strong>Дискусія та запитання журі:</strong> до 3 хвилин.</li>
        </ul>
        <h4>Технічні вимоги до презентації:</h4>
        <ul>
          <li><strong>Формат слайдів:</strong> 16:9 (Full HD або 4K), файли у форматі PowerPoint (.pptx) або PDF.</li>
          <li><strong>Контрастність та шрифти:</strong> якісні рубані шрифти (Montserrat, Arial), контрастний фон для якісного проектування на великих екранах аудиторій.</li>
          <li><strong>Візуалізація:</strong> мінімум суцільного тексту — максимум графіків, схем, оригінальних мікрофотографій та клінічних зображень.</li>
          <li><strong>Біоетика та конфіденційність:</strong> обов'язкове ретушування персональних даних та облич пацієнтів відповідно до Гельсінської декларації.</li>
        </ul>
      `
    },
    register: {
      title: 'Реєстрація на AYMS Conf 2026',
      content: `
        <p><strong>Annual Young Medical Scientists’ Conference 2026</strong> чекає на ваші наукові відкриття!</p>
        <div style="background: rgba(255,88,0,0.1); border: 1px solid rgba(255,88,0,0.3); border-radius: 12px; padding: 16px; margin: 16px 0;">
          <p style="color: #FF8533; font-weight: 700; margin-bottom: 4px;">🎓 Безкоштовна участь для студентів</p>
          <p style="font-size: 13px; color: #E5E7EB;">Для всіх студентів медичних ЗВО України та зарубіжжя участь є безкоштовною за умови проходження відбору.</p>
        </div>
        <h4>Умови подачі:</h4>
        <ul>
          <li>Ви можете подати до <strong>3 власних досліджень</strong> у різні наукові секції.</li>
          <li>Кожна робота реєструється окремо.</li>
          <li>Перед поданням переконайтеся, що тези оформлені відповідно до офіційного зразка.</li>
        </ul>
        <div style="margin-top: 24px; text-align: center;">
          <button type="button" class="btn-primary-gradient" style="padding: 14px 32px; font-size: 15px;" onclick="alert('Реєстраційна форма буде відкрита за регламентом конференції. Слідкуйте за новинами в @aymsconf!');">
            Перейти до реєстраційної форми
          </button>
        </div>
      `
    }
  };

  function openModal(type) {
    const data = modalData[type];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.content;
    modalContainer.classList.add('active');
    modalContainer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalContainer.classList.remove('active');
    modalContainer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind Buttons
  document.getElementById('nav-btn-register')?.addEventListener('click', () => openModal('register'));
  document.getElementById('hero-btn-register')?.addEventListener('click', () => openModal('register'));
  document.getElementById('banner-btn-register')?.addEventListener('click', () => openModal('register'));
  document.getElementById('footer-btn-register')?.addEventListener('click', () => openModal('register'));

  document.getElementById('btn-desktop-theses')?.addEventListener('click', () => openModal('theses'));
  document.getElementById('btn-desktop-sample')?.addEventListener('click', () => openModal('sample'));
  document.getElementById('btn-desktop-presentation')?.addEventListener('click', () => openModal('presentation'));

  // Bind Mobile Hotspots & Buttons
  document.getElementById('btn-m-open-theses')?.addEventListener('click', () => openModal('theses'));
  document.getElementById('btn-m-open-sample')?.addEventListener('click', () => openModal('sample'));
  document.getElementById('btn-m-open-presentation')?.addEventListener('click', () => openModal('presentation'));
  document.getElementById('btn-nav-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    openModal('register');
  });
  document.getElementById('btn-back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.getElementById('btn-m-back-to-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  modalClose?.addEventListener('click', closeModal);
  modalConfirmBtn?.addEventListener('click', closeModal);

  modalContainer?.addEventListener('click', (e) => {
    if (e.target === modalContainer) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer?.classList.contains('active')) {
      closeModal();
    }
  });
});
