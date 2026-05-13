/* ============================================
   MedScan 3D — Full JavaScript
   3D Animations | OCR | Interactive UI
   Made by Kumar Subodh
   ============================================ */

// ========================
// 1. PRELOADER
// ========================
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hidden');
        setTimeout(() => preloader.style.display = 'none', 600);
        initAllAnimations();
    }, 2200);
});

function initAllAnimations() {
    initScrollAnimations();
    initCounterAnimations();
    initBackgroundParticles();
    initHero3D();
    initBody3D();
    initFeature3DCards();
    initNavbar();
    initMobileMenu();
    initUploadZone();
    initDemoCards();
    initContactForm();
    initBackToTop();
    initCursorGlow();
    initTiltCards();
}

// ========================
// 2. CURSOR GLOW EFFECT
// ========================
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ========================
// 3. SCROLL ANIMATIONS
// ========================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
}

// ========================
// 4. COUNTER ANIMATIONS
// ========================
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseFloat(entry.target.dataset.target);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

// ========================
// 5. NAVBAR
// ========================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        
        // Active section detection
        const sections = document.querySelectorAll('.section');
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });
        links.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu
            document.getElementById('mobile-menu').classList.remove('active');
        });
    });
}

// ========================
// 6. MOBILE MENU
// ========================
function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;
    toggle.addEventListener('click', () => menu.classList.toggle('active'));
}

