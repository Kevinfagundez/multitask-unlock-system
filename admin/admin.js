// ===== CONFIGURACIÓN DE AUTENTICACIÓN =====

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin'
};

// ===== CONFIGURACIÓN POR DEFECTO =====
const DEFAULT_CONFIG = {
    mainTitle: 'Multitask Zack',
    unlockUrl: 'https://tu-contenido-desbloqueado.com',
    bannerImage: null, // Base64 de la imagen o null
    tasks: {
        task1: {
            title: 'Suscríbete al Canal',
            description: 'Únete a nuestra comunidad y no te pierdas nada',
            url: 'https://www.youtube.com/@tucanal',
            duration: 10,
            icon: 'bell'
        },
        task2: {
            title: '▶Like & Comenta Video',
            description: 'Comenta y dale apoyo con pulgar arriba',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            duration: 15,
            icon: 'youtube'
        }
    }
};

// ===== VARIABLES GLOBALES =====
let isAuthenticated = false;
let currentConfig = {};
let taskCounter = 0;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    setupEventListeners();
});

// ===== AUTENTICACIÓN =====
function checkAuthentication() {
    const sessionAuth = sessionStorage.getItem('adminAuth');
    if (sessionAuth === 'authenticated') {
        isAuthenticated = true;
        showAdminPanel();
        loadConfiguration();
    } else {
        showLoginScreen();
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveConfiguration);
    }

    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', openPreview);
    }

    // Reset button
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetProgress);
    }

    // Add task button
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', addNewTask);
    }

    // Banner image handlers
    setupBannerImageHandlers();
}

// ===== MANEJO DE LOGIN =====
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Login exitoso
        sessionStorage.setItem('adminAuth', 'authenticated');
        isAuthenticated = true;
        errorMessage.classList.remove('show');
        showAdminPanel();
        loadConfiguration();
    } else {
        // Login fallido
        errorMessage.textContent = 'Usuario o contraseña incorrectos';
        errorMessage.classList.add('show');
        
        // Limpiar campos
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }
}

function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        sessionStorage.removeItem('adminAuth');
        isAuthenticated = false;
        showLoginScreen();
        
        // Limpiar formulario de login
        document.getElementById('loginForm').reset();
        document.getElementById('errorMessage').classList.remove('show');
    }
}

// ===== GESTIÓN DE CONFIGURACIÓN =====
function loadConfiguration() {
    fetch("/config.php")  
        .then(res => res.json())
        .then(config => {
            currentConfig = config;

            const ids = Object.keys(currentConfig.tasks || {});
            if (ids.length) {
                taskCounter = Math.max(...ids.map(id => parseInt(id.replace("task", ""))));
            }

            document.getElementById('mainTitle').value = currentConfig.mainTitle || '';
            document.getElementById('unlockUrl').value = currentConfig.unlockUrl || '';

            renderTasksConfig();
            loadBannerImage();
        })
        .catch(err => {
            console.error("Error cargando config:", err);
            currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            renderTasksConfig();
        });
}


