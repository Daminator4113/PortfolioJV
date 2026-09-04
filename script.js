// functions
function removeClassAfterDelay(element, className, delay) {
    // Vérifie si l'élément a la classe
    if (element.classList.contains(className)) {
        // Enlève la classe après le délai spécifié
        setTimeout(() => {
            element.classList.remove(className);
            //console.log(`Classe "${className}" retirée de "${element}".`);
        }, delay);
    }
}

// Check si la page est lu sur un petit écran comme un mobile
const mobile = window.matchMedia('(max-width: 768px)');

// script.js
document.addEventListener('DOMContentLoaded', () => {
    //------------------------------------------------------//
    //   ANIMATION + APPARITION DES SECTIONS LORS DU SCROLL
    //------------------------------------------------------//
    const sections = document.querySelectorAll('.section');

    // Fonction pour rendre une section visible
    const makeVisible = (section) => {
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
    }

    // Initialisation : les autres sections démarrent invisibles
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
    });

    // Assurez que les sections visibles au chargement soient affichées
    const section_observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const section = entry.target;
                makeVisible(section);
                // Stop observing une fois que la section a été animée
                section_observer.unobserve(section);
            }
        });
    });
    
    // Observe chaque section
    sections.forEach((section) => section_observer.observe(section))

    // On détecte le scroll
    document.addEventListener('scroll', () => {
        const triggerHeight = window.innerHeight / 1.3;

        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;

            if (top < triggerHeight) {
                makeVisible(section)
            }
        });
    });



    //------------------------------------------------------//
    //   RESIZE MANUEL DES IMAGE DANS L'HTML
    //------------------------------------------------------//
    // Sélectionne toutes les images avec l'attribut data-width
    const manualResizeImages = document.querySelectorAll('.manual-resize');

    // Applique la largeur personnalisée si l'attribut est défini    
    const resizeImages = () => {
        manualResizeImages.forEach(img => {
            const width = img.getAttribute('data-width');
            if (width) {
                img.style.width = mobile.matches
                    // Si Mobile détecté, on overwright la taille des images par une valeur par defaut
                    ? (img.classList.contains('pp') ? '' : '75%') // On exclue la pp dans le redimensionnement car elle est set dans le css
                    // Sinon, on définis la taille selon le data-width
                    : `${width}%`;
            }
        });
    };

    // Au chargement
    resizeImages();
    // Lors d'un changement de taille d'écran
    mobile.addEventListener('change', resizeImages);



    //------------------------------------------------------//
    //   VISIONNEUSE D'IMAGE
    //------------------------------------------------------//
    const images = document.querySelectorAll('.img');
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.innerHTML = `
        <span class="close">&times;</span>
        <span class="nav prev">&lsaquo;</span>
        <img src="" alt="Image agrandie">
        <span class="nav next">&rsaquo;</span>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close');
    const prevBtn = lightbox.querySelector('.prev');
    const nextBtn = lightbox.querySelector('.next');
    let currentImages = [];
    let currentIndex = 0;

    const openLightbox = (img) => {
        currentImages = Array.from(document.querySelectorAll('.img')); // Toutes les images avec la class .img du portfolio
        currentIndex = currentImages.indexOf(img);
        lightboxImg.src = img.dataset.full ? img.dataset.full : img.src; // Utilise l'URL de la version haute qualité si possible
        lightbox.style.display = 'flex';
    };

    const navigate = (direction) => {
        currentIndex = (currentIndex + direction + currentImages.length) % currentImages.length;
        const nextImage = currentImages[currentIndex];
        lightboxImg.src = nextImage.dataset.full ? nextImage.dataset.full : nextImage.src; // Charge la version haute qualité si possible
    };

    const closeLightbox = () => {
        lightbox.style.display = 'none';
    };

    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(img));
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });



    //------------------------------------------------------//
    //   ANIM MOUVEMENT DES IMAGES LORS DE L'APPARITION
    //------------------------------------------------------//
    const th_images = document.querySelectorAll(".image");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;

                // Ajoute la classe correspondante (left ou right)
                if (img.classList.contains("left")) {
                    img.classList.add("animate-left");
                } else if (img.classList.contains("right")) {
                    img.classList.add("animate-right");
                } else if (img.classList.contains("bottom")) {
                    img.classList.add("animate-bottom");
                }

                // Après 1s on enlève la class .image pour pouvoir appliquer des transform
                //removeClassAfterDelay(img, 'image', 1000);
                // Après 1s on enlève les class animate pour pouvoir appliquer des transform ET pouvoir rejouer les animations
                removeClassAfterDelay(img, 'animate-left', 1000);
                removeClassAfterDelay(img, 'animate-right', 1000);
                removeClassAfterDelay(img, 'animate-bottom', 1000);

                // Stop observing une fois que l'image a été animée
                //observer.unobserve(img);
            }
        });
    });

    // Observe chaque image
    th_images.forEach((img) => observer.observe(img));



    //------------------------------------------------------//
    //   EFFET DE PARALLAX
    //------------------------------------------------------//
    // Fonction pour appliquer l'effet de parallaxe
    const applyParallax = (section, elements) => {
        section.addEventListener('mousemove', (e) => {
            const { width, height } = section.getBoundingClientRect();
            const { clientX, clientY } = e;

            elements.forEach(({ element, multiplierX, multiplierY, OffsetX, OffsetY }) => {
                const xOffset = OffsetX + ((clientX / width) - 0.5) * multiplierX/20;
                const yOffset = OffsetY + ((clientY / height) - 0.5) * multiplierY/10;

                element.style.transform = `translate(${xOffset}%, ${yOffset}%)`;
            });
        });
    };

    // Parallaxe pour #profil
    applyParallax(
        document.querySelector('#profil'),
        [
            { element: document.querySelector('.background-video'), multiplierX: 20, multiplierY: 20, OffsetX: 0, OffsetY: 0 },
            { element: document.querySelector('.profile-container'), multiplierX: -10, multiplierY: -10, OffsetX: 0, OffsetY: 0 }
        ]
    );

    // Parallaxe pour #projets
    applyParallax(
        document.querySelector('#projects'),
        [
            { element: document.querySelector('.background-image'), multiplierX: 20, multiplierY: 20, OffsetX: 40, OffsetY: -10 },
            { element: document.querySelector('.top-title'), multiplierX: -10, multiplierY: -10, OffsetX: 0, OffsetY: 0 }
        ]
    );



    //------------------------------------------------------//
    //   ANIM UN SCROLL QUAND ON CLIQUE SUR UN BOUTON DU HEADER
    //------------------------------------------------------//
    // Sélectionne tous les liens dans le header et les liens avec la class scroll
    const navLinks = document.querySelectorAll('.scroll a, a.scroll');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Empêche le comportement par défaut du lien

            // Cible la section correspondante
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            // Scrolle vers la section de manière fluide
            if (targetSection) {
                const isNavLink = link.closest('header nav'); // Vérifie si c'est un lien du header
                const isDropdownLink = link.closest('.dropdown'); // Vérifie si c'est un lien du dropdown
                
                if (isNavLink && isDropdownLink === null) {
                    // Défilement avec position en haut pour les boutons du header
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // Défilement centré pour d'autres boutons
                    const offset = window.innerHeight / 6; // Décalage pour centrer
                    const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });



    //------------------------------------------------------//
    //   SECTION DETAILS DEPLIABLE
    //------------------------------------------------------//
    const toggleButtons = document.querySelectorAll('.toggle-details');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const details = button.nextElementSibling; // Section des détails à ouvrir/fermer
            const isOpen = details.classList.contains('open'); // Vérifie si la section est ouverte

            if (isOpen) {
                // Ferme la section
                details.style.height = `${details.scrollHeight}px`; // Définit une hauteur fixe pour activer la transition
                setTimeout(() => (details.style.height = '0'), 1); // Passe à 0 après un cycle pour la fermeture
            } else {
                // Ouvre la section
                details.style.height = `${details.scrollHeight}px`; // Définit la hauteur nécessaire pour afficher le contenu
                setTimeout(() => (details.style.height = 'auto'), 500); // Fixe à "auto" après l'animation pour permettre un ajustement dynamique
            }

            // Ajoute ou retire la classe "open"
            details.classList.toggle('open');
        });
    });



    //------------------------------------------------------//
    //   AJOUTE DE L'ESPACE ENTRE LES PROJETS
    //------------------------------------------------------//
    // Sélectionne uniquement les éléments ".project" dans la section "#projects"
    const project_sections = ['#gamejam', '#mes-jeux']; // Liste des sections à traiter
    const offset = 100; // Taille de l'espace entre chaque projet

    // Fonction réutilisable pour appliquer le style aux projets d'une section
    const styleProjects = (sectionSelector) => {
        const projects = document.querySelectorAll(`${sectionSelector} .project`);

        projects.forEach((project, index) => {
            const previous = projects[index - 1];
            const next = projects[index + 1];

            if (previous && previous.classList.contains('project') &&
                next && next.classList.contains('project')) {
                // Si entouré par deux autres projets
                project.style.margin = `${offset}px 0`;
            } else if (!previous && !next) {
            } else if (!previous) {
                // Si c'est le premier projet
                project.style.margin = `20px 0 ${offset}px 0`;
            } else if (!next) {
                // Si c'est le dernier projet
                project.style.margin = `${offset}px 0 20px 0`;
            }
        });
    };

    // Applique le style à chaque section spécifiée
    project_sections.forEach(section => styleProjects(section));



    //------------------------------------------------------//
    //   INVERSE CHAQUE PROJET EN LIGNE DANS MES JEUX
    //------------------------------------------------------//
    const subSections = document.querySelectorAll('.section .container .sub-section');

    const changeFlexDirections = () => {
        subSections.forEach((sub_section) => {
            const projectIntros = sub_section.querySelectorAll('.project .project-intro');

            projectIntros.forEach((project_intro, project_index) => {
                const flexDirection = mobile.matches
                    // Si Mobile détecté, on met tout en column
                    ? 'column'
                    // Sinon, on alterne entre "row" et "row-reverse"
                    : (project_index % 2 === 0 ? 'row' : 'row-reverse');

                project_intro.style.display = 'flex';
                project_intro.style.flexDirection = flexDirection;
            });
        });
    };

    // Au chargement
    changeFlexDirections();

    // Lors d'un changement de taille d'écran
    mobile.addEventListener('change', changeFlexDirections);



    //------------------------------------------------------//
    //   MENUS DÉROULANTS DU TOP HEADER
    //------------------------------------------------------//
    const toggles = document.querySelectorAll('.dropdown-toggle');
    const dropdowns = document.querySelectorAll('.dropdown');

    // Fonction pour fermer tous les menus déroulants
    const closeAllDropdowns = () => {
        dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
        toggles.forEach(toggle => toggle.classList.remove('open'));
    };

    toggles.forEach(toggle => {
        toggle.addEventListener('click', (event) => {
            const dropdown = toggle.nextElementSibling;

            // Si le menu est déjà ouvert, on le ferme
            if (dropdown.classList.contains('open')) {
                dropdown.classList.remove('open');
                toggle.classList.remove('open');
            } else {
                // Ferme tous les autres menus déroulants
                closeAllDropdowns();

                // Ouvre le menu associé
                dropdown.classList.add('open');
                toggle.classList.add('open');
            }

            // Empêche le clic sur le bouton de fermer immédiatement le menu
            event.stopPropagation();
        });
    });

    // Empêche la fermeture si on clique à l'intérieur d'un dropdown
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });

    // Ferme les menus déroulants si on clique ailleurs
    document.addEventListener('click', () => {
        closeAllDropdowns();
    });



    //------------------------------------------------------//
    //   RESIZE DYNAMIQUEMENT LA PARTIE PROFIL
    //   POUR QUE LE TEXTE RENTRE S'IL EST TROP GRAND
    //------------------------------------------------------//
    const dynamicSection = document.querySelector('#profil');
    const absoluteDiv = document.querySelector('.profile-container');

    const adjustSectionHeight = () => {
        const contentHeight = absoluteDiv.offsetHeight;
        dynamicSection.style.height = `${contentHeight}px`;
    };

    // Ajuste la hauteur initialement
    adjustSectionHeight();

    // Réajuste si le contenu change (utile pour le texte dynamique)
    window.addEventListener('resize', adjustSectionHeight);

});
