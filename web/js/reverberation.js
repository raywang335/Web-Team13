var app = app || {};
var psound;
var analyser;
var ctx;
var graph;
var url;

$('document').ready(function (){
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
// get the audio element
    const audioElement = document.querySelector('audio');

// pass it into the audio context
    const track = audioContext.createMediaElementSource(audioElement);
    const gainNode = audioContext.createGain();
    const panner = new StereoPannerNode(audioContext, pannerOptions);
    const pannerControl = document.querySelector('#panner');

    track.connect(gainNode).connect(panner).connect(audioContext.destination);
    // select our play button
    const playButton = document.querySelector('button');

    playButton.addEventListener('click', function() {

        // check if context is in suspended state (autoplay policy)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        // play or pause track depending on state
        if (this.dataset.playing === 'false') {
            audioElement.play();
            this.dataset.playing = 'true';
        } else if (this.dataset.playing === 'true') {
            audioElement.pause();
            this.dataset.playing = 'false';
        }

    }, false);
    audioElement.addEventListener('ended', () => {
        playButton.dataset.playing = 'false';
    }, false);

    const volumeControl = document.querySelector('#volume');

    volumeControl.addEventListener('input', function() {
        gainNode.gain.value = this.value;
    }, false);
    const pannerOptions = { pan: 0 };

    pannerControl.addEventListener('input', function() {
        panner.pan.value = this.value;
    }, false);
})