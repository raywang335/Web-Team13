var app = app || {};
var source;
var buffer;
var analyser;
// var duration;
var url
var ctx;
// var data;
// var audio;

window.onload = function() {
    var classNames = ['iconfont iconzanting',"iconfont iconbofang"]
    console.log('audio loader connected');

    window.addEventListener('drop', onDrop, false);
    window.addEventListener('dragover', onDrag, false);

    function onDrag(e) {
        // info.velocity('fadeOut', { duration: 150 });
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    function onDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        var droppedFiles = e.dataTransfer.files;

        if(droppedFiles.length!=0) {
            initiateAudio(droppedFiles[0]);

        }
    }

    function initiateAudio(data) {
        if (app.audio) {
            app.audio.remove();
            NTZ = true;
            window.cancelAnimationFrame(app.animationFrame);
            var ig = document.getElementById('play')
            if(ig) ig.children[0].className = classNames[1];
        }
        // console.log(data);
        app.audio = document.createElement('audio'); // creates an html audio element
        app.audio.src = URL.createObjectURL(data); // sets the audio source to the dropped file
        app.audio.autoplay = true;
        app.audio.crossOrigin = "anonymous";
        // duration = data.size / 44100;
        // app.audio.play();
        app.play = true;
        // audio = app.audio
        document.body.appendChild(app.audio);
        app.ctx = new(window.AudioContext || window.webkitAudioContext)(); // creates audioNode

        source = app.ctx.createMediaElementSource(app.audio); // creates audio source
        analyser = app.ctx.createAnalyser(); // creates analyserNode
        source.connect(app.ctx.destination); // connects the audioNode to the audioDestinationNode (computer speakers)
        source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode
        ctx = app.ctx;
        var ig = document.getElementById('play')
        if(ig)ig.children[0].className = classNames[0]
    }
    console.log("ASd")
};
