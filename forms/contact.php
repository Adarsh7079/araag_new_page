<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("HTTP/1.1 403 Forbidden");
    echo "Direct access forbidden.";
    exit;
}

// Dynamically grab the recipient email from your hidden form field
$receiving_email = isset($_POST['to_email']) ? filter_var(trim($_POST['to_email']), FILTER_SANITIZE_EMAIL) : 'info.araag@gmail.com';

$name    = isset($_POST['name']) ? strip_tags(trim($_POST['name'])) : '';
$email   = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$message = isset($_POST['message']) ? htmlspecialchars(trim($_POST['message'])) : '';

if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo "Please fill in all fields correctly.";
    exit;
}

$subject = "New Contact Form Message from " . $name;
$body    = "You have received a new message from your website contact form.\n\n"
         . "Name: $name\n"
         . "Email: $email\n\n"
         . "Message:\n$message\n";

$host    = isset($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : 'localhost';
$headers = "From: Araag Inc <no-reply@$host>\r\n"
         . "Reply-To: $email\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($receiving_email, $subject, $body, $headers)) {
    http_response_code(200);
    echo "OK"; 
} else {
    http_response_code(500);
    echo "Server error. Please try again later.";
}
?>