// ===== RENDERIZAR CONFIGURACIÓN DE TAREAS =====
function renderTasksConfig() {
    const container = document.getElementById('tasksConfigContainer');
    container.innerHTML = '';

    Object.keys(currentConfig.tasks).forEach((taskId, index) => {
        const task = currentConfig.tasks[taskId];
        const taskNumber = taskId.replace('task', '');
        
        const taskHTML = `
            <div class="task-config" data-task-id="${taskId}">
                <div class="task-config-header">
                    <h3>
                        <span class="task-number">${index + 1}</span>
                        Tarea ${index + 1}
                    </h3>
                    ${Object.keys(currentConfig.tasks).length > 1 ? `
                        <button class="delete-task-btn" onclick="deleteTask('${taskId}')">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Eliminar
                        </button>
                    ` : ''}
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="${taskId}Title">Título de la Tarea</label>
                        <input type="text" id="${taskId}Title" value="${task.title}" placeholder="Título de la tarea">
                    </div>
                    
                    <div class="form-group">
                        <label for="${taskId}Icon">Icono de la Tarea</label>
                        <select id="${taskId}Icon" class="icon-select">
                            <option value="bell" ${task.icon === 'bell' ? 'selected' : ''}>Notificación</option>
                            <option value="youtube" ${task.icon === 'youtube' ? 'selected' : ''}>YouTube</option>
                            <option value="discord" ${task.icon === 'discord' ? 'selected' : ''}>Discord</option>
                            <option value="video" ${task.icon === 'video' ? 'selected' : ''}>Video</option>
                            <option value="like" ${task.icon === 'like' ? 'selected' : ''}>Like</option>
                            <option value="comment" ${task.icon === 'comment' ? 'selected' : ''}>Comentario</option>
                            <option value="gaming" ${task.icon === 'gaming' ? 'selected' : ''}>Gaming</option>
                            <option value="share" ${task.icon === 'share' ? 'selected' : ''}>Compartir</option>
                            <option value="heart" ${task.icon === 'heart' ? 'selected' : ''}>Corazón</option>
                            <option value="star" ${task.icon === 'star' ? 'selected' : ''}>Estrella</option>
                            <option value="gift" ${task.icon === 'gift' ? 'selected' : ''}>Regalo</option>
                            <option value="trophy" ${task.icon === 'trophy' ? 'selected' : ''}>Trofeo</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="${taskId}Desc">Descripción</label>
                        <input type="text" id="${taskId}Desc" value="${task.description}" placeholder="Descripción breve">
                    </div>
                    
                    <div class="form-group">
                        <label for="${taskId}Url">URL</label>
                        <input type="url" id="${taskId}Url" value="${task.url}" placeholder="https://...">
                    </div>
                    
                    <div class="form-group">
                        <label for="${taskId}Time">Tiempo de Desbloqueo (Segundos)</label>
                        <div class="time-input-wrapper">
                            <input type="number" id="${taskId}Time" min="5" max="60" value="${task.duration}">
                            <span class="time-label">Segundos</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', taskHTML);
    });
}

// ===== AÑADIR NUEVA TAREA =====
function addNewTask() {
    taskCounter++;
    const newTaskId = `task${taskCounter}`;
    
    // Agregar nueva tarea a la configuración actual
    currentConfig.tasks[newTaskId] = {
        title: 'Nueva Tarea',
        description: 'Descripción de la tarea',
        url: 'https://ejemplo.com',
        duration: 10,
        icon: 'bell'
    };

    // Re-renderizar tareas
    renderTasksConfig();

    // Scroll al final para ver la nueva tarea
    setTimeout(() => {
        const container = document.getElementById('tasksConfigContainer');
        container.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    showNotification('Nueva tarea añadida. Recuerda guardar los cambios.');
}

// ===== ELIMINAR TAREA =====
function deleteTask(taskId) {
    if (Object.keys(currentConfig.tasks).length <= 1) {
        alert('Debe haber al menos una tarea. No puedes eliminar la última.');
        return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        delete currentConfig.tasks[taskId];
        renderTasksConfig();
        showNotification('Tarea eliminada. Recuerda guardar los cambios.');
    }
}

// ===== GUARDAR CONFIGURACIÓN =====
function saveConfiguration() {
    const config = {
        mainTitle: document.getElementById('mainTitle').value,
        unlockUrl: document.getElementById('unlockUrl').value,
        bannerImage: currentConfig.bannerImage || null,
        tasks: {}
    };

    Object.keys(currentConfig.tasks).forEach(taskId => {
        config.tasks[taskId] = {
            title: document.getElementById(`${taskId}Title`).value,
            description: document.getElementById(`${taskId}Desc`).value,
            url: document.getElementById(`${taskId}Url`).value,
            duration: parseInt(document.getElementById(`${taskId}Time`).value),
            icon: document.getElementById(`${taskId}Icon`).value
        };
    });

    fetch("/config.php", {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification("Configuración guardada correctamente");
            currentConfig = config;
        } else {
            alert("Error al guardar");
        }
    })
    .catch(err => {
        console.error(err);
        alert("Error de conexión");
    });
}

// ===== FUNCIONES AUXILIARES =====
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.querySelector('span').textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function openPreview() {
    // Abrir el multitask en nueva pestaña
    window.open('/index.php', '_blank');
}

function resetProgress() {
    if (confirm('¿Estás seguro de que deseas restablecer el progreso de todas las tareas? Esta acción no se puede deshacer.')) {
        // Eliminar progreso guardado en el multitask
        localStorage.removeItem('completedTasks');
        
        showNotification('Progreso restablecido exitosamente');
        
        console.log('Progreso de tareas restablecido');
    }
}

// ===== INSTRUCCIONES PARA CAMBIAR CREDENCIALES =====
console.log('%c🔐 INSTRUCCIONES DE SEGURIDAD', 'color: #a855f7; font-size: 16px; font-weight: bold;');
console.log('%cPara cambiar las credenciales de acceso, edita las siguientes líneas en admin.js:', 'color: #d8b4fe; font-size: 12px;');
console.log('%c\nconst ADMIN_CREDENTIALS = {\n    username: \'admin\',\n    password: \'multitask2024\'\n};', 'color: #c084fc; font-size: 12px; background: rgba(88, 28, 135, 0.2); padding: 10px;');
console.log('%c\n⚠️ Recuerda cambiar estas credenciales antes de publicar el sitio.', 'color: #f59e0b; font-size: 12px; font-weight: bold;');

// ===== MANEJO DE IMAGEN BANNER =====
function setupBannerImageHandlers() {
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const bannerInput = document.getElementById('bannerInput');
    const removeBannerBtn = document.getElementById('removeBannerBtn');

    // Click en placeholder para abrir selector
    if (uploadPlaceholder) {
        uploadPlaceholder.addEventListener('click', () => {
            bannerInput.click();
        });
    }

    // Drag and drop
    if (uploadPlaceholder) {
        uploadPlaceholder.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.borderColor = 'var(--primary)';
        });

        uploadPlaceholder.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.borderColor = 'var(--border)';
        });

        uploadPlaceholder.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.borderColor = 'var(--border)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleBannerImageFile(files[0]);
            }
        });
    }

    // Selección de archivo
    if (bannerInput) {
        bannerInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleBannerImageFile(file);
            }
        });
    }

    // Eliminar banner
    if (removeBannerBtn) {
        removeBannerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeBannerImage();
        });
    }
}

function handleBannerImageFile(file) {
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        alert('Por favor selecciona una imagen en formato JPG o PNG');
        return;
    }

    // Validar tamaño (2MB máximo)
    const maxSize = 2 * 1024 * 1024; // 2MB en bytes
    if (file.size > maxSize) {
        alert('La imagen es demasiado grande. El tamaño máximo es 2MB.');
        return;
    }

    // Leer archivo como Base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Image = e.target.result;
        currentConfig.bannerImage = base64Image;
        showBannerPreview(base64Image);
        showNotification('Imagen cargada. Recuerda guardar los cambios.');
    };
    reader.readAsDataURL(file);
}

function showBannerPreview(base64Image) {
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const bannerPreview = document.getElementById('bannerPreview');
    const bannerPreviewImg = document.getElementById('bannerPreviewImg');

    if (uploadPlaceholder && bannerPreview && bannerPreviewImg) {
        uploadPlaceholder.style.display = 'none';
        bannerPreview.style.display = 'block';
        bannerPreviewImg.src = base64Image;
    }
}

function removeBannerImage() {
    if (confirm('¿Estás seguro de que deseas eliminar la imagen?')) {
        currentConfig.bannerImage = null;
        
        const uploadPlaceholder = document.getElementById('uploadPlaceholder');
        const bannerPreview = document.getElementById('bannerPreview');
        const bannerInput = document.getElementById('bannerInput');

        if (uploadPlaceholder && bannerPreview && bannerInput) {
            uploadPlaceholder.style.display = 'block';
            bannerPreview.style.display = 'none';
            bannerInput.value = '';
        }

        showNotification('Imagen eliminada. Recuerda guardar los cambios.');
    }
}

function loadBannerImage() {
    if (currentConfig.bannerImage) {
        showBannerPreview(currentConfig.bannerImage);
    }
}