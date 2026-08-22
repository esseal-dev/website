<?php
// Set headers to accept JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Accept only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit;
}

// Read JSON payload from JavaScript fetch
$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// Sanitize inputs
$name = filter_var($data['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$project = filter_var($data['project'] ?? '', FILTER_SANITIZE_STRING);
$clientTime = filter_var($data['clientTime'] ?? '', FILTER_SANITIZE_STRING);
$internalTime = filter_var($data['internalTime'] ?? '', FILTER_SANITIZE_STRING);
$startTimeIso = filter_var($data['startTimeIso'] ?? '', FILTER_SANITIZE_STRING);
$endTimeIso = filter_var($data['endTimeIso'] ?? '', FILTER_SANITIZE_STRING);

// Basic Validation
if (empty($email) || empty($clientTime)) {
    echo json_encode(['status' => 'error', 'message' => 'Required fields (email, date/time) are missing.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email address provided.']);
    exit;
}

// Calculate Start and End timestamps in UTC for .ics
try {
    if (!empty($startTimeIso)) {
        $startDt = new DateTime($startTimeIso);
    } else {
        $startDt = new DateTime();
    }
    if (!empty($endTimeIso)) {
        $endDt = new DateTime($endTimeIso);
    } else {
        $endDt = (clone $startDt)->modify('+30 minutes');
    }
} catch (Exception $e) {
    $startDt = new DateTime();
    $endDt = (clone $startDt)->modify('+30 minutes');
}

$startDt->setTimezone(new DateTimeZone('UTC'));
$endDt->setTimezone(new DateTimeZone('UTC'));

$startUtc = $startDt->format('Ymd\THis\Z');
$endUtc = $endDt->format('Ymd\THis\Z');
$nowUtc = gmdate('Ymd\THis\Z');
$uid = "booking-" . uniqid() . "@esseal.co.uk";

// Generate iCalendar (.ics) Content
$locationText = "A meeting link will be shared 1 hour prior to the call.";
$descriptionText = "Thank you for scheduling a discovery and technical consultation with Esseal's senior engineering team.\\n\\nNote: A meeting link will be shared 1 hour prior to the call.";

$icsContent  = "BEGIN:VCALENDAR\r\n";
$icsContent .= "VERSION:2.0\r\n";
$icsContent .= "PRODID:-//Esseal Ltd//Booking System//EN\r\n";
$icsContent .= "CALSCALE:GREGORIAN\r\n";
$icsContent .= "METHOD:REQUEST\r\n";
$icsContent .= "BEGIN:VEVENT\r\n";
$icsContent .= "UID:{$uid}\r\n";
$icsContent .= "DTSTAMP:{$nowUtc}\r\n";
$icsContent .= "DTSTART:{$startUtc}\r\n";
$icsContent .= "DTEND:{$endUtc}\r\n";
$icsContent .= "SUMMARY:Technical Consultation with Esseal\r\n";
$icsContent .= "DESCRIPTION:{$descriptionText}\r\n";
$icsContent .= "LOCATION:{$locationText}\r\n";
$icsContent .= "ORGANIZER;CN=\"Esseal Team\":mailto:inquiry@esseal.co.uk\r\n";
$icsContent .= "ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN={$email}:mailto:{$email}\r\n";
$icsContent .= "STATUS:CONFIRMED\r\n";
$icsContent .= "SEQUENCE:0\r\n";
$icsContent .= "END:VEVENT\r\n";
$icsContent .= "END:VCALENDAR\r\n";

// HTML Email Body
$displayName = !empty($name) ? htmlspecialchars($name) : 'there';
$projectNotesSection = !empty($project) ? "
        <div style='background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;'>
            <strong>Project / Agenda notes:</strong><br/>
            " . nl2br(htmlspecialchars($project)) . "
        </div>" : "";

$email_html = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Booking Confirmation</title>
</head>
<body style='font-family: \"Inter\", Arial, sans-serif; color: #000621; line-height: 1.6; padding: 20px; background-color: #f4f4f5;'>
    <div style='max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; background-color: #ffffff;'>
        
        <h2 style='color: #000621; margin-top: 0;'>Booking Confirmed, {$displayName}!</h2>
        <p>Thank you for scheduling a discovery and technical consultation with Esseal's senior engineering team.</p>
        
        <div style='border-left: 4px solid #fa6220; background-color: #f8fafc; padding: 15px 20px; margin: 20px 0; border-radius: 0 6px 6px 0;'>
            <h3 style='margin: 0 0 10px 0; color: #fa6220;'>Meeting Details</h3>
            <p style='margin: 5px 0;'><strong>Selected Date & Time:</strong> {$clientTime}</p>
            <p style='margin: 5px 0;'><strong>Duration:</strong> 30 Minutes</p>
            <p style='margin: 5px 0;'><strong>Location / Link:</strong> A meeting link will be shared 1 hour prior to the call.</p>
        </div>
        {$projectNotesSection}
        <p>A calendar event file (<code>invite.ics</code>) is attached to this email. Open it to add this call directly to your Google Calendar, Apple Calendar, or Outlook.</p>

        <p style='color: #64748b; font-size: 14px;'>If you need to reschedule or cancel, please reply directly to this email.</p>
        
        <hr style='border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;' />
        <p style='margin-bottom: 0;'>Best regards,</p>
        <p style='margin-top: 4px; font-weight: bold; color: #fa6220;'>The Esseal Team</p>
        <p style='font-size: 12px; color: #64748b; margin-top: 2px;'>inquiry@esseal.co.uk | <a href='https://www.esseal.co.uk' style='color: #fa6220; text-decoration: none;'>www.esseal.co.uk</a></p>
    </div>
</body>
</html>
";

// MIME Multipart Construction
$boundary = "----=_NextPart_" . md5(time());

$to = $email;
$subject = "Booking Confirmation: Strategy Call with Esseal";

$headers  = "From: Esseal <inquiry@esseal.co.uk>\r\n";
$headers .= "Reply-To: inquiry@esseal.co.uk\r\n";
$headers .= "Bcc: inquiry@esseal.co.uk\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

$body  = "--{$boundary}\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $email_html . "\r\n\r\n";

$body .= "--{$boundary}\r\n";
$body .= "Content-Type: text/calendar; method=REQUEST; name=\"invite.ics\"; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: base64\r\n";
$body .= "Content-Disposition: attachment; filename=\"invite.ics\"\r\n\r\n";
$body .= chunk_split(base64_encode($icsContent)) . "\r\n";
$body .= "--{$boundary}--";

// Dispatch Email
$mailSent = mail($to, $subject, $body, $headers);

if ($mailSent) {
    echo json_encode(['status' => 'success', 'message' => 'Booking confirmation email sent.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to send confirmation email. Check server email setup.']);
}
?>