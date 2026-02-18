const redirects = [
    'Unknown',
    'Social',
    'YouTube',
    'VOD',
    'OLV',
    'Webpage',
    'Email',
    'Website',
    'Homepage',
];

const PIXEL_TRACKING_URLS = {

    suffix: "&sz=1x1&c=%%CACHEBUSTER%%",
    site_load: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/SiteLoad/',
    tap_game_island: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/Tap_Game_Island/',
    tap_cherryblueberryisland: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/Tap_CherryBlueberryIsland/',
    tap_kiwilimeisland: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/Tap_KiwiLimeIsland/',
    tap_mangopassionfruitisland: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/Tap_MangoPassionfruitIsland/',
    tap_raspberrypineappleisland: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/Tap_RaspberryPineappleIsland/',
    tap_binocularssign: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/Tap_BinocularsSign/',
    tap_gamecontrollersign: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/Tap_GameControllerSign/',
    error: 'https://pubads.g.doubleclick.net/gampad/ad?iu=/70228659/CP_Duaal/Island25/Error/'

};

const PixelTrack = (key) => {
    const mainUrl = PIXEL_TRACKING_URLS[key];
    let url = mainUrl + referrer;
    url += PIXEL_TRACKING_URLS.suffix;

    //console.log(url)

    if (mainUrl != undefined) {
        fetch(url, {
            mode: 'no-cors'
        });
    } else {
        console.log("tracking url not set?");
        let url = PIXEL_TRACKING_URLS['error'];
        url += referrer;
        url += PIXEL_TRACKING_URLS.suffix;
        fetch(url, {
            mode: 'no-cors'
        });
    }

};

//console.log(PIXEL_TRACKING_URLS.suffix.split(''));

const searchParams = new URLSearchParams(window.location.search);
var referrer = redirects[0];

for (let [key, value] of searchParams) {
    if (key == 'redirect') {
        const matched = redirects.find(r => r.toLowerCase() === value.toLowerCase());
        referrer = matched;
    }
}

if (redirects.indexOf(referrer) == -1) referrer = redirects[0];
PixelTrack('site_load');

// Update all hrefs in page:

document.querySelectorAll('a[href]').forEach(anchor => {
    const href = anchor.getAttribute('href');

    // Only modify links to your own site (optional, safety filter)
    if (href.startsWith('https://www.duaal.com.br')) {
        const url = new URL(href, window.location.origin);
        url.searchParams.set('redirect', referrer); // add or replace existing ref
        // console.log(url.toString())
        anchor.setAttribute('href', url.toString());
    }
});


// main.js
const canvas = document.getElementById("three-canvas");
const scene = new THREE.Scene();

const bgColor = 0x016A8B;

scene.fog = new THREE.Fog(bgColor, 9.5, 12);
scene.background = new THREE.Color(bgColor);

const clock = new THREE.Clock();

// Add floor grid
// Draw grid 'cell';
const dim = 400;
const planeW = 62; // Plane width
const planeD = 28; // You can replace this with this.PLANE_D if necessary

// Plane geometry for the grid texture
const planeGeometry = new THREE.PlaneGeometry(planeW, planeD);

const gridMaterial = new THREE.MeshBasicMaterial();


gridMaterial.transparent = true;
gridMaterial.opacity = 0.25;
gridMaterial.side = THREE.FrontSide;
gridMaterial.depthTest = false;

const texturePlane = new THREE.Mesh(planeGeometry, gridMaterial);
texturePlane.rotation.x = -Math.PI / 2;
texturePlane.renderOrder = 0;

scene.add(texturePlane);

const loader = new THREE.TextureLoader();

// Load the texture
let seaTexture = null;
loader.load('./assets/sea-background.png', (texture) => {
    texture.rotation = Math.PI / 180 * 45;
    gridMaterial.map = texture;
    gridMaterial.map.repeat.set(planeW / 6, planeD / 6);
    gridMaterial.map.wrapS = THREE.RepeatWrapping;
    gridMaterial.map.wrapT = THREE.RepeatWrapping;
    gridMaterial.needsUpdate = true;
    seaTexture = texture; // Store for animation

});

// Create the grid canvas
const gridCanvas = document.createElement("canvas");
gridCanvas.width = dim;
gridCanvas.height = dim;
const gridCanvasContext = gridCanvas.getContext("2d");

// Draw grid lines
gridCanvasContext.lineWidth = 3;
gridCanvasContext.strokeStyle = '#000';
gridCanvasContext.beginPath(); // Start path for grid lines
gridCanvasContext.moveTo(0, 0);
gridCanvasContext.lineTo(dim, dim);
gridCanvasContext.moveTo(dim, 0);
gridCanvasContext.lineTo(0, dim);
gridCanvasContext.stroke(); // Apply stroke

// Create a Three.js material with the grid canvas as texture
const planeMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(gridCanvas),
    transparent: true,

    side: THREE.FrontSide,
    depthTest: true
});

planeMaterial.map.repeat.set(planeW / 2, planeD / 2);
planeMaterial.map.wrapS = THREE.RepeatWrapping;
planeMaterial.map.wrapT = THREE.RepeatWrapping;
planeMaterial.transparent = true;
planeMaterial.opacity = 0.5;
planeMaterial.depthTest = false;

