<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");

$configFile = __DIR__ . "/multitask_config.json";

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    if (!file_exists($configFile)) {
        $default = [
            "mainTitle" => "Multitask Zack",
            "unlockUrl" => "",
            "bannerImage" => null,
            "tasks" => []
        ];
        file_put_contents($configFile, json_encode($default, JSON_PRETTY_PRINT));
        echo json_encode($default);
        exit;
    }

    echo file_get_contents($configFile);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data || !isset($data["tasks"])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "JSON inválido"]);
        exit;
    }

    file_put_contents($configFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    echo json_encode(["success" => true]);
    exit;
}
