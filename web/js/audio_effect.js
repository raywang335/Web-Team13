// var cxt_audio
// var sound;
// var analyser;
var app = app || {};
var gainNode_delay,gainNode_iir,gainNode, gainNode_distortion, gainNode_biquadFilter;
var delayNode;
var canvas,canvasCtx;
var audioCtx,source,source_delay, source_distortion ,analyser, source_biquadFilter;
var convolver;
var iirfilter;
var distortion;
var biquadFilter;

$('document').ready(function () {
    var classNames = ['iconfont iconzanting','iconfont iconbofang'];
    var NTZ = true;
    var RAF;
    var iscov = false;
    console.log('audio loader connected');
    $('#open-menu').click(function () {
        $('nav.menu').fadeToggle('slow');
    })
    $('nav.menu').click(function () {
        $('nav.menu').hide();
    })
    $('nav.menu').hide();
    var IS;
    $("#convolve-forest,#convolve-drain,#convolve-church,#convolve-launch").click(function(event){
        $(this).toggleClass("flipped");
    })

    $("#filter-selector").css({
        'width': $("#filter-choice").css('width'),
        'border-radius-bottomleft': 30,
         'border-radius-bottomright': 30,
    })
    $('#filter-choice').on('click',function (){
        if($("#filter-selector").css('display') == 'none') {
            $("#filter-selector").show();
            $('li:contains(' + $(this).val() + ')').css('background-color', '#059CFA')
        } else {
            $("#filter-selector").hide();
        }
    })
    $("li").click(function() {
        //点击选择时为输入框赋值。并关闭选项窗
        $("#filter-choice").val($(this).text())
        $("#filter-selector").hide();
    })
    //为选项设置颜色
    $("li").mouseover(function() {
        $('li').css('background-color', 'white')
        $(this).css({
            'cursor': 'pointer',
            'background-color': '#059CFA'
        });
    })


    $('#irrnode').css('display','none')
    $('#pingpongnode').css('display','none')
    $('#distortionnode').css('display','none')
    $('#delaynode').css('display','inline-block')
    canvas = document.getElementById("wrap");
    canvas.width = window.screen.availWidth*0.43
    canvas.height = window.screen.availHeight*0.25

    canvasCtx = canvas.getContext("2d");


    window.addEventListener('drop', onDrop, false);
    window.addEventListener('dragover', onDrag, false);
    window.addEventListener('click', hide_label)
    window.addEventListener('timeupdate', adjust_curr, false);
    window.addEventListener('click', add_convolve);
    window.addEventListener('click',filtertype)

    function filtertype(e){
        console.log(e.path.length)
        if(e.path.length == 11){
            var type = e.path[0].id
            switch (type){
                case 'lowpass':
                    biquadFilter.type = type
                    break;
                case 'highpass':
                    biquadFilter.type = type
                    break;
                case 'lowshelf':
                    biquadFilter.type = type
                    break;
                case 'highshelf':
                    biquadFilter.type = 'highshelf'
                    break;
                default:
                    break;
            }
        }
    }




    function add_convolve(e){
        // console.log(e.path)
        var mode = e.path[1].id;
        var idx = -1;
        var path = ['../impulse/pysical_forest.wav', '../impulse/pysical_church.wav', '../impulse/pysical_drain.wav','../impulse/pysical_wc.wav']
        var color = ["url('../images/bg_forest.jpg')", "url('../images/bg_church.jpg')", "url('../images/bg_drain.jpg')", "url('../images/bg_launch.jpg')"]
        var orcolor = ["url('../images/forest.jpg')", "url('../images/church.jpg')", "url('../images/drain.jpg')", "url('../images/launch.jpg')"]
        switch (mode){
            case "convolve-forest":
                idx = 0;
                break;
            case "convolve-church":
                idx = 1;
                break;
            case "convolve-drain":
                idx = 2;
                break;
            case "convolve-launch":
                idx = 3;
                break;
            default:
                mode = null;
        }
        if(app.audio && mode){
            async function createReverb(path) {
                // load impulse response from file
                if(path!=0){
                    let response     = await fetch(path);
                    let arraybuffer  = await response.arrayBuffer();
                    convolver.buffer = await audioCtx.decodeAudioData(arraybuffer);
                }
            }
            // $('')
            createReverb(path[idx])
            if(iscov){
                convolver.disconnect(audioCtx.destination)
                gainNode.disconnect(convolver)
                gainNode.connect(audioCtx.destination)
            }
            gainNode.disconnect(audioCtx.destination)
            gainNode.connect(convolver).connect(audioCtx.destination)
            iscov = true;
            $('#'+mode).css('opacity', 1)
            $('#'+mode).css('transform-style','')
            toOpacity(mode)
            $('.convolver').css('background-image',color[idx])
        }
    }

    $('#play').on('click',function (){
            var ig = document.getElementById('play')
            if (app.audio) {
                if(app.play == false) {
                    draw();
                    IS = true;
                    ig.children[0].className = classNames[Number(app.play)]
                    app.audio.play()
                    app.play = true
                    console.log("Playing Animating!")
                }
                else{
                    cancelAnimationFrame(RAF);
                    IS = false;
                    ig.children[0].className = classNames[Number(app.play)]
                    app.audio.pause()
                    app.play = false
                    console.log("Stoping end-Animating!")
                }
            }
    })

    $('#volume').on('mousedown',function(){
        var change = function($input) {
            gainNode.gain.exponentialRampToValueAtTime(Number($input.value)/100, audioCtx.currentTime + 2)
        }
        $("input[name='controll-volume']").RangeSlider({ min: 0,   max: 100,  step: 0.1,  callback: change});
    })

    $('#delay-time').on('mousedown',function(){
        var change = function($input) {
            console.log(($input.value)/100)
            delayNode.delayTime.setValueAtTime(Number($input.value)/100, audioCtx.currentTime)
            console.log(delayNode)
        }
        $("input[name='delay-time']").RangeSlider({ min: 0,   max: 100,  step: 0.1,  callback: change});
    })

    $('#delay-volume').on('mousedown',function(){
        var change = function($input) {
            console.log(($input.value)/100)
            gainNode_delay.gain.exponentialRampToValueAtTime(Number($input.value)/100, audioCtx.currentTime+2)
            // console.log(delayNode)
        }
        $("input[name='delay-volume']").RangeSlider({ min: 0,   max: 100,  step: 0.1,  callback: change});
    })

    $('#delay-feedback').on('mousedown',function(){
        var change = function($input) {
            console.log(source)
            var rato = Number($input.value/100)
            gainNode_delay.gain.linearRampToValueAtTime(0, audioCtx.currentTime+rato*(app.audio.duration-audioCtx.currentTime))
            // console.log(delayNode)
        }
        $("input[name='delay-feedback']").RangeSlider({ min: 0,   max: 100,  step: 0.1,  callback: change});
    })

    $('#distortion-amount').on('mousedown', function (){
        var change = function($input) {
            distortion.curve = makeDistortionCurve(Number($input.value))
        }
        $("input[name='distortion-amount']").RangeSlider({ min: 0,   max: 1000,  step: 50,  callback: change});
    })

    $('#distortion-volume').on('mousedown',function(){
        var change = function($input) {
            console.log(($input.value))
            gainNode_distortion.gain.exponentialRampToValueAtTime(Number($input.value), audioCtx.currentTime+2)
            // console.log(delayNode)
        }
        $("input[name='distortion-volume']").RangeSlider({ min: 0,   max: 1,  step: 0.1,  callback: change});
    })

    $('#distortion-oversample').on('mousedown',function(){
        var change = function($input) {
            if($input.value == 0) distortion.oversample = 'none'
            else distortion.oversample = String(Number($input.value))+'x'
        }
        $("input[name='distortion-oversample']").RangeSlider({ min: 0,   max: 4,  step: 2,  callback: change});
    })

    $('#filter-volume').on('mousedown',function(){
        var change = function($input) {
            console.log(($input.value))
            gainNode_biquadFilter.gain.exponentialRampToValueAtTime(Number($input.value), audioCtx.currentTime+2)
            console.log(biquadFilter)
        }
        $("input[name='filter-volume']").RangeSlider({ min: 0,   max: 1,  step: 0.1,  callback: change});
    })

    $('#filter-frequency').on('mousedown',function(){
        var change = function($input) {
            console.log(($input.value))
            biquadFilter.frequency.setValueAtTime(Number($input.value), audioCtx.currentTime+2)
            // console.log(delayNode)
        }
        $("input[name='filter-frequency']").RangeSlider({ min: 20,   max: 20000,  step: 1000,  callback: change});
    })

    $('#filter-gain').on('mousedown',function(){
        var change = function($input) {
            console.log(($input.value))
            biquadFilter.gain.setValueAtTime(Number($input.value), audioCtx.currentTime+2)
            // console.log(delayNode)
        }
        $("input[name='filter-gain']").RangeSlider({ min: 1,   max: 50,  step: 1,  callback: change});
    })

    function hide_label(e) {
        var mode_id = e.path[0].id;
        switch (mode_id) {
            case 'label-delay':
                $('#delaynode').css('display','inline-block')
                $('#irrnode').css('display','none')
                $('#pingpongnode').css('display','none')
                $('#distortionnode').css('display','none')
                $('#add-delay').fadeIn('fast')
                $('#add-dtsn').hide('fast')
                $('#add-filter').hide('fast')
                $('#add-pingpong').hide('fast')
                $('#scroll-delay').fadeIn('slow');
                $('#scroll-dtsn').hide('fast');
                $('#scroll-filter').hide('fast');
                $('#scroll-pingpong').hide('fast');
                break;
            case 'label-dtsn':
                $('#distortionnode').css('display','inline-block')
                $('#irrnode').css('display','none')
                $('#pingpongnode').css('display','none')
                $('#delaynode').css('display','none')
                $('#add-delay').hide('fast')
                $('#add-dtsn').fadeIn('fast')
                $('#add-filter').hide('fast')
                $('#add-pingpong').hide('fast')
                $('#scroll-dtsn').fadeIn('slow');
                $('#scroll-filter').hide('fast');
                $('#scroll-pingpong').hide('fast');
                $('#scroll-delay').hide('fast');
                break;
            case 'label-filter':
                $('#irrnode').css('display','inline-block')
                $('#delaynode').css('display','none')
                $('#pingpongnode').css('display','none')
                $('#distortionnode').css('display','none')
                $('#add-delay').hide('fast')
                $('#add-dtsn').hide('fast')
                $('#add-filter').fadeIn('fast')
                $('#add-pingpong').hide('fast')
                $('#scroll-filter').fadeIn('slow');
                $('#scroll-dtsn').hide('fast');
                $('#scroll-pingpong').hide('fast');
                $('#scroll-delay').hide('fast');
                break;
            case 'label-pingpong':
                $('#pingpongnode').css('display','inline-block')
                $('#irrnode').css('display','none')
                $('#delaynode').css('display','none')
                $('#distortionnode').css('display','none')
                $('#add-delay').hide('fast')
                $('#add-dtsn').hide('fast')
                $('#add-filter').hide('fast')
                $('#add-pingpong').fadeIn('fast')
                $('#scroll-pingpong').fadeIn('slow');
                $('#scroll-dtsn').hide('fast');
                $('#scroll-delay').hide('fast');
                $('#scroll-filter').hide('fast');
                break;
        }
    }

    function onDrag(e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    }

    function onDrop(e) {
        e.stopPropagation();
        e.preventDefault();
        var droppedFiles = e.dataTransfer.files;

        if (droppedFiles.length != 0) {
            initiateAudio(droppedFiles[0]);
        }
    }

    function initiateAudio(data) {
        if (app.audio) {
            app.audio.remove();
            window.cancelAnimationFrame(app.animationFrame);
            var ig = document.getElementById('play')
            if(ig) ig.children[0].className = classNames[1];
        }


        app.audio = document.createElement('audio'); // creates an html audio element
        app.audio.src = URL.createObjectURL(data); // sets the audio source to the dropped file
        // app.audio.autoplay = true;
        app.audio.crossOrigin = "anonymous";
        document.body.appendChild(app.audio);
        audioCtx = new(window.AudioContext || window.webkitAudioContext)(); // creates audioNode
        source = audioCtx.createMediaElementSource(app.audio); // creates audio source
        source_delay = source
        source_distortion = source
        source_biquadFilter = source
        // 指数型增加音量，更符合任何听觉习惯
        gainNode = audioCtx.createGain();
        gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 2);
        gainNode_delay = audioCtx.createGain();
        gainNode_delay.gain.setValueAtTime(0,audioCtx.currentTime)
        gainNode_distortion = audioCtx.createGain();
        gainNode_distortion.gain.setValueAtTime(0,audioCtx.currentTime)
        gainNode_biquadFilter = audioCtx.createGain()
        gainNode_biquadFilter.gain.setValueAtTime(0,audioCtx.currentTime)

        //添加延时节点
        delayNode = audioCtx.createDelay()

        // 混响节点
        convolver = audioCtx.createConvolver()

        //扭曲节点
        distortion = audioCtx.createWaveShaper()

        //低频滤波器
        biquadFilter = audioCtx.createBiquadFilter()

        //IIR
        const filterNumber = 2;
        let lowPassCoefs = [
            {
                frequency: 200,
                feedforward: [0.00020298, 0.0004059599, 0.00020298],
                feedback: [1.0126964558, -1.9991880801, 0.9873035442]
            },
            {
                frequency: 500,
                feedforward: [0.0012681742, 0.0025363483, 0.0012681742],
                feedback: [1.0317185917, -1.9949273033, 0.9682814083]
            },
            {
                frequency: 1000,
                feedforward: [0.0050662636, 0.0101325272, 0.0050662636],
                feedback: [1.0632762845, -1.9797349456, 0.9367237155]
            },
            {
                frequency: 5000,
                feedforward: [0.1215955842, 0.2431911684, 0.1215955842],
                feedback: [1.2912769759, -1.5136176632, 0.7087230241]
            }
        ]
        let feedForward = lowPassCoefs[filterNumber].feedforward,
            feedBack = lowPassCoefs[filterNumber].feedback;
        // arrays for our frequency response
        const totalArrayItems = 30;
        // Here we want to create an array of frequency values that we would like to get data about. We could go for a linear approach, but it's far better when working with frequencies to take a log approach, so let's fill our array with frequencies that get larger as array item goes up.
        let myFrequencyArray = new Float32Array(totalArrayItems);
        myFrequencyArray = myFrequencyArray.map(function(item, index) {
            return Math.pow(1.4, index);
        });
        let magResponseOutput = new Float32Array(totalArrayItems);
        let phaseResponseOutput = new Float32Array(totalArrayItems);
        iirfilter = audioCtx.createIIRFilter(feedForward, feedBack);
        iirfilter.getFrequencyResponse(myFrequencyArray, magResponseOutput, phaseResponseOutput);

        // 添加响应事件，保证音频加载完毕后进行播放
        app.audio.addEventListener('canplay',function (){
            source.connect(gainNode).connect(audioCtx.destination);
            analyser = audioCtx.createAnalyser(); // creates analyserNode
            source.connect(analyser); // connects the analyser node to the audioNode and the audioDestinationNode
            app.audio.play();
            draw();
            var ig = document.getElementById('play')
            if(ig)ig.children[0].className = classNames[0]
        })


    }

    function makeDistortionCurve(amount) {
        var k = typeof amount === 'number' ? amount : 50,
            n_samples = audioCtx.sampleRate,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
        for ( ; i < n_samples; ++i ) {
            x = i * 2 / n_samples - 1;
            curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        return curve;
    };

    function draw() {
        RAF = requestAnimationFrame(draw);
        var r = 0;
        var g = 0;
        var b = 0;
        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);


        analyser.getByteFrequencyData(dataArray);
        if (NTZ) {
            NTZ = false;
            var timer = parseFloat(app.audio.duration)
            var minute = parseInt(timer / 60)
            var second = timer - minute * 60
            if (second < 10) $('#showtime').html("00:00 / " + "0" + String(minute) + ":" + "0" + String(parseInt(second)));
            else $('#showtime').html("00:00 / " + "0" + String(minute) + ":" + String(parseInt(second)))
        }
        setTime($('#showtime'), app.audio.currentTime);
        $('#scroll-audio').animate({ left: 15+685 * audioCtx.currentTime / app.audio.duration }, 0.1)

        canvasCtx.fillStyle = 'rgb(0,0,0)'
        canvasCtx.fillRect(0, -40, canvas.width, canvas.height);

        canvasCtx.lineWidth = 4;
        // canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx.beginPath();

        var sliceWidth = canvas.width * 2 / bufferLength;
        // var x = 0;
        var offset = 0

        var buflen = 2048;
        var buf = new Float32Array( buflen );
        analyser.getFloatTimeDomainData( buf );
        var ac = autoCorrelate( buf, audioCtx.sampleRate );
        // console.log(ac)

        for (var i = 0; i < bufferLength; i++) {
            r +=  i/2048 * 256
            g += 256 - i/2048*256
            b = Math.floor(Math.random()*(256 - 0) + 0);
            var v = dataArray[i] / 128.0;
            var left = i*sliceWidth + offset
            offset += sliceWidth
            // var y = v * canvas.height / 2;
            canvasCtx.fillStyle = 'rgb('+r.toString()+','+g.toString()+','+b.toString()+')';
            // canvasCtx.strokeStyle = 'rgb(255,260,250)'
            canvasCtx.fillRect(left,0.75*canvas.height*(1-v),sliceWidth, canvas.height*0.75*v)
            // canvasCtx.strokeRect(left,0.75*canvas.height*(1-v),sliceWidth, canvas.height*0.75*v)
            // x += 10;
        }
        canvasCtx.stroke();

    };


    $('#delaynode').on('click',function (){
        if($(this).is(':checked') && app.audio){
            var value = $('#delay-time').val()
            delayNode.delayTime.setValueAtTime(0.5, audioCtx.currentTime);
            value = $('#delay-volume').val()
            gainNode_delay.gain.exponentialRampToValueAtTime(0.6, audioCtx.currentTime+1);
            source_delay.connect(delayNode).connect(gainNode_delay).connect(gainNode).connect(audioCtx.destination)
            // console.log(delayNode)
        }
        else{
            gainNode_delay.disconnect(gainNode);
        }
    })

    $('#distortionnode').on('click',function (){
        if($(this).is(':checked') && app.audio){
            distortion.curve = makeDistortionCurve(500)
            distortion.oversample = '2x'
            console.log(distortion)
            gainNode_distortion.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime+2)
            source.connect(distortion).connect(gainNode_distortion).connect(gainNode).connect(audioCtx.destination)
            // console.log(delayNode)
        }
        else{
            gainNode_distortion.disconnect(gainNode)
        }
    })

    $('#irrnode').on('click', function (){
        if($(this).is(':checked') && app.audio) {
            biquadFilter.gain.setValueAtTime(25, audioCtx.currentTime+1)
            biquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime+1)
            gainNode_biquadFilter.gain.exponentialRampToValueAtTime(0.5,audioCtx.currentTime+2)
            source_biquadFilter.connect(biquadFilter).connect(gainNode_biquadFilter).connect(gainNode).connect(audioCtx.destination)
        }
        else{
            gainNode_biquadFilter.disconnect(gainNode)
        }
    })
    // $('#irrnode').on('click', function (){
    //     if($(this).is(':checked') && app.audio){
    //         // var value = $('')
    //         gainNode.disconnect(audioCtx.destination)
    //     }
    // })

    function adjust_curr(e){
        console.log("***")
        console.log(e)
        if(app.audio.currentTime > app.audio.duration){
            app.audio.currentTime = app.audio.duration;
        }
        setTime($('#showtime'), app.audio.currentTime);
        $('#scroll-audio').animate({ left: 15+685 * app.audio.currentTime / app.audio.duration }, 0.1)
    }

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

    function toOpacity(input){
        var name = ['convolve-forest', 'convolve-launch', 'convolve-drain', 'convolve-church']
        for(var i=0; i<name.length; i++){
            console.log(input)
            if(name[i] == input) continue;
            $("#"+name[i]).css('opacity',0.1)
        }
    }
})