planeMaterial.side = THREE.FrontSide;

// Make sure texture updates after drawing the grid
planeMaterial.map.needsUpdate = true;

// Apply this material to a plane geometry
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane); // Add the plane to the scene

// Optionally, you can adjust the plane position/rotation if necessary
plane.rotation.x = -Math.PI / 2; // Make the plane face the camera
plane.renderOrder = 1;

scene.add(plane);

// Create the line canvas
const lineCanvas = document.createElement("canvas");
lineCanvas.width = 2200;
lineCanvas.height = 2200;
const lineCanvasContext = lineCanvas.getContext("2d");

// Draw  lines
// Configure the dashed stroke
lineCanvasContext.strokeStyle = '#000';
lineCanvasContext.lineWidth = 2;
lineCanvasContext.setLineDash([8, 4]); // 10px dash, 6px gap

// Define wave parameters
const waveConfigs = [{
        amplitude: 380,
        frequency: 1.7,
        yOffset: 1700,
        phase: 0.4,
        vertical: false
    },
    {
        amplitude: 150,
        frequency: 3.9,
        yOffset: 900,
        phase: 0.6,
        vertical: false
    },
    {
        amplitude: 200,
        frequency: 2.2,
        yOffset: 1300,
        phase: 0.3,
        vertical: true
    },
    {
        amplitude: 170,
        frequency: 1.4,
        yOffset: 600,
        phase: 0.1,
        vertical: true
    },

    {
        amplitude: 100,
        frequency: 4.2,
        yOffset: 1000,
        phase: 0.3,
        vertical: true
    },
];

waveConfigs.forEach(cfg => {
    lineCanvasContext.save(); // Save current context state

    if (cfg.vertical) {
        // Rotate canvas by 90° and move origin
        lineCanvasContext.translate(lineCanvas.width, 0);
        lineCanvasContext.rotate(Math.PI / 2);
    }

    lineCanvasContext.beginPath();
    for (let x = 0; x <= lineCanvas.width; x++) {
        const normalizedX = x / lineCanvas.width;
        const y = cfg.yOffset + Math.sin((normalizedX + cfg.phase) * Math.PI * cfg.frequency) * cfg.amplitude;

        if (x === 0) {
            lineCanvasContext.moveTo(x, y);
        } else {
            lineCanvasContext.lineTo(x, y);
        }
    }
    lineCanvasContext.stroke();
    lineCanvasContext.restore(); // Restore context for next line
});

lineCanvasContext.setLineDash([]); // Reset dash pattern

// Create a Three.js material with the grid canvas as texture
const lineMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(lineCanvas),
    transparent: true,

    side: THREE.FrontSide,
    depthTest: true
});

lineMaterial.transparent = true;
lineMaterial.depthTest = false;
lineMaterial.opacity = 0.8;
lineMaterial.side = THREE.FrontSide;

// Make sure texture updates after drawing the grid
lineMaterial.map.needsUpdate = true;

// Apply this material to a plane geometry
const lines = new THREE.Mesh(planeGeometry, lineMaterial);
scene.add(lines); // Add the plane to the scene

// Optionally, you can adjust the plane position/rotation if necessary
lines.rotation.x = -Math.PI / 2; // Make the plane face the camera
lines.renderOrder = 1;

scene.add(lines);

// Add ripples.
this._rippleAnimations = [];

const ripples = [

    {
        position: {
            x: .9,
            z: 1.5 + .5
        },
        duration: 100,
        angle: 0.0
    },
    {
        position: {
            x: 2.0,
            z: -1.85 + -.5
        },
        duration: 120,
        angle: 0.0
    },
    {
        position: {
            x: 3.25,
            z: 2.75 + .5
        },
        duration: 140,
        angle: 0.0
    },

    {
        position: {
            x: -2.0,
            z: -1.5 + .5
        },
        duration: 110,
        angle: 0.0
    },
    {
        position: {
            x: -2.75,
            z: 2.65 + .5
        },
        duration: 150,
        angle: 0.0
    },

    {
        position: {
            x: 2.0,
            z: -2.95 + .5
        },
        duration: 110,
        angle: 0.0
    }, //kiwi
    {
        position: {
            x: -1.0,
            z: 5.6
        },
        duration: 120,
        angle: 0.0
    }, //mango 1
    {
        position: {
            x: -0.0,
            z: 5.6 + .5
        },
        duration: 120,
        angle: 0.0
    }, //mango 2
    {
        position: {
            x: 5.0,
            z: 5.75 + .5
        },
        duration: 90,
        angle: 0.0
    }, //passion fruit
    {
        position: {
            x: 3.0,
            z: 8.5 + .5
        },
        duration: 90,
        angle: 0.0
    }, //passion fruit 2
    // { position: { x: 1.0, z: 5.75 }, duration: 130, angle: 0.0 }, // mango/passion fruit bridge

    // { position: { x: 0.2, z: -1.55 }, duration: 100, angle: 0.0 }, // kiwi/lime fruit bridge
    // { position: { x: 4.9, z: 1.0 }, duration: 150, angle: 0.0 }, // kiwi/lime fruit bridge
];