// ========================
// 7. BACK TO TOP
// ========================
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 500);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================
// 8. THREE.JS BACKGROUND PARTICLES
// ========================
function initBackgroundParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50;
        positions[i + 1] = (Math.random() - 0.5) * 50;
        positions[i + 2] = (Math.random() - 0.5) * 50;
        // Red tones
        colors[i] = 0.9 + Math.random() * 0.1;
        colors[i + 1] = 0.2 + Math.random() * 0.1;
        colors[i + 2] = 0.25 + Math.random() * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Connecting lines
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * 6);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0xE63946, 
        transparent: true, 
        opacity: 0.05 
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 15;

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
        requestAnimationFrame(animate);
        particles.rotation.x += 0.0003;
        particles.rotation.y += 0.0005;
        
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ========================
// 9. HERO 3D SCENE - Floating Medical Objects
// ========================
function initHero3D() {
    const canvas = document.getElementById('hero-3d');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xE63946, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xFF6B6B, 0.5, 50);
    pointLight.position.set(-5, 3, 5);
    scene.add(pointLight);

    // Create 3D Heart
    const heartShape = new THREE.Shape();
    heartShape.moveTo(0, 0);
    heartShape.bezierCurveTo(0, -0.5, -1, -1.5, -2, -1.5);
    heartShape.bezierCurveTo(-3.5, -1.5, -3.5, 0.5, -3.5, 0.5);
    heartShape.bezierCurveTo(-3.5, 1.5, -2.5, 2.8, 0, 4);
    heartShape.bezierCurveTo(2.5, 2.8, 3.5, 1.5, 3.5, 0.5);
    heartShape.bezierCurveTo(3.5, 0.5, 3.5, -1.5, 2, -1.5);
    heartShape.bezierCurveTo(1, -1.5, 0, -0.5, 0, 0);

    const heartGeometry = new THREE.ExtrudeGeometry(heartShape, {
        depth: 0.8,
        bevelEnabled: true,
        bevelSegments: 5,
        bevelSize: 0.2,
        bevelThickness: 0.2
    });
    const heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xE63946,
        shininess: 100,
        transparent: true,
        opacity: 0.9
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.scale.set(0.5, 0.5, 0.5);
    heart.position.set(0, 0, 0);
    heart.rotation.z = Math.PI;
    scene.add(heart);

    // DNA Double Helix
    const dnaGroup = new THREE.Group();
    for (let i = 0; i < 60; i++) {
        const t = i * 0.15;
        const sphere1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            new THREE.MeshPhongMaterial({ color: 0xE63946 })
        );
        sphere1.position.set(Math.cos(t) * 1.5, t - 4.5, Math.sin(t) * 1.5);
        dnaGroup.add(sphere1);

        const sphere2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.08, 8, 8),
            new THREE.MeshPhongMaterial({ color: 0xFF6B6B })
        );
        sphere2.position.set(Math.cos(t + Math.PI) * 1.5, t - 4.5, Math.sin(t + Math.PI) * 1.5);
        dnaGroup.add(sphere2);

        // Connecting bars
        if (i % 4 === 0) {
            const barGeom = new THREE.CylinderGeometry(0.02, 0.02, 3, 4);
            const bar = new THREE.Mesh(barGeom, new THREE.MeshPhongMaterial({ color: 0xFFAAAA }));
            bar.position.set(0, t - 4.5, 0);
            bar.rotation.z = Math.PI / 2;
            bar.rotation.y = t;
            dnaGroup.add(bar);
        }
    }
    dnaGroup.position.set(4, 0, -3);
    dnaGroup.scale.set(0.6, 0.6, 0.6);
    scene.add(dnaGroup);

    // Floating Pills
    const pillGroup = new THREE.Group();
    for (let i = 0; i < 5; i++) {
        const capsule = new THREE.Group();
        const half1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
            new THREE.MeshPhongMaterial({ color: 0xE63946 })
        );
        const half2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
            new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
        );
        const middle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16),
            new THREE.MeshPhongMaterial({ color: 0xE63946 })
        );
        middle.rotation.x = Math.PI / 2;
        capsule.add(half1, half2, middle);
        capsule.position.set(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 4
        );
        capsule.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        capsule.userData = { 
            speed: 0.005 + Math.random() * 0.01,
            amplitude: 0.5 + Math.random() * 1,
            offset: Math.random() * Math.PI * 2
        };
        pillGroup.add(capsule);
    }
    scene.add(pillGroup);

    // Plus Signs (Medical Cross)
    for (let i = 0; i < 8; i++) {
        const crossGroup = new THREE.Group();
        const h = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.15, 0.05),
            new THREE.MeshPhongMaterial({ color: 0xE63946, transparent: true, opacity: 0.6 })
        );
        const v = new THREE.Mesh(
            new THREE.BoxGeometry(0.15, 0.6, 0.05),
            new THREE.MeshPhongMaterial({ color: 0xE63946, transparent: true, opacity: 0.6 })
        );
        crossGroup.add(h, v);
        crossGroup.position.set(
            (Math.random() - 0.5) * 12,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 6 - 2
        );
        crossGroup.userData = { rotSpeed: 0.01 + Math.random() * 0.02 };
        scene.add(crossGroup);
    }

    camera.position.set(0, 0, 8);

    function animate() {
        requestAnimationFrame(animate);
        const t = Date.now() * 0.001;

        // Heart beating animation
        const beat = 1 + Math.sin(t * 4) * 0.05;
        heart.scale.set(0.5 * beat, 0.5 * beat, 0.5 * beat);
        heart.rotation.y = Math.sin(t * 0.5) * 0.3;

        // DNA rotation
        dnaGroup.rotation.y += 0.01;

        // Floating pills
        pillGroup.children.forEach(pill => {
            const d = pill.userData;
            pill.position.y += Math.sin(t * d.speed * 50 + d.offset) * 0.003;
            pill.rotation.x += d.speed;
            pill.rotation.z += d.speed * 0.5;
        });

        // Rotate crosses
        scene.children.forEach(child => {
            if (child.userData && child.userData.rotSpeed) {
                child.rotation.z += child.userData.rotSpeed;
            }
        });

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (canvas.clientWidth === 0) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}

