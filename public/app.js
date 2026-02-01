// ===== CONFIGURACIÓN DINÁMICA =====
let CONFIG = window.VIDEO_CONFIG || null;
let VIDEO_SLUG = window.VIDEO_SLUG || null;

// ===== ESTADO =====
let TASK_DURATIONS = {};
let completedTasks = {};
let taskTimers = {};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    if (CONFIG) {
        initUI();
    } else if (VIDEO_SLUG) {
        // Fallback: load from API if not passed directly
        loadConfigFromAPI();
    } else {
        console.error("No video configuration found");
        window.location.href = '/admin.php';
    }
});

// ===== CARGAR CONFIG DESDE API (FALLBACK) =====
function loadConfigFromAPI() {
    const storageKey = `completedTasks_${VIDEO_SLUG}`;
    completedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};
    
    fetch(`/config.php?video=${encodeURIComponent(VIDEO_SLUG)}`)
        .then(res => res.json())
        .then(response => {
            if (response.success && response.data) {
                CONFIG = response.data;
                initUI();
            } else {
                console.error("Video no encontrado");
                window.location.href = '/admin.php';
            }
        })
        .catch(err => {
            console.error("❌ Error cargando video:", err);
            window.location.href = '/admin.php';
        });
}

// ===== ICONOS =====
// ===== ICONOS =====
const TASK_ICONS = {
    bell: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)',
        stroke: true
    },
    youtube: {
        svg: '<path d="M21.593 7.203a2.506 2.506 0 00-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 00-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 001.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831zM9.996 15.005l.005-6 5.207 3.005-5.212 2.995z"></path>',
        gradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
        fill: true,
        color: 'white'  // Color específico para YouTube
    },
    discord: {
        svg: '<path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"></path>',
        gradient: 'linear-gradient(135deg, #5865F2 0%, #4752C4 100%)',
        fill: true,
        color: 'white'
    },
    video: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        stroke: true
    },
    like: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        stroke: true
    },
    comment: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        stroke: true
    },
    gaming: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path>',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        stroke: true
    },
    share: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>',
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        stroke: true
    },
    heart: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
        stroke: true
    },
    star: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        stroke: true
    },
    gift: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>',
        gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        stroke: true
    },
    trophy: {
        svg: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        stroke: true
    }
};

function getTaskIconHTML(iconType) {
    const icon = TASK_ICONS[iconType] || TASK_ICONS.bell;
    
    let svgAttributes = '';
    if (icon.fill) {
        svgAttributes = `fill="${icon.color || 'currentColor'}"`;
    } else if (icon.stroke) {
        svgAttributes = 'fill="none" stroke="currentColor" stroke-width="2"';
    }
    
    return `
        <div class="task-icon-wrapper" style="background:${icon.gradient}">
            <svg class="task-icon" ${svgAttributes} viewBox="0 0 24 24">${icon.svg}</svg>
        </div>
    `;
}

// ===== INICIALIZAR INTERFAZ =====
function initUI() {
    if (!CONFIG || !CONFIG.tasks) {
        console.error("CONFIG inválida, abortando initUI");
        return;
    }

    console.log('%c⚙️ Video Unlock Loaded', 'color: #a855f7; font-size: 14px; font-weight: bold;');
    console.log('Video:', CONFIG.title);
    console.log('Tareas disponibles:', Object.keys(CONFIG.tasks || {}).length);

    // Reconstruir duraciones
    TASK_DURATIONS = {};
    Object.keys(CONFIG.tasks).forEach(taskId => {
        TASK_DURATIONS[taskId] = CONFIG.tasks[taskId].duration;
    });

    // Load completed tasks
    const storageKey = `completedTasks_${VIDEO_SLUG}`;
    completedTasks = JSON.parse(localStorage.getItem(storageKey)) || {};

    applyConfiguration();
    updateProgress();

    Object.keys(completedTasks).forEach(taskId => {
        if (completedTasks[taskId]) {
            markTaskAsCompleted(taskId);
        }
    });
}

// ===== APLICAR CONFIGURACIÓN =====
function applyConfiguration() {
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        titleElement.textContent = CONFIG.title || '';
    }

    const descriptionElement = document.querySelector('.description');
    if (descriptionElement && CONFIG.description) {
        descriptionElement.textContent = CONFIG.description;
    }

    displayBannerImage();
    renderTasks();
}