const path2 = './assets/menu/ripple.png';
loader.load(path2, (texture) => {

    const rippleGeometry = new THREE.PlaneGeometry(1.75, 1.75, 1, 1);

    for (let i = 0; i < ripples.length; i++) {
        const rippleData = ripples[i];

        const rippleTexture = texture.clone();
        rippleTexture.needsUpdate = true;

        const rippleAnimation = new TextureAnimator(rippleTexture, 6, 1, 6, rippleData.duration, 1000); // texture, #horiz, #vert, #total, duration.
        const rippleMaterial = new THREE.MeshBasicMaterial({
            map: rippleTexture,
            side: THREE.FrontSide,
            transparent: true,
            depthTest: false,
        });
        rippleMaterial.opacity = 0.5;

        const mesh = new THREE.Mesh(rippleGeometry, rippleMaterial);
        mesh.renderOrder = 2;
        // ripple.position.set(0, 0, 0);
        mesh.position.x = rippleData.position.x;
        mesh.position.z = rippleData.position.z;

        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = Math.PI * 2 * Math.random();

        scene.add(mesh);

        rippleAnimation.dir = Math.random() < 0.5 ? 1 : -1;
        rippleAnimation.mesh = mesh;

        this._rippleAnimations.push(rippleAnimation);
    }

});

// Add islands.
const islands = [

    {
        name: "maracujá",
        link: "p_and_r",
        tracking: 'tap_raspberrypineappleisland',
        position: {
            x: 0.2,
            z: 1.0
        },
        detailScalar: 1.05,
        detailAngle: .05
    },
    {
        name: "tangerina",
        link: "c_and_b",
        tracking: 'tap_cherryblueberryisland',
        position: {
            x: 3.0,
            z: -2.5
        },
        detailScalar: 1.05,
        detailAngle: -Math.PI
    },
    {
        name: "cajú",
        link: "k_and_l",
        tracking: 'tap_kiwilimeisland',
        position: {
            x: 6.5,
            z: -1.0
        },
        detailScalar: 1.05,
        detailAngle: 0
    },
    {
        name: "coquidrink",
        link: "coquidrink",
        tracking: 'tap_kiwilimeisland',
        position: {
            x: 7.0,
            z: 1.5
        },
        detailScalar: 1.7,
        detailAngle: 0
    },
    {
        name: "maracujá2",
        link: "k_and_l",
        tracking: 'tap_kiwilimeisland',
        position: {
            x: 9.0,
            z: 2.0
        },
        detailScalar: 1.05,
        detailAngle: 0
    },

    {
        name: "coqui",
        link: "coqui",
        tracking: 'tap_mangopassionfruitisland',
        position: {
            x: -3.5,
            z: 6.5
        },
        detailScalar: 1.7,
        detailAngle: -Math.PI
    },
    {
        name: "café",
        link: "m_and_p",
        tracking: 'tap_mangopassionfruitisland',
        position: {
            x: -4.0,
            z: 8.5
        },
        detailScalar: 1.05,
        detailAngle: -Math.PI
    },
    {
        name: "chocolate",
        link: "m_and_p",
        tracking: 'tap_mangopassionfruitisland',
        position: {
            x: 3.5,
            z: 6.0
        },
        detailScalar: 1.11,
        detailAngle: 0
    },
    {
        name: "morango2",
        link: "m_and_p",
        tracking: 'tap_mangopassionfruitisland',
        position: {
            x: 2.2,
            z: 8.5
        },
        detailScalar: 1.11,
        detailAngle: 0
    },

    {
        name: "morangos",
        link: "p_and_r",
        tracking: 'tap_raspberrypineappleisland',
        position: {
            x: -3.0,
            z: 2.5
        },
        detailScalar: 1.05,
        detailAngle: 0
    },
    {
        name: "mixlev",
        link: "mixlev",
        tracking: 'tap_cherryblueberryisland',
        position: {
            x: -4.0,
            z: -1.5
        },
        detailScalar: 1.7,
        detailAngle: 0
    },
    {
        name: "açaí",
        link: "c_and_b",
        tracking: 'tap_cherryblueberryisland',
        position: {
            x: -6.0,
            z: 0.5
        },
        detailScalar: 1.15,
        detailAngle: 0
    },

];

const hotspots1 = [];

for (let i = 0; i < islands.length; i++) {

    const islandData = islands[i];

    const path = './assets/menu/' + islandData.name + '.png'

    loader.load(path, (texture) => {

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
        });

        const mesh = new THREE.Sprite(material);
        mesh.scale.set(4.00 * islandData.detailScalar, 2.25 * islandData.detailScalar, 1); // 600x335
        scene.add(mesh);

        mesh.position.y = 0.5;
        mesh.position.x = islandData.position.x;
        mesh.position.z = islandData.position.z;

        mesh.renderOrder = 10;

        mesh.userData.index = i;
        mesh.userData.name = islandData.name;
        mesh.userData.link = islandData.link;
        mesh.userData.tracking = islandData.tracking;

        hotspots1.push(mesh);

    });

}

// island details

// Add kiwis.
var kiwis = [];
var kiwiCanoe
const kiwi_canoe_path = './assets/menu/jo_canoe.png'

