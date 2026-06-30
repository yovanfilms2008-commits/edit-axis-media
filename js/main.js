document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 1. Custom Cursor Implementation
    const cursor = document.querySelector('.cursor');
    const hoverTargets = document.querySelectorAll('.hover-target');

    if (cursor) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const animateCursor = () => {
            const ease = 0.15;
            cursorX += (mouseX - cursorX) * ease;
            cursorY += (mouseY - cursorY) * ease;

            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Enlarge cursor on hover
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            target.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    }

    // 2. Handle AJAX Form Submissions for both Twin Portals
    const setupAjaxForm = (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;

        const statusDiv = form.nextElementSibling; // The div.form-status directly after the form

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'SENDING...';
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    form.reset();
                    statusDiv.style.display = 'block';
                    statusDiv.innerText = 'Application received successfully. We will be in touch.';
                    setTimeout(() => { statusDiv.style.display = 'none'; }, 5000);
                } else {
                    statusDiv.style.display = 'block';
                    statusDiv.innerText = 'Oops! There was a problem submitting your request.';
                    statusDiv.style.color = '#ff4d4d';
                }
            } catch (error) {
                statusDiv.style.display = 'block';
                statusDiv.innerText = 'Oops! There was a problem submitting your request.';
                statusDiv.style.color = '#ff4d4d';
            } finally {
                submitBtn.innerText = originalBtnText;
            }
        });
    };

    setupAjaxForm('brand-form');
    setupAjaxForm('creator-form');
});
