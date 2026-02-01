// ===== CONFIGURACIÓN DE AUTENTICACIÓN =====
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin'
};

// ===== VARIABLES GLOBALES =====
let isAuthenticated = false;
let allVideos = {};
let currentEditingSlug = null;
let taskCounter = 0;
let currentBannerImage = null;

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
        loadAllVideos();
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

    // Create video button
    const createVideoBtn = document.getElementById('createVideoBtn');
    if (createVideoBtn) {
        createVideoBtn.addEventListener('click', () => openEditView(null));
    }

    // Back to list button
    const backToListBtn = document.getElementById('backToListBtn');
    if (backToListBtn) {
        backToListBtn.addEventListener('click', showListView);
    }

    // Form submit
    const videoEditForm = document.getElementById('videoEditForm');
    if (videoEditForm) {
        videoEditForm.addEventListener('submit', handleFormSubmit);
    }

    // Add task button
    const editAddTaskBtn = document.getElementById('editAddTaskBtn');
    if (editAddTaskBtn) {
        editAddTaskBtn.addEventListener('click', () => addTaskToForm());
    }

    // Preview button
    const editPreviewBtn = document.getElementById('editPreviewBtn');
    if (editPreviewBtn) {
        editPreviewBtn.addEventListener('click', openPreview);
    }

    // Reset button
    const editResetBtn = document.getElementById('editResetBtn');
    if (editResetBtn) {
        editResetBtn.addEventListener('click', resetProgress);
    }

    // Banner upload handlers
    setupBannerHandlers();
}

// ===== MANEJO DE LOGIN =====
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('adminAuth', 'authenticated');
        isAuthenticated = true;
        errorMessage.classList.remove('show');
        showAdminPanel();
        loadAllVideos();
    } else {
        errorMessage.textContent = 'Usuario o contraseña incorrectos';
        errorMessage.classList.add('show');
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }
}

function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        sessionStorage.removeItem('adminAuth');
        isAuthenticated = false;
        showLoginScreen();
        document.getElementById('loginForm').reset();
        document.getElementById('errorMessage').classList.remove('show');
    }
}

// ===== NAVEGACIÓN ENTRE VISTAS =====
function showListView() {
    document.getElementById('videosListView').style.display = 'block';
    document.getElementById('videoEditView').style.display = 'none';
    currentEditingSlug = null;
    loadAllVideos();
}

function showEditView() {
    document.getElementById('videosListView').style.display = 'none';
    document.getElementById('videoEditView').style.display = 'block';
}

// ===== CARGAR TODOS LOS VIDEOS =====
function loadAllVideos() {
    fetch('/config.php')
        .then(res => res.json())
        .then(response => {
            if (response.success && response.data) {
                allVideos = response.data.videos || {};
                renderVideosGrid();
            }
        })
        .catch(err => {
            console.error('Error cargando videos:', err);
            showNotification('Error al cargar videos', 'error');
        });
}

// ===== RENDERIZAR GRID DE VIDEOS =====
function renderVideosGrid() {
    const videosGrid = document.getElementById('videosGrid');
    const emptyState = document.getElementById('emptyState');
    const videoCount = document.getElementById('videoCount');
    const totalVideoCount = document.getElementById('totalVideoCount');
    const viewAllSection = document.getElementById('viewAllSection');

    const videoKeys = Object.keys(allVideos);
    const videoAmount = videoKeys.length;

    videoCount.textContent = videoAmount;
    totalVideoCount.textContent = videoAmount;

    if (videoAmount === 0) {
        emptyState.style.display = 'flex';
        viewAllSection.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
        if (videoAmount > 3) {
            viewAllSection.style.display = 'block';
        }
    }

    videosGrid.innerHTML = '';

    videoKeys.forEach(slug => {
        const video = allVideos[slug];
        const card = createVideoCard(video);
        videosGrid.insertAdjacentHTML('beforeend', card);
    });

    attachVideoCardListeners();
}

