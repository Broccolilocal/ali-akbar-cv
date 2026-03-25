/* ============================================================
   Ali Akbar — Interactive CV
   Modules: 3D Bubbles (Three.js) | Ocean Audio (Web Audio API)
            Scroll Reveals | Expandable Cards | Nav Dots
   ============================================================ */

(function () {
  'use strict';

  // ── Wait for DOM ──
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initBubbles();
    initScrollReveal();
    initExpandableCards();
    initNavDots();
    initAudio();
    initSmoothScroll();
    hideLoader();
  }

  /* ============================================================
     1. THREE.JS 3D BUBBLE ANIMATION
     ============================================================ */
  function initBubbles() {
    const canvas = document.getElementById('bubble-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x4466aa, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(0xC8963E, 1.2, 60);
    pointLight1.position.set(-15, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x2C5A8C, 0.9, 60);
    pointLight2.position.set(15, -10, 5);
    scene.add(pointLight2);

    // Bubbles
    const bubbles = [];
    const bubbleCount = getBubbleCount();
    const bubbleGeometry = new THREE.SphereGeometry(1, 32, 32);

    for (let i = 0; i < bubbleCount; i++) {
      const scale = 0.4 + Math.random() * 2.2;
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.55 + Math.random() * 0.15, 0.3 + Math.random() * 0.3, 0.5 + Math.random() * 0.2),
        transparent: true,
        opacity: 0.15 + Math.random() * 0.2,
        shininess: 200,
        specular: new THREE.Color(0xC8963E),
        reflectivity: 0.9,
      });

      const mesh = new THREE.Mesh(bubbleGeometry, material);
      mesh.scale.setScalar(scale);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20 - 5
      );

      scene.add(mesh);

      bubbles.push({
        mesh,
        baseX: mesh.position.x,
        baseY: mesh.position.y,
        baseZ: mesh.position.z,
        speedX: 0.1 + Math.random() * 0.3,
        speedY: 0.1 + Math.random() * 0.3,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        scale,
      });
    }

    // Mouse tracking
    const mouse = { x: 0, y: 0, worldX: 0, worldY: 0 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.worldX = mouse.x * 25;
      mouse.worldY = mouse.y * 20;
    });

    // Touch support
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
        mouse.worldX = mouse.x * 25;
        mouse.worldY = mouse.y * 20;
      }
    }, { passive: true });

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animate
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      for (const b of bubbles) {
        // Floating motion
        b.mesh.position.x = b.baseX + Math.sin(elapsed * b.speedX + b.phaseX) * 3;
        b.mesh.position.y = b.baseY + Math.cos(elapsed * b.speedY + b.phaseY) * 2.5;
        b.mesh.position.z = b.baseZ + Math.sin(elapsed * 0.2 + b.phaseZ) * 1.5;

        // Mouse interaction — gentle attraction/repulsion
        const dx = mouse.worldX - b.mesh.position.x;
        const dy = mouse.worldY - b.mesh.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 15);

        b.mesh.position.x += dx * influence * 0.015;
        b.mesh.position.y += dy * influence * 0.015;

        // Subtle scale pulse
        const pulseFactor = 1 + Math.sin(elapsed * 1.5 + b.phaseX) * 0.05;
        b.mesh.scale.setScalar(b.scale * pulseFactor);

        // Slow rotation
        b.mesh.rotation.x += 0.002;
        b.mesh.rotation.y += 0.003;
      }

      // Camera subtle sway
      camera.position.x = Math.sin(elapsed * 0.15) * 1.5;
      camera.position.y = Math.cos(elapsed * 0.1) * 1;

      renderer.render(scene, camera);
    }

    animate();
  }

  function getBubbleCount() {
    const w = window.innerWidth;
    if (w < 480) return 10;
    if (w < 768) return 15;
    return 22;
  }

  /* ============================================================
     2. OCEAN WAVE AUDIO (Web Audio API — no external files)
     ============================================================ */
  function initAudio() {
    const toggleBtn = document.getElementById('audio-toggle');
    const volumeSlider = document.getElementById('audio-volume');
    const iconOn = document.getElementById('audio-icon-on');
    const iconOff = document.getElementById('audio-icon-off');

    if (!toggleBtn || !volumeSlider) return;

    let audioCtx = null;
    let isPlaying = false;
    let masterGain = null;
    let nodes = [];

    function createOceanSound() {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = volumeSlider.value / 100 * 0.4; // Scale down for comfort
      masterGain.connect(audioCtx.destination);

      // Layer 1: Brown noise (ocean base)
      const bufferSize = 2 * audioCtx.sampleRate;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Low pass filter for deep ocean sound
      const lpFilter = audioCtx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.value = 500;
      lpFilter.Q.value = 1;

      // Modulate volume with LFO for wave-like effect
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 0.7;

      const lfo = audioCtx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.08; // Very slow wave rhythm
      const lfoDepth = audioCtx.createGain();
      lfoDepth.gain.value = 0.3;
      lfo.connect(lfoDepth);
      lfoDepth.connect(lfoGain.gain);

      noiseSource.connect(lpFilter);
      lpFilter.connect(lfoGain);
      lfoGain.connect(masterGain);

      noiseSource.start();
      lfo.start();

      nodes.push(noiseSource, lfo);

      // Layer 2: Higher frequency wash (foam/bubbles)
      const foamBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const foamData = foamBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        foamData[i] = (Math.random() * 2 - 1) * 0.5;
      }

      const foamSource = audioCtx.createBufferSource();
      foamSource.buffer = foamBuffer;
      foamSource.loop = true;

      const foamFilter = audioCtx.createBiquadFilter();
      foamFilter.type = 'bandpass';
      foamFilter.frequency.value = 2000;
      foamFilter.Q.value = 0.5;

      const foamGain = audioCtx.createGain();
      foamGain.gain.value = 0.06;

      const foamLfo = audioCtx.createOscillator();
      foamLfo.type = 'sine';
      foamLfo.frequency.value = 0.12;
      const foamLfoDepth = audioCtx.createGain();
      foamLfoDepth.gain.value = 0.04;
      foamLfo.connect(foamLfoDepth);
      foamLfoDepth.connect(foamGain.gain);

      foamSource.connect(foamFilter);
      foamFilter.connect(foamGain);
      foamGain.connect(masterGain);

      foamSource.start();
      foamLfo.start();

      nodes.push(foamSource, foamLfo);
    }

    function toggleAudio() {
      if (!isPlaying) {
        if (!audioCtx) {
          createOceanSound();
        } else {
          audioCtx.resume();
        }
        isPlaying = true;
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
      } else {
        if (audioCtx) audioCtx.suspend();
        isPlaying = false;
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
      }
    }

    toggleBtn.addEventListener('click', toggleAudio);

    volumeSlider.addEventListener('input', () => {
      if (masterGain) {
        masterGain.gain.setTargetAtTime(
          volumeSlider.value / 100 * 0.4,
          audioCtx.currentTime,
          0.1
        );
      }
    });

    // Start with audio off — show off icon
    iconOn.classList.add('hidden');
    iconOff.classList.remove('hidden');
  }

  /* ============================================================
     3. SCROLL REVEAL (IntersectionObserver)
     ============================================================ */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-up');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  /* ============================================================
     4. EXPANDABLE EXPERIENCE CARDS
     ============================================================ */
  function initExpandableCards() {
    const cards = document.querySelectorAll('[data-expandable]');

    cards.forEach((card) => {
      const toggle = card.querySelector('.exp-toggle');
      const header = card.querySelector('.exp-header');

      function expand() {
        card.classList.toggle('expanded');
      }

      if (toggle) toggle.addEventListener('click', (e) => { e.stopPropagation(); expand(); });
      if (header) header.addEventListener('click', expand);
    });
  }

  /* ============================================================
     5. NAVIGATION DOTS
     ============================================================ */
  function initNavDots() {
    const dots = document.querySelectorAll('.nav-dot');
    const sections = document.querySelectorAll('.section');

    // Click handler
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const target = document.getElementById(dot.dataset.section);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Active state on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            dots.forEach((d) => d.classList.remove('active'));
            const activeDot = document.querySelector(`.nav-dot[data-section="${entry.target.id}"]`);
            if (activeDot) activeDot.classList.add('active');
          }
        }
      },
      { threshold: 0.3 }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  /* ============================================================
     6. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     7. LOADER
     ============================================================ */
  function hideLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // Give Three.js a moment to render first frame
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  }

})();
