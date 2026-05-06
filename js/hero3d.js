/**
 * hero3d.js — ULTRA PREMIUM Three.js 3D Experience
 * Features the ₹40 Lakh "Iron Man" Particle Point-Cloud Assembly Shader
 */

(function () {
  'use strict';

  function loadScript(src, onload) {
    const s = document.createElement('script');
    s.src = src;
    s.onload = onload;
    document.head.appendChild(s);
  }

  function initThreeScene() {
    const canvas = document.getElementById('hero-3d-canvas');
    if (!canvas) return;

    // ── Scene Setup ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 22);

    // ── Lighting ────────────────────────────────────────────────────────────
    const ambientLight = new THREE.AmbientLight(0x0a0a2e, 2.0);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 4, 60);
    pointLight1.position.set(-15, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 3, 60);
    pointLight2.position.set(15, -8, 8);
    scene.add(pointLight2);

    // ── Groups for Separation ───────────────────────────────────────────────
    const torusGroup = new THREE.Group();
    const profileGroup = new THREE.Group();
    const ringGroup = new THREE.Group();
    
    scene.add(torusGroup);
    scene.add(profileGroup);
    scene.add(ringGroup);

    // ── Torus Knot Background ────────────────────────────────────────────────
    const torusKnotGeo = new THREE.TorusKnotGeometry(3.2, 0.9, 160, 20, 2, 3);
    const torusKnotMat = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      emissive: 0x1e40af,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
      roughness: 0.1,
      metalness: 0.8
    });
    const torusKnot = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    torusGroup.add(torusKnot);

    const torusKnotSolidMat = new THREE.MeshPhysicalMaterial({
      color: 0x6366f1,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.15,
      roughness: 0.2,
      clearcoat: 1.0
    });
    const torusKnotSolid = new THREE.Mesh(new THREE.TorusKnotGeometry(3.0, 0.7, 120, 16, 2, 3), torusKnotSolidMat);
    torusGroup.add(torusKnotSolid);
    torusGroup.position.set(10, 0, -8);

    // ── The "Iron Man" Point-Cloud Extraction & Shader ───────────────────────
    const img = new Image();
    img.src = 'assets/profile.jpeg'; // Ensure the path is correct
    img.crossOrigin = "Anonymous";

    img.onload = () => {
        // Draw to hidden canvas to extract pixels
        const tmpCanvas = document.createElement('canvas');
        const resolution = 140; // High detail without crashing GPU
        tmpCanvas.width = resolution;
        tmpCanvas.height = resolution * (img.height / img.width);
        const ctx = tmpCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0, tmpCanvas.width, tmpCanvas.height);
        
        const imgData = ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height).data;
        
        const targetPositions = [];
        const randomPositions = [];
        const colors = [];

        for (let y = 0; y < tmpCanvas.height; y++) {
            for (let x = 0; x < tmpCanvas.width; x++) {
                const i = (y * tmpCanvas.width + x) * 4;
                const r = imgData[i];
                const g = imgData[i+1];
                const b = imgData[i+2];
                const a = imgData[i+3];
                
                // Skip fully transparent pixels and occasionally skip very dark pixels to create "holes" for depth
                if (a > 50 && (r + g + b) > 30) {
                    // Map X/Y to 3D center
                    const pX = (x - tmpCanvas.width / 2) * 0.06;
                    const pY = -(y - tmpCanvas.height / 2) * 0.06;
                    // Add slight Z-depth variation based on brightness (bright pixels pop forward)
                    const brightness = (r + g + b) / (255 * 3);
                    const pZ = brightness * 1.5; 
                    
                    targetPositions.push(pX, pY, pZ);
                    
                    // The "Galaxy" starting state
                    randomPositions.push(
                        (Math.random() - 0.5) * 80,
                        (Math.random() - 0.5) * 80,
                        (Math.random() - 0.5) * 80
                    );
                    
                    // Boost colors for neon aesthetic
                    colors.push(r / 255, g / 255, b / 255);
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(randomPositions, 3));
        geometry.setAttribute('targetPosition', new THREE.Float32BufferAttribute(targetPositions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uProgress: { value: 0.0 }, // 0 = Chaos, 1 = Formed Image
                uPointSize: { value: 3.0 },
                uTime: { value: 0.0 }
            },
            vertexShader: `
                uniform float uProgress;
                uniform float uPointSize;
                uniform float uTime;
                
                attribute vec3 targetPosition;
                attribute vec3 color;
                
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    
                    // Idle Wobble: increased amplitude for more noticeable motion
                    vec3 idleWobble = vec3(
                        sin(uTime * 2.0 + targetPosition.x * 2.0) * 0.2,
                        cos(uTime * 1.5 + targetPosition.y * 2.0) * 0.2,
                        sin(uTime * 1.0 + targetPosition.z * 2.0) * 0.15
                    );
                    
                    vec3 finalTarget = targetPosition + idleWobble;
                    
                    // GLSL Mix handles the interpolation flawlessly
                    // We use an exponential easing curve built into math for a snappy "magnetic" snap-to-grid effect
                    float easeProgress = pow(uProgress, 2.0);
                    vec3 mixedPosition = mix(position, finalTarget, easeProgress);
                    
                    vec4 mvPosition = modelViewMatrix * vec4(mixedPosition, 1.0);
                    
                    // Size attenuation so distant particles are smaller
                    gl_PointSize = uPointSize * (15.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    // Make the particles perfect circles, not squares
                    float dist = distance(gl_PointCoord, vec2(0.5));
                    if(dist > 0.5) discard;
                    
                    gl_FragColor = vec4(vColor, 0.9);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending // Makes the dense pixels glow intensely
        });

        const pointCloud = new THREE.Points(geometry, material);
        profileGroup.add(pointCloud);
        
        profileGroup.position.set(6, 2, -10);
        profileGroup.rotation.y = -Math.PI / 10;
        
        window.pointCloudMat = material;
        window.pointCloudMesh = pointCloud;

        // GSAP Implementation for the Shader
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            // Animate the Shader Uniform based on scroll
            gsap.to(window.pointCloudMat.uniforms.uProgress, {
                value: 1.0,
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5
                }
            });

            // Standard profile group parallax
            gsap.to(profileGroup.position, {
                x: 8 - 15,
                y: 2 - 20,
                z: -10 + 5,
                scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 }
            });
            
            gsap.to(profileGroup.rotation, {
                y: Math.PI / 4,
                scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 1.5 }
            });
        }
    };

    // ── Standard Ambient Particle Nebula ─────────────────────────────────────
    const bgParticleGeo = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      bgPositions[i*3] = (Math.random() - 0.5) * 80;
      bgPositions[i*3+1] = 20 - Math.random() * 80;
      bgPositions[i*3+2] = 5 - Math.random() * 60;
    }
    bgParticleGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    const bgParticleMat = new THREE.PointsMaterial({
        color: 0x3b82f6, size: 0.1, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending
    });
    const ambientParticles = new THREE.Points(bgParticleGeo, bgParticleMat);
    scene.add(ambientParticles);

    // ── Mouse Parallax ───────────────────────────────────────────────────────
    let mouseX = 0, mouseY = 0;
    let targetMouseX = 0, targetMouseY = 0;
    document.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // ── Continuous Animation Loop ────────────────────────────────────────────
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.015; 

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      scene.position.x = mouseX * 0.8;
      scene.position.y = mouseY * 0.8;
      
      torusKnot.rotation.y += 0.008;
      torusKnot.rotation.x += 0.004;
      torusKnotSolid.rotation.copy(torusKnot.rotation);
      
      ambientParticles.rotation.y = time * 0.02;

      // Update Custom Shader Time for Idle Wobble
      if (window.pointCloudMat) {
          window.pointCloudMat.uniforms.uTime.value = time;
      }
      
      // Continuous floating physics for the assembled face
      if (window.pointCloudMesh) {
          window.pointCloudMesh.position.y = Math.sin(time * 1.5) * 0.3;
          window.pointCloudMesh.position.x = Math.cos(time * 1.2) * 0.15;
          window.pointCloudMesh.rotation.z = Math.sin(time * 0.8) * 0.05;
          window.pointCloudMesh.rotation.x = Math.cos(time * 1.1) * 0.05;
          window.pointCloudMesh.rotation.y = Math.sin(time * 0.5) * 0.05;
      }

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js', () => {
      if (typeof gsap === 'undefined') {
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', () => {
              loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js', initThreeScene);
          });
      } else {
          initThreeScene();
      }
  });

})();
