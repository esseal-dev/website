<?php
// Set headers to accept JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust if strict CORS is needed
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Accept only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Read JSON payload from Javascript fetch
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Sanitize inputs
$name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$project = filter_var($data['project'] ?? '', FILTER_SANITIZE_STRING);
$clientTime = filter_var($data['clientTime'] ?? '', FILTER_SANITIZE_STRING);
$internalTime = filter_var($data['internalTime'] ?? '', FILTER_SANITIZE_STRING);

// Basic Validation
if (empty($name) || empty($email) || empty($clientTime)) {
    echo json_encode(['status' => 'error', 'message' => 'Required fields are missing.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address provided.']);
    exit;
}

// ---------------------------------------------------------
// Email Configuration
// ---------------------------------------------------------

$to = $email; // The client's email address
$subject = "Booking Confirmation: Strategy Call with Esseal";

// Headers
$headers = "From: Esseal Sales <sales@esseal.co.uk>\r\n";
$headers .= "Reply-To: sales@esseal.co.uk\r\n";
// BCC the sales team so you have a copy of the incoming booking
$headers .= "Bcc: sales@esseal.co.uk\r\n"; 
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// HTML Email Template
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmation</title>
</head>
<body style='font-family: \"Inter\", Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; background-color: #ffffff;'>
        
        <h2 style='color: #000621; margin-top: 0;'>Booking Confirmed, $name!</h2>
        <p>Thank you for scheduling a discovery and strategy call with Esseal's senior engineering team.</p>
        
        <h3 style='border-bottom: 1px solid #e5e7eb; padding-bottom: 10px; color: #fa6220;'>Meeting Details</h3>
        <ul style='list-style-type: none; padding-left: 0;'>
            <li style='margin-bottom: 10px;'><strong>Your Selected Time:</strong> $clientTime</li>
            <li><strong>Our Internal Time (GMT+5):</strong> $internalTime</li>
        </ul>

        <div style='background-color: #f4f4f5; padding: 15px; border-radius: 6px; margin: 20px 0;'>
            <strong>Project / Agenda notes:</strong><br/>
            " . nl2br(htmlspecialchars($project)) . "
        </div>

        <p>We will be connecting over Google Meet. You will receive a formal calendar invitation containing the meeting link shortly.</p>
        <p>If you need to reschedule or cancel, please reply directly to this email.</p>
        
        <br/>
        <p style='margin-bottom: 0;'>Best regards,</p>
        <p style='margin-top: 5px; font-weight: bold; color: #fa6220;'>The Esseal Team</p>
        <p style='font-size: 12px; color: #a1a1aa;'>sales@esseal.co.uk | www.esseal.co.uk</p>
    </div>
</body>
</html>
";

// Dispatch the email
$mailSent = mail($to, $subject, $email_body, $headers);

// Return JSON response back to the JavaScript
if ($mailSent) {
    echo json_encode(['status' => 'success', 'message' => 'Booking confirmation sent.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to send confirmation email. Check server configuration.']);
}
?>