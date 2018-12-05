var render, cena, camera;
var angle = 0;
var position = 0;

var direction = new THREE.Vector3(1, 0, 0);
var up = new THREE.Vector3(0, 0, 1);
var axis = new THREE.Vector3();
var speed = 0.5;
var canvas;

init();
desenhar();

function init() {
    render = new THREE.WebGLRenderer({
        antialias: true
    });
    render.setPixelRatio(window.devicePixelRatio);
    render.setSize(window.innerWidth, window.innerHeight);
    canvas = render.domElement;
    document.body.appendChild(canvas);

    cena = new THREE.Scene();

    var ambientLight = new THREE.AmbientLight(0x404040);
    cena.add(ambientLight);

    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(60, 25, 50);
    cena.add(ambientLight);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.x = 30;
    camera.position.z = 250;

    var materialCubo = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shading: THREE.FlatShading
    });
    
    var materialBola = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
    });

    var geometriaCubo = new THREE.BoxGeometry(10, 5, 5);
    var geometriaBola = new THREE.SphereGeometry(2, 10, 10);
    cubo = new THREE.Mesh(geometriaCubo, materialCubo);
    bola = new THREE.Mesh(geometriaBola, materialBola);
    bola.position.x = cubo.position.x + 5;
    carro = new THREE.Object3D();
    carro.add(cubo);
    carro.add(bola);
    cena.add(carro);

    var p1 = new THREE.Vector3(-100, -10, 0);
    var p2 = new THREE.Vector3(-80, 10, 0);
    var p3 = new THREE.Vector3(-50, 100, 0);
    var p4 = new THREE.Vector3(100, 50, 0);
    var p5 = new THREE.Vector3(100, -50, 0);
    var p6 = new THREE.Vector3(-0, -75, 0);
    var p7 = new THREE.Vector3(-70, -75, 0);
    var p8 = new THREE.Vector3(-100, -30, 0);
    var p9 = new THREE.Vector3(-100, -10, 0);

    var pontos = [p1, p2, p3, p4, p5, p6, p7, p8, p9];

    curva = new THREE.SplineCurve(pontos);
    caminho = new THREE.Path(curva.getPoints(200));

    desenharCaminho();

    previousPoint = curva.getPoint(position);
    previousAngle = curva.getTangent(position);
}

function desenharCaminho() {
    var pontosCaminho = curva.getSpacedPoints(100);

    for (var i = 0; i < pontosCaminho.length; i++) {
        point = pontosCaminho[i]
        pontosCaminho[i] = new THREE.Vector3(point.x, point.y, 0);
    }

    var geometriaLinha = new THREE.Geometry();
    geometriaLinha.vertices = pontosCaminho;
    var materialLinha = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    var linha = new THREE.Line(geometriaLinha, materialLinha)
    cena.add(linha);
}

function moverObjeto() {
    position += 0.002;

    if (position > 1) {
        position = 0;
    }

    var point = curva.getPointAt(position);
    carro.position.x = point.x;
    carro.position.y = point.y;

    var angle = getAngle(position);
    carro.quaternion.setFromAxisAngle(up, angle);

    previousPoint = point;
    previousAngle = angle;
}

function getAngle(position) {
    var tangent = caminho.getTangent(position).normalize();
    angle = Math.atan2(tangent.y, tangent.x);
    return angle;
}

function desenhar() {
    moverObjeto();
    render.render(cena, camera);
    requestAnimationFrame(desenhar);
}

var xi;
var yi;

canvas.addEventListener("mousedown", function (e) {
    if (e.buttons | 1) {
        xi = e.offsetX;
        yi = e.offsetY;
    }
}, true);

canvas.addEventListener("mousemove", function (e) {
    e.preventDefault();
    if (e.buttons == 1) {

        camera.rotation.y = (Math.max(Math.min((xi - e.offsetX) / canvas.width))) * -1;
        camera.rotation.x = Math.max(Math.min((e.offsetY - yi) / canvas.width)) * 1;

    }
    if (e.buttons == 2) {

        camera.position.x = 100 * (xi - e.offsetX) / canvas.width;
        camera.position.y = 100 * (e.offsetY - yi) / canvas.width;

    } else if (e.buttons == 4) {

        camera.position.z += 10 * (xi - e.offsetX) / canvas.width;
        camera.position.z -= 10 * (e.offsetY - yi) / canvas.width;

    }
}, false);

function keyup_handler(e) {
    keys[e.keyCode] = false;
    if (e.keyCode === 38 || e.keyCode === 40) {
        speed = 0;
    }
}
