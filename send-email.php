<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Honeypot Validation (Bot Prevention)
    if (!empty($_POST['honeypot'])) {
        exit("Bot detected."); 
    }

    // 2. Sanitize Inputs
    $firstName = filter_var($_POST['firstName'], FILTER_SANITIZE_STRING);
    $lastName  = filter_var($_POST['lastName'], FILTER_SANITIZE_STRING);
    $workEmail = filter_var($_POST['workEmail'], FILTER_SANITIZE_EMAIL);
    $company   = filter_var($_POST['company'], FILTER_SANITIZE_STRING);
    $interest  = filter_var($_POST['interest'], FILTER_SANITIZE_STRING);
    $details   = filter_var($_POST['details'], FILTER_SANITIZE_STRING);

    // 3. Email Configuration
    $to = "talha_qureshi@esseal.net";
    $from = "contact-form@esseal.net";
    $subject = "New Inquiry: $interest from $company";

    $message = "You have received a new project inquiry.\n\n";
    $message .= "Name: $firstName $lastName\n";
    $message .= "Email: $workEmail\n";
    $message .= "Company: $company\n";
    $message .= "Service: $interest\n\n";
    $message .= "Details:\n$details\n";

    $headers = "From: $from\r\n";
    $headers .= "Reply-To: $workEmail\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 4. Send the Email
    if (mail($to, $subject, $message, $headers)) {
        // Success redirect (you can create a success.html page)
        header("Location: /contact.html?status=success");
    } else {
        // Error redirect
        header("Location: /contact.html?status=error");
    }
} else {
    header("Location: /contact.html");
}
?>