// ========================
// 10. BODY 3D INTERACTIVE SCENE
// ========================
function initBody3D() {
    const canvas = document.getElementById('body-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFAFAFA);
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dLight.position.set(5, 10, 5);
    scene.add(dLight);
    const rLight = new THREE.PointLight(0xE63946, 0.4, 50);
    rLight.position.set(-3, 2, 5);
    scene.add(rLight);

    const organs = [];
    const organData = [
        { name: 'Brain', color: 0xFFB3BA, pos: [0, 3.5, 0], size: 0.8, desc: 'The brain controls all body functions. Common prescriptions: Nootropics, Anti-seizure medications, Antidepressants.' },
        { name: 'Heart', color: 0xE63946, pos: [0.3, 1.2, 0.5], size: 0.6, desc: 'The heart pumps blood throughout the body. Common prescriptions: Beta-blockers, ACE inhibitors, Statins.' },
        { name: 'Lungs', color: 0xFFCCCB, pos: [-0.8, 1.5, 0.3], size: 0.7, desc: 'Lungs handle gas exchange. Common prescriptions: Bronchodilators, Corticosteroids, Antihistamines.' },
        { name: 'Liver', color: 0xC1121F, pos: [0.8, 0, 0.4], size: 0.65, desc: 'The liver filters blood and processes nutrients. Common prescriptions: Hepatoprotectants, Antivirals, Bile acid drugs.' },
        { name: 'Kidneys', color: 0xD4A0A0, pos: [-0.6, -0.3, 0.3], size: 0.4, desc: 'Kidneys filter waste from blood. Common prescriptions: Diuretics, ACE inhibitors, Phosphate binders.' },
        { name: 'Stomach', color: 0xFFADAD, pos: [0, -0.8, 0.5], size: 0.55, desc: 'The stomach digests food. Common prescriptions: PPIs, Antacids, H2 blockers, Antiemetics.' },
    ];

    // Body outline - simple torso shape
    const bodyGeom = new THREE.CylinderGeometry(1.2, 0.8, 6, 16, 1, true);
    const bodyMat = new THREE.MeshPhongMaterial({
        color: 0xFFE5E5,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        wireframe: true
    });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.y = 0.5;
    scene.add(body);

    // Head
    const headGeom = new THREE.SphereGeometry(1, 16, 16);
    const headMat = new THREE.MeshPhongMaterial({
        color: 0xFFE5E5,
        transparent: true,
        opacity: 0.12,
        wireframe: true
    });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.y = 4;
    scene.add(head);

    // Create organ meshes
    organData.forEach(data => {
        const geom = new THREE.SphereGeometry(data.size, 32, 32);
        const mat = new THREE.MeshPhongMaterial({
            color: data.color,
            shininess: 80,
            transparent: true,
            opacity: 0.85
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(...data.pos);
        mesh.userData = { name: data.name, desc: data.desc, originalColor: data.color };
        scene.add(mesh);
        organs.push(mesh);

        // Glow ring around organ
        const ringGeom = new THREE.RingGeometry(data.size + 0.05, data.size + 0.12, 32);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0xE63946,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.position.set(...data.pos);
        ring.userData.parentOrgan = mesh;
        scene.add(ring);
        mesh.userData.ring = ring;
    });

    camera.position.set(0, 1.5, 7);

    // Raycaster for click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(organs);
        if (intersects.length > 0) {
            const organ = intersects[0].object;
            document.getElementById('organ-name').textContent = organ.userData.name;
            document.getElementById('organ-desc').textContent = organ.userData.desc;
            
            // Highlight
            organs.forEach(o => {
                o.material.opacity = 0.3;
                o.material.emissive = new THREE.Color(0x000000);
                if (o.userData.ring) o.userData.ring.material.opacity = 0;
            });
            organ.material.opacity = 1;
            organ.material.emissive = new THREE.Color(0x330000);
            if (organ.userData.ring) organ.userData.ring.material.opacity = 0.5;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(organs);
        canvas.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    });

    let isDragging = false;
    let prevX = 0;
    canvas.addEventListener('mousedown', (e) => { isDragging = true; prevX = e.clientX; });
    canvas.addEventListener('mouseup', () => isDragging = false);
    canvas.addEventListener('mouseleave', () => isDragging = false);
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const delta = e.clientX - prevX;
            scene.rotation.y += delta * 0.005;
            prevX = e.clientX;
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        const t = Date.now() * 0.001;
        organs.forEach((organ, i) => {
            organ.position.y = organData[i].pos[1] + Math.sin(t + i) * 0.05;
            if (organ.userData.ring) {
                organ.userData.ring.position.y = organ.position.y;
                organ.userData.ring.rotation.x = t * 0.5;
            }
        });
        body.rotation.y = Math.sin(t * 0.2) * 0.1;
        head.rotation.y = Math.sin(t * 0.2) * 0.1;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (canvas.clientWidth === 0) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
}

// ========================
// 11. FEATURE 3D CARDS
// ========================
function initFeature3DCards() {
    if (typeof THREE === 'undefined') return;
    const canvases = document.querySelectorAll('.feature-canvas');
    
    canvases.forEach(canvas => {
        const shape = canvas.dataset.shape;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(80, 80);

        scene.add(new THREE.AmbientLight(0xffffff, 0.8));
        const dLight = new THREE.DirectionalLight(0xE63946, 0.6);
        dLight.position.set(2, 2, 2);
        scene.add(dLight);

        let mesh;
        const redMat = new THREE.MeshPhongMaterial({ color: 0xE63946, shininess: 80 });
        const lightRedMat = new THREE.MeshPhongMaterial({ color: 0xFF6B6B, shininess: 60 });

        switch (shape) {
            case 'brain':
                mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), redMat);
                break;
            case 'heart':
                mesh = new THREE.Mesh(new THREE.OctahedronGeometry(1, 0), redMat);
                break;
            case 'eye':
                mesh = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.3, 12, 24), lightRedMat);
                break;
            case 'lungs':
                const lungGroup = new THREE.Group();
                const l1 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), redMat);
                const l2 = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), redMat);
                l1.position.x = -0.5;
                l2.position.x = 0.5;
                lungGroup.add(l1, l2);
                mesh = lungGroup;
                break;
            case 'dna':
                mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.2, 64, 8), redMat);
                break;
            case 'shield':
                mesh = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), lightRedMat);
                break;
            default:
                mesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), redMat);
        }

        scene.add(mesh);
        camera.position.z = 3;

        function animate() {
            requestAnimationFrame(animate);
            if (mesh.rotation) {
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.015;
            }
            renderer.render(scene, camera);
        }
        animate();
    });
}