loader.load(kiwi_canoe_path, (texture) => {

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
    });

    const mesh = new THREE.Sprite(material);
    mesh.scale.set(1.50, 1.50, 1); // 300x300
    scene.add(mesh);

    mesh.position.x = -0.295;
    mesh.position.y = 0.15;
    mesh.position.z = -0.325;

    mesh.renderOrder = 10;



    kiwiCanoe = mesh;
    kiwiCanoe.userData.startX = mesh.position.x;
    kiwiCanoe.userData.startY = mesh.position.y;
    kiwiCanoe.userData.startZ = mesh.position.z;

    kiwis.push(kiwiCanoe);

});

function updateKiwiCanoe(elapsed) {
    if (!kiwiCanoe) return;
    kiwiCanoe.position.x = kiwiCanoe.userData.startX + Math.sin(elapsed * 1) * 0.1;
    kiwiCanoe.position.y = kiwiCanoe.userData.startY + Math.cos(-elapsed * .1) * 0.25;
    kiwiCanoe.position.z = kiwiCanoe.userData.startZ + Math.cos(elapsed * .5) * 0.1;
}


var kiwiDance;
const kiwi_dance_path = './assets/menu/jo_dance.png'

loader.load(kiwi_dance_path, (texture) => {

    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
    });

    const mesh = new THREE.Sprite(material);
    mesh.scale.set(1.30, 1.30, 1); // 300x300
    scene.add(mesh);

    mesh.position.x = 0.35;
    mesh.position.y = 0.5;
    mesh.position.z = 6;

    mesh.renderOrder = 10;

    mesh.userData.link = "pano";
    mesh.userData.tracking = "tap_binocularssign";

    kiwiDance = mesh;
    kiwiDance.userData.startX = mesh.position.x;
    kiwiDance.userData.startY = mesh.position.y;
    kiwiDance.userData.startZ = mesh.position.z;

    kiwis.push(kiwiDance);
});

function updateKiwiDance(elapsed) {
    if (!kiwiDance) return;
    const speed = 6; // Adjust for faster/slower dancing
    const amplitude = 0.1;

    // Bouncing up and down
    kiwiDance.position.y = kiwiDance.userData.startY + Math.sin(elapsed * speed) * amplitude;

    // kiwiDance-to-side swaying
    kiwiDance.rotation = Math.sin(elapsed * speed * 0.8) * 0.1

    // Squash and stretch effect (cartoony)
    const scaleY = 1 + Math.sin(elapsed * speed) * 0.05;
    const scaleX = 1 - Math.sin(elapsed * speed) * 0.025;
    kiwiDance.scale.set(scaleX, scaleY, 1);
}

// Compass on water near coqui island
var compass;
const compass_path = './assets/menu/compass.png';

loader.load(compass_path, (texture) => {
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthTest: false,
    });

    const mesh = new THREE.Sprite(material);
    mesh.scale.set(3.5, 3.5, 1);
    scene.add(mesh);

    // Position below and to the right of coqui island
    mesh.position.x = 7.5;
    mesh.position.y = 0; // Same level as water surface
    mesh.position.z = 6.8;
    
    // Rotate to look like it's lying down on the water
    mesh.rotation.z = Math.PI / 4; // 45 degrees rotation
    
    mesh.renderOrder = 8; // Lower render order so it appears behind other elements

    compass = mesh;
});

const hotspots2 = [];
const signpostDetails = [

    // { name: "competition", link: "comp", position: { x: 5.5 - 0.2, y: 0, z: 0.34 + .1 } }, // lime bridge
    // { name: "island_game", link: "island", position: { x: 0.65 - 0.2, y: 0, z: -1.45 + .1 } }, // blueberry
    // mixlev
    {
        name: "island_mixlev",
        link: "island",
        tracking: 'tap_gamecontrollersign',
        position: {
            x: -2.0 - 0.2,
            y: 0,
            z: 0.0 // moved even further back
        }
    }, // coqui
    {
        name: "island_coqui",
        link: "island",
        tracking: 'tap_binocularssign',
        position: {
            x: -1.5, // shifted even further left
            y: .0,
            z: 8.0 // moved back
        }
    }, // coquidrink
    {
        name: "island_coquidrink",
        link: "pano",
        tracking: 'tap_binocularssign',
        position: {
            x: 8.0 - .2,
            y: .0,
            z: 3.0 + .1
        }
    },
];

for (let i = 0; i < signpostDetails.length; i++) {

    const signpostDetailsData = signpostDetails[i];

    const path = './assets/menu/signpost_' + signpostDetailsData.name + '.png'

    loader.load(path, (texture) => {

        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
        });

        const mesh = new THREE.Sprite(material);
        mesh.scale.set(2.25, 2.25, 1); // 260x340
        
        // Aumentar tamanho das 3 placas específicas no dobro
        if (signpostDetailsData.name === 'island_mixlev' || 
            signpostDetailsData.name === 'island_coqui' || 
            signpostDetailsData.name === 'island_coquidrink') {
            mesh.scale.multiplyScalar(0.95); // Tamanho aumentado moderado
        } else {
            mesh.scale.multiplyScalar(0.7);
        }
        scene.add(mesh);

        mesh.position.x = signpostDetailsData.position.x;
        mesh.position.y = signpostDetailsData.position.y;
        mesh.position.z = signpostDetailsData.position.z;

        mesh.center.set(0.4, 0.05);

        mesh.renderOrder = 10;

        mesh.userData.index = i;
        mesh.userData.name = signpostDetailsData.name;
        mesh.userData.link = signpostDetailsData.link;
        mesh.userData.tracking = signpostDetailsData.tracking;

        hotspots2.push(mesh);

        mesh.userData.shake = {
            nextTime: 0, // When to shake next (in seconds)
            duration: 1.5, // Shake duration
            elapsed: 0,
            active: false,
            ease: 'sine.easeInOut',
            angle: THREE.MathUtils.degToRad(3), // Shake angle in radians
            speed: 2, // Controls shake frequency
        };

    });
};

