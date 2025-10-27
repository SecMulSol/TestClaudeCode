<?php
/**
 * Formulaire de Contact - Surveillance Mobile
 * Script PHP pour traiter les demandes de devis
 * PHP 8.2+
 */

// Configuration des en-têtes pour JSON
header('Content-Type: application/json; charset=utf-8');

// Démarrer la session pour le rate limiting
session_start();

// Charger la configuration
require_once 'config.php';

// Fonction pour nettoyer les entrées
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Fonction pour valider l'email
function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Fonction pour valider le téléphone français
function validate_phone($phone) {
    // Accepte les formats: +33 X XX XX XX XX, 0X XX XX XX XX, etc.
    $phone = preg_replace('/[^0-9+]/', '', $phone);
    return preg_match('/^(\+33|0033|0)[1-9][0-9]{8}$/', $phone);
}

// Rate Limiting: Limiter à 3 soumissions par heure par IP
function check_rate_limit() {
    $ip = $_SERVER['REMOTE_ADDR'];
    $current_time = time();
    $time_window = 3600; // 1 heure
    $max_attempts = 3;

    if (!isset($_SESSION['form_submissions'])) {
        $_SESSION['form_submissions'] = [];
    }

    // Nettoyer les anciennes entrées
    $_SESSION['form_submissions'] = array_filter(
        $_SESSION['form_submissions'],
        fn($timestamp) => ($current_time - $timestamp) < $time_window
    );

    // Vérifier le nombre de soumissions
    $submission_count = count($_SESSION['form_submissions']);

    if ($submission_count >= $max_attempts) {
        return false;
    }

    // Ajouter la nouvelle soumission
    $_SESSION['form_submissions'][] = $current_time;
    return true;
}

// Protection CSRF simple via vérification de l'origine
function check_origin() {
    $allowed_origins = ALLOWED_ORIGINS;

    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $origin = $_SERVER['HTTP_ORIGIN'];
        if (!in_array($origin, $allowed_origins)) {
            // En développement local, accepter localhost
            if (strpos($origin, 'localhost') === false && strpos($origin, '127.0.0.1') === false) {
                return false;
            }
        }
    }
    return true;
}

// Honeypot: champ caché pour attraper les bots
function check_honeypot($honeypot_value) {
    return empty($honeypot_value);
}

// Réponse JSON
function send_response($success, $message, $data = []) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// Vérifier que c'est une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_response(false, 'Méthode non autorisée');
}

// Vérifier le rate limiting
if (!check_rate_limit()) {
    send_response(false, 'Trop de tentatives. Veuillez réessayer dans une heure.');
}

// Vérifier l'origine
if (!check_origin()) {
    send_response(false, 'Origine non autorisée');
}

// Récupérer les données du formulaire
$nom = isset($_POST['nom']) ? sanitize_input($_POST['nom']) : '';
$entreprise = isset($_POST['entreprise']) ? sanitize_input($_POST['entreprise']) : '';
$email = isset($_POST['email']) ? sanitize_input($_POST['email']) : '';
$telephone = isset($_POST['telephone']) ? sanitize_input($_POST['telephone']) : '';
$type_projet = isset($_POST['type_projet']) ? sanitize_input($_POST['type_projet']) : '';
$date_debut = isset($_POST['date_debut']) ? sanitize_input($_POST['date_debut']) : '';
$duree = isset($_POST['duree']) ? sanitize_input($_POST['duree']) : '';
$message = isset($_POST['message']) ? sanitize_input($_POST['message']) : '';
$honeypot = isset($_POST['website']) ? $_POST['website'] : '';

// Vérifier le honeypot
if (!check_honeypot($honeypot)) {
    send_response(false, 'Soumission invalide');
}

// Validation des champs obligatoires
$errors = [];

if (empty($nom) || strlen($nom) < 2) {
    $errors[] = 'Le nom est requis (minimum 2 caractères)';
}

if (empty($email) || !validate_email($email)) {
    $errors[] = 'Email invalide';
}

if (empty($telephone) || !validate_phone($telephone)) {
    $errors[] = 'Numéro de téléphone invalide';
}

if (empty($type_projet)) {
    $errors[] = 'Le type de projet est requis';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Le message est requis (minimum 10 caractères)';
}

// Si des erreurs existent, les retourner
if (!empty($errors)) {
    send_response(false, implode(', ', $errors));
}

// Préparer l'email
$to = CONTACT_EMAIL;
$subject = "Nouvelle demande de devis - Surveillance Mobile";