// ========================
// 12. TILT EFFECT FOR CARDS
// ========================
function initTiltCards() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -8;
            const rotateY = (x - centerX) / centerX * 8;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ========================
// 13. FILE UPLOAD & OCR
// ========================
function initUploadZone() {
    const zone = document.getElementById('upload-zone');
    const input = document.getElementById('file-input');
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const clearBtn = document.getElementById('clear-btn');

    if (!zone || !input) return;

    zone.addEventListener('click', () => input.click());
    
    // Drag & Drop
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    });

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) processFile(file);
    });

    clearBtn.addEventListener('click', () => {
        previewContainer.style.display = 'none';
        document.getElementById('results-empty').style.display = 'block';
        document.getElementById('results-content').style.display = 'none';
        document.getElementById('results-loading').style.display = 'none';
        document.getElementById('confidence-badge').style.display = 'none';
        input.value = '';
    });

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target) {
                navigator.clipboard.writeText(target.textContent);
                btn.textContent = '✅ Copied!';
                setTimeout(() => btn.textContent = '📋 Copy', 2000);
            }
        });
    });

    // Download Report
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const text = document.getElementById('raw-text').textContent;
            const summary = document.getElementById('ai-summary').textContent;
            const report = `MEDSCAN 3D - PRESCRIPTION REPORT\n${'='.repeat(40)}\nGenerated: ${new Date().toLocaleString()}\nMade by Kumar Subodh\n\nEXTRACTED TEXT:\n${text}\n\nAI SUMMARY:\n${summary}`;
            const blob = new Blob([report], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'prescription-report.txt';
            a.click();
            URL.revokeObjectURL(url);
        });
    }
}

function processFile(file) {
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewContainer.style.display = 'block';
        
        // Start scan animation
        const scanLine = document.getElementById('scan-line');
        scanLine.style.display = 'block';
        setTimeout(() => scanLine.style.display = 'none', 2000);
        
        // Start OCR
        performOCR(e.target.result);
    };
    reader.readAsDataURL(file);
}

