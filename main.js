import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { detectCollisionCubes } from './detectColisions.js';

import * as CANNON from './libs/cannon-es.js';

import { OrbitControls } from "three/addons/controls/OrbitControls";



let scene = new THREE.Scene();
//scene.fog = new THREE.Fog(0xffffff);
//scene.background = new THREE.Color("white");

let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffffff)
//renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
let stats = new Stats();
document.body.appendChild(stats.dom);

let camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 300, 500);
//camera.lookAt(0,0,0);

//var ambient = new THREE.AmbientLight( 0x404040);
var ambient = new THREE.DirectionalLight(0xffffff, 0.7);
scene.add(ambient)

// let light = new THREE.PointLight(0xffffff, 1);
// light.position.set(50, 20, 0);
// light.penumbra = 1;
// light.power = 20;
// light.decay = 2;
// light.distance = 100;


//scene.add(light);



let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 5, 0);

var keyboard = new THREEx.KeyboardState();



let player;
let playerSpeed = 1;

let player2;
let playerSpeed2 = 1;

let ball;





const world = new CANNON.World();
const shape = new CANNON.Sphere(0.5);
let body = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: shape,
});

const clock = new THREE.Clock();
let oldElapsedTime;

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();




function init() {


  var geometryPlane = new THREE.BoxGeometry(200, 1, 400);
  var materialPlane = new THREE.MeshPhongMaterial({ color: 0xcccccc, side: THREE.DoubleSide })
  let plane = new THREE.Mesh(geometryPlane, materialPlane);
  plane.position.set(0, -0.5, 0);
  scene.add(plane);

  var geometryNet = new THREE.BoxGeometry(200, 30, 2);
  var materialNet = new THREE.MeshPhongMaterial({ color: 0x0cccccc, side: THREE.DoubleSide, transparent: true, opacity: 0.5 })
  let net = new THREE.Mesh(geometryNet, materialNet);
  net.position.set(0, 15, 0);
  scene.add(net);

  var geometryPlayer = new THREE.BoxGeometry(10, 20, 10);
  var materialPlayer = new THREE.MeshPhongMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
  player = new THREE.Mesh(geometryPlayer, materialPlayer);
  player.position.set(0, 10, 50);
  //scene.add(player);

  var geometryPlayer2 = new THREE.BoxGeometry(10, 20, 10);
  var materialPlayer2 = new THREE.MeshPhongMaterial({ color: 0x0000ff, side: THREE.DoubleSide })
  player2 = new THREE.Mesh(geometryPlayer2, materialPlayer2);
  player2.position.set(0, 10, -70);
  scene.add(player2);

  var geometryBall = new THREE.SphereGeometry(4, 20, 20);
  var materialBall = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide })
  ball = new THREE.Mesh(geometryBall, materialBall);
  ball.position.set(0, 70, 50);
  scene.add(ball);


  world.gravity.set(0, -9.82, 0);

  body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(ball.position.x, ball.position.y, ball.position.z),
    shape: shape,
  });

  world.addBody(body);

  oldElapsedTime = 0;

  floorBody.mass = 0;
  floorBody.addShape(floorShape);
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  world.addBody(floorBody);




};
init();

function movePlayer() {
  if (keyboard.pressed("left")) player.position.x -= playerSpeed;
  if (keyboard.pressed("right")) player.position.x += playerSpeed;
  if (keyboard.pressed("down")) player.position.z += playerSpeed;
  if (keyboard.pressed("up")) player.position.z -= playerSpeed;
}

/*///////////////////////////////////////////////////////////////////*/

function animate() {
  controls.update();

  movePlayer();

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);

  ball.position.copy(body.position);

};

/*///////////////////////////////////////////////////////////////////*/



renderer.setAnimationLoop((_) => {

  animate();
  stats.update();
  renderer.render(scene, camera);
});


/*///////////////////////////////////////////////////////////////////*/


function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}