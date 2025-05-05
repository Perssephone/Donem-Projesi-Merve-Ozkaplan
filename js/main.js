// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('header nav');
    let overlay = document.querySelector('.overlay');
    const body = document.body;

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Create overlay if it doesn't exist
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.className = 'overlay';
            document.body.appendChild(newOverlay);
            
            // Update overlay reference
            overlay = document.querySelector('.overlay');
            
            // Add event listener to new overlay
            overlay.addEventListener('click', closeMenu);
        }
        
        if (hamburger.classList.contains('active')) {
            overlay.classList.add('active');
            body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        } else {
            overlay.classList.remove('active');
            body.style.overflow = ''; // Re-enable scrolling
        }
    });

    // Close menu when clicking on a menu item
    const navLinks = document.querySelectorAll('header nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', closeMenu);
    }

    // Function to close the mobile menu
    function closeMenu() {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        if (overlay) {
            overlay.classList.remove('active');
        }
        body.style.overflow = ''; // Re-enable scrolling
    }
}); 