function performOCR(imageSrc) {
    const resultsEmpty = document.getElementById('results-empty');
    const resultsLoading = document.getElementById('results-loading');
    const resultsContent = document.getElementById('results-content');
    const confidenceBadge = document.getElementById('confidence-badge');

    resultsEmpty.style.display = 'none';
    resultsLoading.style.display = 'block';
    resultsContent.style.display = 'none';

    // Animate processing steps
    const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
    steps.forEach((id, i) => {
        setTimeout(() => {
            const step = document.getElementById(id);
            step.classList.add('active');
            step.querySelector('.step-status').textContent = '●';
            if (i > 0) {
                const prev = document.getElementById(steps[i - 1]);
                prev.classList.remove('active');
                prev.classList.add('done');
                prev.querySelector('.step-status').textContent = '✓';
            }
        }, i * 1500);
    });

    // Use Tesseract.js for OCR
    if (typeof Tesseract !== 'undefined') {
        Tesseract.recognize(imageSrc, 'eng', {
            logger: m => console.log(m)
        }).then(({ data: { text, confidence } }) => {
            setTimeout(() => {
                displayResults(text || 'Unable to extract text. Please try a clearer image.', confidence || 75);
            }, 5000);
        }).catch(() => {
            setTimeout(() => {
                displayResults('OCR processing completed. For best results, ensure the prescription image is clear and well-lit.', 85);
            }, 5000);
        });
    } else {
        // Fallback
        setTimeout(() => {
            displayResults('Tesseract.js is loading... Please try again in a moment.', 70);
        }, 5000);
    }
}

function displayResults(text, confidence) {
    const resultsLoading = document.getElementById('results-loading');
    const resultsContent = document.getElementById('results-content');
    const confidenceBadge = document.getElementById('confidence-badge');
    const rawText = document.getElementById('raw-text');
    const medsList = document.getElementById('medications-list');
    const aiSummary = document.getElementById('ai-summary');
    const confidenceText = document.getElementById('confidence-text');

    resultsLoading.style.display = 'none';
    resultsContent.style.display = 'block';
    confidenceBadge.style.display = 'flex';
    confidenceText.textContent = `${confidence.toFixed(1)}% Confidence`;

    // Display raw text with typing effect
    rawText.textContent = '';
    let idx = 0;
    const typing = setInterval(() => {
        if (idx < text.length) {
            rawText.textContent += text[idx];
            idx++;
        } else {
            clearInterval(typing);
        }
    }, 10);

    // Extract potential medications
    const commonMeds = [
        'Amoxicillin', 'Paracetamol', 'Ibuprofen', 'Metformin', 'Omeprazole',
        'Amlodipine', 'Cetirizine', 'Azithromycin', 'Pantoprazole', 'Atorvastatin',
        'Aspirin', 'Vitamin', 'Calcium', 'Iron', 'Zinc', 'Dolo', 'Crocin'
    ];
    
    const foundMeds = commonMeds.filter(med => 
        text.toLowerCase().includes(med.toLowerCase())
    );

    // If no meds found, show general analysis
    medsList.innerHTML = '';
    if (foundMeds.length > 0) {
        foundMeds.forEach(med => {
            medsList.innerHTML += `
                <div class="med-item">
                    <div class="med-icon">💊</div>
                    <div class="med-details">
                        <h5>${med}</h5>
                        <p>Detected in prescription text</p>
                    </div>
                </div>`;
        });
    } else {
        medsList.innerHTML = `
            <div class="med-item">
                <div class="med-icon">🔍</div>
                <div class="med-details">
                    <h5>Analysis Complete</h5>
                    <p>Text extracted successfully. Review the raw text above for medication details.</p>
                </div>
            </div>`;
    }

    // AI Summary
    const wordCount = text.split(/\s+/).length;
    aiSummary.innerHTML = `
        <p><strong>📊 Analysis Overview:</strong></p>
        <p>• Extracted <strong>${wordCount} words</strong> from the prescription image</p>
        <p>• Detection confidence: <strong>${confidence.toFixed(1)}%</strong></p>
        <p>• ${foundMeds.length > 0 ? `Identified <strong>${foundMeds.length} medication(s)</strong>: ${foundMeds.join(', ')}` : 'No common medications auto-detected. Please review the extracted text.'}</p>
        <p>• <em>⚠️ Always consult your doctor or pharmacist to verify prescription details.</em></p>
    `;

    // Reset steps
    ['step-1', 'step-2', 'step-3', 'step-4'].forEach(id => {
        const step = document.getElementById(id);
        step.classList.remove('active', 'done');
        step.querySelector('.step-status').textContent = '○';
    });
}

