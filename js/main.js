document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Implementation
    const cursor = document.querySelector('.cursor');
    const hoverTargets = document.querySelectorAll('.hover-target, a');

    // Move cursor smoothly
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animateCursor = () => {
        // Easing factor for smoothness
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

    // 2. 3D Tilt Effect for Showreel Card (Smooth Lerp Implementation)
    const showreelContainer = document.querySelector('.showreel-container');
    const tiltCard = document.getElementById('tilt-card');

    if (showreelContainer && tiltCard) {
        let targetRotateX = 0, targetRotateY = 0;
        let currentRotateX = 0, currentRotateY = 0;
        const tiltEase = 0.1; // Lower is smoother
        let isHovering = false;

        showreelContainer.addEventListener('mousemove', (e) => {
            if (!isHovering) isHovering = true;
            
            const rect = showreelContainer.getBoundingClientRect();
            // Calculate mouse position relative to the container center
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Target rotation degrees (adjust multipliers for effect strength)
            targetRotateX = -(y / (rect.height / 2)) * 15; 
            targetRotateY = (x / (rect.width / 2)) * 15;
        });

        showreelContainer.addEventListener('mouseleave', () => {
            isHovering = false;
            targetRotateX = 0;
            targetRotateY = 0;
        });
        
        const animateTilt = () => {
            // Lerp current rotation towards target rotation
            currentRotateX += (targetRotateX - currentRotateX) * tiltEase;
            currentRotateY += (targetRotateY - currentRotateY) * tiltEase;

            // Apply transformation
            tiltCard.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg)`;
            
            requestAnimationFrame(animateTilt);
        };
        
        // Start animation loop
        animateTilt();
    }

    // 3. Swiper Initialization for Skillset
    if (typeof Swiper !== 'undefined') {
        const skillsetSwiper = new Swiper('.skillset-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            autoplay: {
                delay: 2000,
                disableOnInteraction: false,
            },
            coverflowEffect: {
                rotate: 10,
                stretch: 0,
                depth: 80,
                modifier: 1,
                slideShadows: true,
            },
            keyboard: {
                enabled: true,
            },
            mousewheel: {
                forceToAxis: true,
            }
        });
    }
    // 4. Interactive Rocket Scrollbar
    const rocketScrollbar = document.getElementById('rocket-scrollbar');
    if (rocketScrollbar) {
        const rocketHint = document.getElementById('rocket-hint');
        const rocketWrapper = rocketScrollbar.querySelector('.rocket-wrapper');
        let isDraggingRocket = false;
        let startY = 0;
        let startScrollY = 0;
        let scrollTimeout;
        let hasStartedScrolling = false;

        // Function to update rocket position based on current scroll
        const updateRocketPosition = () => {
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll <= 0) return;

            const scrollRatio = window.scrollY / maxScroll;
            // Rocket container starts at 140px down. Need space at bottom.
            const availableHeight = window.innerHeight - 240; 
            const yPos = scrollRatio * availableHeight;
            
            rocketScrollbar.style.transform = `translateY(${yPos}px)`;

            // Rocket Rotation logic based on scroll direction
            const currentScrollY = window.scrollY;
            if (scrollRatio > 0.99) {
                rocketWrapper.style.transform = 'rotate(180deg)'; // Point UP
            } else if (scrollRatio < 0.01) {
                rocketWrapper.style.transform = 'rotate(0deg)'; // Point DOWN
            } else if (currentScrollY > lastScrollY + 2) {
                rocketWrapper.style.transform = 'rotate(0deg)'; // Point DOWN
            } else if (currentScrollY < lastScrollY - 2) {
                rocketWrapper.style.transform = 'rotate(180deg)'; // Point UP
            }
            lastScrollY = currentScrollY;

            rocketScrollbar.classList.add('is-moving');
            
            // Hide hint once started moving
            if (scrollRatio > 0.05 && !hasStartedScrolling) {
                hasStartedScrolling = true;
                if (rocketHint) rocketHint.classList.add('hidden');
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (!isDraggingRocket) {
                    rocketScrollbar.classList.remove('is-moving');
                }
            }, 150);
        };

        updateRocketPosition();

        window.addEventListener('scroll', () => {
            if (!isDraggingRocket) {
                updateRocketPosition();
            }
        });

        rocketScrollbar.addEventListener('mousedown', (e) => {
            isDraggingRocket = true;
            startY = e.clientY;
            startScrollY = window.scrollY;
            rocketScrollbar.classList.add('is-moving');
            e.preventDefault(); 
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingRocket) return;
            
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const availableHeight = window.innerHeight - 240;
            
            const deltaY = e.clientY - startY;
            const scrollRatioDelta = deltaY / availableHeight;
            const scrollPixelDelta = scrollRatioDelta * maxScroll;
            
            window.scrollTo(0, startScrollY + scrollPixelDelta);
            updateRocketPosition();
        });

        document.addEventListener('mouseup', () => {
            if (isDraggingRocket) {
                isDraggingRocket = false;
                rocketScrollbar.classList.remove('is-moving');
            }
        });

        // Mobile Touch Events for Rocket Control
        rocketScrollbar.addEventListener('touchstart', (e) => {
            isDraggingRocket = true;
            startY = e.touches[0].clientY;
            startScrollY = window.scrollY;
            rocketScrollbar.classList.add('is-moving');
        }, {passive: true});

        document.addEventListener('touchmove', (e) => {
            if (!isDraggingRocket) return;
            
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const availableHeight = window.innerHeight - 240;
            
            const deltaY = e.touches[0].clientY - startY;
            const scrollRatioDelta = deltaY / availableHeight;
            const scrollPixelDelta = scrollRatioDelta * maxScroll;
            
            window.scrollTo(0, startScrollY + scrollPixelDelta);
            updateRocketPosition();
            e.preventDefault(); 
        }, {passive: false});

        document.addEventListener('touchend', () => {
            if (isDraggingRocket) {
                isDraggingRocket = false;
                rocketScrollbar.classList.remove('is-moving');
            }
        });
    }
});