// Corps de l'email en HTML
$email_body = "
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1e40af; }
        .value { margin-left: 10px; }
        .footer { background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>📧 Nouvelle Demande de Devis</h2>
            <p>Surveillance Mobile - " . date('d/m/Y à H:i') . "</p>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>👤 Nom complet:</span>
                <span class='value'>" . htmlspecialchars($nom) . "</span>
            </div>

            " . (!empty($entreprise) ? "
            <div class='field'>
                <span class='label'>🏢 Entreprise:</span>
                <span class='value'>" . htmlspecialchars($entreprise) . "</span>
            </div>
            " : "") . "

            <div class='field'>
                <span class='label'>📧 Email:</span>
                <span class='value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></span>
            </div>

            <div class='field'>
                <span class='label'>📱 Téléphone:</span>
                <span class='value'><a href='tel:" . preg_replace('/[^0-9+]/', '', $telephone) . "'>" . htmlspecialchars($telephone) . "</a></span>
            </div>

            <div class='field'>
                <span class='label'>🎯 Type de projet:</span>
                <span class='value'>" . htmlspecialchars($type_projet) . "</span>
            </div>

            " . (!empty($date_debut) ? "
            <div class='field'>
                <span class='label'>📅 Date de début:</span>
                <span class='value'>" . date('d/m/Y', strtotime($date_debut)) . "</span>
            </div>
            " : "") . "

            " . (!empty($duree) ? "
            <div class='field'>
                <span class='label'>⏱️ Durée estimée:</span>
                <span class='value'>" . htmlspecialchars($duree) . "</span>
            </div>
            " : "") . "

            <div class='field'>
                <span class='label'>💬 Message:</span>
                <div style='margin-top: 10px; padding: 15px; background: white; border-radius: 4px; border-left: 4px solid #1e40af;'>
                    " . nl2br(htmlspecialchars($message)) . "
                </div>
            </div>

            <div class='field' style='margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;'>
                <span class='label'>🌐 IP:</span>
                <span class='value'>" . $_SERVER['REMOTE_ADDR'] . "</span>
            </div>

            <div class='field'>
                <span class='label'>🕐 Date de soumission:</span>
                <span class='value'>" . date('d/m/Y à H:i:s') . "</span>
            </div>
        </div>
        <div class='footer'>
            <p>Cet email a été envoyé automatiquement depuis le formulaire de contact de Surveillance Mobile.</p>
            <p>Merci de répondre au client dans les plus brefs délais.</p>
        </div>
    </div>
</body>
</html>
";

// Version texte pour les clients email ne supportant pas HTML
$email_body_text = "
Nouvelle Demande de Devis - Surveillance Mobile
Date: " . date('d/m/Y à H:i') . "

Nom complet: $nom
" . (!empty($entreprise) ? "Entreprise: $entreprise\n" : "") . "
Email: $email
Téléphone: $telephone
Type de projet: $type_projet
" . (!empty($date_debut) ? "Date de début: " . date('d/m/Y', strtotime($date_debut)) . "\n" : "") . "
" . (!empty($duree) ? "Durée estimée: $duree\n" : "") . "

Message:
$message

---
IP: " . $_SERVER['REMOTE_ADDR'] . "
Date de soumission: " . date('d/m/Y à H:i:s') . "
";

// En-têtes de l'email
$headers = [
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/html; charset=UTF-8',
    'From' => SMTP_FROM_EMAIL . ' <' . SMTP_FROM_EMAIL . '>',
    'Reply-To' => $email . ' <' . $email . '>',
    'X-Mailer' => 'PHP/' . phpversion(),
    'X-Priority' => '1',
    'Importance' => 'High'
];

// Convertir les en-têtes en chaîne
$headers_string = '';
foreach ($headers as $key => $value) {
    $headers_string .= "$key: $value\r\n";
}

// Envoyer l'email
$mail_sent = mail($to, $subject, $email_body, $headers_string);

if ($mail_sent) {
    // Email de confirmation au client
    $client_subject = "Confirmation de réception - Surveillance Mobile";
    $client_body = "
<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .footer { background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center; }
        .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🎉 Demande Reçue !</h1>
        </div>
        <div class='content'>
            <p>Bonjour <strong>" . htmlspecialchars($nom) . "</strong>,</p>

            <p>Nous avons bien reçu votre demande de devis pour votre projet de <strong>" . htmlspecialchars($type_projet) . "</strong>.</p>

            <p>Notre équipe va étudier votre demande et vous recontactera dans les <strong>24 heures</strong> pour vous proposer une solution adaptée à vos besoins.</p>

            <div style='background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af; margin: 20px 0;'>
                <h3 style='color: #1e40af; margin-top: 0;'>Récapitulatif de votre demande :</h3>
                <p><strong>Type de projet :</strong> " . htmlspecialchars($type_projet) . "</p>
                " . (!empty($date_debut) ? "<p><strong>Date de début :</strong> " . date('d/m/Y', strtotime($date_debut)) . "</p>" : "") . "
                " . (!empty($duree) ? "<p><strong>Durée :</strong> " . htmlspecialchars($duree) . "</p>" : "") . "
            </div>

            <p>Si vous avez des questions urgentes, n'hésitez pas à nous contacter directement :</p>
            <ul>
                <li>📞 Téléphone : " . CONTACT_PHONE . "</li>
                <li>📧 Email : " . CONTACT_EMAIL . "</li>
            </ul>

            <p style='margin-top: 30px;'>Merci de votre confiance !</p>
            <p><strong>L'équipe Surveillance Mobile</strong></p>
        </div>
        <div class='footer'>
            <p>&copy; 2025 Surveillance Mobile - Tous droits réservés</p>
            <p style='margin-top: 10px; font-size: 11px;'>Cet email a été envoyé en réponse à votre demande de devis.</p>
        </div>
    </div>
</body>
</html>
    ";

    $client_headers = [
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/html; charset=UTF-8',
        'From' => SMTP_FROM_NAME . ' <' . SMTP_FROM_EMAIL . '>',
        'Reply-To' => CONTACT_EMAIL,
        'X-Mailer' => 'PHP/' . phpversion()
    ];

    $client_headers_string = '';
    foreach ($client_headers as $key => $value) {
        $client_headers_string .= "$key: $value\r\n";
    }

    // Envoyer l'email de confirmation au client
    mail($email, $client_subject, $client_body, $client_headers_string);

    // Log de succès (optionnel)
    error_log("Contact form submitted successfully - Email: $email - IP: " . $_SERVER['REMOTE_ADDR']);

    send_response(true, 'Votre demande a été envoyée avec succès ! Nous vous recontacterons dans les 24 heures.');
} else {
    // Log de l'erreur
    error_log("Contact form email failed - Email: $email - IP: " . $_SERVER['REMOTE_ADDR']);

    send_response(false, 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement.');
}
