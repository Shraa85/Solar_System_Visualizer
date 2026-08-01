const PLANET_DATA = {
    mercury: {
        name: 'Mercury',
        diameter: '4,879 km',
        distance: '57.9 million km',
        moons: '0',
        dayLength: '58.6 Earth days',
        yearLength: '87.97 Earth days',
        temperature: '-173°C to 427°C',
        description: 'Mercury is the smallest planet and the closest planet to the Sun.',
        fact: 'A year on Mercury is shorter than a day on Mercury.',
        note: 'Because it is so close to the Sun, Mercury experiences extreme temperature changes.'
    },
    venus: {
        name: 'Venus',
        diameter: '12,104 km',
        distance: '108.2 million km',
        moons: '0',
        dayLength: '243 Earth days (retrograde)',
        yearLength: '224.7 Earth days',
        temperature: '465°C average',
        description: 'Venus is the hottest planet because its thick atmosphere traps heat.',
        fact: 'Venus spins in the opposite direction compared to most planets.',
        note: 'Its dense carbon dioxide atmosphere creates an extreme greenhouse effect.'
    },
    earth: {
        name: 'Earth',
        diameter: '12,742 km',
        distance: '149.6 million km',
        moons: '1',
        dayLength: '23.9 hours',
        yearLength: '365.25 days',
        temperature: '-88°C to 58°C',
        description: 'Earth is our home planet and the only known world that supports life.',
        fact: 'About 71% of Earth’s surface is covered with water.',
        note: 'Earth rotates once every day while revolving around the Sun once every year.'
    },
    mars: {
        name: 'Mars',
        diameter: '6,779 km',
        distance: '227.9 million km',
        moons: '2',
        dayLength: '24.6 hours',
        yearLength: '687 Earth days',
        temperature: '-143°C to 35°C',
        description: 'Mars is called the Red Planet because iron-rich dust covers its surface.',
        fact: 'Mars has the tallest known volcano in the solar system: Olympus Mons.',
        note: 'Mars is one of the most studied planets for future human missions.'
    },
    jupiter: {
        name: 'Jupiter',
        diameter: '139,820 km',
        distance: '778.5 million km',
        moons: '95+',
        dayLength: '9.9 hours',
        yearLength: '11.86 Earth years',
        temperature: '-110°C',
        description: 'Jupiter is the largest planet in the solar system.',
        fact: 'Its Great Red Spot is a giant storm that has lasted for centuries.',
        note: 'Jupiter is a gas giant, so it does not have a solid surface like Earth.'
    },
    saturn: {
        name: 'Saturn',
        diameter: '116,460 km',
        distance: '1.43 billion km',
        moons: '146+',
        dayLength: '10.7 hours',
        yearLength: '29.46 Earth years',
        temperature: '-140°C',
        description: 'Saturn is famous for its beautiful rings made of ice and rock.',
        fact: 'Saturn could float in water because its average density is very low.',
        note: 'Its rings are very wide but surprisingly thin compared to the planet’s size.'
    },
    uranus: {
        name: 'Uranus',
        diameter: '50,724 km',
        distance: '2.87 billion km',
        moons: '27+',
        dayLength: '17 hours',
        yearLength: '84 Earth years',
        temperature: '-195°C',
        description: 'Uranus is an ice giant and rotates on its side.',
        fact: 'Its tilt is so extreme that its seasons are very unusual.',
        note: 'Uranus likely tilted long ago after a major collision.'
    },
    neptune: {
        name: 'Neptune',
        diameter: '49,244 km',
        distance: '4.50 billion km',
        moons: '14+',
        dayLength: '16 hours',
        yearLength: '164.8 Earth years',
        temperature: '-200°C',
        description: 'Neptune is the farthest major planet from the Sun.',
        fact: 'Neptune has some of the fastest winds in the solar system.',
        note: 'Its deep blue color is linked to gases in its atmosphere.'
    }
};

