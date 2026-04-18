<?php
header('Content-Type: application/json; charset=utf-8');

// Simple demo API: reads data/tracking.json and returns matching entry
// Usage: /api/get_tracking.php?tracking=GEX123456
// Note: in production use a DB and authentication

$tracking = isset($_GET['tracking']) ? trim($_GET['tracking']) : '';

if ($tracking === '') {
    http_response_code(400);
    echo json_encode([ "error" => "tracking parameter required" ]);
    exit;
}

$dataFile = __DIR__ . '/../data/tracking.json';
if (!file_exists($dataFile)) {
    http_response_code(500);
    echo json_encode([ "error" => "tracking data not found on server" ]);
    exit;
}

$json = file_get_contents($dataFile);
$all = json_decode($json, true);

if (!is_array($all)) {
    http_response_code(500);
    echo json_encode([ "error" => "invalid tracking data format" ]);
    exit;
}

// case-insensitive lookup
$key = null;
foreach ($all as $k => $v) {
    if (strcasecmp($k, $tracking) === 0) { $key = $k; break; }
}

if ($key === null) {
    http_response_code(404);
    echo json_encode([ "found": false, "message" => "Tracking number not found" ]);
    exit;
}

$result = $all[$key];

// Return standardized JSON
echo json_encode([
    "found" => true,
    "data" => $result
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
