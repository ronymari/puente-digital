/**
 * PUENTE DIGITAL - Lógica Interactiva, Autenticación, Simulador Play Store y Evaluaciones
 * Plataforma Educativa de Alfabetización Digital para Adultos Mayores
 */

// Usuarios precargados y gestión de base de datos local
const INITIAL_USERS = [
  { username: 'RONY', password: 'RONY', name: 'Rony' }
];

document.addEventListener('DOMContentLoaded', () => {
  initUsersDatabase();
  initAccessibility();
  initSpeechSynthesis();
  initAuthSystem();
  initDashboard2();
  initLevelsAndCourses();
  initSearch();
  initPlayStoreSimulator();
  initCourseEvaluation();
  initScamDetector();
  initWhatsAppSimulator();
  initLessonModal();
  initHelpModal();
  initAiCompanion();
  initSosModal();
  initProfileModal();
  initTutorModal();
  initBackToTop();
  initServiceWorker();
  updateUIForAuthState();
});

/* --------------------------------------------------------------------------
   0. GESTIÓN DE USUARIOS Y BASE DE DATOS LOCAL
   -------------------------------------------------------------------------- */
function initUsersDatabase() {
  if (!localStorage.getItem('puente_users')) {
    localStorage.setItem('puente_users', JSON.stringify(INITIAL_USERS));
  }
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem('puente_users')) || INITIAL_USERS;
  } catch (e) {
    return INITIAL_USERS;
  }
}

function saveUser(userObj) {
  const users = getUsers();
  users.push(userObj);
  localStorage.setItem('puente_users', JSON.stringify(users));
}

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem('puente_logged_user'));
  } catch (e) {
    return null;
  }
}

function setLoggedUser(userObj) {
  if (userObj) {
    localStorage.setItem('puente_logged_user', JSON.stringify(userObj));
  } else {
    localStorage.removeItem('puente_logged_user');
  }
}

/* --------------------------------------------------------------------------
   0.1 NOTIFICACIONES TOAST FLOTANTES MODERNAS
   -------------------------------------------------------------------------- */
function showToast(title, message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  const icon = type === 'success' ? '✅' : type === 'danger' ? '⚠️' : type === 'warning' ? '📞' : 'ℹ️';
  
  toast.innerHTML = `
    <div style="font-size: 28px; flex-shrink: 0;" aria-hidden="true">${icon}</div>
    <div style="flex: 1;">
      <div style="font-weight: 800; font-size: 1.05rem; color: var(--text-primary); margin-bottom: 2px;">${title}</div>
      <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.4;">${message}</div>
    </div>
  `;
  
  container.appendChild(toast);
  announceAccessibilityChange(`${title}: ${message}`);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* --------------------------------------------------------------------------
   1. SISTEMA DE ACCESIBILIDAD GERONTOLÓGICA
   -------------------------------------------------------------------------- */
function initAccessibility() {
  const root = document.documentElement;
  const body = document.body;

  const btnFontNormal = document.getElementById('btn-font-normal');
  const btnFontLarge = document.getElementById('btn-font-large');
  const btnFontXlarge = document.getElementById('btn-font-xlarge');
  const fontButtons = [btnFontNormal, btnFontLarge, btnFontXlarge];

  const btnContrastToggle = document.getElementById('btn-contrast-toggle');
  const btnVoiceSpeed = document.getElementById('btn-voice-speed');

  const prefs = window.StorageService ? StorageService.getPreferences() : { fontScale: '1', contrast: 'normal', voiceSpeed: 0.9 };
  setFontScale(prefs.fontScale || '1');

  if (prefs.contrast === 'high') {
    body.classList.add('high-contrast');
    if (btnContrastToggle) {
      btnContrastToggle.setAttribute('aria-pressed', 'true');
      btnContrastToggle.innerHTML = '☀️ Modo Normal';
    }
  }

  // Control de velocidad de voz en barra superior
  if (btnVoiceSpeed) {
    updateVoiceSpeedButtonUI(prefs.voiceSpeed || 0.9);
    btnVoiceSpeed.addEventListener('click', () => {
      const currentRate = StorageService.getPreferences().voiceSpeed || 0.9;
      let nextRate = 0.9;
      if (currentRate === 0.9) nextRate = 0.75;
      else if (currentRate === 0.75) nextRate = 1.1;
      else nextRate = 0.9;

      StorageService.savePreferences({ voiceSpeed: nextRate });
      updateVoiceSpeedButtonUI(nextRate);
      showToast('Velocidad de voz', `Voz ajustada a ${nextRate === 0.75 ? 'Lenta' : nextRate === 1.1 ? 'Rápida' : 'Normal'}`, 'info');
      speakText(`Velocidad de voz ajustada`);
    });
  }

  function updateVoiceSpeedButtonUI(rate) {
    if (!btnVoiceSpeed) return;
    if (rate <= 0.8) btnVoiceSpeed.innerHTML = '⚡ Voz: Lenta';
    else if (rate >= 1.05) btnVoiceSpeed.innerHTML = '⚡ Voz: Rápida';
    else btnVoiceSpeed.innerHTML = '⚡ Voz: Normal';
  }

  if (btnFontNormal) btnFontNormal.addEventListener('click', () => setFontScale('1'));
  if (btnFontLarge) btnFontLarge.addEventListener('click', () => setFontScale('1.18'));
  if (btnFontXlarge) btnFontXlarge.addEventListener('click', () => setFontScale('1.35'));

  function setFontScale(scale) {
    root.style.setProperty('--font-scale', scale);
    if (window.StorageService) StorageService.savePreferences({ fontScale: scale });
    localStorage.setItem('puente_font_scale', scale);

    fontButtons.forEach(btn => {
      if (btn) btn.classList.remove('active');
    });

    if (scale === '1' && btnFontNormal) btnFontNormal.classList.add('active');
    else if (scale === '1.18' && btnFontLarge) btnFontLarge.classList.add('active');
    else if (scale === '1.35' && btnFontXlarge) btnFontXlarge.classList.add('active');

    announceAccessibilityChange(`Tamaño de letra ajustado`);
  }

  if (btnContrastToggle) {
    btnContrastToggle.addEventListener('click', () => {
      const isHigh = body.classList.toggle('high-contrast');
      const contrastMode = isHigh ? 'high' : 'normal';
      if (window.StorageService) StorageService.savePreferences({ contrast: contrastMode });
      localStorage.setItem('puente_contrast', contrastMode);
      btnContrastToggle.setAttribute('aria-pressed', isHigh ? 'true' : 'false');
      btnContrastToggle.innerHTML = isHigh ? '☀️ Modo Normal' : '🌙 Alto Contraste';
      announceAccessibilityChange(isHigh ? 'Modo Alto Contraste activado' : 'Modo Normal activado');
    });
  }
}

function announceAccessibilityChange(text) {
  let announcer = document.getElementById('a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    document.body.appendChild(announcer);
  }
  announcer.textContent = text;
}

/* --------------------------------------------------------------------------
   2. LECTOR DE VOZ ACCESIBLE (Web Speech API)
   -------------------------------------------------------------------------- */
let isSpeaking = false;

function initSpeechSynthesis() {
  const btnReadPage = document.getElementById('btn-read-page');
  const btnReadHero = document.getElementById('btn-read-hero');

  if (!('speechSynthesis' in window)) {
    if (btnReadPage) btnReadPage.style.display = 'none';
    if (btnReadHero) btnReadHero.style.display = 'none';
    return;
  }

  if (btnReadPage) {
    btnReadPage.addEventListener('click', () => {
      if (isSpeaking) {
        stopSpeaking();
        btnReadPage.innerHTML = '🔊 Escuchar Página';
      } else {
        const textToRead = "Bienvenido a Puente Digital 2.0, plataforma de inclusión y autonomía digital para personas mayores. Aquí aprenderás a tu ritmo, con letra grande, simuladores interactivos y un compañero digital con voz. Tocar la pantalla no rompe nada y todo tiene marcha atrás.";
        speakText(textToRead, () => {
          btnReadPage.innerHTML = '🔊 Escuchar Página';
        });
        btnReadPage.innerHTML = '⏹️ Detener Voz';
      }
    });
  }

  if (btnReadHero) {
    btnReadHero.addEventListener('click', () => {
      if (isSpeaking) {
        stopSpeaking();
        btnReadHero.innerHTML = '🔊 Escuchar Bienvenida';
      } else {
        const heroText = document.getElementById('hero-welcome-text')?.innerText || "Bienvenido a Puente Digital. Aprender a usar tu celular y computadora es más fácil de lo que crees.";
        speakText(heroText, () => {
          btnReadHero.innerHTML = '🔊 Escuchar Bienvenida';
        });
        btnReadHero.innerHTML = '⏹️ Detener Voz';
      }
    });
  }
}

function speakText(text, onComplete) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const currentPrefs = window.StorageService ? StorageService.getPreferences() : { voiceSpeed: 0.9 };
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'es-ES';
  utterance.rate = currentPrefs.voiceSpeed || 0.9;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const spanishVoice = voices.find(v => v.lang.startsWith('es'));
  if (spanishVoice) utterance.voice = spanishVoice;

  utterance.onstart = () => { isSpeaking = true; };
  utterance.onend = () => { isSpeaking = false; if (onComplete) onComplete(); };
  utterance.onerror = () => { isSpeaking = false; if (onComplete) onComplete(); };

  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
}