const PLANET_CONFIG = [
    { key: 'mercury', radius: 1.9, orbitRadius: 16, color: 0x8c7853, texture: '/static/planet_images/mercury.jpg', orbitalPeriodDays: 87.97, rotationPeriodDays: 58.6, inclination: 7.0, axialTilt: 0.03 },
    { key: 'venus', radius: 3.0, orbitRadius: 24, color: 0xffc649, texture: '/static/planet_images/venus.jpg', orbitalPeriodDays: 224.7, rotationPeriodDays: -243.0, inclination: 3.39, axialTilt: 177.4 },
    { key: 'earth', radius: 3.35, orbitRadius: 33, color: 0x4a90e2, texture: '/static/planet_images/earth.jpg', orbitalPeriodDays: 365.25, rotationPeriodDays: 1.0, inclination: 0.0, axialTilt: 23.44, hasAtmosphere: true },
    { key: 'mars', radius: 2.6, orbitRadius: 43, color: 0xe27b58, texture: '/static/planet_images/mars.jpg', orbitalPeriodDays: 687, rotationPeriodDays: 1.03, inclination: 1.85, axialTilt: 25.19 },
    { key: 'jupiter', radius: 7.1, orbitRadius: 58, color: 0xc88b3a, texture: '/static/planet_images/jupiter.jpg', orbitalPeriodDays: 4331, rotationPeriodDays: 0.41, inclination: 1.31, axialTilt: 3.13 },
    { key: 'saturn', radius: 6.35, orbitRadius: 76, color: 0xfad5a5, texture: '/static/planet_images/saturn.jpg', orbitalPeriodDays: 10747, rotationPeriodDays: 0.45, inclination: 2.49, axialTilt: 26.73, hasRing: true },
    { key: 'uranus', radius: 5.0, orbitRadius: 94, color: 0x4fd0e7, texture: '/static/planet_images/uranus.jpg', orbitalPeriodDays: 30589, rotationPeriodDays: -0.72, inclination: 0.77, axialTilt: 97.77 },
    { key: 'neptune', radius: 4.9, orbitRadius: 112, color: 0x4166f5, texture: '/static/planet_images/neptune.jpg', orbitalPeriodDays: 59800, rotationPeriodDays: 0.67, inclination: 1.77, axialTilt: 28.32 }
];

let scene, camera, renderer;
let raycaster, mouse, clock, textureLoader;
let planets = [];
let stars = null;
let farStars = null;
let nebulaStars = null;
let galaxySphere = null;
let sun = null;
let sunLight = null;
let spaceGlow = null;

let animationSpeed = 1;
let showTrails = false;
let autoRotateEnabled = false;

let isDragging = false;
let isRightDragging = false;
let previousMousePosition = { x: 0, y: 0 };

let cameraTarget = new THREE.Vector3(0, 0, 0);
let desiredCameraTarget = new THREE.Vector3(0, 0, 0);
let cameraDistance = 175;
let desiredCameraDistance = 175;
let cameraAzimuth = 0.58;
let cameraPolar = 1.06;

document.addEventListener('DOMContentLoaded', () => {
    initVisualization();
    setupEventListeners();
    loadUserProfile();
});

function initVisualization() {
    const container = document.getElementById('visualizationContainer');

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020611);
    scene.fog = new THREE.FogExp2(0x020611, 0.00055);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 7000);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    textureLoader = new THREE.TextureLoader();

    updateCameraPosition(true);

    addLights();
    addDeepSpaceGlow();
    addGalaxyBackground();
    addStarsBackground();
    addSun();
    addPlanets();

    animate();

    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('click', onCanvasClick, false);
    renderer.domElement.addEventListener('mousedown', onMouseDown, false);
    renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault(), false);
    window.addEventListener('mouseup', onMouseUp, false);
    window.addEventListener('mousemove', onMouseDrag, false);
    window.addEventListener('wheel', onMouseWheel, { passive: false });
}

function addLights() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.18);
    scene.add(ambient);

    sunLight = new THREE.PointLight(0xfff2c4, 4.6, 2600, 1.75);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const fillLightBlue = new THREE.DirectionalLight(0x6da7ff, 0.12);
    fillLightBlue.position.set(180, 90, 140);
    scene.add(fillLightBlue);

    const fillLightWarm = new THREE.DirectionalLight(0xffb066, 0.08);
    fillLightWarm.position.set(-160, -40, -120);
    scene.add(fillLightWarm);
}