// 绘制一个当前音频源的频谱


//计算自相关函数
function autoCorrelate( buf, sampleRate ) {
    // Implements the ACF2+ algorithm
    var SIZE = buf.length;
    var rms = 0;

    for (var i=0;i<SIZE;i++) {
        var val = buf[i];
        rms += val*val;
    }
    rms = Math.sqrt(rms/SIZE);
    if (rms<0.01) // not enough signal
        return -1;

    var r1=0, r2=SIZE-1, thres=0.2;
    for (var i=0; i<SIZE/2; i++)
        if (Math.abs(buf[i])<thres) { r1=i; break; }
    for (var i=1; i<SIZE/2; i++)
        if (Math.abs(buf[SIZE-i])<thres) { r2=SIZE-i; break; }

    buf = buf.slice(r1,r2);
    SIZE = buf.length;

    var c = new Array(SIZE).fill(0);
    for (var i=0; i<SIZE; i++)
        for (var j=0; j<SIZE-i; j++)
            c[i] = c[i] + buf[j]*buf[j+i];

    var d=0; while (c[d]>c[d+1]) d++;
    var maxval=-1, maxpos=-1;
    for (var i=d; i<SIZE; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }
    var T0 = maxpos;

    var x1=c[T0-1], x2=c[T0], x3=c[T0+1];
    a = (x1 + x3 - 2*x2)/2;
    b = (x3 - x1)/2;
    if (a) T0 = T0 - b/(2*a);

    return sampleRate/T0;
}

$.fn.RangeSlider = function(cfg){
    this.sliderCfg = {
        min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null,
        max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
        step: cfg && Number(cfg.step) ? cfg.step : 1,
        callback: cfg && cfg.callback ? cfg.callback : null
    };

    var $input = $(this);
    var min = this.sliderCfg.min;
    var max = this.sliderCfg.max;
    var step = this.sliderCfg.step;
    var callback = this.sliderCfg.callback;

    $input.attr('min', min)
        .attr('max', max)
        .attr('step', step);

    $input.bind("input", function(e){
        $input.attr('value', this.value);
        console.log(this.value)
        $input.css( 'background', 'linear-gradient(to right, #059CFA,' + 100*(1-(this.value-this.min)/(this.max-this.min)) + '%, black)' );
        console.log((this.value-this.min)/(this.max-this.min))
        if ($.isFunction(callback)) {
            callback(this);
        }
    });
};
