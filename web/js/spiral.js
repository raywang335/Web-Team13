// console.log('spiral loaded');

var app = app || {};
var NTZ = true;
$(document).ready(function() {
    console.log("DOM is ready!");
    var drag_tag = false,ox = 0,left = 0;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var mouseX = 0,
        mouseY = 0,
        windowHalfX = window.width / 2,
        windowHalfY = window.weight / 2;
    var camera, scene, renderer;
    init();
    $('#open-menu').click(function() {
        $('nav.menu').fadeToggle('slow');
    })
    $('nav.menu').click(function() {
        $('nav.menu').fadeOut('slow');
    })
    $('nav.menu').hide();
    $('canvas').width = width;
    $('canvas').height = height;
    var classNames = ['iconfont iconzanting',"iconfont iconbofang"]
    var rAF;
    var IS;

    function init() {
        scene = new THREE.Scene();

        var fov = 20;

        renderer = new THREE.CanvasRenderer();
        renderer.setSize(width - 100, height - 150);
        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(fov, width / height, 1, 10000);
        camera.position.set(0, 0, 175);

        renderer.setClearColor(0x000000, 1);

        var PI2 = Math.PI * 2;
        particles = new Array();

        for (var i = 0; i <= 2048; i++) {
            var material = new THREE.SpriteCanvasMaterial({
                color: 0xffffff,
                program: function(context) {
                    context.beginPath();
                    context.arc(0, 0, 0.33, 0, PI2);
                    context.fill();
                }
            });
            var particle = particles[i++] = new THREE.Particle(material);
            scene.add(particle);
        }

        function windowResize() {
            width = window.innerWidth;
            height = window.innerHeight;
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }

        function onKeyDown(e) {
            switch (e.which) {
                case 32:
                    if (app.play) {
                        app.audio.pause();
                        app.play = false;
                    } else {
                        app.audio.play();
                        app.play = true;
                    }
                    break;
                case 'h':
                    if (gui.closed) {
                        gui.closed = false;
                    } else {
                        gui.closed = true;
                    }
                    break;
                case 49:
                    spiral.spiral = true;
                    spiral.wavySpiral = false;
                    spiral.circle = false;
                    spiral.flower = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.open();
                    wavySpiralFolder.close();
                    flowerFolder.close();
                    circleFolder.close();
                    break;
                case 50:
                    spiral.spiral = false;
                    spiral.wavySpiral = true;
                    spiral.circle = false;
                    spiral.flower = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.open();
                    flowerFolder.close();
                    circleFolder.close();
                    break;
                case 51:
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.circle = false;
                    spiral.flower = true;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.open();
                    circleFolder.close();
                    break;
                case 52:
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.circle = true;
                    spiral.flower = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.close();
                    circleFolder.open();
                    break;
                case 53:
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.circle = false;
                    spiral.flower = false;
                    spiral.hyperbola = true;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.close();
                    circleFolder.close();
                    break;
                case 54:
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.circle = false;
                    spiral.flower = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = true;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.close();
                    circleFolder.close();
                    break;
                case 55:
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.circle = false;
                    spiral.flower = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = true;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.close();
                    circleFolder.close();
                    break;
                case 82:
                    spiral.toggleRed = true;
                    spiral.toggleGreen = false;
                    spiral.toggleBlue = false;
                    break;
                case 71:
                    spiral.toggleRed = false;
                    spiral.toggleGreen = true;
                    spiral.toggleBlue = false;
                    break;
                case 66:
                    spiral.toggleRed = false;
                    spiral.toggleGreen = false;
                    spiral.toggleBlue = true;
                    break;
                case 65:
                    spiral.animate = !spiral.animate;
                    break;
                case 187:
                    if (spiral.intensity < 1) {
                        spiral.intensity += 0.01;
                    }
                    break;
                case 189:
                    if (spiral.intensity > 0.05) {
                        spiral.intensity -= 0.01;
                    }
            }
            return false;
        }

        function onDocumentTouchStart(e) {
            if (e.touches.length === 1) {
                e.preventDefault();
                mouseX = e.touches[0].pageX - windowHalfX;
                mouseY = e.touches[0].pageY - windowHalfY;
            }
        }

        function onDocumentTouchMove(e) {
            if (e.touches.length === 1) {
                e.preventDefault();
                mouseX = e.touches[0].pageX - windowHalfX;
                mouseY = e.touches[0].pageY - windowHalfY;
            }
        }

        function changeMode(e) {
            var mode_id = e.path[0].id
                // console.log(mode_id)
            switch (mode_id) {
                case "spiral":
                    spiral.spiral = true;
                    spiral.wavySpiral = false;
                    spiral.flower = false;
                    spiral.circle = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.open();
                    wavySpiralFolder.close();
                    flowerFolder.close();
                    circleFolder.close();
                    break;
                case "circle":
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.flower = false;
                    spiral.circle = true;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.close();
                    circleFolder.open();
                    break;
                case "wavy":
                    spiral.spiral = false;
                    spiral.wavySpiral = true;
                    spiral.flower = false;
                    spiral.circle = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.open();
                    flowerFolder.close();
                    circleFolder.close();
                    break;
                case "flower":
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.flower = true;
                    spiral.circle = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.open();
                    circleFolder.close();
                    break;
                case "hyperbola":
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.flower = false;
                    spiral.circle = false;
                    spiral.hyperbola = true;
                    spiral.hybrid = false;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.open();
                    circleFolder.close();
                    break;
                case "hybrid":
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.flower = false;
                    spiral.circle = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = true;
                    spiral.donut = false;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.open();
                    circleFolder.close();
                    break;
                case "donut":
                    spiral.spiral = false;
                    spiral.wavySpiral = false;
                    spiral.flower = false;
                    spiral.circle = false;
                    spiral.hyperbola = false;
                    spiral.hybrid = false;
                    spiral.donut = true;
                    spiralFolder.close();
                    wavySpiralFolder.close();
                    flowerFolder.open();
                    circleFolder.close();
                    break;

            }
        }

        function play_music(e) {
            var mode_id = e.path[1].id
                //console.log(app)
            // console.log(e);
            var ig = document.getElementById('play')
            console.log(ig.children[0].className)
            if (mode_id == 'play' && app.audio) {
                if(app.play == false) {
                    animate();
                    IS = true;
                    ig.children[0].className = classNames[Number(app.play)]
                    app.audio.play()
                    app.play = true
                    console.log("Playing Animating!")
                }
                else{
                    cancelAnimationFrame(rAF);
                    IS = false;
                    ig.children[0].className = classNames[Number(app.play)]
                    app.audio.pause()
                    app.play = false
                    console.log("Stoping end-Animating!")
                }
            }
        }

        function start_drag_music(e){
            if(app.audio && e.path[0].className=='mask'){
                drag_tag = true
                ox = e.pageX;
            }
        }

        function drag_music(e) {
            if (drag_tag) {
                left = e.pageX - ox;
                if (left > 500) {
                    left = 500;
                }
            }
        }

        function end_drag_music(e){
            drag_tag = false;
            if(app.audio && e.path[0].className=='mask'){
                var rate = left / 485
                app.audio.currentTime = rate * app.audio.duration + app.audio.currentTime
                if(!IS){
                    setTime($('#showtime'), app.audio.currentTime);
                    $('#scroll-audio').animate({ left: 15+485 * app.audio.currentTime / app.audio.duration }, 0.1)
                }
            }

        }

        function adjust_curr(e){
            console.log(e)
            if(app.audio.currentTime > app.audio.duration){
                app.audio.currentTime = app.audio.duration;
            }
            setTime($('#showtime'), app.audio.currentTime);
            $('#scroll-audio').animate({ left: 15+485 * app.audio.currentTime / app.audio.duration }, 0.1)
        }

        // var bx;
        window.addEventListener('resize', windowResize, false);
        document.addEventListener('click', play_music, false)
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('click', changeMode, false);
        document.addEventListener('mousedown', start_drag_music, false);
        document.addEventListener('mousemove', drag_music, false);
        document.addEventListener('mouseup', end_drag_music, false);
        document.addEventListener('timeupdate', adjust_curr, false)


        var GuiControls = function() {
            this.intensity = 0.15;
            this.toggleRed = true;
            this.toggleGreen = false;
            this.toggleBlue = false;
            this.fov = 35;
            this.R = 0.7;
            this.G = 0;
            this.B = 0.7;

            this.colorChange = true;

            this.radius = 50;
            this.test = 20;
            this.a = 0.15;
            this.b = 0.20;
            this.angle = 11;
            this.aWavy = 1.20;
            this.bWavy = 0.76;
            this.wavyAngle = 2.44;
            this.aFlower = 25;
            this.bFlower = 0;
            this.flowerAngle = 2.86;
            this.spiral = false;
            this.wavySpiral = false;
            this.flower = false;
            this.circle = false;
            this.hyperbola = false;
            this.hybrid = false;
            this.donut = true;
            this.valueOfTest02 = 40;

            this.animate = true;
        };

        var spiral = new GuiControls();

        var gui = new dat.GUI({ autoPlace: true });
        gui.closed = true;
        // gui.domElement.id = "gui";
        $('.moveGUI').append($(gui.domElement));
        gui.add(spiral, 'animate').name('ANIMATE');

        gui.add(spiral, 'colorChange').name('ColorChange').listen().onChange(function() {
            if (spiral.colorChange) {
                colorFolder.close();
            } else {
                colorFolder.open();
            }
        });


        gui.add(spiral, 'intensity', 0.01, 1).name('Intensity');
        gui.add(spiral, 'fov', 1, 150).name('Zoom Distance');
        // visualizer type checkboxes
        gui.add(spiral, 'spiral').name('Spiral').listen().onChange(function() {
            spiral.spiral = true;
            spiral.wavySpiral = false;
            spiral.flower = false;
            spiral.circle = false;
            spiral.hyperbola = false;
            spiral.hybrid = false;
            spiral.donut = false;
            spiralFolder.open();
            wavySpiralFolder.close();
            flowerFolder.close();
            circleFolder.close();

        });
        gui.add(spiral, 'wavySpiral').name('Wavy Spiral').listen().onChange(function() {
            spiral.spiral = false;
            spiral.wavySpiral = true;
            spiral.flower = false;
            spiral.circle = false;
            spiral.hyperbola = false;
            spiral.hybrid = false;
            spiral.donut = false;
            spiralFolder.close();
            wavySpiralFolder.open();
            flowerFolder.close();
            circleFolder.close();
        });
        gui.add(spiral, 'flower').name('Flower').listen().onChange(function() {
            spiral.spiral = false;
            spiral.wavySpiral = false;
            spiral.flower = true;
            spiral.circle = false;
            spiral.hyperbola = false;
            spiral.hybrid = false;
            spiral.donut = false;
            spiralFolder.close();
            wavySpiralFolder.close();
            flowerFolder.open();
            circleFolder.close();
        });
        gui.add(spiral, 'circle').name('Circle').listen().onChange(function() {
            spiral.spiral = false;
            spiral.wavySpiral = false;
            spiral.flower = false;
            spiral.circle = true;
            spiral.hyperbola = false;
            spiral.hybrid = false;
            spiral.donut = false;
            spiralFolder.close();
            wavySpiralFolder.close();
            flowerFolder.close();
            circleFolder.open();
        });

        gui.add(spiral, 'hyperbola').name('Hyperbola').listen().onChange(function() {
            spiral.spiral = false;
            spiral.wavySpiral = false;
            spiral.flower = false;
            spiral.circle = false;
            spiral.hyperbola = true;
            spiral.hybrid = false;
            spiral.donut = false;
            spiralFolder.close();
            wavySpiralFolder.close();
            flowerFolder.close();
            circleFolder.close();
        });

        gui.add(spiral, 'hybrid').name('hybrid').listen().onChange(function() {
            spiral.spiral = false;
            spiral.wavySpiral = false;
            spiral.flower = false;
            spiral.circle = false;
            spiral.hyperbola = false;
            spiral.hybrid = true;
            spiral.donut = false;
            spiralFolder.close();
            wavySpiralFolder.close();
            flowerFolder.close();
            circleFolder.close();
        })

        gui.add(spiral, 'donut').name('donut').listen().onChange(function() {
            spiral.spiral = false;
            spiral.wavySpiral = false;
            spiral.flower = false;
            spiral.circle = false;
            spiral.hyperbola = false;
            spiral.hybrid = false;
            spiral.donut = true;
            spiralFolder.close();
            wavySpiralFolder.close();
            flowerFolder.close();
            circleFolder.close();
        })

        var spiralFolder = gui.addFolder('Spiral Controls');
        spiralFolder.add(spiral, 'a', 0, 50).step(0.01).name('Inner Radius');
        spiralFolder.add(spiral, 'b', 0, 5).step(0.01).name('Outer Radius');
        spiralFolder.add(spiral, 'angle', 0, 50).step(.01).name('Angle');
        // spiralFolder.open();

        var wavySpiralFolder = gui.addFolder('Wavy Spiral Controls');
        wavySpiralFolder.add(spiral, 'aWavy', 0, 50).step(0.01).name('Inner Radius');
        wavySpiralFolder.add(spiral, 'bWavy', 0, 3).step(0.01).name('Outer Radius');
        wavySpiralFolder.add(spiral, 'wavyAngle', 1, 4).step(0.01).name('Angle');
        wavySpiralFolder.open();

        var flowerFolder = gui.addFolder('Flower Controls');
        flowerFolder.add(spiral, 'aFlower', 0, 50).step(0.01).name('Inner Radius');
        flowerFolder.add(spiral, 'bFlower', 0, 3).step(0.01).name('Outer Radius');
        flowerFolder.add(spiral, 'flowerAngle', 1, 4).step(0.01).name('Angle');

        var circleFolder = gui.addFolder('Circle Controls');
        circleFolder.add(spiral, 'radius', 10, 100).name('Radius');

        //var hybridFolder= gui.addFolder('Test02 Controls');
        //hybridFolder.add(spiral,'valueOfTesto2',-80,80).step(0.1).name()
        // color emphasis checkbox
        gui.add(spiral, 'toggleRed').name('Red Emphasis').listen().onChange(function() {
            spiral.toggleRed = true;
            spiral.toggleGreen = false;
            spiral.toggleBlue = false;
        });

        gui.add(spiral, 'toggleGreen').name('Green Emphasis').listen().onChange(function() {
            spiral.toggleRed = false;
            spiral.toggleGreen = true;
            spiral.toggleBlue = false;
        });

        gui.add(spiral, 'toggleBlue').name('Blue Emphasis').listen().onChange(function() {
            spiral.toggleRed = false;
            spiral.toggleGreen = false;
            spiral.toggleBlue = true;
        });

        // color controls
        var colorFolder = gui.addFolder('Colors');
        colorFolder.add(spiral, 'R', 0, 1).name('Red').step(0.01);
        colorFolder.add(spiral, 'G', 0, 1).name('Green').step(0.01);
        colorFolder.add(spiral, 'B', 0, 1).name('Blue').step(0.01);
        colorFolder.close();

        // hides dat.gui for production
        dat.GUI.toggleHide();

        function setTime(label, time) {
            var desstr = label.html().split('/')
            var total = desstr[1]
            var timer = parseFloat(time);
            var minute = parseInt(timer / 60);
            var second = timer - minute * 60;
            var minflag = "";
            var secflag = "";
            if (second < 10) secflag = "0"
            if (minute < 10) minflag = "0"
            label.html(minflag + minute + ":" + secflag + parseInt(second) + "/" + total);
        }


        function animate() {
            rAF = requestAnimationFrame(animate);
            var timeFloatData = [];
            var timeFrequencyData = [];

            if (app.audio && app.audio.duration) {
                // var timer = app.cxt;
                if (NTZ) {
                    NTZ = false;
                    var timer = parseFloat(app.audio.duration)
                    var minute = parseInt(timer / 60)
                    var second = timer - minute * 60
                    if (second < 10) $('#showtime').html("00:00 / " + "0" + String(minute) + ":" + "0" + String(parseInt(second)));
                    else $('#showtime').html("00:00 / " + "0" + String(minute) + ":" + String(parseInt(second)))
                }
                timeFrequencyData = new Uint8Array(analyser.fftSize);
                timeFloatData = new Float32Array(analyser.fftSize);
                analyser.getByteTimeDomainData(timeFrequencyData);
                analyser.getFloatTimeDomainData(timeFloatData);
                setTime($('#showtime'), app.audio.currentTime);
                $('#scroll-audio').animate({ left: 15+485 * app.audio.currentTime / app.audio.duration }, 1)
            }
            var n = 0;
            for (var j = 0; j <= particles.length; j++) {
                particle = particles[j++];
                if (app.audio || app.microphone) {
                    if (spiral.toggleRed) {
                        // forces red by adding the timeFloatData rather than subtracting
                        var R = spiral.R + (timeFloatData[j]);
                        var G = spiral.G - (timeFloatData[j]);
                        var B = spiral.B - (timeFloatData[j]);
                        particle.material.color.setRGB(R, G, B);
                    } else if (spiral.toggleGreen) {
                        // forces green by adding the timeFloatData rather than subtracting
                        var R = spiral.R - (timeFloatData[j]);
                        var G = spiral.G + (timeFloatData[j]);
                        var B = spiral.B - (timeFloatData[j]);
                        particle.material.color.setRGB(R, G, B);
                    } else if (spiral.toggleBlue) {
                        // forces blue by adding  the timeFloatData rather than subtracting
                        var R = spiral.R - (timeFloatData[j]);
                        var G = spiral.G - (timeFloatData[j]);
                        var B = spiral.B + (timeFloatData[j]);
                        particle.material.color.setRGB(R, G, B);
                    } else {
                        particle.material.color.setHex(0xffffff);
                    }
                    if (spiral.spiral) {
                        // Archimedean Spiral
                        particle.position.x = (spiral.a + spiral.b * ((spiral.angle / 100) * j)) *
                            Math.sin(((spiral.angle / 100) * j));
                        particle.position.y = (spiral.a + spiral.b * ((spiral.angle / 100) * j)) *
                            Math.cos(((spiral.angle / 100) * j));
                        particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
                        camera.position.y = 0;
                    } else if (spiral.wavySpiral) {
                        // Archimedean Spiral with sin and cos added respectively to position to create a wavy spiral
                        particle.position.x = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j)) *
                            Math.sin(((spiral.wavyAngle / 100) * j)) +
                            Math.sin(j / (spiral.wavyAngle / 100));
                        particle.position.y = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j)) *
                            Math.cos(((spiral.wavyAngle / 100) * j)) +
                            Math.cos(j / (spiral.wavyAngle / 100));
                        particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
                        camera.position.y = 0;
                    } else if (spiral.flower) {
                        // Archimedean Wavy Spiral with opposite sin and cos to generate crossover in flower pattern
                        particle.position.x = (spiral.aFlower + spiral.bFlower * ((spiral.flowerAngle / 100) * j)) *
                            Math.cos(((spiral.flowerAngle / 100) * j)) +
                            Math.sin(j / (spiral.flowerAngle / 100)) * 17;
                        particle.position.y = (spiral.aFlower + spiral.bFlower * ((spiral.flowerAngle / 100) * j)) *
                            Math.sin(((spiral.flowerAngle / 100) * j)) +
                            Math.cos(j / (spiral.flowerAngle / 100)) * 17;
                        particle.position.z = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
                        camera.position.y = 0;
                    } else if (spiral.circle) {
                        particle.position.x = Math.sin(j) * (j / (j / spiral.radius));
                        particle.position.y = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity);
                        particle.position.z = Math.cos(j) * (j / (j / spiral.radius));
                        camera.fov = 35;
                        camera.position.y = 100;
                    } else if (spiral.hyperbola) {
                        particle.position.z = Math.sin(j) * spiral.test + j * 0.01;
                        particle.position.y = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity * 0.5);
                        //particle.position.y = (timeFloatData[j] * timeFrequencyData[j])
                        particle.position.x = Math.tan(j) * spiral.test + j * 0.01;
                        camera.fov = 35;
                        //camera.position.y = 80;
                    } else if (spiral.hybrid) {
                        if (j % 3 == 0) {
                            particle.position.z = Math.sin(j) * Math.cos(j) * spiral.valueOfTest02 + Math.sin(j) * (j / (j / spiral.radius)) + timeFrequencyData[j] / 10;
                            particle.position.y = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity * 0.5);
                            particle.position.x = Math.tan(j) * Math.sin(j) * spiral.valueOfTest02 + Math.sin(j) * (j / (j / spiral.radius)) + timeFloatData[j] / 10;
                        } else {
                            particle.position.x = Math.sin(j) * Math.cos(j) * spiral.valueOfTest02 + Math.sin(j) * (j / (j / spiral.radius)) + timeFrequencyData[j] / 10;
                            particle.position.y = (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity * 0.5);
                            particle.position.z = Math.tan(j) * Math.sin(j) * spiral.valueOfTest02 + Math.sin(j) * (j / (j / spiral.radius)) + timeFloatData[j] / 10;
                        }
                        // camera.position.y = 150;
                        // camera.position.z = 200;
                        // camera.position.x = 200;
                        //camera.position.x = 50 * Math.cos(spiral.hybrid * j);
                    } else if (spiral.donut) {
                        particle.position.x = 30 * (Math.sin(j / spiral.angle) * Math.cos(j) + Math.cos(j));
                        particle.position.y = 30 * (Math.cos(j / spiral.angle)) + (timeFloatData[j] * timeFrequencyData[j] * spiral.intensity * 0.5 * spiral.intensity);
                        particle.position.z = 30 * (Math.sin(j / spiral.angle) * Math.sin(j) + Math.sin(j));
                    }

                } else {
                    if (spiral.toggleRed) {
                        // forces red by adding the timeFloatData rather than subtracting
                        var R = spiral.R;
                        var G = spiral.G;
                        var B = spiral.B;
                        particle.material.color.setRGB(R, G, B);
                    } else if (spiral.toggleGreen) {
                        // forces green by adding the timeFloatData rather than subtracting
                        var R = spiral.R;
                        var G = spiral.G;
                        var B = spiral.B;
                        particle.material.color.setRGB(R, G, B);
                    } else if (spiral.toggleBlue) {
                        // forces blue by adding  the timeFloatData rather than subtracting
                        var R = spiral.R;
                        var G = spiral.G;
                        var B = spiral.B;
                        particle.material.color.setRGB(R, G, B);
                    } else {
                        particle.material.color.setHex(0xffffff);
                    }
                    if (spiral.spiral) {
                        // Archimedean Spiral
                        particle.position.x = (spiral.a + spiral.b * ((spiral.angle / 100) * j)) *
                            Math.sin(((spiral.angle / 100) * j));
                        particle.position.y = (spiral.a + spiral.b * ((spiral.angle / 100) * j)) *
                            Math.cos(((spiral.angle / 100) * j));
                        particle.position.z = (spiral.intensity);
                        camera.position.y = 0;
                    } else if (spiral.wavySpiral) {
                        // Archimedean Spiral with sin and cos added respectively to position to create a wavy spiral
                        particle.position.x = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j)) *
                            Math.sin(((spiral.wavyAngle / 100) * j)) +
                            Math.sin(j / (spiral.wavyAngle / 100));
                        particle.position.y = (spiral.aWavy + spiral.bWavy * ((spiral.wavyAngle / 100) * j)) *
                            Math.cos(((spiral.wavyAngle / 100) * j)) +
                            Math.cos(j / (spiral.wavyAngle / 100));
                        particle.position.z = (spiral.intensity);
                        camera.position.y = 0;
                    } else if (spiral.flower) {
                        // Archimedean Wavy Spiral with opposite sin and cos to generate crossover in flower pattern
                        particle.position.x = (spiral.aFlower + spiral.bFlower * ((spiral.flowerAngle / 100) * j)) *
                            Math.cos(((spiral.flowerAngle / 100) * j)) +
                            Math.sin(j / (spiral.flowerAngle / 100)) * 17;
                        particle.position.y = (spiral.aFlower + spiral.bFlower * ((spiral.flowerAngle / 100) * j)) *
                            Math.sin(((spiral.flowerAngle / 100) * j)) +
                            Math.cos(j / (spiral.flowerAngle / 100)) * 17;
                        particle.position.z = (spiral.intensity);
                        camera.position.y = 0;
                    } else if (spiral.circle) {
                        particle.position.x = Math.sin(j) * (j / (j / spiral.radius));
                        particle.position.y = (spiral.intensity);
                        particle.position.z = Math.cos(j) * (j / (j / spiral.radius));
                        camera.fov = 35;
                        camera.position.y = 100;
                    } else if (spiral.hyperbola) {
                        particle.position.z = Math.sin(j) * spiral.test + j * 0.01;
                        particle.position.y = (spiral.intensity * 0.1); //粒子
                        particle.position.x = Math.tan(j) * spiral.test + j * 0.01;
                        camera.fov = 35;
                        //camera.position.y = 80;

                    } else if (spiral.hybrid) {
                        if (j % 3 == 0) {
                            particle.position.z = Math.sin(j) * Math.cos(j) * spiral.valueOfTest02 + Math.sin(j) * (j / (j / spiral.radius));
                            particle.position.y = (spiral.intensity);
                            particle.position.x = Math.tan(j) * Math.sin(j) * spiral.valueOfTest02 + Math.sin(j) * (j / (j / spiral.radius));
                        } else {
                            particle.position.x = Math.sin(j) * Math.cos(j) * spiral.valueOfTest02 + Math.sin(j) * (j / (j / spiral.radius));
                            particle.position.y = (spiral.intensity);
                            particle.position.z = Math.tan(j) * Math.sin(j) * spiral.valueOfTest02 + Math.sin(j) * (j / (j / spiral.radius));
                        }

                        //camera.position.y = 150;
                        //camera.position.z = 200;
                        //camera.position.x = 200;
                        //camera.position.x = 50 * Math.cos(spiral.hybrid * j);
                    } else if (spiral.donut) {
                        particle.position.x = 30 * (Math.sin(j / spiral.angle) * Math.cos(j) + Math.cos(j));
                        particle.position.y = 30 * (Math.cos(j / spiral.angle)) + (spiral.intensity * 8);
                        particle.position.z = 30 * (Math.sin(j / spiral.angle) * Math.sin(j) + Math.sin(j));
                    }
                }
            }




            checkVisualizer();
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
            camera.fov = spiral.fov;
            camera.updateProjectionMatrix();
            // stats.end();
        }

        function checkVisualizer() {
            changeColor();
            if (spiral.animate) {
                if (spiral.spiral) {
                    changeAngle();
                } else if (spiral.wavySpiral) {
                    changeWavyAngle();
                } else if (spiral.flower) {
                    changeFlowerAngle();
                } else if (spiral.circle) {
                    changeCircleRadius();
                } else if (spiral.hyperbola) {
                    changeTest01();
                } else if (spiral.hybrid) {
                    changeTest02();
                } else if (spiral.donut) {
                    changeDonut();
                }
            }
        }






        app.colorRFlag = true;
        app.colorGFlag = true;
        app.colorBFlag = true;

        function changeColor() {
            if (spiral.colorChange) {
                if (spiral.R <= 1 && app.colorRFlag) {
                    spiral.R = spiral.R + Math.floor(Math.random() * 10) * 0.0008;
                } else {
                    app.colorRFlag = false;
                    spiral.R = spiral.R - Math.floor(Math.random() * 10) * 0.0008;
                    if (spiral.R <= 0) {
                        app.colorRFlag = true;
                    }
                }

                if (spiral.G <= 1 && app.colorGFlag) {
                    spiral.G = spiral.G + Math.floor(Math.random() * 10) * 0.0008;
                } else {
                    app.colorGFlag = false;
                    spiral.G = spiral.G - Math.floor(Math.random() * 10) * 0.0008;
                    if (spiral.G <= 0) {
                        app.colorGFlag = true;
                    }
                }

                if (spiral.B <= 1 && app.colorBFlag) {
                    spiral.B = spiral.B + Math.floor(Math.random() * 10) * 0.0008;
                } else {
                    app.colorBFlag = false;
                    spiral.B = spiral.B - Math.floor(Math.random() * 10) * 0.0008;
                    if (spiral.B <= 0) {
                        app.colorBFlag = true;
                    }
                }

                //spiral.G = spiral.G + Math.floor(Math.random() * 10) * 0.01;
                //spiral.B = spiral.B + Math.floor(Math.random() * 10) * 0.01;


            }
        }










        app.spiralCounter = true;
        app.wavySpiralCounter = true;
        app.circleCounter = true;
        app.flowerCounter = false;
        app.test01Conter = true;
        app.hybridCounter = true;
        app.donutCounter = true;

        function changeDonut() {
            if (app.donutCounter) {
                spiral.angle += 0.0005;
                if (spiral.angle >= 25) {
                    app.donutCounter = false;
                }
            } else {
                spiral.angle -= 0.0005;
                if (spiral.angle <= 0) {
                    app.donutCounter = true;
                }
            }
        }


        function changeTest02() {
            if (app.hybridCounter) {
                spiral.valueOfTest02 += 0.2;
                if (spiral.valueOfTest02 >= 100) {
                    app.hybridCounter = false;
                }
            } else {
                spiral.valueOfTest02 -= 0.2;
                if (spiral.valueOfTest02 <= -100) {
                    app.hybridCounter = true;
                }
            }
        }


        function changeTest01() {
            if (app.test01Conter) {
                spiral.test += 0.1;
                if (spiral.test >= 40) {
                    app.test01Conter = false;
                }
            } else {
                spiral.test -= 0.1;
                if (spiral.test <= -40) {
                    console.log("change")
                    app.test01Conter = true;
                }
            }
        }


        function changeAngle() {
            if (app.spiralCounter) {
                spiral.angle += 0.0008;
                if (spiral.angle >= 13) {
                    app.spiralCounter = false;
                }
            } else {
                spiral.angle -= 0.0008;
                if (spiral.angle <= 9) {
                    app.spiralCounter = true;
                }
            }
        }

        function changeWavyAngle() {
            if (app.wavySpiralCounter) {
                spiral.wavyAngle += 0.000004;
                if (spiral.wavyAngle >= 2.48) {
                    app.wavySpiralCounter = false;
                }
            } else {
                spiral.wavyAngle -= 0.000006;
                if (spiral.wavyAngle <= 2.43) {
                    app.wavySpiralCounter = true;
                }
            }
        }

        function changeFlowerAngle() {
            if (app.flowerCounter) {
                spiral.flowerAngle += 0.0000004;
                if (spiral.flowerAngle >= 2.87) {
                    app.flowerCounter = false;
                }
            } else {
                spiral.flowerAngle -= 0.0000004;
                if (spiral.flowerAngle <= 2.85) {
                    app.flowerCounter = true;
                }
            }
        }

        function changeCircleRadius() {
            if (app.circleCounter) {
                spiral.radius += 0.05;
                if (spiral.radius >= 65) {
                    app.circleCounter = false;
                }
            } else {
                spiral.radius -= 0.05;
                if (spiral.radius <= 35) {
                    console.log('hit');
                    app.circleCounter = true;
                }
            }
        }



        animate();
        var controls = new THREE.OrbitControls(camera, renderer.domElement); //创建控件对象
        controls.addEventListener('change', renderer);
    }

});