function addDeepSpaceGlow() {
    const outerGeometry = new THREE.SphereGeometry(1400, 32, 32);
    const outerMaterial = new THREE.MeshBasicMaterial({
        color: 0x091632,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    });

    spaceGlow = new THREE.Mesh(outerGeometry, outerMaterial);
    scene.add(spaceGlow);

    const innerGeometry = new THREE.SphereGeometry(980, 32, 32);
    const innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x1a1042,
        transparent: true,
        opacity: 0.08,
        side: THREE.BackSide
    });

    const innerGlow = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerGlow);
}

function addGalaxyBackground() {
    const geometry = new THREE.SphereGeometry(3200, 48, 48);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.28
    });

    galaxySphere = new THREE.Mesh(geometry, material);
    scene.add(galaxySphere);

    textureLoader.load(
        '/static/planet_images/milkyway.jpg',
        (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            material.map = texture;
            material.needsUpdate = true;
        },
        undefined,
        () => {
            console.warn('Milky Way texture not loaded.');
        }
    );
}

function addStarsBackground() {
    stars = createStarLayer(10000, 900, 2200, 0xffffff, 1.2, 0.95);
    farStars = createStarLayer(6000, 2200, 2500, 0xbfd9ff, 0.92, 0.58);
    nebulaStars = createStarLayer(1800, 700, 1800, 0xffe4b8, 1.5, 0.18);

    scene.add(stars);
    scene.add(farStars);
    scene.add(nebulaStars);
}

function createStarLayer(count, minRadius, spread, color, size, opacity) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < count; i++) {
        const radius = minRadius + Math.random() * spread;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        vertices.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.cos(phi),
            radius * Math.sin(phi) * Math.sin(theta)
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        depthWrite: false
    });

    return new THREE.Points(geometry, material);
}

function addSun() {
    const sunGeometry = new THREE.SphereGeometry(9.3, 64, 64);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffb347
    });

    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    textureLoader.load(
        '/static/planet_images/sun.jpg',
        (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            sun.material.map = texture;
            sun.material.needsUpdate = true;
        },
        undefined,
        () => {
            console.warn('Sun texture missing.');
        }
    );

    const corona1 = new THREE.Mesh(
        new THREE.SphereGeometry(12.8, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0xffb347,
            transparent: true,
            opacity: 0.22,
            side: THREE.BackSide
        })
    );
    sun.add(corona1);

    const corona2 = new THREE.Mesh(
        new THREE.SphereGeometry(18.5, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0xff7b29,
            transparent: true,
            opacity: 0.10,
            side: THREE.BackSide
        })
    );
    sun.add(corona2);

    const corona3 = new THREE.Mesh(
        new THREE.SphereGeometry(26, 64, 64),
        new THREE.MeshBasicMaterial({
            color: 0xffd58a,
            transparent: true,
            opacity: 0.04,
            side: THREE.BackSide
        })
    );
    sun.add(corona3);
}

function addPlanets() {
    planets = [];

    PLANET_CONFIG.forEach((config, index) => {
        const orbitTiltGroup = new THREE.Object3D();
        orbitTiltGroup.rotation.x = THREE.MathUtils.degToRad(config.inclination);
        scene.add(orbitTiltGroup);

        const orbitPivot = new THREE.Object3D();
        orbitTiltGroup.add(orbitPivot);

        const planetGroup = new THREE.Object3D();
        planetGroup.position.set(config.orbitRadius, 0, 0);
        orbitPivot.add(planetGroup);

        const geometry = new THREE.SphereGeometry(config.radius, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: 0.95,
            metalness: 0.02,
            emissive: 0x000000
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.z = THREE.MathUtils.degToRad(config.axialTilt);
        planetGroup.add(mesh);

        textureLoader.load(
            config.texture,
            (texture) => {
                texture.encoding = THREE.sRGBEncoding;
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                material.map = texture;
                material.needsUpdate = true;
            },
            undefined,
            () => {
                console.warn(`Texture missing: ${config.texture}`);
            }
        );

        const orbitLine = createOrbitLine(config.orbitRadius);
        orbitTiltGroup.add(orbitLine);

        const label = createPlanetLabel(PLANET_DATA[config.key].name);
        scene.add(label);

        const trailLine = createTrailLine();
        trailLine.visible = false;
        scene.add(trailLine);

        orbitPivot.rotation.y = (index / PLANET_CONFIG.length) * Math.PI * 2;

        const planetObject = {
            key: config.key,
            config,
            orbitTiltGroup,
            orbitPivot,
            planetGroup,
            mesh,
            orbitLine,
            label,
            trailLine,
            trailPoints: [],
            moonPivot: null
        };

        mesh.userData = {
            key: config.key,
            planetRef: planetObject
        };

        if (config.hasRing) {
            addSaturnRing(mesh, config.radius);
        }

        if (config.key === 'earth') {
            addEarthMoon(planetObject);
        }

        if (config.hasAtmosphere) {
            addAtmosphereGlow(mesh, config.radius);
        }

        planets.push(planetObject);
    });

    toggleOrbits();
    toggleLabels();
}

function createOrbitLine(radius) {
    const points = [];

    for (let i = 0; i <= 360; i++) {
        const angle = (i / 360) * Math.PI * 2;
        points.push(new THREE.Vector3(
            radius * Math.cos(angle),
            0,
            radius * Math.sin(angle)
        ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
        color: 0x88a9d9,
        transparent: true,
        opacity: 0.32
    });

    return new THREE.LineLoop(geometry, material);
}

function createPlanetLabel(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 10, 20, 0.35)';
    roundRect(ctx, 36, 22, 440, 84, 24);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
    ctx.lineWidth = 2;
    roundRect(ctx, 36, 22, 440, 84, 24);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
    });

    const sprite = new THREE.Sprite(material);
    sprite.scale.set(14, 3.6, 1);
    return sprite;
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function createTrailLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
    ]);

    const material = new THREE.LineBasicMaterial({
        color: 0x72b6ff,
        transparent: true,
        opacity: 0.26
    });

    return new THREE.Line(geometry, material);
}

