<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type");

$configFile = __DIR__ . "/multitask_config.json";

// Initialize config file if doesn't exist
if (!file_exists($configFile)) {
    $default = [
        "videos" => []
    ];
    file_put_contents($configFile, json_encode($default, JSON_PRETTY_PRINT));
}

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// GET - Retrieve data
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $config = json_decode(file_get_contents($configFile), true);
    
    // Get specific video by slug
    if (isset($_GET['video'])) {
        $slug = $_GET['video'];
        if (isset($config['videos'][$slug])) {
            echo json_encode([
                "success" => true,
                "data" => $config['videos'][$slug]
            ]);
        } else {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "error" => "Video no encontrado"
            ]);
        }
        exit;
    }
    
    // Get all videos
    echo json_encode([
        "success" => true,
        "data" => $config
    ]);
    exit;
}

// POST - Create new video
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "JSON inválido"]);
        exit;
    }
    
    // Check if it's a create operation
    if (isset($data['action']) && $data['action'] === 'create') {
        $config = json_decode(file_get_contents($configFile), true);
        
        $slug = $data['slug'];
        
        // Validate slug
        if (!preg_match('/^[a-zA-Z0-9-]+$/', $slug)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "error" => "El slug solo puede contener letras, números y guiones"
            ]);
            exit;
        }
        
        // Check if slug already exists
        if (isset($config['videos'][$slug])) {
            http_response_code(409);
            echo json_encode([
                "success" => false,
                "error" => "Ya existe un video con ese slug"
            ]);
            exit;
        }
        
        // Create new video
        $config['videos'][$slug] = [
            "id" => $slug,
            "title" => $data['title'],
            "description" => $data['description'] ?? '',
            "unlockUrl" => $data['unlockUrl'] ?? '',
            "bannerImage" => $data['bannerImage'] ?? null,
            "createdAt" => date('c'),
            "tasks" => $data['tasks'] ?? []
        ];
        
        file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        
        echo json_encode([
            "success" => true,
            "message" => "Video creado exitosamente",
            "data" => $config['videos'][$slug]
        ]);
        exit;
    }
}

// PUT - Update existing video
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['slug'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Datos inválidos"]);
        exit;
    }
    
    $config = json_decode(file_get_contents($configFile), true);
    $slug = $data['slug'];
    
    if (!isset($config['videos'][$slug])) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Video no encontrado"]);
        exit;
    }
    
    // Update video
    $config['videos'][$slug] = array_merge($config['videos'][$slug], [
        "title" => $data['title'] ?? $config['videos'][$slug]['title'],
        "description" => $data['description'] ?? $config['videos'][$slug]['description'],
        "unlockUrl" => $data['unlockUrl'] ?? $config['videos'][$slug]['unlockUrl'],
        "bannerImage" => $data['bannerImage'] ?? $config['videos'][$slug]['bannerImage'],
        "tasks" => $data['tasks'] ?? $config['videos'][$slug]['tasks']
    ]);
    
    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    echo json_encode([
        "success" => true,
        "message" => "Video actualizado exitosamente",
        "data" => $config['videos'][$slug]
    ]);
    exit;
}

// DELETE - Remove video
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $slug = $_GET['video'] ?? null;
    
    if (!$slug) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Slug no proporcionado"]);
        exit;
    }
    
    $config = json_decode(file_get_contents($configFile), true);
    
    if (!isset($config['videos'][$slug])) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Video no encontrado"]);
        exit;
    }
    
    unset($config['videos'][$slug]);
    
    file_put_contents($configFile, json_encode($config, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    echo json_encode([
        "success" => true,
        "message" => "Video eliminado exitosamente"
    ]);
    exit;
}

// Method not allowed
http_response_code(405);
echo json_encode(["success" => false, "error" => "Método no permitido"]);
?>