function updateSignShake(sprite, elapsedTime, delta) {
    const shake = sprite.userData.shake;

    if (!shake) return;

    if (elapsedTime >= shake.nextTime && !shake.active) {
        // Start shaking
        shake.active = true;
        shake.elapsed = 0;
        shake.nextTime = elapsedTime + 4; // Next shake in 2s
    }

    if (shake.active) {

        shake.elapsed += delta;

        if (shake.elapsed < shake.duration) {

            // Apply shake: tiny back-and-forth rotation
            const t = shake.elapsed * shake.speed;

            sprite.material.rotation = Math.sin(t * Math.PI * 2) * shake.angle;


        } else {
            // Reset
            sprite.material.rotation = 0;
            shake.active = false;
        }
    }
}

// Camera
const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);

scene.add(camera);

// Add sunlight for realistic daytime appearance
const sunLight = new THREE.DirectionalLight(0xFFFFF0, 0.25); // Reduced sunlight intensity
sunLight.position.set(5, 10, 5);
sunLight.castShadow = true;
scene.add(sunLight);

// Ambient light for overall illumination
const ambientLight = new THREE.AmbientLight(0xB0E0E6, 0.15); // Reduced ambient light intensity
scene.add(ambientLight);

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = true;
renderer.setClearColor(0x0d0d1a, 1); // Very dark blue background
renderer.toneMapping = THREE.NoToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const startTarget = signpostDetails[1]; // islands[4];
const camStartX = startTarget.position.x;
const camStartZ = startTarget.position.z + 5 - 2;

// minX & maxX are set in resize.
var minX = -2;
var maxX = 3.5;
var minZ = 3;
var maxZ = 11;

var minFoV = 25;
var maxFoV = 55;
var targetFoV = camera.fov;

camera.position.x = camStartX;
camera.position.y = 5;
camera.position.z = camStartZ;

camera.lookAt(startTarget.position.x, 0, startTarget.position.z - 2);

// Variables to track mouse/touch movement.
let isPointerDown = false;
let prevPointerX = 0;
let prevPointerY = 0;
let startPointerX = 0;
let startPointerY = 0;
let targetCameraX = camStartX;
let targetCameraY = camStartZ;
let cameraMovementSpeed = 0.008; // Adjust the speed of camera movement
let cameraLerpFactor = 0.05;
// Pinch stuff:
let initialDistance = null;

function getDistance(touches) {
    const [touch1, touch2] = touches;
    const dx = touch2.pageX - touch1.pageX;
    const dy = touch2.pageY - touch1.pageY;
    return Math.sqrt(dx * dx + dy * dy);
}
// 
const raycaster = new THREE.Raycaster();

