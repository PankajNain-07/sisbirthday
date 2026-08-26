/* ================================================================
   BIRTHDAY EXPERIENCE — Main JavaScript Controller
   Architecture: Modules → Init → Event Handlers → Animation Engine
   ================================================================ */

(function () {
  'use strict';

  /* ================================================================
     1. DOM ELEMENT REFERENCES
     ================================================================ */
  const DOM = {
    // Cursor
    cursorGlow: document.getElementById('cursorGlow'),
    cursorTrail: document.getElementById('cursorTrail'),

    // Particle Canvas
    particleCanvas: document.getElementById('particleCanvas'),

    // Overlay
    startOverlay: document.getElementById('startOverlay'),
    startBtn: document.getElementById('startBtn'),

    // Main Content
    mainContent: document.getElementById('mainContent'),

    // Hero
    heroSection: document.getElementById('heroSection'),
    heroBanner: document.getElementById('heroBanner'),
    balloonsContainer: document.getElementById('balloonsContainer'),

    // Gallery
    gallerySection: document.getElementById('gallerySection'),
    galleryGrid: document.getElementById('galleryGrid'),
    photoCards: null, // populated after DOM ready

    // Wish
    wishSection: document.getElementById('wishSection'),
    wishCard: document.getElementById('wishCard'),
    confettiBtn: document.getElementById('confettiBtn'),

    // Music Player
    musicPlayer: document.getElementById('musicPlayer'),
    bgMusic: document.getElementById('bgMusic'),
    playPauseBtn: document.getElementById('playPauseBtn'),
    playIcon: document.getElementById('playIcon'),
    pauseIcon: document.getElementById('pauseIcon'),
    volumeSlider: document.getElementById('volumeSlider'),

    // Confetti Canvas
    confettiCanvas: document.getElementById('confettiCanvas'),
  };

  /* ================================================================
     2. STATE
     ================================================================ */
  const state = {
    isPlaying: false,
    mouseX: 0,
    mouseY: 0,
    particlesInitialized: false,
  };

  /* ================================================================
     3. CUSTOM CURSOR (Desktop Only)
     ================================================================ */
  function initCursor() {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    document.addEventListener('mousemove', (e) => {
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;

      // Move cursor glow immediately
      DOM.cursorGlow.style.left = e.clientX + 'px';
      DOM.cursorGlow.style.top = e.clientY + 'px';

      // Trail follows with slight delay (via CSS transition)
      DOM.cursorTrail.style.left = e.clientX + 'px';
      DOM.cursorTrail.style.top = e.clientY + 'px';
    });

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll(
      'button, a, .photo-card, .btn-confetti, input[type="range"]'
    );
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => DOM.cursorGlow.classList.add('hovering'));
      el.addEventListener('mouseleave', () => DOM.cursorGlow.classList.remove('hovering'));
    });
  }

  /* ================================================================
     4. THREE.JS PARTICLE SYSTEM — Floating WebGL Particles
     ================================================================ */
  function initParticles() {
    if (state.particlesInitialized) return;
    state.particlesInitialized = true;

    const canvas = DOM.particleCanvas;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle geometry
    const particleCount = window.innerWidth < 600 ? 500 : 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    // Palette colors for particles (converted to 0-1 range)
    const palette = [
      [1.0, 0.42, 0.615],   // Pink #FF6B9D
      [0.753, 0.522, 0.988], // Purple #C084FC
      [0.404, 0.91, 0.976],  // Cyan #67E8F9
      [0.988, 0.827, 0.302], // Gold #FCD34D
      [0.204, 0.831, 0.6],   // Green #34D399
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 15;
      positions[i3 + 1] = (Math.random() - 0.5) * 15;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color[0];
      colors[i3 + 1] = color[1];
      colors[i3 + 2] = color[2];

      sizes[i] = Math.random() * 3 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Simple particle material
    const material = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow rotation for dreamy ambient feel
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = elapsed * 0.015;

      // Subtle mouse-based parallax
      const targetRotX = (state.mouseY / window.innerHeight - 0.5) * 0.15;
      const targetRotY = (state.mouseX / window.innerWidth - 0.5) * 0.15;
      particles.rotation.x += (targetRotX - particles.rotation.x) * 0.02;
      particles.rotation.y += (targetRotY - particles.rotation.y) * 0.02;

      // Gentle wave motion on particles
      const posArray = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3 + 1] += Math.sin(elapsed + i * 0.1) * 0.0005;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ================================================================
     5. PARALLAX BALLOONS — Mouse-reactive floating balloons
     ================================================================ */
  function initParallaxBalloons() {
    const balloons = document.querySelectorAll('.balloon');

    document.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX) / centerX;
      const deltaY = (e.clientY - centerY) / centerY;

      balloons.forEach((balloon) => {
        const speed = parseFloat(balloon.dataset.speed) || 0.03;
        const moveX = deltaX * 40 * speed * 10;
        const moveY = deltaY * 30 * speed * 10;
        const rotateZ = deltaX * 5;

        balloon.style.transform = `translate(${moveX}px, ${moveY}px) rotateZ(${rotateZ}deg)`;
      });
    });

    // Touch parallax for mobile
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (touch.clientX - centerX) / centerX;
      const deltaY = (touch.clientY - centerY) / centerY;

      balloons.forEach((balloon) => {
        const speed = parseFloat(balloon.dataset.speed) || 0.03;
        const moveX = deltaX * 25 * speed * 10;
        const moveY = deltaY * 20 * speed * 10;
        balloon.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    }, { passive: true });
  }

  /* ================================================================
     6. HERO ENTRANCE ANIMATION (GSAP)
     ================================================================ */
  function animateHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.to('.line-1', {
      opacity: 1,
      y: 0,
      duration: 1.2,
    })
    .to('.line-2', {
      opacity: 1,
      y: 0,
      duration: 1.2,
    }, '-=0.8')
    .to('.line-3', {
      opacity: 1,
      y: 0,
      duration: 1,
    }, '-=0.6')
    .to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.8,
    }, '-=0.4')
    .to('.hero-pretitle', {
      opacity: 1,
      duration: 0.6,
    }, '-=0.6');
  }

  /* ================================================================
     7. SCROLL-TRIGGERED ANIMATIONS (GSAP ScrollTrigger)
     ================================================================ */
  function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Gallery Section header
    gsap.from('.section-header', {
      scrollTrigger: {
        trigger: '.gallery-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'expo.out',
    });

    // Photo cards stagger animation
    gsap.from('.photo-card', {
      scrollTrigger: {
        trigger: '.gallery-grid',
        start: 'top 85%',
      },
      opacity: 0,
      y: 60,
      scale: 0.9,
      duration: 0.8,
      stagger: 0.15,
      ease: 'expo.out',
    });

    // Wish card
    gsap.from('.wish-card', {
      scrollTrigger: {
        trigger: '.wish-section',
        start: 'top 75%',
      },
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 1,
      ease: 'expo.out',
    });

    // Confetti button
    gsap.from('.btn-confetti', {
      scrollTrigger: {
        trigger: '.btn-confetti',
        start: 'top 90%',
      },
      opacity: 0,
      scale: 0.5,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });
  }

  /* ================================================================
     8. PHOTO CARD FLIP INTERACTION
     ================================================================ */
  function initPhotoCards() {
    DOM.photoCards = document.querySelectorAll('.photo-card');

    DOM.photoCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        // Toggle flip class on click/tap
        card.classList.toggle('flipped');

        // GSAP subtle spring bounce on click
        gsap.fromTo(card, {
          scale: 0.95,
        }, {
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
        });
      });
    });

    // Swipe support for mobile photo cards
    initMobileSwipe();
  }

  /* ================================================================
     9. MOBILE SWIPE GESTURES FOR GALLERY
     ================================================================ */
  function initMobileSwipe() {
    if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    let touchStartX = 0;
    let touchStartY = 0;

    DOM.photoCards.forEach((card) => {
      card.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      card.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // If horizontal swipe > 50px and more horizontal than vertical
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
          card.classList.toggle('flipped');
          gsap.fromTo(card, { scale: 0.95 }, {
            scale: 1,
            duration: 0.4,
            ease: 'back.out(1.7)',
          });
        }
      }, { passive: true });
    });
  }

  /* ================================================================
     10. MUSIC PLAYER CONTROLS
     ================================================================ */
  function initMusicPlayer() {
    const audio = DOM.bgMusic;
    audio.volume = 0.7;

    // Play/Pause toggle
    DOM.playPauseBtn.addEventListener('click', togglePlayback);

    // Volume control
    DOM.volumeSlider.addEventListener('input', (e) => {
      audio.volume = parseInt(e.target.value) / 100;
    });

    // Update UI when audio ends/plays
    audio.addEventListener('play', () => {
      state.isPlaying = true;
      DOM.playIcon.style.display = 'none';
      DOM.pauseIcon.style.display = 'block';
      DOM.musicPlayer.classList.add('playing');
    });

    audio.addEventListener('pause', () => {
      state.isPlaying = false;
      DOM.playIcon.style.display = 'block';
      DOM.pauseIcon.style.display = 'none';
      DOM.musicPlayer.classList.remove('playing');
    });
  }

  function togglePlayback() {
    const audio = DOM.bgMusic;
    if (audio.paused) {
      audio.play().catch(() => {
        console.log('Audio play was blocked. User interaction required.');
      });
    } else {
      audio.pause();
    }
  }

  /* ================================================================
     11. CONFETTI CELEBRATION SYSTEM
     ================================================================ */
  function initConfetti() {
    const canvas = DOM.confettiCanvas;
    const ctx = canvas.getContext('2d');
    let confettiPieces = [];
    let animationId = null;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Confetti piece class
    class ConfettiPiece {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.opacity = 1;
        this.color = [
          '#FF6B9D', '#C084FC', '#67E8F9', '#FCD34D',
          '#34D399', '#A78BFA', '#F472B6', '#FB923C',
        ][Math.floor(Math.random() * 8)];
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedX += (Math.random() - 0.5) * 0.1;

        // Fade out as it reaches bottom
        if (this.y > canvas.height * 0.8) {
          this.opacity -= 0.01;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;

        if (this.shape === 'rect') {
          ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    function launchConfetti() {
      // Create burst of confetti
      for (let i = 0; i < 150; i++) {
        confettiPieces.push(new ConfettiPiece());
      }

      if (!animationId) {
        animateConfetti();
      }
    }

    function animateConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confettiPieces.forEach((piece) => {
        piece.update();
        piece.draw();
      });

      // Remove dead pieces
      confettiPieces = confettiPieces.filter(
        (p) => p.opacity > 0 && p.y < canvas.height + 50
      );

      if (confettiPieces.length > 0) {
        animationId = requestAnimationFrame(animateConfetti);
      } else {
        animationId = null;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    // Trigger confetti on button click
    DOM.confettiBtn.addEventListener('click', () => {
      launchConfetti();

      // Button bounce animation
      gsap.fromTo(DOM.confettiBtn, {
        scale: 0.85,
        rotation: -5,
      }, {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
    });
  }

  /* ================================================================
     12. DYNAMIC AUDIO VISUALIZER (Web Audio API)
     ================================================================ */
  function initAudioVisualizer() {
    let audioContext;
    let analyser;
    let dataArray;
    let isVisualizerActive = false;

    function setupVisualizer() {
      if (isVisualizerActive) return;

      try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 32;

        const source = audioContext.createMediaElementSource(DOM.bgMusic);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
        isVisualizerActive = true;

        animateVisualizer();
      } catch (err) {
        console.log('Audio visualizer setup failed:', err.message);
      }
    }

    function animateVisualizer() {
      if (!isVisualizerActive) return;

      requestAnimationFrame(animateVisualizer);

      analyser.getByteFrequencyData(dataArray);

      const bars = document.querySelectorAll('.vis-bar');
      bars.forEach((bar, i) => {
        const value = dataArray[i + 1] || 0;
        const height = Math.max(4, (value / 255) * 24);
        bar.style.height = height + 'px';
      });
    }

    // Set up visualizer once audio starts playing
    DOM.bgMusic.addEventListener('play', setupVisualizer, { once: true });
  }

  /* ================================================================
     13. PASSWORD GATE — Verify Access Code
     ================================================================ */
  function initPasswordGate() {
    const SECRET_CODE = '2708';
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
    const passwordError = document.getElementById('passwordError');
    const passwordGate = document.getElementById('passwordGate');

    function verifyPassword() {
      const entered = passwordInput.value.trim();

      if (entered === SECRET_CODE) {
        // Success!
        passwordInput.classList.remove('error');
        passwordInput.classList.add('success');
        passwordError.textContent = '';

        // Hide password gate and show start button with animation
        setTimeout(() => {
          passwordGate.classList.add('hidden');
          DOM.startBtn.style.display = 'inline-flex';

          // Animate button entrance
          gsap.fromTo(DOM.startBtn, {
            opacity: 0,
            scale: 0.7,
            y: 20,
          }, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
          });
        }, 400);
      } else {
        // Wrong password
        passwordInput.classList.add('error');
        passwordError.textContent = 'Wrong code! Try again 🔒';
        passwordError.classList.remove('shake');

        // Force reflow to restart animation
        void passwordError.offsetWidth;
        passwordError.classList.add('shake');

        // Clear input for retry
        passwordInput.value = '';
        passwordInput.focus();

        // Remove error state after a moment
        setTimeout(() => {
          passwordInput.classList.remove('error');
        }, 1500);
      }
    }

    // Click unlock button
    passwordSubmitBtn.addEventListener('click', verifyPassword);

    // Enter key on input
    passwordInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        verifyPassword();
      }
    });
  }

  /* ================================================================
     14. START OVERLAY — Entry Gate Handler
     ================================================================ */
  function initStartOverlay() {
    DOM.startBtn.addEventListener('click', () => {
      // Fade out overlay
      DOM.startOverlay.classList.add('hidden');

      // Show main content
      DOM.mainContent.classList.remove('hidden');

      // Show music player
      setTimeout(() => {
        DOM.musicPlayer.classList.add('visible');
      }, 500);

      // Start music
      DOM.bgMusic.play().catch((err) => {
        console.log('Audio autoplay blocked:', err.message);
      });

      // Initialize particles
      initParticles();

      // Animate hero entrance
      setTimeout(animateHeroEntrance, 300);

      // Initialize scroll animations after a short delay
      setTimeout(initScrollAnimations, 800);
    });
  }

  /* ================================================================
     14. GRADIENT MESH BACKGROUND ANIMATION
     ================================================================ */
  function initGradientMesh() {
    // Animate the body background gradient slowly
    let angle = 0;
    function updateGradient() {
      angle += 0.1;
      const x1 = 20 + Math.sin(angle * 0.01) * 15;
      const y1 = 30 + Math.cos(angle * 0.015) * 15;
      const x2 = 80 + Math.sin(angle * 0.012 + 2) * 15;
      const y2 = 70 + Math.cos(angle * 0.01 + 1) * 15;

      document.body.style.background = `
        radial-gradient(600px circle at ${x1}% ${y1}%, rgba(192, 132, 252, 0.1), transparent 50%),
        radial-gradient(600px circle at ${x2}% ${y2}%, rgba(255, 107, 157, 0.08), transparent 50%),
        radial-gradient(400px circle at 50% 50%, rgba(103, 232, 249, 0.05), transparent 50%),
        #0a0a0f
      `;

      requestAnimationFrame(updateGradient);
    }
    updateGradient();
  }

  /* ================================================================
     15. INITIALIZATION — Master Setup Function
     ================================================================ */
  function init() {
    initCursor();
    initPasswordGate();
    initStartOverlay();
    initParallaxBalloons();
    initPhotoCards();
    initMusicPlayer();
    initConfetti();
    initAudioVisualizer();
    initGradientMesh();
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
