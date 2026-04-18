<?php
// Simple demo update endpoint - for testing only.
// POST fields: tracking, time, status, location, notes
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "POST required"]);
    exit;
}

$tracking = isset($_POST['tracking']) ? trim($_POST['tracking']) : '';
$time = isset($_POST['time']) ? trim($_POST['time']) : date('Y-m-d H:i');
$status = isset($_POST['status']) ? trim($_POST['status']) : '';
$location = isset($_POST['location']) ? trim($_POST['location']) : '';
$notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';

if ($tracking === '' || $status === '') {
    http_response_code(400);
    echo json_encode(["error" => "tracking and status required"]);
    exit;
}

$dataFile = __DIR__ . '/../data/tracking.json';
if (!file_exists($dataFile)) {
    http_response_code(500);
    echo json_encode(["error" => "data file missing"]);
    exit;
}

$all = json_decode(file_get_contents($dataFile), true);
if (!is_array($all)) $all = [];

$key = null;
foreach ($all as $k => $v) {
    if (strcasecmp($k, $tracking) === 0) { $key = $k; break; }
}

if ($key === null) {
    // create new entry
    $all[$tracking] = [
        "tracking" => $tracking,
        "service" => "Demo",
        "origin" => "",
        "destination" => "",
        "eta" => "",
        "progress" => 0,
        "events" => []
    ];
    $key = $tracking;
}

// append event
$event = [
    "time" => $time,
    "status" => $status,
    "location" => $location,
    "notes" => $notes
];

$all[$key]['events'][] = $event;

// optional: update progress automatically if status contains keywords
$progress = $all[$key]['progress'];
if (stripos($status, 'picked') !== false) $progress = max($progress, 10);
if (stripos($status, 'in transit') !== false) $progress = max($progress, 40);
if (stripos($status, 'arrived') !== false) $progress = max($progress, 70);
if (stripos($status, 'out for delivery') !== false) $progress = max($progress, 90);
if (stripos($status, 'delivered') !== false) $progress = 100;
$all[$key]['progress'] = $progress;

// save back
file_put_contents($dataFile, json_encode($all, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo json_encode(["success" => true, "tracking" => $key, "event" => $event]);
