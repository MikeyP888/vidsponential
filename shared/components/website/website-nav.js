/**
 * Website Navigation Component
 * Shared navigation bar for all vidsponential website pages
 */

(function() {
    // Navigation CSS styles
    const navStyles = `
        /* Navigation */
        .nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border-light);
            z-index: 1000;
            padding: 0 40px;
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 70px;
        }

        .nav-logo {
            height: 32px;
        }

        .nav-links {
            display: flex;
            gap: 32px;
            list-style: none;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-secondary);
            font-weight: 500;
            font-size: 15px;
            transition: color 0.2s;
        }

        .nav-links a:hover,
        .nav-links a.active {
            color: var(--text-primary);
        }

        .nav-cta {
            background: var(--gradient-primary);
            color: white;
            padding: 10px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .nav-cta:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
        }

        .mobile-menu-btn svg {
            width: 24px;
            height: 24px;
            stroke: var(--text-primary);
        }

        /* Mobile Responsive - Navigation */
        @media (max-width: 768px) {
            .nav {
                padding: 0 20px;
            }

            .nav-links {
                display: none;
                position: absolute;
                top: 70px;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 20px;
                gap: 16px;
                border-bottom: 1px solid var(--border-light);
            }

            .nav-links.active {
                display: flex;
            }

            .nav-cta {
                display: none;
            }

            .mobile-menu-btn {
                display: block;
            }
        }
    `;

    // Navigation HTML template
    const navHTML = `
        <nav class="nav">
            <div class="nav-container">
                <a href="/">
                    <img src="/shared/assets/vidsponential logo.png" alt="vidsponential" class="nav-logo">
                </a>
                <ul class="nav-links" id="navLinks">
                    <li><a href="/services" data-page="services">Services</a></li>
                    <li><a href="/portfolio" data-page="portfolio">Portfolio</a></li>
                    <li><a href="/book" data-page="book">Book</a></li>
                    <li><a href="/about" data-page="about">About</a></li>
                    <li><a href="/newsletter" data-page="newsletter">Newsletter</a></li>
                    <li><a href="/contact" data-page="contact">Contact</a></li>
                </ul>
                <a href="/contact" class="nav-cta">Get Started</a>
                <button class="mobile-menu-btn" onclick="toggleMenu()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 12h18M3 6h18M3 18h18"></path>
                    </svg>
                </button>
            </div>
        </nav>
    `;

    // Inject styles
    const styleElement = document.createElement('style');
    styleElement.textContent = navStyles;
    document.head.appendChild(styleElement);

    // Inject navigation HTML
    const navContainer = document.getElementById('website-nav');
    if (navContainer) {
        navContainer.innerHTML = navHTML;
    } else {
        // If no container, insert at the start of body
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }

    // Set active link based on current page
    function setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a[data-page]');

        navLinks.forEach(link => {
            const page = link.getAttribute('data-page');
            // Check if current path contains the page name
            if (currentPath.includes(page)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Toggle mobile menu function (global)
    window.toggleMenu = function() {
        document.getElementById('navLinks').classList.toggle('active');
    };

    // Initialize
    setActiveLink();
})();