function addSaturnRing(planetMesh, planetRadius) {
    const ringGeometry = new THREE.RingGeometry(planetRadius * 1.35, planetRadius * 2.35, 128);
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8c19c,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.84,
        roughness: 1,
        metalness: 0
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    planetMesh.add(ring);

    textureLoader.load(
        '/static/planet_images/saturn_ring.png',
        (texture) => {
            ringMaterial.map = texture;
            ringMaterial.alphaMap = texture;
            ringMaterial.needsUpdate = true;
        },
        undefined,
        () => {}
    );
}

function addAtmosphereGlow(planetMesh, planetRadius) {
    const glowGeometry = new THREE.SphereGeometry(planetRadius * 1.08, 48, 48);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x67b7ff,
        transparent: true,
        opacity: 0.16,
        side: THREE.BackSide
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    planetMesh.add(glow);
}

function addEarthMoon(planetObject) {
    const moonPivot = new THREE.Object3D();
    planetObject.planetGroup.add(moonPivot);

    const moonGeometry = new THREE.SphereGeometry(0.75, 28, 28);
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xbdbdbd,
        roughness: 1,
        metalness: 0
    });

    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.castShadow = true;
    moon.receiveShadow = true;
    moon.position.set(5.4, 0, 0);
    moonPivot.add(moon);

    textureLoader.load(
        '/static/planet_images/moon.jpg',
        (texture) => {
            texture.encoding = THREE.sRGBEncoding;
            moonMaterial.map = texture;
            moonMaterial.needsUpdate = true;
        },
        undefined,
        () => {}
    );

    planetObject.moonPivot = moonPivot;
}

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.033);
    const time = performance.now() * 0.001;

    if (sun) {
        sun.rotation.y += delta * 0.05;
        const pulse = 1 + Math.sin(time * 1.7) * 0.008;
        sun.scale.set(pulse, pulse, pulse);
    }

    if (sunLight) {
        sunLight.intensity = 4.5 + Math.sin(time * 1.9) * 0.08;
    }

    if (stars) {
        stars.rotation.y += delta * 0.0014;
        stars.material.opacity = 0.9 + Math.sin(time * 0.7) * 0.04;
    }

    if (farStars) {
        farStars.rotation.y -= delta * 0.00035;
    }

    if (nebulaStars) {
        nebulaStars.rotation.y += delta * 0.0008;
        nebulaStars.material.opacity = 0.16 + Math.sin(time * 0.5) * 0.03;
    }

    if (galaxySphere) {
        galaxySphere.rotation.y += delta * 0.00022;
    }

    if (spaceGlow) {
        spaceGlow.rotation.y += delta * 0.00055;
    }

    if (autoRotateEnabled) {
        cameraAzimuth += delta * 0.05;
    }

    updatePlanetPositions(delta);
    updateCameraPosition(false);
    updateHud();
    renderer.render(scene, camera);
}

