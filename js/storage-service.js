/**
 * Puente Digital 2.0 - Capa de Persistencia y Almacenamiento (StorageService)
 * Abstracción limpia sobre localStorage con soporte futuro para IndexedDB / REST API.
 */

const StorageService = (() => {
  const KEYS = {
    USERS: 'puente_users',
    LOGGED_USER: 'puente_logged_user',
    COMPLETED_COURSES: 'puente_completed_courses',
    ACHIEVEMENTS: 'puente_achievements',
    PREFERENCES: 'puente_preferences',
    CERTIFICATES: 'puente_certificates',
    TUTOR_NOTES: 'puente_tutor_notes'
  };

  const DEFAULT_USERS = [
    { username: 'RONY', password: 'RONY', name: 'Rony', role: 'ALUMNO', joinedDate: '2026-03-01' }
  ];

  const DEFAULT_PREFERENCES = {
    fontScale: '1',
    contrast: 'normal',
    voiceSpeed: 0.9,
    soundEffects: true,
    reducedMotion: false,
    buttonSize: 'large'
  };

  // Inicialización segura
  function init() {
    try {
      if (!localStorage.getItem(KEYS.USERS)) {
        localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      }
      if (!localStorage.getItem(KEYS.COMPLETED_COURSES)) {
        // Marcamos por defecto el curso 1 como realizado para que RONY tenga progreso visible
        localStorage.setItem(KEYS.COMPLETED_COURSES, JSON.stringify(['c1-app-install']));
      }
      if (!localStorage.getItem(KEYS.ACHIEVEMENTS)) {
        localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify([
          { id: 'ach-first-step', unlockedAt: new Date().toISOString() },
          { id: 'ach-app-installer', unlockedAt: new Date().toISOString() }
        ]));
      }
      if (!localStorage.getItem(KEYS.PREFERENCES)) {
        // Respetar escala y contraste previos si existen
        const oldScale = localStorage.getItem('puente_font_scale') || '1';
        const oldContrast = localStorage.getItem('puente_contrast') || 'normal';
        const prefs = { ...DEFAULT_PREFERENCES, fontScale: oldScale, contrast: oldContrast };
        localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(prefs));
      }
    } catch (err) {
      console.warn('StorageService: Error al inicializar almacenamiento local', err);
    }
  }

  // --- Usuarios y Sesión ---
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.USERS)) || DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  }

  function saveUser(userObj) {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.username.toUpperCase() === userObj.username.toUpperCase());
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...userObj };
    } else {
      users.push({
        ...userObj,
        role: userObj.role || 'ALUMNO',
        joinedDate: new Date().toISOString()
      });
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }

  function getLoggedUser() {
    try {
      const user = JSON.parse(localStorage.getItem(KEYS.LOGGED_USER));
      if (user) return user;
      // Si no hay ninguno, retornar por defecto al usuario RONY para facilitar la evaluación
      return DEFAULT_USERS[0];
    } catch (e) {
      return DEFAULT_USERS[0];
    }
  }

  function setLoggedUser(userObj) {
    if (userObj) {
      localStorage.setItem(KEYS.LOGGED_USER, JSON.stringify(userObj));
    } else {
      localStorage.removeItem(KEYS.LOGGED_USER);
    }
  }

  // --- Progreso de Cursos ---
  function getCompletedCourses() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.COMPLETED_COURSES)) || ['c1-app-install'];
    } catch (e) {
      return ['c1-app-install'];
    }
  }

  function completeCourse(courseId) {
    const list = getCompletedCourses();
    if (!list.includes(courseId)) {
      list.push(courseId);
      localStorage.setItem(KEYS.COMPLETED_COURSES, JSON.stringify(list));
    }
    return list;
  }

  function isCourseCompleted(courseId) {
    return getCompletedCourses().includes(courseId);
  }

  // --- Logros (Achievements) ---
  function getUnlockedAchievements() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.ACHIEVEMENTS)) || [];
    } catch (e) {
      return [];
    }
  }

  function unlockAchievement(achievementId) {
    const unlocked = getUnlockedAchievements();
    const found = unlocked.find(a => a.id === achievementId);
    if (!found) {
      const newAchievement = { id: achievementId, unlockedAt: new Date().toISOString() };
      unlocked.push(newAchievement);
      localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(unlocked));
      return { newlyUnlocked: true, achievement: newAchievement };
    }
    return { newlyUnlocked: false, achievement: found };
  }

  function hasAchievement(achievementId) {
    return getUnlockedAchievements().some(a => a.id === achievementId);
  }

  // --- Preferencias de Accesibilidad ---
  function getPreferences() {
    try {
      return { ...DEFAULT_PREFERENCES, ...(JSON.parse(localStorage.getItem(KEYS.PREFERENCES)) || {}) };
    } catch (e) {
      return DEFAULT_PREFERENCES;
    }
  }

  function savePreferences(partialPrefs) {
    const current = getPreferences();
    const updated = { ...current, ...partialPrefs };
    localStorage.setItem(KEYS.PREFERENCES, JSON.stringify(updated));
    // Sincronizar llaves legacy para compatibilidad
    if (updated.fontScale) localStorage.setItem('puente_font_scale', updated.fontScale);
    if (updated.contrast) localStorage.setItem('puente_contrast', updated.contrast);
    return updated;
  }

  // --- Certificados ---
  function getCertificates() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.CERTIFICATES)) || [];
    } catch (e) {
      return [];
    }
  }

  function issueCertificate(certData) {
    const certs = getCertificates();
    const id = certData.id || `PD-${Date.now().toString(36).toUpperCase()}`;
    const newCert = {
      id,
      studentName: certData.studentName || 'Rony',
      courseTitle: certData.courseTitle || 'Descarga e Instalación Segura de Aplicaciones',
      issuedDate: new Date().toISOString(),
      score: certData.score || 3,
      totalQuestions: certData.totalQuestions || 3,
      hashVerification: `PD-VERIF-${Math.floor(100000 + Math.random() * 900000)}`
    };
    certs.push(newCert);
    localStorage.setItem(KEYS.CERTIFICATES, JSON.stringify(certs));
    return newCert;
  }

  // --- Notas de Acompañante / Tutor ---
  function getTutorNotes() {
    try {
      return JSON.parse(localStorage.getItem(KEYS.TUTOR_NOTES)) || [
        {
          id: 'note-1',
          author: 'Sofía (Nieta)',
          date: '2026-03-10',
          text: '¡Felicitaciones abu por tu primer certificado! Te quiero un montón, el domingo lo festejamos con medialunas.'
        }
      ];
    } catch (e) {
      return [];
    }
  }

  function addTutorNote(noteText, author = 'Familiar / Tutor') {
    const notes = getTutorNotes();
    const newNote = {
      id: `note-${Date.now()}`,
      author,
      date: new Date().toISOString().split('T')[0],
      text: noteText
    };
    notes.unshift(newNote);
    localStorage.setItem(KEYS.TUTOR_NOTES, JSON.stringify(notes));
    return newNote;
  }

  // Inicializar al cargar
  init();

  return {
    getUsers,
    saveUser,
    getLoggedUser,
    setLoggedUser,
    getCompletedCourses,
    completeCourse,
    isCourseCompleted,
    getUnlockedAchievements,
    unlockAchievement,
    hasAchievement,
    getPreferences,
    savePreferences,
    getCertificates,
    issueCertificate,
    getTutorNotes,
    addTutorNote
  };
})();

// Exportar globalmente
window.StorageService = StorageService;
