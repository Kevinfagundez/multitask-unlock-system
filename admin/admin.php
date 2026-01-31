<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administración</title>
    <link rel="stylesheet" href="admin.css">
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
                <h1 style="color: white;">
                    <img src="/img/configuration.svg" alt="" style="width: 30px; height: 30px; filter: invert(1);">
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
            <div class="alert alert-info">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                    <strong>Bienvenido al panel de administración</strong>
                    <p>Configura tu MultiTask desde aquí. Los cambios se aplicarán automáticamente.</p>
                </div>
            </div>

            <!-- Configuración General -->
            <section class="config-section">
                <div class="section-header">
                    <img src="/img/config-general.svg" alt="" style="width: 30px; height: 30px; filter: invert(1);">
                    <h2>CONFIGURACIÓN GENERAL</h2>
                </div>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="mainTitle">Título del MultiTask</label>
                        <input type="text" id="mainTitle" placeholder="Multitask Zack">
                    </div>
                    
                    <div class="form-group">
                        <label for="unlockUrl">URL de Contenido Desbloqueado</label>
                        <input type="url" id="unlockUrl" placeholder="https://tu-contenido.com">
                    </div>
                </div>
            </section>

            <!-- Imagen Banner (Opcional) -->
            <section class="config-section">
                <div class="section-header">
                    <img src="/img/img-banner.svg" alt="" style="width: 30px; height: 30px; filter: invert(1);">
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

                    <div class="banner-upload-area" id="bannerUploadArea">
                        <input type="file" id="bannerInput" accept="image/png,image/jpeg,image/jpg" style="display: none;">
                        <div class="upload-placeholder" id="uploadPlaceholder">
                            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p>Click para seleccionar imagen</p>
                            <span>o arrastra y suelta aquí</span>
                        </div>
                        <div class="banner-preview" id="bannerPreview" style="display: none;">
                            <img id="bannerPreviewImg" alt="Preview">
                            <button class="remove-banner-btn" id="removeBannerBtn">
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
                    <img src="/img/task.svg" alt="" style="width: 30px; height: 30px; filter: invert(1);">
                    <h2>TAREAS</h2>
                    <button class="add-task-btn" id="addTaskBtn">
                        <img src="/img/more.svg" alt="" style="width: 30px; height: 30px; filter: invert(1);">
                        AÑADIR TAREA
                    </button>
                </div>

                <!-- Contenedor dinámico de tareas -->
                <div id="tasksConfigContainer">
                    <!-- Las tareas se cargarán dinámicamente desde admin.js -->
                </div>
            </section>

            <!-- Botones de Acción -->
            <div class="action-buttons">
                <button class="btn-secondary" id="previewBtn">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    Vista Previa
                </button>
                
                <button class="btn-secondary" id="resetBtn">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Restablecer Progreso
                </button>
                
                <button class="btn-primary" id="saveBtn">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Guardar Cambios
                </button>
            </div>

            <!-- Notificación de éxito -->
            <div class="notification" id="notification">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Cambios guardados exitosamente</span>
            </div>
        </div>
    </div>

    <script src="admin.js"></script>
</body>
</html>