// Event listener for mobile (touch) devices
if (isMobile()) {
    canvas.addEventListener('touchstart', (event) => {
        if (event.touches.length === 2) {
            initialDistance = getDistance(event.touches);
            isPointerDown = false;
            startPointerX = startPointerY = -1;
            return
        }

        isPointerDown = true;
        startPointerX = prevPointerX = event.touches[0].clientX;
        startPointerY = prevPointerY = event.touches[0].clientY;
        event.preventDefault(); // Prevent default action (like scrolling)

    });

    canvas.addEventListener('touchend', (event) => {
        isPointerDown = false;

        if (initialDistance) {
            initialDistance = null; // Reset when fingers lifted
            console.log('Pinch ended or unpinched');
            startPointerX = startPointerY = -1;
            return;
        }

        const currentPointerX = prevPointerX;
        const currentPointerY = prevPointerY;

        // Calculate the movement distance
        const deltaX = (currentPointerX - startPointerX);
        const deltaY = (currentPointerY - startPointerY);

        if (Math.abs(deltaX) + Math.abs(deltaY) < 5) {

            clickOnMap(currentPointerX, currentPointerY);
        }
    });

    canvas.addEventListener('touchmove', (event) => {
        if (event.touches.length === 2 && initialDistance) {
            const currentDistance = getDistance(event.touches);

            if (currentDistance > initialDistance) {

                const dDistance = currentDistance - initialDistance;
                targetFoV -= dDistance * 0.15;
                // console.log('Pinch out (zoom in)', targetFoV);
                initialDistance = currentDistance; // Update to avoid repeated logs
            } else if (currentDistance < initialDistance) {

                const dDistance = currentDistance - initialDistance;
                targetFoV -= dDistance * 0.15;
                // console.log('Pinch in (zoom out)', targetFoV);
                initialDistance = currentDistance;
            }
            isPointerDown = false;
            return;
        }

        if (isPointerDown) {
            // Get the current touch position
            const currentPointerX = event.touches[0].clientX;
            const currentPointerY = event.touches[0].clientY;

            // Calculate the movement distance
            const deltaX = (currentPointerX - prevPointerX);
            const deltaY = (currentPointerY - prevPointerY);

            // Update the camera's position on the x and z axes (locked on y)
            // camera.position.x -= deltaX * cameraMovementSpeed;
            // camera.position.z -= deltaY * cameraMovementSpeed;
            targetCameraX -= deltaX * cameraMovementSpeed;
            targetCameraY -= deltaY * cameraMovementSpeed;

            // Lock camera's y position (camera stays at fixed height)
            camera.position.y = 5; // Set the y position as fixed

            // Update the previous pointer position
            prevPointerX = currentPointerX;
            prevPointerY = currentPointerY;
        }
        event.preventDefault(); // Prevent default action (like scrolling)

    });
} else {
    // Event listener for desktop (mouse/pointer) devices
    canvas.addEventListener('pointerdown', (event) => {
        isPointerDown = true;
        startPointerX = prevPointerX = event.clientX;
        startPointerY = prevPointerY = event.clientY;
        event.preventDefault(); // Prevent default action (like scrolling)
    });

    canvas.addEventListener('pointerup', (event) => {
        isPointerDown = false;

        const currentPointerX = event.clientX;
        const currentPointerY = event.clientY;

        // Calculate the movement distance.
        const deltaX = (currentPointerX - startPointerX);
        const deltaY = (currentPointerY - startPointerY);

        if (Math.abs(deltaX) + Math.abs(deltaY) < 5) {

            clickOnMap(currentPointerX, currentPointerY);
        }
    });

    window.addEventListener('pointerup', (event) => {
        isPointerDown = false;

    });

    window.addEventListener("mouseout", (event) => {
        isPointerDown = false;

    });

    canvas.addEventListener('pointermove', (event) => {
        if (isPointerDown) {
            // Get the current pointer position
            const currentPointerX = event.clientX;
            const currentPointerY = event.clientY;

            // Calculate the movement distance
            const deltaX = (currentPointerX - prevPointerX);
            const deltaY = (currentPointerY - prevPointerY);

            // Update the camera's position on the x and z axes (locked on y)
            // camera.position.x -= deltaX * cameraMovementSpeed;
            // camera.position.z -= deltaY * cameraMovementSpeed;
            targetCameraX -= deltaX * cameraMovementSpeed;
            targetCameraY -= deltaY * cameraMovementSpeed;

            // Lock camera's y position (camera stays at fixed height)
            camera.position.y = 5; // Set the y position as fixed

            // Update the previous pointer position
            prevPointerX = currentPointerX;
            prevPointerY = currentPointerY;
        }
        event.preventDefault(); // Prevent default action (like scrolling)
    });
}

document.addEventListener('pointerleave', (event) => {
    isPointerDown = false;
});

