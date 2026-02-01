<?php
// Get video slug from URL parameter
$videoSlug = $_GET['video'] ?? null;

// If no video specified, redirect to admin
if (!$videoSlug) {
    header('Location: /admin.php');
    exit;
}

// Read multitask_config.json directly
$configFile = __DIR__ . '/multitask_config.json';
if (!file_exists($configFile)) {
    header('Location: /admin.php');
    exit;
}

$configContent = file_get_contents($configFile);
$configData = json_decode($configContent, true);

if (!$configData || !isset($configData['videos'][$videoSlug])) {
    // Video not found, redirect to admin
    header('Location: /admin.php');
    exit;
}

$video = $configData['videos'][$videoSlug];
$video['id'] = $videoSlug; // Add slug to video data

$pageTitle = $video['title'] . ' - Gomiatos';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($pageTitle); ?></title>
    <link rel="icon" type="image/png" sizes="16x16" href="img/favicon-16x16.png">
    <link rel="icon" type="image/png" sizes="32x32" href="img/favicon-32x32.png">
    <link rel="stylesheet" href="/public/styles.css">
    <script>
        // Pass video slug and data to JavaScript
        window.VIDEO_SLUG = <?php echo json_encode($videoSlug); ?>;
        window.VIDEO_CONFIG = <?php echo json_encode($video); ?>;
    </script>
</head>
<body>
    <div class="container">
        <!-- Banner Image (Optional) -->
        <div class="banner-container" id="bannerContainer" style="display: none;">
            <img id="bannerImage" alt="Banner" class="banner-image">
        </div>

        <h1 class="title"><?php echo htmlspecialchars($video['title']); ?></h1>
        
        <?php 
        // Solo mostrar descripción si existe y no es el placeholder de error
        if (!empty($video['description']) && $video['description'] !== 'descripción para corregir'): 
        ?>
            <p class="description"><?php echo htmlspecialchars($video['description']); ?></p>
        <?php endif; ?>

        <div class="progress-section">
            <div class="progress-header">
                <svg class="progress-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>PROGRESO DEL DESBLOQUEO</span>
            </div>
            <div class="progress-text" id="progressText">0/0 tareas completadas</div>
            <div class="progress-bar-container">
                <div class="progress-bar" id="progressBar" style="width: 0%"></div>
            </div>
        </div>

        <!-- Contenedor dinámico de tareas -->
        <div id="tasksContainer">
            <!-- Las tareas se cargarán dinámicamente desde app.js -->
        </div>

        <button class="unlock-btn" id="unlockBtn" disabled>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            COMPLETAR TAREAS
        </button>
    </div>

    <script src="/public/app.js"></script>
</body>
</html>