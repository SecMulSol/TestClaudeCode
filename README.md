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
└── README.md       # Documentation
```

## Installation et Utilisation

### Ouvrir localement

1. Clonez le repository ou téléchargez les fichiers
2. Ouvrez `index.html` dans votre navigateur

### Via un serveur local

```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

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
Le formulaire est actuellement configuré en mode simulation. Pour l'intégrer avec un backend :

1. Décommentez le code fetch dans `script.js` (ligne 179-203)
2. Configurez votre endpoint API
3. Ajoutez la gestion côté serveur

Exemple d'intégration :
```javascript
fetch('/api/contact', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    // Gérer la réponse
})
```

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

## Améliorations Futures

- [ ] Ajouter un carrousel de témoignages clients
- [ ] Intégration avec un CMS
- [ ] Ajouter une galerie de projets réalisés
- [ ] Système de réservation en ligne
- [ ] Chat en direct
- [ ] Version multilingue
- [ ] Mode sombre
- [ ] PWA (Progressive Web App)

## Support

Pour toute question ou support, contactez :
- Email : contact@surveillancemobile.fr
- Téléphone : +33 1 23 45 67 89

## Licence

Tous droits réservés © 2025 SurveillanceMobile

---

Développé avec ❤️ pour des solutions de surveillance professionnelles