// ===== CREAR CARD DE VIDEO =====
function createVideoCard(video) {
    const taskCount = Object.keys(video.tasks || {}).length;
    const date = new Date(video.createdAt);
    const formattedDate = date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const icons = Object.values(video.tasks || {}).map(t => t.icon || 'bell');
    const youtubeCount = icons.filter(i => i === 'youtube').length;
    const discordCount = icons.filter(i => i === 'discord').length;

    return `
        <div class="video-card" data-slug="${video.id}">
            <div class="video-card-header">
                <h3 class="video-title">${video.title}</h3>
                <div class="video-actions">
                    <button class="btn-edit-video" data-slug="${video.id}" title="Editar">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="btn-delete-video" data-slug="${video.id}" title="Eliminar">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <p class="video-description">${video.description || 'Sin descripción'}</p>

            <div class="video-badges">
                <span class="badge badge-time">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    ${taskCount > 0 ? (Object.values(video.tasks)[0].duration || 5) + 's' : '5s'}
                </span>
                ${youtubeCount > 0 ? `
                <span class="badge badge-youtube">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21.593 7.203a2.506 2.506 0 00-1.762-1.766C18.265 5.007 12 5 12 5s-6.264-.007-7.831.404a2.56 2.56 0 00-1.766 1.778c-.413 1.566-.417 4.814-.417 4.814s-.004 3.264.406 4.814c.23.857.905 1.534 1.763 1.765 1.582.43 7.83.437 7.83.437s6.265.007 7.831-.403a2.515 2.515 0 001.767-1.763c.414-1.565.417-4.812.417-4.812s.02-3.265-.407-4.831z"></path>
                    </svg>
                </span>
                ` : ''}
                ${discordCount > 0 ? `
                <span class="badge badge-discord">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03z"></path>
                    </svg>
                </span>
                ` : ''}
            </div>

            <div class="video-link-section">
                <label class="link-label">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                    </svg>
                    Enlace de desbloqueo:
                </label>
                <div class="link-copy-wrapper">
                    <input type="text" class="link-input" value="https://extra.gomiatos.com/${video.id}" readonly>
                    <button class="btn-copy-link" data-link="https://extra.gomiatos.com/${video.id}">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <div class="video-footer">
                <span class="video-date">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    ${formattedDate}
                </span>
                <a href="/index.php?video=${video.id}" target="_blank" class="btn-view-video">Ver</a>
            </div>
        </div>
    `;
}

// ===== ATTACH EVENT LISTENERS TO CARDS =====
function attachVideoCardListeners() {
    document.querySelectorAll('.btn-edit-video').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const slug = e.currentTarget.dataset.slug;
            openEditView(slug);
        });
    });

    document.querySelectorAll('.btn-delete-video').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const slug = e.currentTarget.dataset.slug;
            deleteVideo(slug);
        });
    });

    document.querySelectorAll('.btn-copy-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const link = e.currentTarget.dataset.link;
            copyToClipboard(link);
        });
    });
}

// ===== COPIAR AL PORTAPAPELES =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Enlace copiado al portapapeles', 'success');
    }).catch(err => {
        console.error('Error copiando:', err);
        showNotification('Error al copiar enlace', 'error');
    });
}

// ===== ABRIR VISTA DE EDICIÓN =====
function openEditView(slug) {
    currentEditingSlug = slug;
    showEditView();
    
    if (slug) {
        // Editar video existente
        const video = allVideos[slug];
        if (!video) {
            showNotification('Video no encontrado', 'error');
            showListView();
            return;
        }
        loadVideoDataIntoForm(video);
    } else {
        // Crear nuevo video
        clearForm();
        addTaskToForm();
        addTaskToForm();
    }
}

// ===== CARGAR DATOS DEL VIDEO EN EL FORMULARIO =====
function loadVideoDataIntoForm(video) {
    document.getElementById('editSlug').value = video.id;
    document.getElementById('editSlug').disabled = true;
    document.getElementById('editTitle').value = video.title;
    document.getElementById('editDescription').value = video.description || '';
    document.getElementById('editUnlockUrl').value = video.unlockUrl;
    
    currentBannerImage = video.bannerImage;
    if (video.bannerImage) {
        document.getElementById('editBannerPreviewImg').src = video.bannerImage;
        document.getElementById('editUploadPlaceholder').style.display = 'none';
        document.getElementById('editBannerPreview').style.display = 'block';
    } else {
        document.getElementById('editUploadPlaceholder').style.display = 'block';
        document.getElementById('editBannerPreview').style.display = 'none';
    }
    
    const container = document.getElementById('editTasksConfigContainer');
    container.innerHTML = '';
    taskCounter = 0;
    
    Object.keys(video.tasks || {}).forEach(taskId => {
        const task = video.tasks[taskId];
        addTaskToForm(task);
    });
}

// ===== LIMPIAR FORMULARIO =====
function clearForm() {
    document.getElementById('editSlug').value = '';
    document.getElementById('editSlug').disabled = false;
    document.getElementById('editTitle').value = '';
    document.getElementById('editDescription').value = '';
    document.getElementById('editUnlockUrl').value = '';
    
    currentBannerImage = null;
    document.getElementById('editUploadPlaceholder').style.display = 'block';
    document.getElementById('editBannerPreview').style.display = 'none';
    document.getElementById('editBannerInput').value = '';
    
    document.getElementById('editTasksConfigContainer').innerHTML = '';
    taskCounter = 0;
}