// Check for clicks.
function clickOnMap(posX, posY) {

    const clickPosition = new THREE.Vector2()

    const rect = canvas.getBoundingClientRect();

    clickPosition.x = ((posX - rect.left) / rect.width) * 2 - 1;
    clickPosition.y = -((posY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(clickPosition, camera);
    const intersects2 = raycaster.intersectObjects(hotspots2);

    if (intersects2.length > 0) {

        const intersect = intersects2[0]; // The 3D point of intersection

        const object = intersect.object;
        const material = object.material;

        PixelTrack(object.userData.tracking);

        gotoLink(object.userData.link);

        return;

    }

    const intersects3 = raycaster.intersectObjects(kiwis);
    if (intersects3.length > 0) {

        const intersect = intersects3[0]; // The 3D point of intersection

        const object = intersect.object;
        const material = object.material;

        PixelTrack(object.userData.tracking);

        gotoLink(object.userData.link);

        return;

    }

    const intersects1 = raycaster.intersectObjects(hotspots1);

    if (intersects1.length > 0) {

        const intersect = intersects1[0]; // The 3D point of intersection

        const object = intersect.object;
        const material = object.material;
        // material.color.set('#f00');

        // const spriteWidth = object.scale.x * rect.width / 2;
        // const spriteHeight = object.scale.y * rect.height / 2;

        // PixelTrack(object.userData.tracking);
        // console.log(object.userData.tracking);
        PixelTrack(object.userData.tracking);

        const cx = 0.5
        const cy = 0.3;

        const rx = 0.475
        const ry = 0.5;

        const dx = intersect.uv.x - cx;
        const dy = intersect.uv.y - cy;

        const hit = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;

        showCarouselSlide(object.userData.link);

    }
}

function showCarouselSlide(linkName) {
    // Special handling for the "coquidrink" island: show slides 10,11,12 only
    if (linkName === 'coquidrink') {
        const coquidrinkSlides = `
            <div class="carousel-item active">
                <img src="assets/overlay/10.png" class="d-block w-100 no-click" alt="Slide 1">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/11.png" class="d-block w-100 no-click" alt="Slide 2">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/12.png" class="d-block w-100 no-click" alt="Slide 3">
            </div>
        `;

        setCarouselSlides(coquidrinkSlides);
        showCarousel(0);
        return;
    }

    // Special handling for the "coqui" island: show slides 1..6 only
    if (linkName === 'coqui') {
        const coquiSlides = `
            <div class="carousel-item active">
                <img src="assets/overlay/1.png" class="d-block w-100 no-click" alt="Slide 1">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/2.png" class="d-block w-100 no-click" alt="Slide 2">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/3.png" class="d-block w-100 no-click" alt="Slide 3">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/4.png" class="d-block w-100 no-click" alt="Slide 4">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/5.png" class="d-block w-100 no-click" alt="Slide 5">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/6.png" class="d-block w-100 no-click" alt="Slide 6">
            </div>
        `;

        setCarouselSlides(coquiSlides);
        showCarousel(0);
        return;
    }

    // Special handling for the "mixlev" island: show slides 7..9 only
    if (linkName === 'mixlev') {
        const mixlevSlides = `
            <div class="carousel-item active">
                <img src="assets/overlay/7.png" class="d-block w-100 no-click" alt="Slide 1">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/8.png" class="d-block w-100 no-click" alt="Slide 2">
            </div>
            <div class="carousel-item">
                <img src="assets/overlay/9.png" class="d-block w-100 no-click" alt="Slide 3">
            </div>
        `;

        setCarouselSlides(mixlevSlides);
        showCarousel(0);
        return;
    }

    // For other islands, restore the original carousel slides and show the mapped index
    if (carouselInnerEl && carouselInnerEl.innerHTML !== originalCarouselInner) {
        setCarouselSlides(originalCarouselInner);
    }

    const carouselLinks = // Needs to match order of carousel slides.
        [
            "c_and_b",
            "k_and_l",
            "m_and_p",
            "p_and_r",
        ];

    const index = carouselLinks.indexOf(linkName);
    if (index == -1) {
        console.warn("incorrect carousel index for: " + linkName)
    }
    showCarousel(index);
}

function gotoLink(linkName) {
    // Link desabilitado - apenas loja local
}

const wrapper = document.getElementById('carouselWrapper');
const backdrop = document.getElementById('carouselBackdrop');

const carouselElement = document.getElementById('imageCarousel');
let carousel = new bootstrap.Carousel(carouselElement, {
    interval: false, // Disable auto sliding
});

// Save original carousel slides so we can restore later
const carouselInnerEl = carouselElement.querySelector('.carousel-inner');
const originalCarouselInner = carouselInnerEl ? carouselInnerEl.innerHTML : '';

function setCarouselSlides(html) {
    // Dispose current carousel instance
    try {
        carousel.dispose();
    } catch (e) {
        // ignore
    }

    // Replace slides
    if (carouselInnerEl) carouselInnerEl.innerHTML = html;

    // Ensure first item has 'active' class
    const first = carouselInnerEl.querySelector('.carousel-item');
    if (first) {
        carouselInnerEl.querySelectorAll('.carousel-item').forEach((el, i) => {
            if (i === 0) el.classList.add('active'); else el.classList.remove('active');
        });
    }

    // Recreate carousel instance
    carousel = new bootstrap.Carousel(carouselElement, { interval: false });
}

const closeBtn = document.getElementById('carouselClose');

function showCarousel(index = 0) {
    wrapper.classList.remove('d-none');
    backdrop.classList.remove('d-none');
    jumpToSlide(index);
}

function jumpToSlide(index) {
    // Disable the transition
    carouselElement.classList.add('no-transition');

    // Jump to the desired slide (0-indexed)
    carousel.to(index);

    // Re-enable the transition after a small delay
    setTimeout(() => {
        carouselElement.classList.remove('no-transition');
    }, 50); // Slight delay before re-enabling transition

}

document.getElementById('carouselPrev').addEventListener('click', () => {
    carousel.next();
});

document.getElementById('carouselNext').addEventListener('click', () => {
    carousel.prev();
});

closeBtn.addEventListener('click', () => {
    wrapper.classList.add('d-none');
    backdrop.classList.add('d-none');
    // Restore original slides when closing, if they were replaced
    if (carouselInnerEl && carouselInnerEl.innerHTML !== originalCarouselInner) {
        setCarouselSlides(originalCarouselInner);
    }
});


// Animation loop
function animate() {

    requestAnimationFrame(animate);

    camera.position.x += (targetCameraX - camera.position.x) * cameraLerpFactor;
    camera.position.z += (targetCameraY - camera.position.z) * cameraLerpFactor;

    camera.position.x = clamp(camera.position.x, minX, maxX);
    camera.position.z = clamp(camera.position.z, minZ, maxZ);

    targetFoV = clamp(targetFoV, minFoV, maxFoV);
    camera.fov += (targetFoV - camera.fov) * cameraLerpFactor;
    camera.updateProjectionMatrix();

    const delta = clock.getDelta();

    for (let i = 0; i < this._rippleAnimations.length; i++) {
        const rippleAnimation = this._rippleAnimations[i];

        rippleAnimation.update(delta * 1000);

        rippleAnimation.mesh.rotation.z += rippleAnimation.dir * delta * 0.1
    }

    const elapsed = clock.getElapsedTime();
    updateKiwiCanoe(elapsed);
    updateKiwiDance(elapsed);

    // Animate water movement
    if (seaTexture) {
        seaTexture.offset.x += 0.0003; // Horizontal movement
        seaTexture.offset.y += 0.0002; // Vertical movement
        gridMaterial.needsUpdate = true;
    }

    for (let i = 0; i < hotspots2.length; i++) {
        const signpost = hotspots2[i];

        updateSignShake(signpost, elapsed, delta);
    }

    // Render the scene
    renderer.render(scene, camera);
}

// Resize handler
window.addEventListener('resize', () => {

    canvas.height = 5;
    canvas.style.height = '5px';

    const width = canvas.parentElement.clientWidth;
    const height = Math.floor(canvas.parentElement.clientHeight);
    const dpr = window.devicePixelRatio || 1;

    // Update camera aspect and projection matrix
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    minX = -2 / camera.aspect;
    maxX = 6.55 / camera.aspect;

    // Update renderer size
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(width, height);

    // Update nav bar classes.
    const dd1 = document.getElementById("dd1");
    // const dd2 = document.getElementById("dd2");
    // const dd3 = document.getElementById("dd3");

    if (width > 992) {
        dd1.classList.add('text-center');
        // dd2.classList.add('text-center');
        // dd3.classList.add('text-center');

        dd1.classList.add('dropdown-menu-center');
        // dd2.classList.add('dropdown-menu-center');
        // dd3.classList.add('dropdown-menu-end');
    } else {
        dd1.classList.remove('text-center');
        // dd2.classList.remove('text-center');
        // dd3.classList.remove('text-center');

        dd1.classList.remove('dropdown-menu-center');
        // dd2.classList.remove('dropdown-menu-center');
        // dd3.classList.remove('dropdown-menu-end');
    }
});

function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for Android
    if (/android/i.test(userAgent)) {
        return true;
    }

    // Check for iOS
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return true;
    }

    // Check for Windows Phone
    if (/windows phone/i.test(userAgent)) {
        return true;
    }

    // Check for other mobile devices
    if (/mobile/i.test(userAgent)) {
        return true;
    }

    // Default to desktop
    return false;
}

