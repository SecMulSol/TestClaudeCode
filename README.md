# Surveillance Mobile - Landing Page

Landing page professionnelle pour la location de systèmes de surveillance mobile (alarmes et vidéosurveillance).

## Description

Cette landing page présente des solutions de surveillance mobile pour différentes applications :
- Surveillance de chantiers
- Surveillance d'événements
- Surveillance de zones temporaires
- Surveillance ponctuelle

## Technologies Utilisées

- **HTML5** - Structure de la page
- **TailwindCSS** - Framework CSS pour le design responsive
- **CSS3** - Styles personnalisés et animations
- **JavaScript (Vanilla)** - Interactions et animations dynamiques
- **PHP 8.2+** - Traitement du formulaire de contact et envoi d'emails

## Fonctionnalités

### Interface Utilisateur
- Design moderne et responsive (mobile, tablette, desktop)
- Navigation fixe avec effet de scroll
- Menu mobile hamburger
- Animations au scroll (Intersection Observer)
- Bouton "retour en haut" dynamique

### Sections
1. **Hero Section** - Présentation principale avec appel à l'action
2. **Services** - Trois services principaux (Vidéosurveillance, Alarmes, Solutions complètes)
3. **Applications** - Quatre cas d'usage principaux
4. **Avantages** - Six avantages clés
5. **Statistiques** - Compteurs animés
6. **Contact** - Formulaire de demande de devis
7. **Footer** - Informations de contact et liens

### Interactions JavaScript
- Menu mobile responsive
- Smooth scroll pour la navigation
- Animations au défilement
- Compteurs animés pour les statistiques
- Gestion du formulaire de contact avec validation
- Formatage automatique du numéro de téléphone
- Effets de hover sur les cartes

### Animations CSS
- Fade in
- Slide in (gauche/droite)
- Float
- Pulse
- Spin
- Effets de glow sur les cartes

## Structure des Fichiers

```
/
├── index.html      # Page HTML principale
├── styles.css      # Styles CSS personnalisés
├── script.js       # Scripts JavaScript
├── contact.php     # Script PHP pour traiter le formulaire
├── config.php      # Configuration PHP (emails, sécurité)
├── .htaccess       # Configuration Apache (sécurité, performance)
├── logs/           # Dossier pour les logs (à créer)
└── README.md       # Documentation
```

## Installation et Utilisation

### Déploiement sur Hostinger (Production)

1. **Uploadez tous les fichiers** via FTP ou le gestionnaire de fichiers Hostinger :
   ```
   index.html
   styles.css
   script.js
   contact.php
   config.php
   .htaccess
   ```

2. **Configurez `config.php`** :
   - Ouvrez `config.php` dans l'éditeur
   - Modifiez `CONTACT_EMAIL` avec votre vraie adresse email
   - Modifiez `SMTP_FROM_EMAIL` avec une adresse email de votre domaine
   - Modifiez `ALLOWED_ORIGINS` avec votre nom de domaine
   - Changez `DEBUG_MODE` à `false` pour la production

3. **Créez le dossier logs** :
   ```bash
   mkdir logs
   chmod 755 logs
   ```

4. **Créez l'adresse email d'envoi** dans le panneau Hostinger

5. **Testez le formulaire** et vérifiez la réception des emails

### Test en local (Développement)

```bash
# Avec PHP (nécessaire pour tester le formulaire)
php -S localhost:8000

# Puis ouvrez http://localhost:8000 dans votre navigateur
```

**Note** : Pour tester l'envoi d'emails en local, vous devrez configurer un serveur SMTP ou utiliser un service comme Mailhog.

## Personnalisation