// ===== AÑADIR TAREA AL FORMULARIO =====
function addTaskToForm(taskData = null) {
    taskCounter++;
    const taskId = `editTask${taskCounter}`;
    
    const task = taskData || {
        title: '',
        description: '',
        url: '',
        duration: 10,
        icon: 'bell'
    };
    
    const taskHTML = `
        <div class="task-config" data-task-id="${taskId}">
            <div class="task-config-header">
                <h3>
                    <span class="task-number">${taskCounter}</span>
                    Tarea ${taskCounter}
                </h3>
                ${document.querySelectorAll('.task-config').length >= 0 ? `
                    <button type="button" class="delete-task-btn" onclick="deleteTaskFromForm('${taskId}')">
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
                    <input type="text" id="${taskId}Title" value="${task.title}" placeholder="Título de la tarea" required>
                </div>
                
                <div class="form-group">
                    <label for="${taskId}Icon">Icono de la Tarea</label>
                    <select id="${taskId}Icon" class="icon-select">
                        <option value="bell" ${task.icon === 'bell' ? 'selected' : ''}>🔔 Notificación</option>
                        <option value="youtube" ${task.icon === 'youtube' ? 'selected' : ''}>📺 YouTube</option>
                        <option value="discord" ${task.icon === 'discord' ? 'selected' : ''}>💬 Discord</option>
                        <option value="video" ${task.icon === 'video' ? 'selected' : ''}>▶️ Video</option>
                        <option value="like" ${task.icon === 'like' ? 'selected' : ''}>👍 Like</option>
                        <option value="comment" ${task.icon === 'comment' ? 'selected' : ''}>💬 Comentario</option>
                        <option value="gaming" ${task.icon === 'gaming' ? 'selected' : ''}>🎮 Gaming</option>
                        <option value="share" ${task.icon === 'share' ? 'selected' : ''}>📤 Compartir</option>
                        <option value="heart" ${task.icon === 'heart' ? 'selected' : ''}>❤️ Corazón</option>
                        <option value="star" ${task.icon === 'star' ? 'selected' : ''}>⭐ Estrella</option>
                        <option value="gift" ${task.icon === 'gift' ? 'selected' : ''}>🎁 Regalo</option>
                        <option value="trophy" ${task.icon === 'trophy' ? 'selected' : ''}>🏆 Trofeo</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="${taskId}Desc">Descripción</label>
                    <input type="text" id="${taskId}Desc" value="${task.description}" placeholder="Descripción breve">
                </div>
                
                <div class="form-group">
                    <label for="${taskId}Url">URL</label>
                    <input type="url" id="${taskId}Url" value="${task.url}" placeholder="https://..." required>
                </div>
                
                <div class="form-group">
                    <label for="${taskId}Time">Tiempo de Desbloqueo (Segundos)</label>
                    <div class="time-input-wrapper">
                        <input type="number" id="${taskId}Time" min="5" max="60" value="${task.duration}" required>
                        <span class="time-label">Segundos</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('editTasksConfigContainer').insertAdjacentHTML('beforeend', taskHTML);
}

// ===== ELIMINAR TAREA DEL FORMULARIO =====
window.deleteTaskFromForm = function(taskId) {
    const taskItems = document.querySelectorAll('.task-config');
    if (taskItems.length <= 1) {
        alert('Debe haber al menos una tarea');
        return;
    }
    
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.remove();
            renumberTasks();
        }
    }
};

function renumberTasks() {
    const tasks = document.querySelectorAll('.task-config');
    tasks.forEach((task, index) => {
        const numberSpan = task.querySelector('.task-number');
        const header = task.querySelector('.task-config-header h3');
        if (numberSpan) numberSpan.textContent = index + 1;
        if (header) {
            const textNode = Array.from(header.childNodes).find(node => node.nodeType === 3);
            if (textNode) textNode.textContent = ` Tarea ${index + 1}`;
        }
    });
}

// ===== MANEJO DE BANNER =====
function setupBannerHandlers() {
    const uploadPlaceholder = document.getElementById('editUploadPlaceholder');
    const bannerInput = document.getElementById('editBannerInput');
    const removeBannerBtn = document.getElementById('editRemoveBannerBtn');

    if (uploadPlaceholder) {
        uploadPlaceholder.addEventListener('click', () => {
            bannerInput.click();
        });
    }

    if (bannerInput) {
        bannerInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                handleBannerFile(file);
            }
        });
    }

    if (removeBannerBtn) {
        removeBannerBtn.addEventListener('click', () => {
            currentBannerImage = null;
            document.getElementById('editBannerInput').value = '';
            document.getElementById('editUploadPlaceholder').style.display = 'block';
            document.getElementById('editBannerPreview').style.display = 'none';
        });
    }
}

function handleBannerFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
        alert('Por favor selecciona una imagen en formato JPG o PNG');
        return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('La imagen es demasiado grande. El tamaño máximo es 2MB.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        currentBannerImage = e.target.result;
        document.getElementById('editBannerPreviewImg').src = e.target.result;
        document.getElementById('editUploadPlaceholder').style.display = 'none';
        document.getElementById('editBannerPreview').style.display = 'block';
    };
    reader.readAsDataURL(file);
}

// ===== SUBMIT DEL FORMULARIO =====
function handleFormSubmit(e) {
    e.preventDefault();
    
    const slug = document.getElementById('editSlug').value.trim();
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const unlockUrl = document.getElementById('editUnlockUrl').value.trim();
    
    if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
        alert('El slug solo puede contener letras, números y guiones');
        return;
    }
    
    const tasks = {};
    const taskItems = document.querySelectorAll('.task-config');
    
    if (taskItems.length === 0) {
        alert('Debes agregar al menos una tarea');
        return;
    }
    
    taskItems.forEach((item, index) => {
        const taskId = `task${index + 1}`;
        const baseId = item.dataset.taskId;
        
        tasks[taskId] = {
            title: document.getElementById(`${baseId}Title`).value.trim(),
            description: document.getElementById(`${baseId}Desc`).value.trim(),
            url: document.getElementById(`${baseId}Url`).value.trim(),
            duration: parseInt(document.getElementById(`${baseId}Time`).value),
            icon: document.getElementById(`${baseId}Icon`).value
        };
    });
    
    const videoData = {
        slug: slug,
        title: title,
        description: description,
        unlockUrl: unlockUrl,
        bannerImage: currentBannerImage,
        tasks: tasks
    };
    
    if (currentEditingSlug && currentEditingSlug !== slug) {
        alert('No puedes cambiar el slug de un video existente');
        return;
    }
    
    if (currentEditingSlug) {
        updateVideo(videoData);
    } else {
        createVideo(videoData);
    }
}

// ===== CREATE VIDEO =====
function createVideo(videoData) {
    fetch('/config.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'create',
            ...videoData
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('Video creado exitosamente', 'success');
            showListView();
        } else {
            alert('Error: ' + (data.error || 'No se pudo crear el video'));
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error de conexión al crear el video');
    });
}

// ===== UPDATE VIDEO =====
function updateVideo(videoData) {
    fetch('/config.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('Video actualizado exitosamente', 'success');
            showListView();
        } else {
            alert('Error: ' + (data.error || 'No se pudo actualizar el video'));
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error de conexión al actualizar el video');
    });
}

// ===== DELETE VIDEO =====
function deleteVideo(slug) {
    const video = allVideos[slug];
    if (!video) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar "${video.title}"? Esta acción no se puede deshacer.`)) {
        return;
    }
    
    fetch(`/config.php?video=${encodeURIComponent(slug)}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showNotification('Video eliminado exitosamente', 'success');
            loadAllVideos();
        } else {
            alert('Error: ' + (data.error || 'No se pudo eliminar el video'));
        }
    })
    .catch(err => {
        console.error('Error:', err);
        alert('Error de conexión al eliminar el video');
    });
}

// ===== FUNCIONES AUXILIARES =====
function openPreview() {
    const slug = document.getElementById('editSlug').value.trim();
    if (slug) {
        window.open(`/index.php?video=${slug}`, '_blank');
    } else {
        alert('Por favor ingresa un slug para ver la vista previa');
    }
}

function resetProgress() {
    const slug = document.getElementById('editSlug').value.trim();
    if (!slug || !currentEditingSlug) {
        alert('Debes estar editando un video existente para restablecer el progreso');
        return;
    }
    
    if (confirm('¿Estás seguro de que deseas restablecer el progreso de este video? Los usuarios perderán su progreso.')) {
        showNotification('Progreso restablecido. Los usuarios comenzarán desde cero.', 'success');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = 'notification show';
    
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
    }
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

console.log('%c🔐 Admin Panel Loaded', 'color: #a855f7; font-size: 14px; font-weight: bold;');
console.log('Gomiatos MultiTask System v6.0');
console.log('%cPara cambiar credenciales, edita admin.js líneas 2-5', 'color: #d8b4fe; font-size: 12px;');