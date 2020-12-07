// import "three/build/three"
function init(){
    // var stats = initStats();
    camera = new THREE.PerspectiveCamera(80, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 1000;
    scene = new THREE.Scene();
    scene.add(camera);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    makeParticles();
    document.addEventListener('mousemove', onmousemove, false);
    update();
}
function makeParticles(){
    var particle, material;
    for(var zpos=-1000; zpos<1000; zpos+=20){
        var geo = new THREE.OctahedronGeometry();
        var material1 = new THREE.LineBasicMaterial({color:0xf212ac});
        var material2 = new THREE.LineBasicMaterial({color:0xac12fa});

        var particle1 = new THREE.Line(geo, material1);
        particle1.position.x = Math.random()*1000 - 500;
        particle1.position.y = Math.random()*1000 - 500;
        particle1.position.z = zpos;
        particle1.scale.x = particle1.scale.y = 10;
        scene.add(particle1);
        particles.push(particle1);

        var geo2 = new THREE.ConeGeometry();
        var particle2 = new THREE.Line(geo, material2);
        particle2.position.x = Math.random()*1000 - 500;
        particle2.position.y = Math.random()*1000 - 500;
        particle2.position.z = zpos+100;
        particle2.scale.x = particle2.scale.y = 10;
        scene.add(particle2);
        particles.push(particle2);
    }
}

function updateParticles() {
    for(var i=0; i<particles.length; i++){
        // particle = particles[i];
        particles[i].position.z += Math.random() * 50;
        if(particles[i].position.z > 1000)  particles[i].position.z -=2000;
    }
}

function update() {
    updateParticles();
    requestAnimationFrame(update);
    renderer.render(scene, camera);
}
function onMouseMove( event ) {
    // store the mouseX and mouseY position
    mouseX = event.clientX;
    mouseY = event.clientY;
}
// function initStats(type){
//     var pannelType = (typeof type !== 'undefined' && type) && (!isNaN(type)?parseInt(type):0);
//     var stats = new Stats();
//     stats.setMode(0);
//     stats.domElement.style.position = 'absolute';
//     stats.domElement.style.left = '0px';
//     stats.domElement.style.top = '0px';
//     // document.getElementById("Stats-output").appendChild(stats.domElement);
//     return stats;
// }
var camera, scene, renderer,
    mouseX = 0, mouseY = 0,
    particles = [];
init();