### Couleurs
Les couleurs principales sont définies dans la configuration TailwindCSS dans `index.html` :
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#1e40af',    // Bleu principal
                secondary: '#0ea5e9',  // Bleu secondaire
                accent: '#f59e0b',     // Orange/Jaune accent
            }
        }
    }
}
```

### Contenu
- Modifiez le contenu HTML dans `index.html`
- Ajustez les textes, images et liens selon vos besoins

### Formulaire de contact
Le formulaire est **entièrement fonctionnel** avec PHP pour l'envoi d'emails.

#### Configuration requise (Hostinger)

1. **Configurez vos emails dans `config.php`** :
```php
// Modifiez ces valeurs avec vos vraies informations
define('CONTACT_EMAIL', 'votre-email@domaine.com');  // Email qui reçoit les demandes
define('SMTP_FROM_EMAIL', 'noreply@votredomaine.com'); // Email d'envoi (doit être du même domaine)
define('CONTACT_PHONE', '+33 1 23 45 67 89');
```

2. **Créez l'adresse email d'envoi** :
   - Connectez-vous au panneau Hostinger
   - Allez dans "Emails"
   - Créez l'adresse `noreply@votredomaine.com` (ou celle que vous avez configurée)

3. **Créez le dossier logs** :
```bash
mkdir logs
chmod 755 logs
```

4. **Testez le formulaire** :
   - Remplissez et soumettez le formulaire
   - Vérifiez votre boîte email (et le dossier spam)
   - Vérifiez les logs : `logs/contact-submissions.log`

#### Fonctionnalités de sécurité

- ✅ **Rate Limiting** : Max 3 soumissions par heure par IP
- ✅ **Honeypot** : Champ caché pour bloquer les bots
- ✅ **Validation côté client et serveur**
- ✅ **Protection CSRF** via vérification d'origine
- ✅ **Sanitisation des données**
- ✅ **Protection XSS et injections SQL**
- ✅ **Email de confirmation automatique au client**

#### Personnalisation des emails

Les emails HTML sont dans `contact.php` :
- Lignes 135-200 : Email pour vous (avec toutes les infos)
- Lignes 263-310 : Email de confirmation pour le client

## Responsive Design

La page est entièrement responsive avec des breakpoints :
- Mobile : < 768px
- Tablette : 768px - 1024px
- Desktop : > 1024px

## Optimisations

- Smooth scroll natif CSS
- Intersection Observer pour les animations au scroll
- Debounce des événements scroll
- Lazy loading prêt pour les images
- Compression des animations avec CSS transforms
- Performance optimisée avec requestAnimationFrame

## Compatibilité Navigateurs

- Chrome (dernières versions)
- Firefox (dernières versions)
- Safari (dernières versions)
- Edge (dernières versions)

## Dépannage

### Le formulaire ne s'envoie pas

1. **Vérifiez la configuration PHP** :
   - `config.php` : Les emails sont-ils corrects ?
   - `SMTP_FROM_EMAIL` doit être une adresse de votre domaine
   - L'adresse email d'envoi existe-t-elle dans Hostinger ?

2. **Vérifiez les erreurs** :
   - Activez `DEBUG_MODE` dans `config.php` temporairement
   - Consultez les logs : `logs/contact-submissions.log`
   - Vérifiez les logs d'erreur PHP dans le panneau Hostinger

3. **Vérifiez les permissions** :
   ```bash
   chmod 644 contact.php
   chmod 640 config.php
   chmod 755 logs/
   ```

4. **Problèmes .htaccess** :
   - Si vous avez une erreur 500, commentez progressivement les sections du .htaccess
   - Certains hébergeurs ont des restrictions sur certaines directives

5. **Emails non reçus** :
   - Vérifiez le dossier spam
   - Configurez SPF et DKIM dans votre DNS (panneau Hostinger)
   - Testez avec `mail()` PHP simple d'abord

### Erreur "Configuration non complète"

Modifiez les valeurs par défaut dans `config.php` :
- `votre-email@domaine.com` → votre vraie adresse
- `noreply@votredomaine.com` → adresse de votre domaine

### Rate limiting trop restrictif

Modifiez dans `config.php` :
```php
define('MAX_SUBMISSIONS_PER_HOUR', 5); // Augmentez la limite
```

## Sécurité en Production

**Checklist avant mise en ligne** :

- [ ] `DEBUG_MODE = false` dans `config.php`
- [ ] Emails configurés avec vos vraies adresses
- [ ] `.htaccess` activé et testé
- [ ] Certificat SSL installé (décommentez redirection HTTPS dans .htaccess)
- [ ] Permissions fichiers correctes (644 pour PHP, 640 pour config.php)
- [ ] Dossier `logs/` créé avec permissions 755
- [ ] SPF et DKIM configurés dans le DNS
- [ ] Testez le formulaire plusieurs fois

## Améliorations Futures

- [ ] Ajouter un carrousel de témoignages clients
- [ ] Intégration avec un CMS
- [ ] Ajouter une galerie de projets réalisés
- [ ] Système de réservation en ligne
- [ ] Chat en direct
- [ ] Version multilingue
- [ ] Mode sombre
- [ ] PWA (Progressive Web App)
- [ ] Intégration Google Analytics
- [ ] Captcha pour le formulaire

## Support

Pour toute question ou support, contactez :
- Email : contact@surveillancemobile.fr
- Téléphone : +33 1 23 45 67 89

## Licence

Tous droits réservés © 2025 SurveillanceMobile

---

Développé avec ❤️ pour des solutions de surveillance professionnelles
