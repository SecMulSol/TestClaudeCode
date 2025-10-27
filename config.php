<?php
/**
 * Configuration - Surveillance Mobile
 * Fichier de configuration pour le formulaire de contact
 *
 * IMPORTANT: Modifiez les valeurs ci-dessous avec vos informations réelles
 * Protégez ce fichier avec .htaccess pour empêcher l'accès direct
 */

// ================================
// CONFIGURATION EMAIL
// ================================

// Email qui recevra les demandes de devis
define('CONTACT_EMAIL', 'votre-email@domaine.com');

// Téléphone de contact (affiché dans l'email de confirmation au client)
define('CONTACT_PHONE', '+33 1 23 45 67 89');

// Email d'envoi (doit être un email valide de votre domaine chez Hostinger)
// Format recommandé: noreply@votredomaine.com
define('SMTP_FROM_EMAIL', 'noreply@votredomaine.com');

// Nom de l'expéditeur
define('SMTP_FROM_NAME', 'Surveillance Mobile');

// ================================
// CONFIGURATION SÉCURITÉ
// ================================

// Origines autorisées pour les requêtes (ajoutez votre domaine)
define('ALLOWED_ORIGINS', [
    'https://votredomaine.com',
    'https://www.votredomaine.com',
    'http://localhost:8000',      // Pour tests en local
    'http://localhost',            // Pour tests en local
    'http://127.0.0.1'             // Pour tests en local
]);

// ================================
// CONFIGURATION RATE LIMITING
// ================================

// Nombre maximum de soumissions autorisées par heure
define('MAX_SUBMISSIONS_PER_HOUR', 3);

// Durée de la fenêtre de rate limiting (en secondes)
define('RATE_LIMIT_WINDOW', 3600); // 1 heure

// ================================
// CONFIGURATION VALIDATION
// ================================

// Longueur minimale du nom
define('MIN_NAME_LENGTH', 2);

// Longueur minimale du message
define('MIN_MESSAGE_LENGTH', 10);

// Longueur maximale du message
define('MAX_MESSAGE_LENGTH', 5000);

// ================================
// CONFIGURATION LOGGING
// ================================

// Activer les logs détaillés (true/false)
define('ENABLE_LOGGING', true);

// Fichier de log pour les soumissions (relatif à la racine du site)
define('LOG_FILE', __DIR__ . '/logs/contact-submissions.log');

// ================================
// CONFIGURATION DÉVELOPPEMENT
// ================================

// Mode développement (affiche les erreurs détaillées)
// IMPORTANT: Mettre à false en production !
define('DEBUG_MODE', false);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

// ================================
// CONFIGURATION HOSTINGER
// ================================

/**
 * NOTES POUR HOSTINGER:
 *
 * 1. EMAIL D'ENVOI (SMTP_FROM_EMAIL):
 *    - DOIT être un email de votre domaine hébergé
 *    - Exemples: noreply@votredomaine.com, contact@votredomaine.com
 *    - Créez l'adresse email dans le panneau Hostinger si elle n'existe pas
 *
 * 2. FONCTION MAIL():
 *    - Hostinger supporte la fonction mail() PHP native
 *    - Pas besoin de configurer SMTP externe
 *    - Les emails sont envoyés automatiquement
 *
 * 3. LIMITE D'ENVOI:
 *    - Hostinger limite à environ 100-150 emails/heure par défaut
 *    - Parfait pour un formulaire de contact
 *
 * 4. SPF/DKIM:
 *    - Configurez SPF dans votre DNS pour améliorer la délivrabilité
 *    - Hostinger configure automatiquement DKIM
 *
 * 5. DOSSIER LOGS:
 *    - Créez le dossier 'logs' à la racine avec permissions 755
 *    - Le fichier de log sera créé automatiquement
 *
 * 6. PERMISSIONS FICHIERS:
 *    - config.php: 640 (lecture seule)
 *    - contact.php: 644
 *    - logs/: 755
 *
 * 7. TEST EMAIL:
 *    - Testez d'abord avec mail() simple pour vérifier la configuration
 *    - Vérifiez les dossiers spam si vous ne recevez pas les emails
 */

// ================================
// FONCTIONS UTILITAIRES
// ================================

/**
 * Logger un message dans le fichier de log
 */
function log_submission($message, $level = 'INFO') {
    if (!ENABLE_LOGGING) {
        return;
    }

    $log_dir = dirname(LOG_FILE);
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    $log_message = "[$timestamp] [$level] [IP: $ip] $message" . PHP_EOL;

    file_put_contents(LOG_FILE, $log_message, FILE_APPEND | LOCK_EX);
}

/**
 * Vérifier que la configuration est complète
 */
function check_configuration() {
    $errors = [];

    if (CONTACT_EMAIL === 'votre-email@domaine.com') {
        $errors[] = 'CONTACT_EMAIL doit être configuré dans config.php';
    }

    if (SMTP_FROM_EMAIL === 'noreply@votredomaine.com') {
        $errors[] = 'SMTP_FROM_EMAIL doit être configuré dans config.php';
    }

    if (!filter_var(CONTACT_EMAIL, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'CONTACT_EMAIL n\'est pas un email valide';
    }

    if (!filter_var(SMTP_FROM_EMAIL, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'SMTP_FROM_EMAIL n\'est pas un email valide';
    }

    return $errors;
}

// Vérifier la configuration au chargement (seulement en mode debug)
if (DEBUG_MODE) {
    $config_errors = check_configuration();
    if (!empty($config_errors)) {
        die('Erreurs de configuration: ' . implode(', ', $config_errors));
    }
}
