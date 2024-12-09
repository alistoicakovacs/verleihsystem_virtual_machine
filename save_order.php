<?php

$ordersDir = __DIR__ . '/orders';

// Ensure the orders directory exists
if (!file_exists($ordersDir)) {
    mkdir($ordersDir, 0755, true); // More secure permissions
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDate() {
    return date('Y-m-d');
}

// Helper function to generate a unique order number
function generateOrderNumber() {
    return strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
}

// Handle the incoming POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Set response headers
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Methods: POST');

    // Get the raw POST data
    $orderDetails = json_decode(file_get_contents('php://input'), true);

    // Validate the incoming data
    if (empty($orderDetails) || empty($orderDetails['customerName'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Order details and customer name are required.']);
        exit;
    }

    // Generate the filename: YYYY-MM-DD-OrderNumber.json
    $currentDate = getTodayDate();
    $orderNumber = !empty($orderDetails['orderNumber']) ? $orderDetails['orderNumber'] : generateOrderNumber();
    $fileName = $currentDate . '-' . $orderNumber . '.json';
    $filePath = $ordersDir . '/' . $fileName;

    // Check if the file already exists
    if (file_exists($filePath)) {
        http_response_code(409);
        echo json_encode(['status' => 'error', 'message' => 'Order number already exists.']);
        exit;
    }

    // Save the order details to the JSON file
    if (file_put_contents($filePath, json_encode($orderDetails, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save the order.']);
        exit;
    }

    // Log the saved order (optional)
    error_log("Order saved: $filePath\n", 3, __DIR__ . '/logs/order_log.log');

    // Respond with success
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Order saved successfully!', 'fileName' => $fileName]);
    exit;
}

// If the request method is not POST, respond with an error
http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
exit;
 
?>