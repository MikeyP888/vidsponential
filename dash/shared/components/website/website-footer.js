/**
 * Website Footer Component
 * Shared footer for all vidsponential website pages
 */

(function() {
    // Footer CSS styles
    const footerStyles = `
        /* Footer */
        .footer {
            background: #1a1a1a;
            padding: 19px 40px;
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .footer-copyright {
            color: rgba(255, 255, 255, 0.6);
            font-size: 14px;
        }

        .footer-links {
            display: flex;
            gap: 24px;
        }

        .footer-links a {
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            font-size: 14px;
            transition: color 0.2s;
        }

        .footer-links a:hover {
            color: white;
        }

        /* Mobile Responsive - Footer */
        @media (max-width: 768px) {
            .footer-container {
                flex-direction: column;
                gap: 10px;
                text-align: center;
            }
        }
    `;

    // Footer HTML template
    const footerHTML = `
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-copyright">&copy; 2025 vidsponential. All rights reserved.</div>
                <div class="footer-links">
                    <a href="/terms">Terms &amp; Conditions</a>
                    <a href="/privacy">Privacy Policy</a>
                </div>
            </div>
        </footer>
    `;

    // Inject styles
    const styleElement = document.createElement('style');
    styleElement.textContent = footerStyles;
    document.head.appendChild(styleElement);

    // Inject footer HTML
    const footerContainer = document.getElementById('website-footer');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    } else {
        // If no container, append to end of body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
})();