/* --------------------------------------------------------------------------
   3. SISTEMA DE AUTENTICACIÓN
   -------------------------------------------------------------------------- */
function initAuthSystem() {
  const btnsOpenLogin = document.querySelectorAll('.trigger-open-login');
  const btnsOpenRegister = document.querySelectorAll('.trigger-open-register');
  const btnsOpenSupport = document.querySelectorAll('.trigger-open-support');
  const btnsOpenTutor = document.querySelectorAll('.trigger-open-tutor, #btn-nav-tutor');

  const modalLogin = document.getElementById('login-modal');
  const modalRegister = document.getElementById('register-modal');
  const modalSupport = document.getElementById('support-account-modal');
  const modalTutor = document.getElementById('tutor-modal');

  btnsOpenLogin.forEach(btn => btn.addEventListener('click', () => openModal(modalLogin)));
  btnsOpenRegister.forEach(btn => btn.addEventListener('click', () => openModal(modalRegister)));
  btnsOpenSupport.forEach(btn => btn.addEventListener('click', () => openModal(modalSupport)));
  btnsOpenTutor.forEach(btn => btn.addEventListener('click', () => openModal(modalTutor)));

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetInput = document.getElementById(btn.getAttribute('data-target-input'));
      if (targetInput) {
        const isPassword = targetInput.type === 'password';
        targetInput.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? '🙈' : '👁️';
      }
    });
  });

  const btnQuickRony = document.getElementById('btn-quick-rony');
  if (btnQuickRony) {
    btnQuickRony.addEventListener('click', () => {
      document.getElementById('login-username').value = 'RONY';
      document.getElementById('login-password').value = 'RONY';
      processLogin('RONY', 'RONY');
    });
  }

  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('login-username').value.trim();
      const p = document.getElementById('login-password').value.trim();
      processLogin(u, p);
    });
  }

  const formRegister = document.getElementById('form-register');
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const u = document.getElementById('reg-username').value.trim();
      const p = document.getElementById('reg-password').value.trim();

      if (!name || !u || !p) {
        showToast('Campos incompletos', 'Por favor completa todos los campos con letra clara.', 'warning');
        return;
      }

      const users = getUsers();
      if (users.some(existing => existing.username.toUpperCase() === u.toUpperCase())) {
        showToast('Usuario ya registrado', 'Ese nombre de usuario ya está en uso. Prueba con otro o inicia sesión.', 'danger');
        return;
      }

      const newUser = { username: u, password: p, name: name };
      saveUser(newUser);
      setLoggedUser(newUser);

      closeModal(modalRegister);
      playTone(587, 0.25);
      showToast('¡Cuenta Creada!', `Bienvenido/a a Puente Digital, ${name}. Ya puedes ingresar a tus cursos.`, 'success');
      updateUIForAuthState();
    });
  }

  const formSupport = document.getElementById('form-support-account');
  if (formSupport) {
    formSupport.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sup-name').value.trim();
      const phone = document.getElementById('sup-phone').value.trim();
      const ticket = Math.floor(1000 + Math.random() * 9000);

      closeModal(modalSupport);
      playTone(523, 0.3);
      showToast('Solicitud Registrada', `N° ${ticket}: Un tutor te llamará al ${phone} para ayudarte paso a paso.`, 'success');
    });
  }

  const btnLogout = document.getElementById('btn-nav-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('¿Deseas salir de tu cuenta de Puente Digital?')) {
        setLoggedUser(null);
        updateUIForAuthState();
        showToast('Sesión Cerrada', 'Has salido de tu cuenta correctamente.', 'info');
        announceAccessibilityChange('Has cerrado sesión');
      }
    });
  }
}

function processLogin(username, password) {
  const users = getUsers();
  const found = users.find(u => 
    u.username.toUpperCase() === username.toUpperCase() && 
    u.password === password
  );

  if (found) {
    setLoggedUser(found);
    const modalLogin = document.getElementById('login-modal');
    closeModal(modalLogin);
    playTone(587, 0.25);
    showToast(`¡Hola, ${found.name}!`, 'Has iniciado sesión correctamente. Acceso habilitado a todos los cursos.', 'success');
    updateUIForAuthState();
    document.getElementById('aula-virtual-section')?.scrollIntoView({ behavior: 'smooth' });
  } else {
    playTone(330, 0.3);
    showToast('Datos incorrectos', 'Usuario o contraseña no coinciden. Recuerda: puedes probar con Usuario: RONY y Contraseña: RONY.', 'danger');
  }
}

function updateUIForAuthState() {
  const logged = getLoggedUser();
  const navAuthVisitor = document.getElementById('nav-auth-visitor');
  const navAuthLogged = document.getElementById('nav-auth-logged');
  const userGreetingName = document.getElementById('user-greeting-name');
  const classroomGreetingName = document.getElementById('classroom-greeting-name');
  const classroomSection = document.getElementById('aula-virtual-section');

  if (logged) {
    if (navAuthVisitor) navAuthVisitor.style.display = 'none';
    if (navAuthLogged) navAuthLogged.style.display = 'flex';
    if (userGreetingName) userGreetingName.textContent = logged.name || logged.username;
    if (classroomGreetingName) classroomGreetingName.textContent = logged.name || logged.username;
    if (classroomSection) classroomSection.style.display = 'block';

    const accessCardsWrap = document.getElementById('landing-access-cards');
    if (accessCardsWrap) accessCardsWrap.style.display = 'none';

    renderCoursesGrid();
    if (typeof renderDashboard2 === 'function') renderDashboard2();
  } else {
    if (navAuthVisitor) navAuthVisitor.style.display = 'flex';
    if (navAuthLogged) navAuthLogged.style.display = 'none';
    if (classroomSection) classroomSection.style.display = 'none';

    const accessCardsWrap = document.getElementById('landing-access-cards');
    if (accessCardsWrap) accessCardsWrap.style.display = 'grid';

    renderCoursesGrid();
    if (typeof renderDashboard2 === 'function') renderDashboard2();
  }
}

function openModal(modalEl) {
  if (modalEl) {
    modalEl.classList.add('active');
    modalEl.setAttribute('aria-hidden', 'false');
    modalEl.querySelector('.modal-close-btn')?.focus();
  }
}

function closeModal(modalEl) {
  if (modalEl) {
    modalEl.classList.remove('active');
    modalEl.setAttribute('aria-hidden', 'true');
  }
  stopSpeaking();
}

/* --------------------------------------------------------------------------
   4. GESTIÓN DE NIVELES Y CURSOS
   -------------------------------------------------------------------------- */
let currentLevel = 1;
let completedCourses = JSON.parse(localStorage.getItem('puente_completed_courses') || '[]');

function initLevelsAndCourses() {
  renderLevelTabs();
  renderCurrentLevelBanner();
  renderCoursesGrid();
}