// ===== RENDERIZAR TAREAS =====
function renderTasks() {
    const tasksContainer = document.getElementById('tasksContainer');
    if (!tasksContainer) return;

    tasksContainer.innerHTML = '';

    Object.keys(CONFIG.tasks).forEach(taskId => {
        const task = CONFIG.tasks[taskId];
        const iconHTML = getTaskIconHTML(task.icon || 'bell');

        tasksContainer.insertAdjacentHTML('beforeend', `
            <div class="task-item" id="${taskId}">
                ${iconHTML}
                <div class="task-content">
                    <div class="task-title">
                        ${task.title}
                    </div>
                    <div class="task-description">${task.description}</div>
                </div>
                <button class="task-action-btn" onclick="handleTaskClick('${taskId}', '${task.url}')">
                    <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                </button>
            </div>
        `);
    });
}

// ===== INTERACCIONES =====
function handleTaskClick(taskId, url) {
    if (completedTasks[taskId]) return;
    window.open(url, '_blank');
    startTaskTimer(taskId);
}

function startTaskTimer(taskId) {
    if (taskTimers[taskId]) return;

    let remainingTime = TASK_DURATIONS[taskId];
    
    taskTimers[taskId] = setInterval(() => {
        remainingTime--;
        
        if (remainingTime <= 0) {
            clearInterval(taskTimers[taskId]);
            delete taskTimers[taskId];
            completeTask(taskId);
        }
    }, 1000);
}

function completeTask(taskId) {
    completedTasks[taskId] = true;
    const storageKey = `completedTasks_${VIDEO_SLUG}`;
    localStorage.setItem(storageKey, JSON.stringify(completedTasks));
    markTaskAsCompleted(taskId);
    updateProgress();
}

function markTaskAsCompleted(taskId) {
    const el = document.getElementById(taskId);
    if (!el) return;

    el.classList.add('completed');
    const title = el.querySelector('.task-title');

    if (title && !title.querySelector('.checkmark')) {
        const check = document.createElement('span');
        check.className = 'checkmark';
        check.textContent = '✓';
        title.appendChild(check);
    }
}

// ===== PROGRESO =====
function updateProgress() {
    const total = Object.keys(TASK_DURATIONS).length;
    const done = Object.values(completedTasks).filter(Boolean).length;
    const percent = total ? (done / total) * 100 : 0;

    const progressText = document.getElementById('progressText');
    const progressBar = document.getElementById('progressBar');
    const unlockBtn = document.getElementById('unlockBtn');

    if (progressText) progressText.textContent = `${done}/${total} tareas completadas`;
    if (progressBar) progressBar.style.width = `${percent}%`;

    if (unlockBtn) {
        if (done === total && total > 0) {
            unlockBtn.disabled = false;
            unlockBtn.innerHTML = `
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                TAREAS COMPLETADAS
            `;
            unlockBtn.classList.add('completed');
            unlockBtn.onclick = () => {
                if (CONFIG && CONFIG.unlockUrl) {
                    window.location.href = CONFIG.unlockUrl;
                }
            };
        } else {
            unlockBtn.disabled = true;
            unlockBtn.innerHTML = `
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                COMPLETAR TAREAS
            `;
            unlockBtn.classList.remove('completed');
            unlockBtn.onclick = null;
        }
    }
}

// ===== BANNER =====
function displayBannerImage() {
    const container = document.getElementById('bannerContainer');
    const img = document.getElementById('bannerImage');

    if (CONFIG.bannerImage && img && container) {
        img.src = CONFIG.bannerImage;
        container.style.display = 'block';
    } else if (container) {
        container.style.display = 'none';
    }
}

// ===== RESET (DEBUG) =====
function resetProgress() {
    const storageKey = `completedTasks_${VIDEO_SLUG}`;
    localStorage.removeItem(storageKey);
    location.reload();
}
window.resetTasks = resetProgress;

// ===== EXPORT FUNCTIONS FOR HTML ONCLICK =====
window.handleTaskClick = handleTaskClick;