function updatePlanetPositions(delta) {
    const effectiveSpeed = Math.pow(animationSpeed, 1.08);
    const simulationDaysPerSecond = 10 * effectiveSpeed;

    planets.forEach((planet) => {
        const cfg = planet.config;

        const orbitAngularSpeed = (Math.PI * 2) / cfg.orbitalPeriodDays;
        planet.orbitPivot.rotation.y += orbitAngularSpeed * simulationDaysPerSecond * delta;

        const absRotationPeriod = Math.max(Math.abs(cfg.rotationPeriodDays), 0.01);
        const spinAngularSpeed = (Math.PI * 2) / absRotationPeriod;
        const spinDirection = cfg.rotationPeriodDays < 0 ? -1 : 1;
        planet.mesh.rotation.y += spinDirection * spinAngularSpeed * simulationDaysPerSecond * delta * 0.028;

        if (planet.moonPivot) {
            planet.moonPivot.rotation.y += delta * Math.max(0.25, animationSpeed * 0.25);
        }

        updatePlanetLabel(planet);

        if (showTrails) {
            updatePlanetTrail(planet);
        }
    });
}

function updatePlanetLabel(planet) {
    if (!planet.label) return;

    const worldPos = new THREE.Vector3();
    planet.mesh.getWorldPosition(worldPos);

    planet.label.position.copy(worldPos);
    planet.label.position.y += planet.config.radius + 2.2;

    const dist = camera.position.distanceTo(planet.label.position);
    const scale = THREE.MathUtils.clamp(dist * 0.011, 7, 12);
    planet.label.scale.set(scale, scale * 0.26, 1);
}

function updatePlanetTrail(planet) {
    const worldPos = new THREE.Vector3();
    planet.mesh.getWorldPosition(worldPos);
    planet.trailPoints.push(worldPos.clone());

    const maxPoints = 120;
    if (planet.trailPoints.length > maxPoints) {
        planet.trailPoints.shift();
    }

    if (planet.trailPoints.length >= 2) {
        if (planet.trailLine.geometry) {
            planet.trailLine.geometry.dispose();
        }
        planet.trailLine.geometry = new THREE.BufferGeometry().setFromPoints(planet.trailPoints);
        planet.trailLine.visible = true;
    }
}

function updateCameraPosition(forceInstant = false) {
    const lerpFactor = forceInstant ? 1 : 0.08;

    cameraTarget.lerp(desiredCameraTarget, lerpFactor);
    cameraDistance = THREE.MathUtils.lerp(cameraDistance, desiredCameraDistance, lerpFactor);

    const sinPolar = Math.sin(cameraPolar);

    camera.position.set(
        cameraTarget.x + cameraDistance * sinPolar * Math.sin(cameraAzimuth),
        cameraTarget.y + cameraDistance * Math.cos(cameraPolar),
        cameraTarget.z + cameraDistance * sinPolar * Math.cos(cameraAzimuth)
    );

    camera.lookAt(cameraTarget);
}

function updateHud() {
    const hudSpeed = document.getElementById('hudSpeed');
    const hudMode = document.getElementById('hudMode');
    const hudScale = document.getElementById('hudScale');

    if (hudSpeed) {
        hudSpeed.textContent = `Speed: ${animationSpeed.toFixed(1)}x`;
    }

    if (hudMode) {
        const nearPlanet = planets.find((planet) => {
            const pos = new THREE.Vector3();
            planet.mesh.getWorldPosition(pos);
            return desiredCameraTarget.distanceTo(pos) < 1.5;
        });

        hudMode.textContent = nearPlanet ? `Mode: ${PLANET_DATA[nearPlanet.key].name} Focus` : 'Mode: Solar View';
    }

    if (hudScale) {
        hudScale.textContent = 'Educational Simulation';
    }
}

function setupEventListeners() {
    const orbitsToggle = document.getElementById('orbitsToggle');
    const labelsToggle = document.getElementById('labelsToggle');
    const speedSlider = document.getElementById('speedSlider');

    if (orbitsToggle) {
        orbitsToggle.addEventListener('change', toggleOrbits);
    }

    if (labelsToggle) {
        labelsToggle.addEventListener('change', toggleLabels);
    }

    if (speedSlider) {
        speedSlider.addEventListener('input', function () {
            setAnimationSpeed(this.value);
        });
    }
}