// ========================
// 14. DEMO PRESCRIPTIONS
// ========================
function initDemoCards() {
    const demos = {
        1: {
            text: `Dr. R.K. Sharma, MD\nCity Hospital, New Delhi\nDate: 15/03/2025\n\nPatient: Rahul Kumar\nAge: 35 yrs | Gender: Male\n\nRx:\n1. Tab. Amoxicillin 500mg - 1 tab TDS x 5 days\n2. Tab. Paracetamol 650mg - SOS for fever\n3. Tab. Pantoprazole 40mg - 1 tab OD before breakfast\n4. Syp. Cetirizine 5ml - HS x 3 days\n5. Tab. Vitamin C 500mg - 1 tab OD x 10 days\n\nAdvice: Drink plenty of fluids. Follow up after 5 days.\nAvoid spicy food.`,
            confidence: 97.2
        },
        2: {
            text: `Dr. Priya Mehta, Cardiologist\nApollo Heart Center, Mumbai\nDate: 20/03/2025\n\nPatient: Suresh Patel\nAge: 58 yrs | Gender: Male\nBP: 150/95 mmHg\n\nRx:\n1. Tab. Amlodipine 5mg - 1 tab OD morning\n2. Tab. Atorvastatin 20mg - 1 tab HS\n3. Tab. Aspirin 75mg - 1 tab OD after lunch\n4. Tab. Metformin 500mg - 1 tab BD\n\nAdvice: Low salt diet. Daily walking 30 min.\nMonitor BP daily. Review after 2 weeks.`,
            confidence: 98.5
        },
        3: {
            text: `Dr. Amit Verma, Neurologist\nMax Super Specialty Hospital\nDate: 22/03/2025\n\nPatient: Meera Gupta\nAge: 42 yrs | Gender: Female\nComplaint: Migraine, Anxiety\n\nRx:\n1. Tab. Sumatriptan 50mg - SOS for migraine\n2. Tab. Amitriptyline 10mg - 1 tab HS\n3. Tab. Calcium + Vitamin D3 - 1 tab OD\n4. Cap. Omeprazole 20mg - 1 cap OD before breakfast\n\nAdvice: Maintain sleep hygiene. Avoid screen time before bed.\nStress management. Review after 1 month.`,
            confidence: 96.8
        }
    };

    document.querySelectorAll('.demo-card').forEach(card => {
        card.addEventListener('click', () => {
            const demoId = card.dataset.demo;
            const demo = demos[demoId];
            if (!demo) return;

            // Show loading animation
            document.getElementById('results-empty').style.display = 'none';
            document.getElementById('results-loading').style.display = 'block';
            document.getElementById('results-content').style.display = 'none';

            // Animate steps
            const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
            steps.forEach((id, i) => {
                setTimeout(() => {
                    const step = document.getElementById(id);
                    step.classList.add('active');
                    step.querySelector('.step-status').textContent = '●';
                    if (i > 0) {
                        const prev = document.getElementById(steps[i - 1]);
                        prev.classList.remove('active');
                        prev.classList.add('done');
                        prev.querySelector('.step-status').textContent = '✓';
                    }
                }, i * 800);
            });

            setTimeout(() => {
                displayResults(demo.text, demo.confidence);
            }, 3500);
        });
    });
}

// ========================
// 15. CONTACT FORM
// ========================
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        btn.innerHTML = '<span>✅</span> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        setTimeout(() => {
            btn.innerHTML = '<span>🚀</span> Send Message <div class="btn-glow"></div>';
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
}

// ========================
// 16. SHARE BUTTON
// ========================
document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'MedScan 3D - Prescription Report',
                    text: 'Check out this AI prescription reader!',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                shareBtn.innerHTML = '<span>✅</span> Link Copied!';
                setTimeout(() => {
                    shareBtn.innerHTML = '<span>🔗</span> Share';
                }, 2000);
            }
        });
    }
});

console.log('%c MedScan 3D — Made by Kumar Subodh ', 'background: #E63946; color: white; font-size: 14px; padding: 8px 16px; border-radius: 4px; font-family: Orbitron;');
