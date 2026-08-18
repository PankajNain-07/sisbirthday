/**
 * ==========================================================================
 * HAPPY BIRTHDAY REEL - INTERACTIVE JAVASCRIPT ENGINE
 * Mobile-first Instagram Reel Experience with Scroll-Snap, Confetti,
 * Audio Engine, 3D Tilt, Double-Tap Hearts & Modals
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM ELEMENT REFERENCES ---
  const startOverlay = document.getElementById('startOverlay');
  const startBtn = document.getElementById('startBtn');
  const reelContainer = document.getElementById('reelContainer');
  const sections = document.querySelectorAll('.reel-section');
  const progressSegments = document.querySelectorAll('.progress-segment');
  
  // Audio Elements
  const bgMusic = document.getElementById('bgMusic');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioStatusText = document.getElementById('audioStatusText');
  const vinylDisc = document.getElementById('vinylDisc');

  // Password Protection
  const passwordSection = document.getElementById('passwordSection');
  const passwordInput = document.getElementById('passwordInput');
  const verifyPasswordBtn = document.getElementById('verifyPasswordBtn');
  const passwordError = document.getElementById('passwordError');
  const CORRECT_PASSWORD = '27082000';
  let passwordVerified = false;

  // Interaction Buttons
  const likeActionBtn = document.getElementById('likeActionBtn');
  const likeCounter = document.getElementById('likeCounter');
  const doubleTapHeart = document.getElementById('doubleTapHeart');
  const commentActionBtn = document.getElementById('commentActionBtn');
  const shareActionBtn = document.getElementById('shareActionBtn');
  const giftActionBtn = document.getElementById('giftActionBtn');
  const tapForGiftBtn = document.getElementById('tapForGiftBtn');
  const secretCard = document.getElementById('secretCard');
  const secretOverlay = document.getElementById('secretOverlay');

  // Modals & Drawers
  const giftModal = document.getElementById('giftModal');
  const closeGiftModalBtn = document.getElementById('closeGiftModalBtn');
  const giftModalBackdrop = document.getElementById('giftModalBackdrop');
  const claimGiftBtn = document.getElementById('claimGiftBtn');
  
  const commentsModal = document.getElementById('commentsModal');
  const closeCommentsModalBtn = document.getElementById('closeCommentsModalBtn');
  const commentsModalBackdrop = document.getElementById('commentsModalBackdrop');
  const commentForm = document.getElementById('commentForm');
  const newCommentInput = document.getElementById('newCommentInput');
  const commentsList = document.getElementById('commentsList');
  const commentCounter = document.getElementById('commentCounter');

  // Toasts & Canvas
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const confettiCanvas = document.getElementById('confettiCanvas');
  const flyingHeartsContainer = document.getElementById('flyingHeartsContainer');
  const polaroidCard = document.getElementById('polaroidCard');
  const bubbleBtns = document.querySelectorAll('.bubble-btn');

  // State Variables
  let isAudioPlaying = false;
  let isLiked = false;
  let likeCountNum = 100000;
  let synthAudioCtx = null;
  let synthInterval = null;
  let lastTapTime = 0;

  /* ==========================================================================
     1. WEB AUDIO API SYNTHESIZER (ZERO-DEPENDENCY FALLBACK BGM)
     If no external MP3 is supplied or audio fails, plays a cheerful birthday melody!
     ========================================================================== */
  function initSynthAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      synthAudioCtx = new AudioContext();
      
      // Cheerful birthday chord sequence (frequencies in Hz)
      const notes = [
        261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy Birthday phrase 1
        261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // phrase 2
        261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // phrase 3
        466.16, 466.16, 440.00, 349.23, 392.00, 349.23  // phrase 4
      ];
      const durations = [
        0.3, 0.3, 0.6, 0.6, 0.6, 1.2,
        0.3, 0.3, 0.6, 0.6, 0.6, 1.2,
        0.3, 0.3, 0.6, 0.6, 0.6, 0.6, 1.2,
        0.3, 0.3, 0.6, 0.6, 0.6, 1.4
      ];
      
      let noteIndex = 0;
      function playNextNote() {
        if (!isAudioPlaying || !synthAudioCtx) return;
        if (synthAudioCtx.state === 'suspended') {
          synthAudioCtx.resume();
        }

        const osc = synthAudioCtx.createOscillator();
        const gain = synthAudioCtx.createGain();
        
        // Warm soft synth sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[noteIndex], synthAudioCtx.currentTime);

        // Envelope
        gain.gain.setValueAtTime(0.001, synthAudioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.18, synthAudioCtx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, synthAudioCtx.currentTime + durations[noteIndex]);

        osc.connect(gain);
        gain.connect(synthAudioCtx.destination);

        osc.start();
        osc.stop(synthAudioCtx.currentTime + durations[noteIndex]);

        const nextDelay = (durations[noteIndex] * 750);
        noteIndex = (noteIndex + 1) % notes.length;
        synthInterval = setTimeout(playNextNote, nextDelay);
      }

      playNextNote();
    } catch (e) {
      console.log('Web Audio Synth initialization note:', e);
    }
  }

  // Celebratory Sound Chime Fanfare for Gift / Confetti
  function playFanfareChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = synthAudioCtx || new AudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major high arpeggio
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.7);
      });
    } catch (e) {}
  }

  /* ==========================================================================
     2. AUDIO CONTROLLER & PLAYBACK MANAGEMENT
     ========================================================================== */
  function startBackgroundMusic() {
    isAudioPlaying = true;
    updateAudioUI(true);

    if (bgMusic) {
      bgMusic.volume = 0.65;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If custom MP3 is not found / blocked, fallback to internal Web Audio synth
          initSynthAudio();
        });
      }
    } else {
      initSynthAudio();
    }
  }

  function toggleAudio() {
    if (isAudioPlaying) {
      isAudioPlaying = false;
      if (bgMusic) bgMusic.pause();
      if (synthInterval) clearTimeout(synthInterval);
      updateAudioUI(false);
    } else {
      isAudioPlaying = true;
      if (bgMusic && bgMusic.src) {
        bgMusic.play().catch(() => initSynthAudio());
      } else {
        initSynthAudio();
      }
      updateAudioUI(true);
    }
  }

  function updateAudioUI(playing) {
    if (playing) {
      audioToggleBtn.classList.add('audio-playing');
      audioStatusText.textContent = 'Audio On';
      if (vinylDisc) vinylDisc.classList.add('spinning');
    } else {
      audioToggleBtn.classList.remove('audio-playing');
      audioStatusText.textContent = 'Muted';
      if (vinylDisc) vinylDisc.classList.remove('spinning');
    }
  }

  audioToggleBtn.addEventListener('click', toggleAudio);

  /* ==========================================================================
     2.5. PASSWORD PROTECTION (ACCESS GATE) - MANDATORY VERIFICATION
     ========================================================================== */
  function verifyPassword() {
    const inputValue = passwordInput.value.trim();
    
    if (inputValue === CORRECT_PASSWORD) {
      passwordVerified = true;
      passwordError.textContent = '';
      passwordSection.style.display = 'none';
      startBtn.style.display = 'flex';
      startBtn.classList.remove('hidden');
      // Auto-focus the start button
      setTimeout(() => startBtn.focus(), 300);
      showToast('✅ Access Granted! Ready to celebrate? 🎉');
    } else {
      passwordError.textContent = '❌ Incorrect code. Try again!';
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  // Prevent access without password
  function preventUnauthorizedAccess(e) {
    if (!passwordVerified) {
      e.preventDefault();
      e.stopPropagation();
      passwordInput.focus();
      showToast('🔒 Enter the access code first!');
      return false;
    }
  }

  // Disable all reel interactions until password verified
  reelContainer.addEventListener('click', preventUnauthorizedAccess, true);
  reelContainer.addEventListener('scroll', preventUnauthorizedAccess, true);
  reelContainer.addEventListener('touchstart', preventUnauthorizedAccess, true);

  verifyPasswordBtn.addEventListener('click', verifyPassword);
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      verifyPassword();
    }
  });

  /* ==========================================================================
     3. START OVERLAY (AUTOPLAY UNLOCK & ENTRY)
     ========================================================================== */
  startBtn.addEventListener('click', () => {
    startOverlay.classList.add('hidden');
    startBackgroundMusic();
    triggerMiniHearts(window.innerWidth / 2, window.innerHeight / 2, 8);
    showToast('✨ Welcome to your Birthday Reel! Swipe down to explore ⬇️');
  });

  /* ==========================================================================
     4. SCROLL-SNAP OBSERVER & PROGRESS BAR TRACKER
     ========================================================================== */
  const sectionObserverOptions = {
    root: reelContainer,
    threshold: 0.55
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = parseInt(entry.target.getAttribute('data-index'), 10);
        updateProgressBar(index);
        
        // Trigger entrance animations for elements inside the section
        const animElements = entry.target.querySelectorAll('.animate-on-scroll');
        animElements.forEach(el => el.classList.add('visible'));

        // Auto trigger celebratory sparks on final screen
        if (index === 3) {
          triggerConfettiBurst(25);
        }
      }
    });
  }, sectionObserverOptions);

  sections.forEach(section => sectionObserver.observe(section));

  function updateProgressBar(activeIndex) {
    progressSegments.forEach((segment, idx) => {
      segment.classList.remove('active', 'completed');
      if (idx < activeIndex) {
        segment.classList.add('completed');
      } else if (idx === activeIndex) {
        segment.classList.add('active');
      }
    });
  }

  /* ==========================================================================
     5. LIKE BUTTON & DOUBLE-TAP TO LIKE INTERACTION
     ========================================================================== */
  function toggleLike(e) {
    if (e) e.stopPropagation();
    isLiked = !isLiked;
    const heartBtn = likeActionBtn.querySelector('.action-btn');

    if (isLiked) {
      heartBtn.classList.add('liked');
      likeCountNum += 1;
      likeCounter.textContent = formatCount(likeCountNum);
      
      const rect = heartBtn.getBoundingClientRect();
      triggerMiniHearts(rect.left + 20, rect.top + 20, 6);
      showToast('💖 You liked this birthday memory!');
    } else {
      heartBtn.classList.remove('liked');
      likeCountNum -= 1;
      likeCounter.textContent = formatCount(likeCountNum);
    }
  }

  likeActionBtn.addEventListener('click', toggleLike);

  function formatCount(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  // Double-tap anywhere on the reel to like & pop large heart
  reelContainer.addEventListener('click', (e) => {
    // Ignore clicks on buttons, forms, or links
    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.app-modal')) {
      return;
    }

    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 320 && tapLength > 0) {
      // Double tap detected!
      if (!isLiked) toggleLike();
      
      // Trigger center heart animation
      doubleTapHeart.classList.remove('animate');
      void doubleTapHeart.offsetWidth; // Force reflow
      doubleTapHeart.classList.add('animate');
      
      // Spawn floating hearts at touch/click coordinates
      triggerMiniHearts(e.clientX, e.clientY, 8);
    }
    lastTapTime = currentTime;
  });

  /* ==========================================================================
     6. FLOATING MINI HEARTS SPAWNER
     ========================================================================== */
  function triggerMiniHearts(x, y, count = 5) {
    const emojis = ['💖', '❤️', '✨', '🌸', '👑', '🎉'];
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'flying-heart-particle';
      heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      
      const offsetX = (Math.random() - 0.5) * 80;
      const offsetY = (Math.random() - 0.5) * 60;
      
      heart.style.left = `${x + offsetX}px`;
      heart.style.top = `${y + offsetY}px`;
      
      flyingHeartsContainer.appendChild(heart);
      
      setTimeout(() => {
        if (heart && heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 1600);
    }
  }

  /* ==========================================================================
     7. SCREEN 2: 3D POLAROID TILT & INTERACTIVE PHOTO CYCLING
     ========================================================================== */
  const photoGallery = [
    { src: 'assets/images/sofa_lounge.jpg', caption: 'Main Character Energy & Cozy Vibes 🌸', tag: '#BirthdayQueen', badge: 'PHOTO 1 OF 5' },
    { src: 'assets/images/sister_solo.jpg', caption: 'Stunning Queen in Black Elegance 🖤✨', tag: '#SlayAllDay', badge: 'PHOTO 2 OF 5' },
    { src: 'assets/images/mall_chandelier.jpg', caption: 'Under The Grand Chandelier ✨', tag: '#PartnerInCrime', badge: 'PHOTO 3 OF 5' },
    { src: 'assets/images/night_fountain.jpg', caption: 'Night Lights & Endless Laughs 🌙', tag: '#ForeverBond', badge: 'PHOTO 4 OF 5' },
    { src: 'assets/images/family_mall.jpg', caption: 'Family Moments & Sweet Love 💖', tag: '#Blessed', badge: 'PHOTO 5 OF 5' }
  ];

  let currentPhotoIdx = 0;
  const polaroidMainImg = document.getElementById('polaroidMainImg');
  const polaroidCaption = document.getElementById('polaroidCaption');
  const polaroidTag = document.getElementById('polaroidTag');
  const polaroidBadge = document.getElementById('polaroidBadge');
  const polaroidDots = document.querySelectorAll('#polaroidDots .p-dot');

  function switchPolaroidPhoto(idx) {
    currentPhotoIdx = (idx !== undefined) ? idx : (currentPhotoIdx + 1) % photoGallery.length;
    const photo = photoGallery[currentPhotoIdx];
    
    if (polaroidMainImg) {
      polaroidMainImg.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
      polaroidMainImg.style.opacity = '0';
      polaroidMainImg.style.transform = 'scale(0.95)';
      setTimeout(() => {
        polaroidMainImg.src = photo.src;
        if (polaroidCaption) polaroidCaption.textContent = photo.caption;
        if (polaroidTag) polaroidTag.textContent = photo.tag;
        if (polaroidBadge) polaroidBadge.textContent = photo.badge;
        polaroidMainImg.style.opacity = '1';
        polaroidMainImg.style.transform = 'scale(1)';
      }, 180);
    }
    
    polaroidDots.forEach((dot, dIdx) => {
      dot.classList.toggle('active', dIdx === currentPhotoIdx);
    });

    triggerMiniHearts(window.innerWidth / 2, window.innerHeight * 0.4, 5);
  }

  if (polaroidCard) {
    polaroidCard.addEventListener('click', (e) => {
      switchPolaroidPhoto();
    });

    polaroidCard.addEventListener('mousemove', (e) => {
      const rect = polaroidCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = -(y / rect.height) * 20;
      const rotateY = (x / rect.width) * 20;
      
      const card = polaroidCard.querySelector('.polaroid-card');
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    });

    polaroidCard.addEventListener('mouseleave', () => {
      const card = polaroidCard.querySelector('.polaroid-card');
      card.style.transform = `rotate(-3deg)`;
    });
  }

  polaroidDots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-idx'), 10);
      switchPolaroidPhoto(idx);
    });
  });

  /* ==========================================================================
     8. SCREEN 3: SECRET COMPLIMENT SCRATCH/TAP REVEAL
     ========================================================================== */
  if (secretCard && secretOverlay) {
    secretCard.addEventListener('click', () => {
      if (!secretOverlay.classList.contains('revealed')) {
        secretOverlay.classList.add('revealed');
        playFanfareChime();
        triggerConfettiBurst(20);
        showToast('💌 Compliment Unlocked! #BestSisterEver');
      }
    });
  }

  /* ==========================================================================
     9. CANVAS CONFETTI EXPLOSION SYSTEM (ZERO DEPENDENCIES)
     ========================================================================== */
  const ctx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let isConfettiRunning = false;

  function resizeCanvas() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#ff2a7a', '#833ab4', '#fcb045', '#00f2fe', '#ffd700', '#ffffff', '#ff6b81'];

  class ConfettiParticle {
    constructor(x, y) {
      this.x = x || Math.random() * confettiCanvas.width;
      this.y = y || confettiCanvas.height * 0.75;
      this.size = Math.random() * 8 + 6;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      
      // Explosion velocities
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 12 + 6;
      this.vx = Math.cos(angle) * velocity;
      this.vy = Math.sin(angle) * velocity - Math.random() * 8;
      
      this.gravity = 0.35;
      this.friction = 0.96;
      this.opacity = 1;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 12;
      this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;
      this.opacity -= 0.009;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(this.opacity, 0);
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.fillStyle = this.color;

      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function renderConfetti() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.update();
      p.draw();
      if (p.opacity <= 0 || p.y > confettiCanvas.height + 20) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      requestAnimationFrame(renderConfetti);
    } else {
      isConfettiRunning = false;
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  function triggerConfettiBurst(count = 120, x, y) {
    const burstX = x !== undefined ? x : confettiCanvas.width / 2;
    const burstY = y !== undefined ? y : confettiCanvas.height * 0.6;
    
    for (let i = 0; i < count; i++) {
      confettiParticles.push(new ConfettiParticle(burstX, burstY));
    }

    if (!isConfettiRunning) {
      isConfettiRunning = true;
      renderConfetti();
    }
  }

  /* ==========================================================================
     10. SCREEN 4: GIFT EXPLOSION & MODAL POPUP
     ========================================================================== */
  function openGiftExperience(e) {
    if (e) e.stopPropagation();
    playFanfareChime();
    
    // Dual cannon confetti explosion
    triggerConfettiBurst(80, window.innerWidth * 0.3, window.innerHeight * 0.7);
    triggerConfettiBurst(80, window.innerWidth * 0.7, window.innerHeight * 0.7);
    
    // Open Gift Box Modal
    giftModal.classList.add('show');
    giftModal.setAttribute('aria-hidden', 'false');
  }

  if (tapForGiftBtn) tapForGiftBtn.addEventListener('click', openGiftExperience);
  if (giftActionBtn) giftActionBtn.addEventListener('click', openGiftExperience);

  function closeGiftModal() {
    giftModal.classList.remove('show');
    giftModal.setAttribute('aria-hidden', 'true');
  }

  if (closeGiftModalBtn) closeGiftModalBtn.addEventListener('click', closeGiftModal);
  if (giftModalBackdrop) giftModalBackdrop.addEventListener('click', closeGiftModal);
  if (claimGiftBtn) {
    claimGiftBtn.addEventListener('click', () => {
      closeGiftModal();
      triggerConfettiBurst(120);
      showToast('🎉 Birthday Gift Claimed! Enjoy your special day!');
    });
  }

  /* ==========================================================================
     11. COMMENTS DRAWER & DYNAMIC COMMENTING
     ========================================================================== */
  function openCommentsModal() {
    commentsModal.classList.add('show');
    commentsModal.setAttribute('aria-hidden', 'false');
  }

  function closeCommentsModal() {
    commentsModal.classList.remove('show');
    commentsModal.setAttribute('aria-hidden', 'true');
  }

  if (commentActionBtn) commentActionBtn.addEventListener('click', openCommentsModal);
  if (closeCommentsModalBtn) closeCommentsModalBtn.addEventListener('click', closeCommentsModal);
  if (commentsModalBackdrop) commentsModalBackdrop.addEventListener('click', closeCommentsModal);

  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = newCommentInput.value.trim();
      if (!text) return;

      const newComment = document.createElement('div');
      newComment.className = 'comment-item';
      newComment.innerHTML = `
        <img src="assets/images/sister_solo.jpg" alt="You" class="comment-avatar">
        <div class="comment-content">
          <div class="comment-user">
            <strong>you</strong>
            <span class="comment-time">Just now</span>
          </div>
          <p class="comment-body">${escapeHTML(text)}</p>
        </div>
        <button class="comment-like-btn">❤️</button>
      `;

      commentsList.prepend(newComment);
      newCommentInput.value = '';
      
      // Increment comment count
      const currentComments = parseInt(commentCounter.textContent, 10) || 24;
      commentCounter.textContent = (currentComments + 1).toString();
      
      triggerMiniHearts(window.innerWidth / 2, window.innerHeight * 0.8, 6);
      showToast('💬 Your comment was posted!');
    });
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  /* ==========================================================================
     12. SHARE BUTTON & WEB SHARE API
     ========================================================================== */
  if (shareActionBtn) {
    shareActionBtn.addEventListener('click', async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Happy Birthday Sis! ✨",
            text: "Check out this special birthday reel created just for you! 🎂💖",
            url: window.location.href
          });
        } catch (err) {
          copyLinkFallback();
        }
      } else {
        copyLinkFallback();
      }
    });
  }

  function copyLinkFallback() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('🔗 Link copied to clipboard! Share it anywhere!');
      }).catch(() => {
        showToast('💌 Share this link with family & friends!');
      });
    } else {
      showToast('💌 Share this link with family & friends!');
    }
  }

  /* ==========================================================================
     13. QUICK REACTION BUBBLES
     ========================================================================== */
  bubbleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const reaction = btn.getAttribute('data-reaction');
      const rect = btn.getBoundingClientRect();
      
      // Floating reaction explosion
      for (let i = 0; i < 6; i++) {
        const p = document.createElement('div');
        p.className = 'flying-heart-particle';
        p.textContent = reaction;
        p.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 40}px`;
        p.style.top = `${rect.top}px`;
        flyingHeartsContainer.appendChild(p);
        setTimeout(() => p.remove(), 1600);
      }
      
      showToast(`${reaction} Sent reaction!`);
    });
  });

  /* ==========================================================================
     14. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  let toastTimeout = null;
  function showToast(msg) {
    if (toastMessage) toastMessage.textContent = msg;
    if (toastNotification) {
      toastNotification.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toastNotification.classList.remove('show');
      }, 2600);
    }
  }

  // Keyboard navigation support (Arrow Up / Down to scroll snaps)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      reelContainer.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      reelContainer.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
    }
  });

  // Initial trigger for top elements
  setTimeout(() => {
    const firstSectionAnims = sections[0].querySelectorAll('.animate-on-scroll');
    firstSectionAnims.forEach(el => el.classList.add('visible'));
  }, 300);
});
