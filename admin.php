<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Gomiatos</title>
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png">
    <link rel="stylesheet" href="admin/admin.css">
</head>
<body>
    
    <!-- PANTALLA DE LOGIN-->
    <div class="login-screen" id="loginScreen">
        <div class="login-container">
            <div class="login-header">
                <svg class="lock-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <h1>Panel de Administración</h1>
            </div>
            
            <form class="login-form" id="loginForm">
                <div class="form-group">
                    <label for="username">Usuario</label>
                    <input type="text" id="username" autocomplete="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" autocomplete="current-password" required>
                </div>
                
                <div class="error-message" id="errorMessage"></div>
                
                <button type="submit" class="login-btn">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                    Iniciar Sesión
                </button>
            </form>
            
            <div class="login-footer">
                <small>Acceso restringido solo para administradores</small>
            </div>
        </div>
    </div>

    <!-- PANEL DE ADMINISTRACIÓN -->
    <div class="admin-panel" id="adminPanel" style="display: none;">
        <header class="admin-header">
            <div class="header-content">
                <h1>
                    <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    PANEL DE ADMINISTRACIÓN
                </h1>
                <button class="logout-btn" id="logoutBtn">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    Cerrar Sesión
                </button>
            </div>
        </header>

        <div class="admin-content">
            <!-- Lista de Videos (Vista Principal) -->
            <div class="videos-list-view" id="videosListView">
                <!-- Botón Crear Video Unlock -->
                <div class="create-video-section">
                    <button class="btn-create-video" id="createVideoBtn">
                        CREAR VIDEO UNLOCK
                    </button>
                </div>

                <!-- Botón Ver Todos -->
                <div class="view-all-section" id="viewAllSection" style="display: none;">
                    <button class="btn-view-all" id="viewAllBtn">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                        </svg>
                        Ver Todos los Videos (<span id="totalVideoCount">0</span>)
                    </button>
                </div>

                <!-- Lista de Videos Creados -->
                <section class="videos-section">
                    <div class="section-header">
                        <h2>
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                            </svg>
                            Videos Creados (<span id="videoCount">0</span>)
                        </h2>
                    </div>

                    <!-- Grid de Videos -->
                    <div class="videos-grid" id="videosGrid">
                        <!-- Los videos se cargarán dinámicamente -->
                        <div class="empty-state" id="emptyState">
                            <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <p>No hay videos creados aún</p>
                            <small>Crea tu primer Video Unlock para empezar</small>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Formulario de Edición (Vista Original) -->
            <div class="video-edit-view" id="videoEditView" style="display: none;">
                <div class="back-to-list">
                    <button class="btn-back" id="backToListBtn">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Volver a la lista
                    </button>
                </div>

                <div class="alert alert-info">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <strong>Bienvenido al panel de administración</strong>
                        <p>Configura tu Video Unlock desde aquí. Los cambios se aplicarán automáticamente.</p>
                    </div>
                </div>

                <form id="videoEditForm">
                    <!-- Configuración General -->
                    <section class="config-section">
                        <div class="section-header">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                            </svg>
                            <h2>CONFIGURACIÓN GENERAL</h2>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="editSlug">Enlace Personalizado (slug)</label>
                                <div class="input-with-prefix">
                                    <span class="input-prefix">extra.gomiatos.com/</span>
                                    <input type="text" id="editSlug" placeholder="delta" pattern="[a-zA-Z0-9-]+" required>
                                </div>
                                <small class="form-hint">Solo letras, números y guiones</small>
                            </div>

                            <div class="form-group">
                                <label for="editTitle">Título del MultiTask</label>
                                <input type="text" id="editTitle" placeholder="Delta Executor" required>
                            </div>

                            <div class="form-group">
                                <label for="editDescription">Descripción</label>
                                <input type="text" id="editDescription" placeholder="Completa los pasos para obtener Delta">
                            </div>
                            
                            <div class="form-group">
                                <label for="editUnlockUrl">URL de Contenido Desbloqueado</label>
                                <input type="url" id="editUnlockUrl" placeholder="https://gomiscripts.com/linksecurith" required>
                            </div>
                        </div>
                    </section>

                    <!-- Imagen Banner (Opcional) -->
                    <section class="config-section">
                        <div class="section-header">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <h2>IMÁGEN BANNER (OPCIONAL)</h2>
                        </div>

                        <div class="banner-config">
                            <div class="banner-info">
                                <p>Agrega una imagen promocional que aparecerá en la parte superior del MultiTask.</p>
                                <ul>
                                    <li>Formatos aceptados: JPG, PNG</li>
                                    <li>Tamaño recomendado: 800x200 píxeles</li>
                                    <li>Tamaño máximo: 2MB</li>
                                </ul>
                            </div>

                            <div class="banner-upload-area" id="editBannerUploadArea">
                                <input type="file" id="editBannerInput" accept="image/png,image/jpeg,image/jpg" style="display: none;">
                                <div class="upload-placeholder" id="editUploadPlaceholder">
                                    <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p>Click para seleccionar imagen</p>
                                    <span>o arrastra y suelta aquí</span>
                                </div>
                                <div class="banner-preview" id="editBannerPreview" style="display: none;">
                                    <img id="editBannerPreviewImg" alt="Preview">
                                    <button type="button" class="remove-banner-btn" id="editRemoveBannerBtn">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Eliminar Imagen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Tareas -->
                    <section class="config-section">
                        <div class="section-header">
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                            <h2>TAREAS</h2>
                            <button type="button" class="add-task-btn" id="editAddTaskBtn">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                AÑADIR TAREA
                            </button>
                        </div>

                        <!-- Contenedor dinámico de tareas -->
                        <div id="editTasksConfigContainer">
                            <!-- Las tareas se cargarán dinámicamente -->
                        </div>
                    </section>

                    <!-- Botones de Acción -->
                    <div class="action-buttons">
                        <button type="button" class="btn-secondary" id="editPreviewBtn">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Vista Previa
                        </button>
                        
                        <button type="button" class="btn-secondary" id="editResetBtn">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            Restablecer Progreso
                        </button>
                        
                        <button type="submit" class="btn-primary" id="editSaveBtn">
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>


        <!-- Notificación -->
        <div class="notification" id="notification">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span id="notificationText">Cambios guardados exitosamente</span>
        </div>
    </div>

    <script src="admin/admin.js"></script>
</body>
</html>