<?php

header('Content-Type: application/json');

require_once 'vendor/autoload.php'; // Include autoloader
use Dompdf\Dompdf;

$ordersDir = __DIR__ . '/orders';

// Ensure the orders directory exists
if (!file_exists($ordersDir)) {
    mkdir($ordersDir, 0755, true); // More secure permissions
}

// Helper functions
function getTodayDate() {
    return date('Y-m-d');
}
function generateOrderNumber() {
    return strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 4));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderDetails = json_decode(file_get_contents('php://input'), true);

    // Validate the incoming data
    if (empty($orderDetails) || empty($orderDetails['customerName']) || empty($orderDetails['shoeSizes'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Order details are missing required fields.']);
        exit;
    }

    $currentDate = getTodayDate();
    $orderNumber = $orderDetails['orderNumber'] ?? generateOrderNumber();
    $htmlFileName = "$currentDate-$orderNumber.html";
    $pdfFileName = "$currentDate-$orderNumber.pdf";

    ob_start();
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Order Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 10px; font-size: 12px; }
            h1, h2 { font-size: 14px; text-decoration: underline; }
            p { text-transform: capitalize; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            table, th, td { border: 1px solid #000; }
            th, td { padding: 5px; text-align: left; }
        </style>
    </head>
    <body>
        <h1>Mietbestätigung</h1>
        <p><strong>Bestellnummer:</strong> <?= htmlspecialchars($orderDetails['orderNumber'], ENT_QUOTES, 'UTF-8') ?></p>
        <p><strong>Name:</strong> <?= htmlspecialchars($orderDetails['customerName'], ENT_QUOTES, 'UTF-8') ?></p>
        <p><strong>Adresse:</strong> <?= htmlspecialchars($orderDetails['address'], ENT_QUOTES, 'UTF-8') ?></p>
        <p><strong>Mietdauer:</strong> <?= htmlspecialchars($orderDetails['rentalDuration'], ENT_QUOTES, 'UTF-8') ?> Stunden</p>
        <p><strong>Mietbeginn:</strong> <?= htmlspecialchars($orderDetails['startTime'], ENT_QUOTES, 'UTF-8') ?></p>
        <p><strong><?= htmlspecialchars($orderDetails['kaution'], ENT_QUOTES, 'UTF-8') ?></strong></p>
        <p><strong><?= htmlspecialchars($orderDetails['eintritt'], ENT_QUOTES, 'UTF-8') ?></strong></p>
        <h2>Schuhgröße</h2>
        <table>
            <tr>
                <th>Type</th>
                <th>Größe</th>
            </tr>
            <?php foreach ($orderDetails['shoeSizes'] as $size): ?>
                <tr>
                    <td><?= htmlspecialchars($size['type'], ENT_QUOTES, 'UTF-8') ?></td>
                    <td><?= htmlspecialchars($size['size'], ENT_QUOTES, 'UTF-8') ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    </body>
    </html>
    <?php
    $htmlContent = ob_get_clean();

    if (file_put_contents("$ordersDir/$htmlFileName", $htmlContent) === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to write HTML file.']);
        exit;
    }

    $dompdf = new Dompdf();
    $dompdf->loadHtml($htmlContent);
    $dompdf->setPaper('A6', 'portrait');
    $dompdf->render();

    $pdfFilePath = $ordersDir . '/' . $pdfFileName;
    if (file_put_contents($pdfFilePath, $dompdf->output()) === false) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save PDF file.']);
        exit;
    }

    // Respond with success
    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'PDF generated successfully!', 'pdfFilePath' => $pdfFilePath]);
    exit;

    // PowerShell printing command
        $pdfFilePath = $ordersDir . '/' . $pdfFileName;
        $escapedFilePath = escapeshellarg($pdfFilePath); // Escape file path for safety
        $printCommand = "PowerShell -Command \"Start-Process -FilePath $escapedFilePath -Verb Print\"";

        // Execute the command
        exec($printCommand, $output, $return_var);

        // Check if the command was successful
        if ($return_var !== 0) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Printing failed.', 'details' => implode("\n", $output)]);
        } else {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Printed successfully.']);
        }




}

http_response_code(405);
echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
exit;
