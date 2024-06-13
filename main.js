import './style.css';
import * as THREE from 'three';

/*
  This site uses the ThreeJS library to handle the graphics displayed.

  Acest site utilizează libraria de grafici ThreeJS.
*/


/*
  Because the graphics are displayed in a canvas element, resizing the page will break them. Thus, we reload the site on every resize. An the contents will fade in to account for loading delay.

  Din cauza că graficile sunt afișate printr-un element canvas, redimensionarea paginii le va strica. De aceea vom reîncărca pagina la fiecare redimensionare. Conținul se va estompa pentru a ascunde întârzierea încărcării paginii.
*/
addEventListener("resize", (event) => {
  document.body.style.opacity = 0;
  setTimeout(() => {
    location.reload(); 
  }, 200);
});

/*
  ThreeJS Setup
*/
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(30);
camera.position.setX(-3);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.render(scene, camera);

/*
  Scene Objects and Background | Obiectele din scenă și fundalul
*/

// Space background || Imagine de fundal cu spațiu
const spaceTexture = new THREE.TextureLoader().load('/space.jpg');
spaceTexture.magFilter = THREE.NearestFilter;
scene.background = spaceTexture;
scene.backgroundIntensity = 0.01;

// Background stars with random position | Stele pe fundal cu poziții întâmplătoare
Array(400).fill().forEach(() => {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
});

// Profile image cube | Cub cu imaginea de profil
const profileTexture = new THREE.TextureLoader().load('/profile.jpg');
profileTexture.magFilter = THREE.NearestFilter;

const profile = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3), 
  new THREE.MeshBasicMaterial({ map: profileTexture })
);

profile.position.z = -5;
profile.position.x = 2;
scene.add(profile);

// Torus | Inel
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(8, 1.5, 16, 100), 
  new THREE.MeshStandardMaterial({ color: 0x3489eb })
);

torus.position.set(0, 0, 0)
scene.add(torus);

// Moon | Luna
const moonTexture = new THREE.TextureLoader().load('/moon.jpg');
const moonNormalTexture = new THREE.TextureLoader().load('/normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: moonNormalTexture,
  })
);

scene.add(moon);

const radiusMoon = 15;
let angleMoon = 0;

moon.position.z = 30;
moon.position.setX(-10);

// Venus
const venusTexture = new THREE.TextureLoader().load('/venus.jpg');
const venusNormalTexture = new THREE.TextureLoader().load('/venus_normal.jpg');

const venus = new THREE.Mesh(
  new THREE.SphereGeometry(5, 32, 32),
  new THREE.MeshStandardMaterial({
    map: venusTexture,
    normalMap: venusNormalTexture,
  })
);

scene.add(venus);

const radiusVenus = 25;
let angleVenus = 0;

venus.position.z = -30;
venus.position.setX(10);

// Scene light | Lumină pentru scenă
const pointLight = new THREE.PointLight(0xffffff, 5000);
pointLight.position.set(30, 5, 30);

scene.add(pointLight);



/*
  When scrolling, some objects of the scene will rotate

  La parcurgerea paginii, unele obiecte se vor roti
*/
function moveCamera() {

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  venus.rotation.x += 0.05;
  venus.rotation.y += 0.075;
  venus.rotation.z += 0.05;

  profile.rotation.y += 0.01;
  profile.rotation.z += 0.01;

  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();


/*
  A recursive function for allowing animations to happen in the scene

  O funcție recursivă ce va permite animațiile din scenă
*/
function animate() {
  requestAnimationFrame(animate);

  // Rotating the torus around the profile cube | Rotim inelul în jurul cubului de profil
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  // The moon and venus will orbit the cube | Luna și Venus se vor orbita cubul
  angleMoon += 0.005;
  moon.position.set(radiusMoon * Math.cos(angleMoon), radiusMoon * Math.sin(angleMoon), radiusMoon * Math.sin(angleMoon));
  angleVenus += 0.005;
  venus.position.set(radiusVenus * Math.cos(angleVenus), radiusVenus * Math.cos(angleVenus), radiusVenus * Math.sin(angleVenus))

  moon.rotation.x += 0.005;
  venus.rotation.z += 0.005;

  profile.rotation.x += 0.0005;
  profile.rotation.y += 0.0005;
  profile.rotation.z += 0.0005;

  renderer.render(scene, camera);
}

animate();