function onWindowResize() {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    if (!renderer || !camera) return;

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onCanvasClick() {
    if (!raycaster || !camera) return;

    raycaster.setFromCamera(mouse, camera);
    const planetMeshes = planets.map((p) => p.mesh);
    const intersects = raycaster.intersectObjects(planetMeshes);

    if (intersects.length > 0) {
        const selectedMesh = intersects[0].object;
        if (selectedMesh.userData && selectedMesh.userData.key) {
            selectPlanet(selectedMesh.userData.key);
        }
    }
}

function onMouseDown(event) {
    if (!renderer || event.target !== renderer.domElement) return;

    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;

    if (event.button === 0) {
        isDragging = true;
    } else if (event.button === 2) {
        isRightDragging = true;
    }
}

function onMouseUp() {
    isDragging = false;
    isRightDragging = false;
}

function onMouseDrag(event) {
    if (!isDragging && !isRightDragging) return;

    const deltaX = event.clientX - previousMousePosition.x;
    const deltaY = event.clientY - previousMousePosition.y;

    if (isDragging) {
        cameraAzimuth -= deltaX * 0.004;
        cameraPolar -= deltaY * 0.004;
        cameraPolar = THREE.MathUtils.clamp(cameraPolar, 0.25, Math.PI - 0.25);
    }

    if (isRightDragging) {
        const panSpeed = cameraDistance * 0.001;

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);

        const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
        const up = new THREE.Vector3().copy(camera.up).normalize();

        desiredCameraTarget.addScaledVector(right, -deltaX * panSpeed);
        desiredCameraTarget.addScaledVector(up, deltaY * panSpeed);
    }

    previousMousePosition.x = event.clientX;
    previousMousePosition.y = event.clientY;
}

function onMouseWheel(event) {
    const leftPanel = document.querySelector('.left-panel');
    const rightPanel = document.querySelector('.right-panel');

    if (leftPanel && isPointInsideElement(event.clientX, event.clientY, leftPanel)) return;
    if (rightPanel && isPointInsideElement(event.clientX, event.clientY, rightPanel)) return;

    event.preventDefault();

    const zoomFactor = event.deltaY > 0 ? 1.08 : 0.92;
    desiredCameraDistance *= zoomFactor;
    desiredCameraDistance = THREE.MathUtils.clamp(desiredCameraDistance, 18, 700);
}