function renderLevelTabs() {
  const tabsContainer = document.getElementById('level-tabs-container');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = '';
  PUENTE_DATA.levels.forEach(level => {
    const btn = document.createElement('button');
    btn.className = `level-tab-btn ${level.id === currentLevel ? 'active' : ''}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', level.id === currentLevel ? 'true' : 'false');
    btn.innerHTML = `<span>${level.icon}</span> <span>${level.number}: ${level.title}</span>`;
    
    btn.addEventListener('click', () => {
      currentLevel = level.id;
      renderLevelTabs();
      renderCurrentLevelBanner();
      renderCoursesGrid();
    });

    tabsContainer.appendChild(btn);
  });
}

function renderCurrentLevelBanner() {
  const bannerContainer = document.getElementById('level-banner-wrap');
  if (!bannerContainer) return;

  const level = PUENTE_DATA.levels.find(l => l.id === currentLevel);
  if (!level) return;

  bannerContainer.innerHTML = `
    <div class="level-banner-card" style="border-left: 8px solid ${level.color}">
      <div class="level-banner-info">
        <span class="level-banner-tag" style="background-color: ${level.color}22; color: ${level.color}">${level.badgeText}</span>
        <h2>${level.number}: ${level.title}</h2>
        <p style="font-size: 1.15rem; margin-bottom: 8px;"><strong>Objetivo:</strong> ${level.description}</p>
        <p style="margin-bottom: 0; color: var(--text-muted);"><strong>Destinatarios:</strong> ${level.targetAudience}</p>
      </div>
      <div class="level-banner-icon" aria-hidden="true">${level.icon}</div>
    </div>
  `;
}

function renderCoursesGrid(filterText = '') {
  const gridContainer = document.getElementById('courses-grid-container');
  if (!gridContainer) return;

  const isLogged = !!getLoggedUser();
  let filtered = PUENTE_DATA.courses.filter(c => c.level === currentLevel);

  if (filterText.trim()) {
    const q = filterText.toLowerCase().trim();
    filtered = PUENTE_DATA.courses.filter(c => 
      c.title.toLowerCase().includes(q) ||
      c.shortDesc.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: var(--bg-surface); border-radius: var(--radius-md); border: 2px dashed var(--border-strong);">
        <p style="font-size: 1.3rem; font-weight: 700;">🔍 No encontramos lecciones con esa palabra.</p>
        <p>Prueba buscando palabras como "WhatsApp", "aplicaciones", "claves", "Wi-Fi" o toca uno de los botones sugeridos arriba.</p>
        <button class="btn-secondary" onclick="resetSearch()" style="margin-top: 15px;">Ver todas las lecciones</button>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = '';
  filtered.forEach(course => {
    const isCompleted = completedCourses.includes(course.id);
    const isFeatured = !!course.isFeatured;
    const card = document.createElement('article');
    card.className = `course-card ${isFeatured ? 'featured-card' : ''} ${!isLogged ? 'locked' : ''}`;

    let extraButtonsHtml = '';
    if (course.hasSimulator && isLogged) {
      extraButtonsHtml += `
        <button class="btn-course-quiz btn-open-playstore-sim" style="background-color: var(--color-primary-light); color: var(--color-primary); border-color: var(--color-primary);">
          <span>📲</span> Practicar en Play Store Simulada
        </button>
      `;
    }
    if (course.hasQuiz && isLogged) {
      extraButtonsHtml += `
        <button class="btn-course-quiz btn-open-eval-sim">
          <span>📝</span> Comprobar si lo sé (Evaluación)
        </button>
      `;
    }

    card.innerHTML = `
      <div>
        <div class="course-card-top">
          <div class="course-icon" aria-hidden="true">${course.icon}</div>
          <div class="course-card-meta">
            <span class="course-category">${course.category} • Nivel ${course.level}</span>
            <div class="course-duration">⏱️ ${course.duration} de lectura fácil</div>
          </div>
          ${isCompleted ? '<span title="Lección completada" style="font-size: 26px;">✅</span>' : ''}
          ${!isLogged ? '<span title="Requiere iniciar sesión" style="font-size: 22px;">🔒</span>' : ''}
        </div>
        <h3 class="course-card-title">${course.title}</h3>
        <p class="course-card-desc">${course.shortDesc}</p>
      </div>

      <div class="course-card-actions">
        <button class="course-card-btn" data-course-id="${course.id}">
          <span>${!isLogged ? '🔒 Ingresar para ver lección' : (isCompleted ? '🔄 Repasar lección' : '📖 Comenzar lección')}</span>
          <span aria-hidden="true">➡️</span>
        </button>
        ${extraButtonsHtml}
      </div>
    `;

    const openBtn = card.querySelector('.course-card-btn');
    openBtn.addEventListener('click', () => {
      if (!isLogged) {
        showToast('Requiere ingreso', 'Para ver la lección completa y guardar tu progreso, ingresa con tu cuenta o prueba como RONY.', 'warning');
        openModal(document.getElementById('login-modal'));
      } else {
        openLessonModal(course);
      }
    });

    const openPlayStoreBtn = card.querySelector('.btn-open-playstore-sim');
    if (openPlayStoreBtn) {
      openPlayStoreBtn.addEventListener('click', () => {
        openModal(document.getElementById('playstore-modal'));
      });
    }

    const openEvalBtn = card.querySelector('.btn-open-eval-sim');
    if (openEvalBtn) {
      openEvalBtn.addEventListener('click', () => {
        openModal(document.getElementById('evaluation-modal'));
      });
    }

    gridContainer.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   5. BUSCADOR ASISTIDO
   -------------------------------------------------------------------------- */
function initSearch() {
  const searchInput = document.getElementById('main-search-input');
  const tagButtons = document.querySelectorAll('.tag-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      renderCoursesGrid(query);
    });
  }

  tagButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const term = btn.getAttribute('data-search-term');
      if (searchInput) {
        searchInput.value = term;
        renderCoursesGrid(term);
        document.getElementById('cursos-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

window.resetSearch = function() {
  const searchInput = document.getElementById('main-search-input');
  if (searchInput) searchInput.value = '';
  renderCoursesGrid('');
};

/* --------------------------------------------------------------------------
   6. SIMULADOR INTERACTIVO DE PLAY STORE (CURSO ESTRELLA)
   -------------------------------------------------------------------------- */
function initPlayStoreSimulator() {
  const btnOfficialInstall = document.getElementById('btn-sim-pami-install');
  const btnFakeCard = document.getElementById('sim-fake-app-card');
  const progressBox = document.getElementById('sim-download-progress-box');
  const progressBar = document.getElementById('sim-progress-bar-fill');
  const progressText = document.getElementById('sim-progress-text');
  const instructionBox = document.getElementById('sim-playstore-feedback-instruction');

  if (btnFakeCard) {
    btnFakeCard.addEventListener('click', () => {
      playTone(330, 0.3);
      alert('⚠️ ¡ALERTA DE SEGURIDAD!\n\nFíjate bien: esa aplicación dice "📢 Anuncio Patrocinado" y el desarrollador no es oficial. Si la descargas, te llenará de anuncios o te pedirá dinero.\n\n👉 Elige la aplicación de arriba que tiene el tilde verde de verificación de INSSJP.');
    });
  }

  if (btnOfficialInstall) {
    btnOfficialInstall.addEventListener('click', () => {
      if (btnOfficialInstall.classList.contains('installed')) {
        playTone(660, 0.2);
        unlockAchievementWithToast('ach-app-installer');
        showToast('🎉 ¡Excelente!', 'La aplicación PAMI Móvil se abrió en tu teléfono. Has completado la práctica de descarga con éxito.', 'success');
        closeModal(document.getElementById('playstore-modal'));
        return;
      }

      if (btnOfficialInstall.classList.contains('installing')) return;

      // Iniciar descarga simulada
      btnOfficialInstall.classList.add('installing');
      btnOfficialInstall.textContent = '⏳ Descargando...';
      if (progressBox) progressBox.style.display = 'block';
      if (instructionBox) instructionBox.textContent = 'Descargando a través de tu Wi-Fi. Por favor espera sin tocar la pantalla...';

      let progress = 0;
      const interval = setInterval(() => {
        progress += 25;
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `Descargando: ${progress}% completado`;
        playTone(700 + progress * 2, 0.08);

        if (progress >= 100) {
          clearInterval(interval);
          btnOfficialInstall.classList.remove('installing');
          btnOfficialInstall.classList.add('installed');
          btnOfficialInstall.textContent = '📲 ABRIR APLICACIÓN';
          if (progressText) progressText.textContent = '✅ ¡Instalación completa!';
          if (instructionBox) instructionBox.innerHTML = '✨ <strong>¡Muy bien hecho!</strong> La aplicación ya está instalada en tu teléfono. Toca el botón azul "ABRIR APLICACIÓN" para finalizar.';
          unlockAchievementWithToast('ach-app-installer');
        }
      }, 700);
    });
  }
}

/* --------------------------------------------------------------------------
   7. EVALUACIÓN DE COMPROBACIÓN Y CERTIFICADO DIGITAL
   -------------------------------------------------------------------------- */
let evalAnswers = {};

function initCourseEvaluation() {
  const container = document.getElementById('eval-questions-container');
  const btnCheck = document.getElementById('btn-eval-check-answers');
  const certContainer = document.getElementById('eval-certificate-box');
  const btnPrintCert = document.getElementById('btn-print-certificate');

  if (!container) return;

  container.innerHTML = '';
  PUENTE_DATA.courseEvaluation.questions.forEach((q, qIndex) => {
    const card = document.createElement('div');
    card.className = 'eval-question-card';
    card.id = `eval-card-${q.id}`;

    let optsHtml = '';
    q.options.forEach((opt, optIndex) => {
      optsHtml += `
        <label class="eval-opt-label">
          <input type="radio" name="eval-${q.id}" value="${optIndex}" style="width: 22px; height: 22px; accent-color: var(--color-primary);">
          <span>${opt.text}</span>
        </label>
      `;
    });

    card.innerHTML = `
      <h3 class="eval-question-title">${q.question}</h3>
      <div class="eval-options-list">
        ${optsHtml}
      </div>
      <div class="eval-feedback-box" id="eval-feedback-${q.id}"></div>
    `;

    const radioInputs = card.querySelectorAll(`input[name="eval-${q.id}"]`);
    radioInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        evalAnswers[q.id] = parseInt(e.target.value, 10);
      });
    });

    container.appendChild(card);
  });

  if (btnCheck) {
    btnCheck.addEventListener('click', () => {
      const questions = PUENTE_DATA.courseEvaluation.questions;
      let score = 0;
      let answeredCount = 0;

      questions.forEach(q => {
        const selectedIndex = evalAnswers[q.id];
        const feedbackEl = document.getElementById(`eval-feedback-${q.id}`);

        if (selectedIndex !== undefined) {
          answeredCount++;
          const isCorrect = q.options[selectedIndex].correct;
          if (isCorrect) {
            score++;
            if (feedbackEl) {
              feedbackEl.className = 'eval-feedback-box correct';
              feedbackEl.innerHTML = `🎉 <strong>¡Correcto!</strong> ${q.explanation}`;
            }
          } else {
            if (feedbackEl) {
              feedbackEl.className = 'eval-feedback-box incorrect';
              feedbackEl.innerHTML = `⚠️ <strong>Recuerda:</strong> ${q.explanation}`;
            }
          }
        }
      });

      if (answeredCount < questions.length) {
        showToast('Evaluación Incompleta', 'Por favor responde las 3 preguntas antes de comprobar tus respuestas.', 'warning');
        return;
      }

      if (score >= 2) {
        playTone(523.25, 0.4);
        const logged = getLoggedUser();
        const studentName = logged ? (logged.name || logged.username) : 'Rony';

        let certData = null;
        if (window.StorageService) {
          certData = StorageService.issueCertificate({
            studentName: studentName,
            courseTitle: 'Descarga e Instalación Segura de Aplicaciones Móviles',
            score: score,
            totalQuestions: 3
          });
        }

        const nameEl = document.getElementById('cert-student-name');
        const dateEl = document.getElementById('cert-date-text');
        const hashEl = document.getElementById('cert-hash-text');

        if (nameEl) nameEl.textContent = studentName;
        if (dateEl) dateEl.textContent = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        if (hashEl && certData) {
          hashEl.textContent = certData.hashVerification;
        }

        if (certContainer) certContainer.style.display = 'block';
        certContainer.scrollIntoView({ behavior: 'smooth' });
        speakText(`¡Felicitaciones ${studentName}! Has aprobado la evaluación con ${score} de 3 respuestas correctas y obtenido tu Certificado de Autonomía Digital.`);
        showToast('¡Certificado Obtenido!', `Felicitaciones ${studentName}, aprobaste con ${score} de 3 respuestas correctas.`, 'success');
        unlockAchievementWithToast('ach-digital-citizen');
      } else {
        playTone(330, 0.3);
        showToast('Sigue practicando', `Obtuviste ${score} de 3 aciertos. Revisa las explicaciones y vuelve a intentarlo.`, 'warning');
      }
    });
  }

  if (btnPrintCert) {
    btnPrintCert.addEventListener('click', () => {
      window.print();
    });
  }
}

/* --------------------------------------------------------------------------
   8. SIMULADOR DE DETECCIÓN DE ESTAFAS
   -------------------------------------------------------------------------- */
let currentScamIndex = 0;
let scamScore = 0;

function initScamDetector() {
  renderScamScenario();

  const btnSafe = document.getElementById('btn-scam-safe');
  const btnDanger = document.getElementById('btn-scam-danger');
  const btnNext = document.getElementById('btn-scam-next');

  if (btnSafe) btnSafe.addEventListener('click', () => evaluateScamChoice(false));
  if (btnDanger) btnDanger.addEventListener('click', () => evaluateScamChoice(true));
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentScamIndex = (currentScamIndex + 1) % PUENTE_DATA.scamScenarios.length;
      renderScamScenario();
    });
  }
}

function renderScamScenario() {
  const scenario = PUENTE_DATA.scamScenarios[currentScamIndex];
  if (!scenario) return;

  const senderEl = document.getElementById('scam-sender-text');
  const msgEl = document.getElementById('scam-message-text');
  const indexEl = document.getElementById('scam-current-index');
  const feedbackEl = document.getElementById('scam-feedback-box');
  const actionsEl = document.getElementById('scam-buttons-row');

  if (senderEl) senderEl.textContent = `Remitente: ${scenario.sender}`;
  if (msgEl) msgEl.textContent = `"${scenario.messageText}"`;
  if (indexEl) indexEl.textContent = `Ejercicio ${currentScamIndex + 1} de ${PUENTE_DATA.scamScenarios.length}`;

  if (feedbackEl) {
    feedbackEl.style.display = 'none';
    feedbackEl.className = 'scam-feedback-panel';
  }

  if (actionsEl) actionsEl.style.display = 'grid';
}

function evaluateScamChoice(userChoseScam) {
  const scenario = PUENTE_DATA.scamScenarios[currentScamIndex];
  const isCorrect = userChoseScam === scenario.isScam;

  const feedbackEl = document.getElementById('scam-feedback-box');
  const feedbackTitle = document.getElementById('scam-feedback-title');
  const feedbackBody = document.getElementById('scam-feedback-body');
  const cluesList = document.getElementById('scam-clues-list');
  const actionsEl = document.getElementById('scam-buttons-row');

  if (isCorrect) {
    scamScore++;
    playTone(587, 0.2);
    updateStarsDisplay();
    feedbackEl.className = 'scam-feedback-panel correct';
    feedbackTitle.innerHTML = '🎉 ¡Excelente! Acertaste la respuesta';
    if (scamScore >= 3) {
      unlockAchievementWithToast('ach-scam-shield');
    }
  } else {
    playTone(330, 0.3);
    feedbackEl.className = 'scam-feedback-panel incorrect';
    feedbackTitle.innerHTML = '⚠️ ¡Atención! No es la opción correcta';
  }

  feedbackBody.innerHTML = `<p style="font-size: 1.15rem; margin-bottom: 12px;"><strong>Explicación:</strong> ${scenario.explanation}</p>`;
  
  if (cluesList) {
    cluesList.innerHTML = scenario.warningClues.map(clue => `<li>${clue}</li>`).join('');
  }

  if (actionsEl) actionsEl.style.display = 'none';
  feedbackEl.style.display = 'block';

  speakText(scenario.explanation);
}

function updateStarsDisplay() {
  const starsEl = document.getElementById('scam-stars-rating');
  if (!starsEl) return;
  const starsCount = Math.min(scamScore, 5);
  starsEl.textContent = '⭐'.repeat(starsCount) + '☆'.repeat(5 - starsCount);
}

let sharedAudioCtx = null;

function playTone(frequency, duration) {
  try {
    const prefs = window.StorageService ? StorageService.getPreferences() : {};
    if (prefs.soundEffects === false) return;

    if (!sharedAudioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) sharedAudioCtx = new AudioCtxClass();
    }
    if (!sharedAudioCtx) return;

    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }

    const osc = sharedAudioCtx.createOscillator();
    const gain = sharedAudioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.1, sharedAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, sharedAudioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);

    osc.start();
    osc.stop(sharedAudioCtx.currentTime + duration);
  } catch (e) {}
}

/* --------------------------------------------------------------------------
   9. SIMULADOR DE MENSAJES (WhatsApp Fácil 2.0)
   -------------------------------------------------------------------------- */
let videocallInterval = null;
let videocallSeconds = 0;

function initWhatsAppSimulator() {
  const quickOptsContainer = document.getElementById('chat-quick-options');
  const chatScroll = document.getElementById('chat-messages-scroll');
  const chatInput = document.getElementById('chat-input-field');
  const sendBtn = document.getElementById('chat-send-btn');
  const btnAttachPhoto = document.getElementById('btn-sim-attach-photo');
  const btnRecordAudio = document.getElementById('btn-sim-record-audio');
  const recBanner = document.getElementById('chat-recording-banner');
  const btnCancelRec = document.getElementById('btn-cancel-audio-rec');
  const btnVideocall = document.getElementById('btn-sim-videocall');
  const btnVoicecall = document.getElementById('btn-sim-voicecall');
  const videocallModal = document.getElementById('videocall-modal');
  const btnHangupVc = document.getElementById('btn-hangup-videocall');

  if (!quickOptsContainer || !chatScroll) return;

  quickOptsContainer.innerHTML = '';
  PUENTE_DATA.chatSimulator.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'chat-opt-btn';
    btn.innerHTML = `💬 <strong>Opción ${idx + 1}:</strong> "${opt.text}"`;
    btn.addEventListener('click', () => {
      sendSimulatorMessage(opt.text, opt.botReply);
    });
    quickOptsContainer.appendChild(btn);
  });

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', () => {
      const customText = chatInput.value.trim();
      if (customText) {
        sendSimulatorMessage(customText, "¡Qué lindo mensaje abu! Me encanta leerte por acá. ¡Seguí practicando así! ❤️");
        chatInput.value = '';
      }
    });

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendBtn.click();
    });
  }

  // Adjuntar foto familiar
  if (btnAttachPhoto) {
    btnAttachPhoto.addEventListener('click', () => {
      openModal(document.getElementById('whatsapp-photo-modal'));
    });
  }

  // Grabación de audio simulada
  if (btnRecordAudio) {
    btnRecordAudio.addEventListener('click', () => {
      triggerAudioRecording();
    });
  }

  if (btnCancelRec) {
    btnCancelRec.addEventListener('click', () => {
      finishAudioRecording();
    });
  }

  let audioRecordingTimeout = null;

  function triggerAudioRecording() {
    if (recBanner) recBanner.style.display = 'flex';
    playTone(700, 0.15);
    showToast('Grabando audio', 'Hablale a tu teléfono con tranquilidad. En 3 segundos se enviará...', 'info');

    audioRecordingTimeout = setTimeout(() => {
      finishAudioRecording();
    }, 3000);
  }

  function finishAudioRecording() {
    if (audioRecordingTimeout) clearTimeout(audioRecordingTimeout);
    if (recBanner) recBanner.style.display = 'none';

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const audioBubble = document.createElement('div');
    audioBubble.className = 'bubble bubble-out bubble-audio';
    audioBubble.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <button class="btn-play-audio-sim" style="background: none; border: none; font-size: 26px; cursor: pointer;" title="Reproducir audio">▶️</button>
        <div style="flex: 1; height: 8px; background: rgba(0, 0, 0, 0.15); border-radius: 4px; overflow: hidden;">
          <div style="width: 75%; height: 100%; background: #008069; border-radius: 4px;"></div>
        </div>
        <span style="font-size: 0.85rem; font-weight: 700; color: #075e54;">0:06</span>
      </div>
      <div class="bubble-time">
        <span>${timeStr}</span>
        <span class="bubble-check" style="color: #34b7f1;">✓✓</span>
      </div>
    `;
    chatScroll.appendChild(audioBubble);
    chatScroll.scrollTop = chatScroll.scrollHeight;

    playTone(880, 0.1);
    unlockAchievementWithToast('ach-first-message');

    audioBubble.querySelector('.btn-play-audio-sim')?.addEventListener('click', () => {
      speakText('Hola Sofi, te mando un audio para contarte que estoy practicando en la computadora.');
    });

    setTimeout(() => {
      const replyBubble = document.createElement('div');
      replyBubble.className = 'bubble bubble-in';
      replyBubble.innerHTML = `
        <div>¡Te escuché clarito abu! Qué hermosa alegría escuchar tu voz. ¡Sos una genia aprendiendo! 🥰</div>
        <div class="bubble-time">${timeStr}</div>
      `;
      chatScroll.appendChild(replyBubble);
      chatScroll.scrollTop = chatScroll.scrollHeight;
      playTone(660, 0.15);
    }, 1800);
  }

  // Videollamada simulada
  if (btnVideocall && videocallModal) {
    btnVideocall.addEventListener('click', () => {
      openModal(videocallModal);
      playTone(523, 0.2);
      setTimeout(() => playTone(659, 0.2), 250);

      videocallSeconds = 0;
      const timerEl = document.getElementById('videocall-timer');
      if (timerEl) timerEl.textContent = '00:00 • Conectado';

      if (videocallInterval) clearInterval(videocallInterval);
      videocallInterval = setInterval(() => {
        videocallSeconds++;
        const mins = String(Math.floor(videocallSeconds / 60)).padStart(2, '0');
        const secs = String(videocallSeconds % 60).padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs} • Conectado`;
      }, 1000);
    });
  }

  if (btnHangupVc && videocallModal) {
    btnHangupVc.addEventListener('click', () => {
      if (videocallInterval) clearInterval(videocallInterval);
      closeModal(videocallModal);
      playTone(440, 0.25);
      showToast('Videollamada finalizada', '¡Felicitaciones! Conversaste cara a cara con Sofía.', 'success');
      unlockAchievementWithToast('ach-video-call');
    });
  }

  // Llamada tradicional con voz
  if (btnVoicecall) {
    btnVoicecall.addEventListener('click', () => {
      playTone(660, 0.2);
      showToast('Llamada con Sofía', '¡Tu teléfono está sonando y conectado con Sofía! Todo funciona a la perfección.', 'success');
    });
  }
}

function sendSimulatorMessage(text, replyText) {
  const chatScroll = document.getElementById('chat-messages-scroll');
  if (!chatScroll) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const userBubble = document.createElement('div');
  userBubble.className = 'bubble bubble-out';
  userBubble.innerHTML = `
    <div>${escapeHtml(text)}</div>
    <div class="bubble-time">
      <span>${timeStr}</span>
      <span class="bubble-check">✓</span>
    </div>
  `;
  chatScroll.appendChild(userBubble);
  chatScroll.scrollTop = chatScroll.scrollHeight;

  playTone(880, 0.1);
  unlockAchievementWithToast('ach-first-message');

  const checkEl = userBubble.querySelector('.bubble-check');
  setTimeout(() => { if (checkEl) checkEl.innerHTML = '✓✓'; }, 700);
  setTimeout(() => { if (checkEl) checkEl.innerHTML = '<span style="color: #34b7f1;">✓✓</span>'; }, 1400);

  setTimeout(() => {
    const replyBubble = document.createElement('div');
    replyBubble.className = 'bubble bubble-in';
    replyBubble.innerHTML = `
      <div>${replyText}</div>
      <div class="bubble-time">${timeStr}</div>
    `;
    chatScroll.appendChild(replyBubble);
    chatScroll.scrollTop = chatScroll.scrollHeight;
    playTone(660, 0.15);
  }, 2000);
}

/* --------------------------------------------------------------------------
   10. MODAL DE LECCIÓN PASO A PASO
   -------------------------------------------------------------------------- */
let activeCourse = null;
let currentStepIndex = 0;

function initLessonModal() {
  const modal = document.getElementById('lesson-modal');
  const closeBtn = document.getElementById('btn-close-lesson-modal');
  const btnPrev = document.getElementById('btn-lesson-prev');
  const btnNext = document.getElementById('btn-lesson-next');
  const btnReadStep = document.getElementById('btn-lesson-read-step');
  const btnComplete = document.getElementById('btn-lesson-complete');

  if (closeBtn) closeBtn.addEventListener('click', closeLessonModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLessonModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeLessonModal();
    }
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStepIndex > 0) {
        currentStepIndex--;
        renderLessonStep();
      }
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (activeCourse && currentStepIndex < activeCourse.steps.length - 1) {
        currentStepIndex++;
        renderLessonStep();
      }
    });
  }

  if (btnReadStep) {
    btnReadStep.addEventListener('click', () => {
      if (!activeCourse) return;
      const step = activeCourse.steps[currentStepIndex];
      const text = `${step.title}. ${step.text}. Consejo: ${step.tip}`;
      speakText(text);
    });
  }

  if (btnComplete) {
    btnComplete.addEventListener('click', () => {
      if (!activeCourse) return;
      if (window.StorageService) {
        StorageService.completeCourse(activeCourse.id);
      }
      if (!completedCourses.includes(activeCourse.id)) {
        completedCourses.push(activeCourse.id);
        localStorage.setItem('puente_completed_courses', JSON.stringify(completedCourses));
      }
      playTone(523.25, 0.3);
      showToast('¡Lección Completada!', `Has completado "${activeCourse.title}" con éxito.`, 'success');
      unlockAchievementWithToast('ach-first-step');

      // Comprobar si completó todo el Nivel 1
      const level1Courses = PUENTE_DATA.courses.filter(c => c.level === 1).map(c => c.id);
      const allLevel1Done = level1Courses.every(id => completedCourses.includes(id));
      if (allLevel1Done) {
        unlockAchievementWithToast('ach-device-master');
      }

      closeLessonModal();
      renderCoursesGrid();
      if (typeof renderDashboard2 === 'function') renderDashboard2();
    });
  }
}

function openLessonModal(course) {
  activeCourse = course;
  currentStepIndex = 0;
  const modal = document.getElementById('lesson-modal');
  if (!modal) return;

  document.getElementById('modal-course-title').textContent = course.title;
  document.getElementById('modal-course-category').textContent = `${course.category} • Nivel ${course.level}`;

  renderLessonStep();
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('btn-close-lesson-modal')?.focus();
}

function renderLessonStep() {
  if (!activeCourse) return;
  const step = activeCourse.steps[currentStepIndex];
  const totalSteps = activeCourse.steps.length;

  document.getElementById('modal-step-badge').textContent = `Paso ${currentStepIndex + 1} de ${totalSteps}`;
  document.getElementById('modal-step-title').textContent = step.title;
  document.getElementById('modal-step-text').textContent = step.text;
  document.getElementById('modal-step-tip').textContent = step.tip;
  document.getElementById('modal-step-icon').textContent = step.icon;

  const btnPrev = document.getElementById('btn-lesson-prev');
  const btnNext = document.getElementById('btn-lesson-next');
  const btnComplete = document.getElementById('btn-lesson-complete');

  if (btnPrev) btnPrev.style.display = currentStepIndex === 0 ? 'none' : 'inline-flex';
  if (btnNext) btnNext.style.display = currentStepIndex === totalSteps - 1 ? 'none' : 'inline-flex';
  if (btnComplete) btnComplete.style.display = currentStepIndex === totalSteps - 1 ? 'inline-flex' : 'none';
}

function closeLessonModal() {
  const modal = document.getElementById('lesson-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
  stopSpeaking();
}

/* --------------------------------------------------------------------------
   11. MODAL DE AYUDA RÁPIDA
   -------------------------------------------------------------------------- */
function initHelpModal() {
  const btnHelpTop = document.getElementById('btn-help-top');
  const modal = document.getElementById('help-modal');
  const closeBtn = document.getElementById('btn-close-help-modal');

  if (btnHelpTop && modal) {
    btnHelpTop.addEventListener('click', () => {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      closeBtn?.focus();
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
  }
}

/* --------------------------------------------------------------------------
   12. BOTÓN FLOTANTE "VOLVER ARRIBA"
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btnTop = document.getElementById('btn-back-to-top');
  if (!btnTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 350) {
      btnTop.classList.add('show');
    } else {
      btnTop.classList.remove('show');
    }
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   13. HELPER GENERAL: ESCAPE HTML & DESBLOQUEO DE LOGROS CON TOAST
   -------------------------------------------------------------------------- */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function unlockAchievementWithToast(id) {
  if (!window.StorageService) return;
  const res = StorageService.unlockAchievement(id);
  if (res && res.newlyUnlocked) {
    const ach = (PUENTE_DATA.achievements || []).find(a => a.id === id);
    if (ach) {
      playTone(660, 0.2);
      setTimeout(() => playTone(880, 0.3), 160);
      showToast('🎉 ¡Nuevo Logro Desbloqueado!', `${ach.icon} ${ach.title}: ${ach.description}`, 'success');
      if (typeof renderDashboard2 === 'function') renderDashboard2();
      if (typeof renderAchievementsGrid === 'function') renderAchievementsGrid();
    }
  }
}

/* --------------------------------------------------------------------------
   14. DASHBOARD 2.0 - MI ESPACIO DE APRENDIZAJE Y PROGRESO
   -------------------------------------------------------------------------- */
function initDashboard2() {
  const btnResume = document.getElementById('btn-resume-learning');
  if (btnResume) {
    btnResume.addEventListener('click', () => {
      const nextCourse = getNextRecommendedCourse();
      if (nextCourse) {
        openLessonModal(nextCourse);
      }
    });
  }

  // Vincular botones globales para abrir modales 2.0
  document.querySelectorAll('.trigger-open-companion').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(document.getElementById('ai-companion-modal'));
    });
  });

  document.querySelectorAll('.trigger-open-profile').forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(document.getElementById('profile-modal'));
      renderAchievementsGrid();
    });
  });

  renderDashboard2();
}

function getNextRecommendedCourse() {
  const completed = window.StorageService ? StorageService.getCompletedCourses() : completedCourses;
  const pending = PUENTE_DATA.courses.find(c => !completed.includes(c.id));
  return pending || PUENTE_DATA.courses[0];
}

function renderDashboard2() {
  const logged = getLoggedUser();
  const completed = window.StorageService ? StorageService.getCompletedCourses() : completedCourses;
  const totalCourses = PUENTE_DATA.courses.length;
  const completedCount = completed.length;
  const pct = Math.min(100, Math.round((completedCount / totalCourses) * 100));

  const pctEl = document.getElementById('dashboard-progress-pct');
  const barEl = document.getElementById('dashboard-progress-bar');
  const countEl = document.getElementById('dashboard-completed-count');
  const achCountEl = document.getElementById('dashboard-achievements-count');
  const userLevelEl = document.getElementById('dashboard-user-level');
  const studentNameEl = document.getElementById('classroom-greeting-name');

  if (studentNameEl && logged) {
    studentNameEl.textContent = logged.name || logged.username;
  }

  if (pctEl) pctEl.textContent = `${pct}%`;
  if (barEl) {
    barEl.style.width = `${pct}%`;
    barEl.parentElement?.setAttribute('aria-valuenow', pct);
  }
  if (countEl) {
    countEl.textContent = `${completedCount} de ${totalCourses} lecciones completadas`;
  }

  const unlockedCount = window.StorageService ? StorageService.getUnlockedAchievements().length : 2;
  const totalAchievements = (PUENTE_DATA.achievements || []).length || 9;
  if (achCountEl) {
    achCountEl.textContent = `${unlockedCount} de ${totalAchievements} logros obtenidos`;
  }

  if (userLevelEl) {
    if (completedCount >= 8) {
      userLevelEl.textContent = '🏆 Nivel 3 • Experto/a Digital';
    } else if (completedCount >= 4) {
      userLevelEl.textContent = '🌿 Nivel 2 • Usuario Cotidiano';
    } else {
      userLevelEl.textContent = '🌱 Nivel 1 • En camino';
    }
  }

  // Actualizar tarjeta "Continuar Aprendiendo"
  const nextCourse = getNextRecommendedCourse();
  if (nextCourse) {
    const titleEl = document.getElementById('next-lesson-title');
    const descEl = document.getElementById('next-lesson-desc');
    const iconEl = document.getElementById('next-lesson-icon');
    const metaEl = document.getElementById('next-lesson-meta');

    if (titleEl) titleEl.textContent = nextCourse.title;
    if (descEl) descEl.textContent = nextCourse.shortDesc;
    if (iconEl) iconEl.textContent = nextCourse.icon;
    if (metaEl) metaEl.textContent = `⏱️ ${nextCourse.duration} • ${nextCourse.category} (Nivel ${nextCourse.level})`;
  }
}

/* --------------------------------------------------------------------------
   15. MI COMPAÑERO DIGITAL 2.0 (ASISTENCIA CON IA Y VOZ)
   -------------------------------------------------------------------------- */
let lastAiResponseText = '';

function initAiCompanion() {
  const modal = document.getElementById('ai-companion-modal');
  const btnTop = document.getElementById('btn-top-companion');
  const btnSend = document.getElementById('btn-companion-send');
  const btnMic = document.getElementById('btn-companion-mic');
  const btnReadLast = document.getElementById('btn-companion-read-last');
  const inputEl = document.getElementById('companion-input-text');
  const streamEl = document.getElementById('companion-chat-stream');
  const micIndicator = document.getElementById('companion-voice-indicator');

  if (btnTop && modal) {
    btnTop.addEventListener('click', () => {
      openModal(modal);
      inputEl?.focus();
    });
  }

  // Chips de preguntas frecuentes
  document.querySelectorAll('.companion-quick-chips .chip-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      if (q) {
        if (inputEl) inputEl.value = q;
        handleCompanionSubmit(q);
      }
    });
  });

  if (btnSend && inputEl) {
    btnSend.addEventListener('click', () => {
      const query = inputEl.value.trim();
      if (query) {
        handleCompanionSubmit(query);
        inputEl.value = '';
      }
    });

    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = inputEl.value.trim();
        if (query) {
          handleCompanionSubmit(query);
          inputEl.value = '';
        }
      }
    });
  }

  // Dictado por voz
  if (btnMic) {
    btnMic.addEventListener('click', () => {
      if (!window.AIService) return;
      if (!AIService.isSpeechRecognitionSupported()) {
        showToast('Micrófono no soportado', 'Tu navegador no permite dictado por voz directo. Puedes escribir tu pregunta en la casilla.', 'warning');
        return;
      }

      if (micIndicator) micIndicator.style.display = 'inline-block';
      btnMic.classList.add('recording-pulse');

      AIService.startSpeechRecognition({
        onResult: (transcript) => {
          if (inputEl) inputEl.value = transcript;
          handleCompanionSubmit(transcript);
        },
        onError: (err) => {
          console.warn('Speech error:', err);
          if (micIndicator) micIndicator.style.display = 'none';
          btnMic.classList.remove('recording-pulse');
        },
        onEnd: () => {
          if (micIndicator) micIndicator.style.display = 'none';
          btnMic.classList.remove('recording-pulse');
        }
      });
    });
  }

  // Escuchar última respuesta
  if (btnReadLast) {
    btnReadLast.addEventListener('click', () => {
      if (lastAiResponseText) {
        speakText(lastAiResponseText);
      } else {
        speakText('Hola, estoy aquí para responder tus dudas de tecnología sin palabras raras.');
      }
    });
  }

  async function handleCompanionSubmit(query) {
    if (!streamEl) return;

    // Mensaje del usuario
    const userBubble = document.createElement('div');
    userBubble.className = 'ai-msg ai-bubble-user';
    userBubble.innerHTML = `
      <div class="ai-msg-sender">👤 Tú:</div>
      <div class="ai-msg-text">${escapeHtml(query)}</div>
    `;
    streamEl.appendChild(userBubble);
    streamEl.scrollTop = streamEl.scrollHeight;

    // Mensaje de carga/pensamiento
    const thinkingBubble = document.createElement('div');
    thinkingBubble.className = 'ai-msg ai-bubble-bot';
    thinkingBubble.innerHTML = `
      <div class="ai-msg-sender">🤖 Mi Compañero:</div>
      <div class="ai-msg-text"><em>Pensando con calma y preparando los pasos para vos... ⏳</em></div>
    `;
    streamEl.appendChild(thinkingBubble);
    streamEl.scrollTop = streamEl.scrollHeight;

    // Obtener respuesta de AIService
    const result = await AIService.ask(query);

    let stepsHtml = '';
    if (result.steps && result.steps.length > 0) {
      stepsHtml = `
        <ol class="ai-steps-list" style="margin: 10px 0 10px 20px; line-height: 1.6;">
          ${result.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
        </ol>
      `;
    }

    let actionBtnHtml = '';
    if (result.action) {
      actionBtnHtml = `
        <button class="btn-primary btn-ai-action" data-action-type="${result.action.type}" data-action-target="${result.action.target}" style="margin-top: 12px; font-size: 0.95rem; min-height: 44px;">
          ${result.action.label}
        </button>
      `;
    }

    thinkingBubble.innerHTML = `
      <div class="ai-msg-sender">🤖 Mi Compañero:</div>
      <div class="ai-msg-text">
        <div style="font-weight: 700; margin-bottom: 6px; font-size: 1.1rem; color: var(--color-primary);">${result.title}</div>
        <div>${result.answer}</div>
        ${stepsHtml}
        ${result.tip ? `<div style="background: rgba(254, 243, 199, 0.6); padding: 8px 12px; border-radius: var(--radius-sm); margin-top: 8px; font-size: 0.95rem;">${result.tip}</div>` : ''}
        ${actionBtnHtml}
      </div>
    `;

    // Vincular botón de acción
    const actBtn = thinkingBubble.querySelector('.btn-ai-action');
    if (actBtn) {
      actBtn.addEventListener('click', () => {
        const aType = actBtn.getAttribute('data-action-type');
        const aTarget = actBtn.getAttribute('data-action-target');
        closeModal(modal);

        if (aType === 'OPEN_SIMULATOR') {
          if (aTarget === 'whatsapp-modal') {
            openWhatsAppSimulator();
          } else if (aTarget === 'scam-modal') {
            openScamSimulator();
          } else {
            openModal(document.getElementById(aTarget));
          }
        } else if (aType === 'OPEN_LESSON') {
          const course = PUENTE_DATA.courses.find(c => c.id === aTarget) || PUENTE_DATA.courses[0];
          openLessonModal(course);
        } else if (aType === 'OPEN_MODAL') {
          openModal(document.getElementById(aTarget));
        }
      });
    }

    streamEl.scrollTop = streamEl.scrollHeight;
    lastAiResponseText = result.fullTextForSpeech || `${result.title}. ${result.answer}`;

    unlockAchievementWithToast('ach-ai-friend');
  }
}

/* --------------------------------------------------------------------------
   16. MODAL 2.0: 🆘 NECESITO AYUDA INMEDIATA
   -------------------------------------------------------------------------- */
function initSosModal() {
  const btnTopSos = document.getElementById('btn-top-sos');
  const modal = document.getElementById('sos-modal');
  const detailBox = document.getElementById('sos-detail-box');
  const titleEl = document.getElementById('sos-detail-title');
  const calmEl = document.getElementById('sos-calm-banner');
  const stepsEl = document.getElementById('sos-steps-list');
  const phoneEl = document.getElementById('sos-phone-callout');

  if (btnTopSos && modal) {
    btnTopSos.addEventListener('click', () => {
      openModal(modal);
    });
  }

  document.querySelectorAll('.sos-option-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const sosId = btn.getAttribute('data-sos-id');
      const item = (PUENTE_DATA.emergencyHelp || []).find(h => h.id === sosId);
      if (!item || !detailBox) return;

      document.querySelectorAll('.sos-option-card').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      titleEl.innerHTML = `🛡️ ${item.title}`;
      calmEl.innerHTML = `🕊️ <strong>Respirá hondo:</strong> ${item.calmMessage}`;
      stepsEl.innerHTML = item.steps.map(s => `<li>${s}</li>`).join('');
      phoneEl.innerHTML = `📞 <strong>Teléfono de contacto seguro:</strong> ${item.officialPhone}`;

      detailBox.style.display = 'block';
      detailBox.scrollIntoView({ behavior: 'smooth' });

      speakText(`${item.title}. ${item.calmMessage}.`);
    });
  });
}

/* --------------------------------------------------------------------------
   17. MODAL 2.0: 👤 MI PERFIL, LOGROS Y PREFERENCIAS
   -------------------------------------------------------------------------- */
window.switchProfileTab = function(tab) {
  const tabAch = document.getElementById('prof-tab-achievements');
  const tabPrefs = document.getElementById('prof-tab-prefs');
  const viewAch = document.getElementById('profile-view-achievements');
  const viewPrefs = document.getElementById('profile-view-preferences');

  if (tab === 'achievements') {
    tabAch?.classList.add('active');
    tabPrefs?.classList.remove('active');
    if (viewAch) viewAch.style.display = 'block';
    if (viewPrefs) viewPrefs.style.display = 'none';
  } else {
    tabPrefs?.classList.add('active');
    tabAch?.classList.remove('active');
    if (viewAch) viewAch.style.display = 'none';
    if (viewPrefs) viewPrefs.style.display = 'block';
  }
};

function initProfileModal() {
  const modal = document.getElementById('profile-modal');
  const userNameEl = document.getElementById('profile-user-name');
  const logged = getLoggedUser();

  if (userNameEl && logged) {
    userNameEl.textContent = logged.name || logged.username;
  }

  renderAchievementsGrid();

  // Configuración de preferencias dentro del modal
  const prefs = window.StorageService ? StorageService.getPreferences() : { voiceSpeed: 0.9, contrast: 'normal', soundEffects: true };

  // Velocidad de voz
  document.querySelectorAll('[data-voice-rate]').forEach(btn => {
    const r = parseFloat(btn.getAttribute('data-voice-rate'));
    if (r === (prefs.voiceSpeed || 0.9)) btn.classList.add('active');
    else btn.classList.remove('active');

    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-voice-rate]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Contraste
  document.querySelectorAll('[data-contrast]').forEach(btn => {
    const c = btn.getAttribute('data-contrast');
    if (c === (prefs.contrast || 'normal')) btn.classList.add('active');
    else btn.classList.remove('active');

    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-contrast]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Sonidos
  document.querySelectorAll('[data-sounds]').forEach(btn => {
    const s = btn.getAttribute('data-sounds') === 'true';
    if (s === (prefs.soundEffects !== false)) btn.classList.add('active');
    else btn.classList.remove('active');

    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-sounds]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const btnSavePrefs = document.getElementById('btn-save-preferences');
  if (btnSavePrefs) {
    btnSavePrefs.addEventListener('click', () => {
      const activeVoiceBtn = document.querySelector('[data-voice-rate].active');
      const activeContrastBtn = document.querySelector('[data-contrast].active');
      const activeSoundBtn = document.querySelector('[data-sounds].active');

      const voiceSpeed = activeVoiceBtn ? parseFloat(activeVoiceBtn.getAttribute('data-voice-rate')) : 0.9;
      const contrast = activeContrastBtn ? activeContrastBtn.getAttribute('data-contrast') : 'normal';
      const soundEffects = activeSoundBtn ? (activeSoundBtn.getAttribute('data-sounds') === 'true') : true;

      StorageService.savePreferences({ voiceSpeed, contrast, soundEffects });

      // Aplicar contraste a la página
      if (contrast === 'high') {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }

      showToast('Preferencias Guardadas', 'Tus ajustes de accesibilidad se han guardado con éxito.', 'success');
      playTone(587, 0.2);
    });
  }
}

function renderAchievementsGrid() {
  const container = document.getElementById('achievements-grid-container');
  const countBadge = document.getElementById('profile-ach-count');
  if (!container) return;

  const allAchievements = PUENTE_DATA.achievements || [];
  const unlocked = window.StorageService ? StorageService.getUnlockedAchievements() : [];
  const unlockedIds = unlocked.map(u => u.id);

  if (countBadge) {
    countBadge.textContent = `${unlockedIds.length}/${allAchievements.length}`;
  }

  container.innerHTML = '';
  allAchievements.forEach(ach => {
    const isUnlocked = unlockedIds.includes(ach.id);
    const card = document.createElement('div');
    card.className = `achievement-badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <div class="ach-icon" aria-hidden="true">${ach.icon}</div>
      <div class="ach-info">
        <div class="ach-category">${ach.category}</div>
        <h4 class="ach-title">${ach.title}</h4>
        <p class="ach-desc">${ach.description}</p>
        <div class="ach-status">
          ${isUnlocked ? '✅ <strong>¡Desbloqueado!</strong>' : '🔒 Por desbloquear'}
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

/* --------------------------------------------------------------------------
   18. MODAL 2.0: 👨‍🏫 VISTA ACOMPAÑANTE / PANEL DOCENTE
   -------------------------------------------------------------------------- */
function initTutorModal() {
  const modal = document.getElementById('tutor-modal');
  const btnSend = document.getElementById('btn-send-tutor-note');
  const inputEl = document.getElementById('tutor-new-note');
  const streamEl = document.getElementById('tutor-notes-stream');
  const completedBadge = document.getElementById('tutor-completed-badge');

  const completed = window.StorageService ? StorageService.getCompletedCourses() : completedCourses;
  if (completedBadge) {
    completedBadge.textContent = `${completed.length}/11 lecciones`;
  }

  renderTutorNotes();

  if (btnSend && inputEl) {
    btnSend.addEventListener('click', () => {
      const text = inputEl.value.trim();
      if (!text) {
        showToast('Mensaje vacío', 'Por favor escribe unas palabras para tu familiar o alumno.', 'warning');
        return;
      }

      StorageService.addTutorNote(text, 'Familiar / Tutor Acompañante');
      inputEl.value = '';
      renderTutorNotes();
      showToast('Mensaje Guardado', 'Tu mensaje de aliento ya está disponible para el alumno.', 'success');
      playTone(660, 0.2);
    });
  }

  function renderTutorNotes() {
    if (!streamEl) return;
    const notes = StorageService.getTutorNotes();
    if (notes.length === 0) {
      streamEl.innerHTML = '<p style="color: var(--text-muted);">Aún no hay mensajes guardados.</p>';
      return;
    }

    streamEl.innerHTML = notes.map(n => `
      <div class="tutor-note-item">
        <div class="note-header">
          <strong>${escapeHtml(n.author)}</strong>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${n.date}</span>
        </div>
        <p class="note-text">"${escapeHtml(n.text)}"</p>
      </div>
    `).join('');
  }
}

/* --------------------------------------------------------------------------
   19. WHATSAPP 2.0 - MULTIMEDIA, AUDIO, FOTOS Y PESTAÑAS
   -------------------------------------------------------------------------- */
window.showPracticeTab = function(tab) {
  const tabWa = document.getElementById('tab-pr-whatsapp');
  const tabScam = document.getElementById('tab-pr-scam');
  const viewWa = document.getElementById('view-whatsapp-sim');
  const viewScam = document.getElementById('view-scam-detector');

  if (tab === 'whatsapp') {
    tabWa?.classList.add('active');
    tabScam?.classList.remove('active');
    if (viewWa) viewWa.style.display = 'block';
    if (viewScam) viewScam.style.display = 'none';
  } else if (tab === 'scam') {
    tabScam?.classList.add('active');
    tabWa?.classList.remove('active');
    if (viewWa) viewWa.style.display = 'none';
    if (viewScam) viewScam.style.display = 'block';
  }
};

window.openWhatsAppSimulator = function() {
  document.getElementById('taller-practico')?.scrollIntoView({ behavior: 'smooth' });
  showPracticeTab('whatsapp');
  setTimeout(() => {
    document.getElementById('chat-input-field')?.focus();
  }, 400);
};

window.openScamSimulator = function() {
  document.getElementById('taller-practico')?.scrollIntoView({ behavior: 'smooth' });
  showPracticeTab('scam');
};

window.selectSimPhoto = function(title, icon, caption) {
  const photoModal = document.getElementById('whatsapp-photo-modal');
  closeModal(photoModal);

  const chatScroll = document.getElementById('chat-messages-scroll');
  if (!chatScroll) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const photoBubble = document.createElement('div');
  photoBubble.className = 'bubble bubble-out bubble-photo';
  photoBubble.innerHTML = `
    <div style="background: rgba(255, 255, 255, 0.9); padding: 12px; border-radius: var(--radius-sm); text-align: center; margin-bottom: 6px;">
      <div style="font-size: 54px;" aria-hidden="true">${icon}</div>
      <div style="font-weight: 700; color: #075e54;">${escapeHtml(title)}</div>
    </div>
    <div style="font-size: 0.95rem; margin-bottom: 4px;">${escapeHtml(caption)}</div>
    <div class="bubble-time">
      <span>${timeStr}</span>
      <span class="bubble-check" style="color: #34b7f1;">✓✓</span>
    </div>
  `;
  chatScroll.appendChild(photoBubble);
  chatScroll.scrollTop = chatScroll.scrollHeight;

  playTone(880, 0.1);
  unlockAchievementWithToast('ach-photo-shared');

  setTimeout(() => {
    const replyBubble = document.createElement('div');
    replyBubble.className = 'bubble bubble-in';
    replyBubble.innerHTML = `
      <div>¡Qué hermosa foto abu! Me encanta que me mandes fotitos de la familia. Te quiero mucho ❤️</div>
      <div class="bubble-time">${timeStr}</div>
    `;
    chatScroll.appendChild(replyBubble);
    chatScroll.scrollTop = chatScroll.scrollHeight;
    playTone(660, 0.15);
  }, 1600);
};

/* --------------------------------------------------------------------------
   20. REGISTRO DE SERVICE WORKER PWA
   -------------------------------------------------------------------------- */
function initServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => {
          console.log('Puente Digital 2.0 PWA registrado con éxito:', reg.scope);
        })
        .catch(err => {
          console.log('Puente Digital 2.0 PWA info:', err);
        });
    });
  }
}