function clamp(value, min, max) {
    min = min || 0;
    max = max || 1;

    return Math.max(min, Math.min(value, max));
}

function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration, pauseDuration = 0) {
    // note: texture passed by reference, will be updated by the update function.

    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    this.numberOfTiles = numTiles;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

    this.tileDisplayDuration = tileDispDuration;
    this.pauseDuration = pauseDuration; // New pause duration property
    this.currentDisplayTime = 0;
    this.currentTile = 0;

    this.isPaused = false; // Flag to track if animation is paused
    this.pauseTime = 0; // Time elapsed during pause

    this.update = function(milliSec) {
        if (this.isPaused) {
            this.pauseTime += milliSec;

            // Check if pause time has elapsed, and unpause if so
            if (this.pauseTime >= this.pauseDuration) {
                this.isPaused = false;
                this.pauseTime = 0;
            }
            return; // Skip updating the animation while paused
        }

        this.currentDisplayTime += milliSec;
        while (this.currentDisplayTime > this.tileDisplayDuration) {
            this.currentDisplayTime -= this.tileDisplayDuration;
            this.currentTile++;

            if (this.currentTile == this.numberOfTiles - 1) {
                // If the current tile is the last one, start the pause
                if (this.pauseDuration > 0) {
                    this.isPaused = true;
                }
            }

            if (this.currentTile == this.numberOfTiles) {
                this.currentTile = 0; // Reset to first tile
            }

            const currentColumn = this.currentTile % this.tilesHorizontal;
            texture.offset.x = currentColumn / this.tilesHorizontal;
            const currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
            texture.offset.y = currentRow / this.tilesVertical;
        }
    };
}

window.dispatchEvent(new Event('resize'));

window.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('customModal');
    const backdrop = document.getElementById('modalBackdrop');
    const closeBtn = document.getElementById('modalClose');

    const modalImage = document.querySelector('#customModal img');

    if (modalImage) {
        if (isMobile()) {
            modalImage.src = 'assets/overlay/instructions_mobile.png';
        } else {
            modalImage.src = 'assets/overlay/instructions_desktop.png';
        }
    }

    // Show on load
    modal.classList.remove('d-none');
    backdrop.classList.remove('d-none');
    modal.classList.add('instruction-modal-fade');
    backdrop.classList.add('instruction-modal-fade');

    closeBtn.classList.add('pulse');
    /*
    // Wait for 5 seconds before fading out
    setTimeout(() => {
        modal.classList.add('instruction-modal-fade-out');
        backdrop.classList.add('instruction-modal-fade-out');

        // Hide the modal and backdrop after the fade-out is complete
        setTimeout(() => {
            modal.classList.add('d-none');
            backdrop.classList.add('d-none');
        }, 1000); // Fade out duration (1 second)
    }, 8000); // 5-second delay before fading out
    */

    const hideModal = () => {
        modal.classList.add('instruction-modal-fade-out');
        backdrop.classList.add('instruction-modal-fade-out');

        // Hide the modal and backdrop after fade-out
        setTimeout(() => {
            modal.classList.add('d-none');
            backdrop.classList.add('d-none');
        }, 1000); // Fade out duration (1 second)
    }

    // Close on button click.
    closeBtn.addEventListener('click', hideModal);

    // Close on backdrop click.
    backdrop.addEventListener('click', hideModal);

    // Close on Modal click.
    modal.addEventListener('click', hideModal);
});




animate();