function isPointInsideElement(x, y, element) {
    const rect = element.getBoundingClientRect();
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

function selectPlanet(planetKey) {
    const planetData = PLANET_DATA[planetKey];
    const selectedPlanet = planets.find((p) => p.key === planetKey);

    if (!planetData || !selectedPlanet) return;

    planets.forEach((planet) => {
        if (planet.mesh.material.emissive) {
            planet.mesh.material.emissive.setHex(0x000000);
        }
    });

    selectedPlanet.mesh.material.emissive.setHex(0x1a1a1a);

    const worldPos = new THREE.Vector3();
    selectedPlanet.mesh.getWorldPosition(worldPos);

    desiredCameraTarget.copy(worldPos);
    desiredCameraDistance = Math.max(selectedPlanet.config.radius * 7.5, 20);

    updateInfoPanel(planetKey);

    const rightPanel = document.querySelector('.right-panel');
    const reopenBtn = document.querySelector('.reopen-right');

    if (rightPanel && rightPanel.classList.contains('collapse')) {
        rightPanel.classList.remove('collapse');
        if (reopenBtn) reopenBtn.style.display = 'none';
    }
}

function updateInfoPanel(planetKey) {
    const planetData = PLANET_DATA[planetKey];
    const infoPanel = document.getElementById('objectInfo');
    if (!planetData || !infoPanel) return;

    infoPanel.classList.remove('info-placeholder');
    infoPanel.innerHTML = `
        <div class="planet-info">
            <div class="info-badge">Student Explorer Card</div>
            <h2>${planetData.name}</h2>

            <div class="info-details">
                <div class="detail-row">
                    <span class="label">Diameter</span>
                    <span class="value">${planetData.diameter}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Distance from Sun</span>
                    <span class="value">${planetData.distance}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Moons</span>
                    <span class="value">${planetData.moons}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Day Length</span>
                    <span class="value">${planetData.dayLength}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Year Length</span>
                    <span class="value">${planetData.yearLength}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Temperature</span>
                    <span class="value">${planetData.temperature}</span>
                </div>
            </div>

            <div class="description">
                <p>${planetData.description}</p>
            </div>

            <div class="fact-box">
                <strong>Did you know?</strong>
                <p>${planetData.fact}</p>
            </div>

            <div class="learning-note">
                <strong>Learning note:</strong>
                <p>${planetData.note}</p>
            </div>

            <a class="detail-study-link" href="/planet/${planetKey}">
                Detailed study / info about this planet
                <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

function toggleOrbits() {
    const show = document.getElementById('orbitsToggle')?.checked ?? true;
    planets.forEach((planet) => {
        if (planet.orbitLine) {
            planet.orbitLine.visible = show;
        }
    });
}

function toggleLabels() {
    const show = document.getElementById('labelsToggle')?.checked ?? true;
    planets.forEach((planet) => {
        if (planet.label) {
            planet.label.visible = show;
        }
    });
}

function setAnimationSpeed(speed) {
    animationSpeed = parseFloat(speed);
    if (isNaN(animationSpeed)) animationSpeed = 1;

    const speedValue = document.getElementById('speedValue');
    if (speedValue) {
        speedValue.textContent = `${animationSpeed.toFixed(1)}x`;
    }
}

function updateGraphicsQuality(value) {
    if (!renderer) return;

    if (value === 'low') {
        renderer.setPixelRatio(1);
    } else if (value === 'medium') {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function toggleBackgroundStars() {
    const visible = document.getElementById('backgroundStarsToggle')?.checked ?? true;

    if (stars) stars.visible = visible;
    if (farStars) farStars.visible = visible;
    if (nebulaStars) nebulaStars.visible = visible;
    if (galaxySphere) galaxySphere.visible = visible;
}

function togglePlanetTrails() {
    showTrails = !showTrails;

    if (!showTrails) {
        planets.forEach((planet) => {
            planet.trailPoints = [];

            if (planet.trailLine) {
                if (planet.trailLine.geometry) {
                    planet.trailLine.geometry.dispose();
                }

                planet.trailLine.geometry = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, 0, 0)
                ]);
                planet.trailLine.visible = false;
            }
        });
    }
}

function toggleAutoRotate() {
    autoRotateEnabled = !autoRotateEnabled;
}

function resetSolarView() {
    desiredCameraTarget.set(0, 0, 0);
    desiredCameraDistance = 175;
    cameraAzimuth = 0.58;
    cameraPolar = 1.06;

    planets.forEach((planet) => {
        if (planet.mesh.material.emissive) {
            planet.mesh.material.emissive.setHex(0x000000);
        }
    });

    const infoPanel = document.getElementById('objectInfo');
    if (infoPanel) {
        infoPanel.classList.add('info-placeholder');
        infoPanel.innerHTML = `
            <i class="fas fa-rocket"></i>
            <p>Click on a planet to explore details, facts, and its place in the solar system.</p>
        `;
    }
}

function focusSun() {
    desiredCameraTarget.set(0, 0, 0);
    desiredCameraDistance = 55;
}

function togglePanel(panel) {
    if (panel === 'left') {
        const leftPanel = document.querySelector('.left-panel');
        const reopenBtn = document.querySelector('.reopen-left');
        if (!leftPanel || !reopenBtn) return;

        leftPanel.classList.toggle('collapse');
        reopenBtn.style.display = leftPanel.classList.contains('collapse') ? 'block' : 'none';
    }

    if (panel === 'right') {
        const rightPanel = document.querySelector('.right-panel');
        const reopenBtn = document.querySelector('.reopen-right');
        if (!rightPanel || !reopenBtn) return;

        rightPanel.classList.toggle('collapse');
        reopenBtn.style.display = rightPanel.classList.contains('collapse') ? 'block' : 'none';
    }
}

function showHelp() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.classList.add('active');
}

function closeHelp() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.classList.remove('active');
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.add('active');
}

function closeSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('active');
}

function loadUserProfile() {
    fetch('/api/user/profile')
        .then((response) => {
            if (!response.ok) return null;
            return response.json();
        })
        .then(() => {})
        .catch(() => {});
}