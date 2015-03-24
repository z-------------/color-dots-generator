var DEFAULT_IMG_WIDTH = 20;
var TAU = Math.PI * 2;
var CIRCLE_RELRAD = 0.9;

var fileInput = document.querySelector("#file-choose");
var colorToggle = document.querySelector("#color-toggle");
var widthInput = document.querySelector("#width-input");
var goButton = document.querySelector("#go-button");

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var ocanvas = document.querySelector("#output");
var octx = ocanvas.getContext("2d");

widthInput.value = DEFAULT_IMG_WIDTH;
var imgWidth = Number(widthInput.value);
widthInput.addEventListener("change", function(){
    imgWidth = Number(this.value);
});

function drawDots(data){
    for (var i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];

        var lum = (255 - (0.2126 * r + 0.7152 * g + 0.0722 * b)) / 255;

        var unitWidth = ocanvas.width / imgWidth;
        
        var gy = Math.floor((i / 4) / imgWidth);
        var gx = (i / 4) % imgWidth;
        var x = unitWidth * gx + unitWidth / 2;
        var y = unitWidth * gy + unitWidth / 2;
        var r = (unitWidth / 2) * CIRCLE_RELRAD;
        var dr = r * lum;
        
        // color circle
        if (colorToggle.checked) {
            var hsl = color2color("rgb(" + [r, g, b].map(Math.round).join(",") + ")", "hsl");
            
            var hslRegex = /[^,]+$/g;
            var hslLast = hsl.match(hslRegex)[0];
            var hslLastInt = parseInt(hslLast);
            if (hslLastInt < 50) {
                hslLastInt = 50;
                hsl = hsl.replace(hslRegex, hslLastInt + "%)");
            }
            
            console.log(hsl);

            octx.fillStyle = hsl;
            octx.beginPath();
            octx.arc(x, y, r, 0, TAU);
            octx.fill();
        }

        // darkness circle
        octx.fillStyle = "#000000";
        octx.beginPath();
        octx.arc(x, y, dr, 0, TAU);
        octx.fill();
    }
}

function readImage(elem){
    var file = elem.files[0];
    if (file) {
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function(){
            img.height = imgWidth * img.height / img.width;
            img.width = imgWidth;
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            ocanvas.height = ocanvas.width * canvas.height / canvas.width;
            
            drawDots(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
        };
    }
}

fileInput.addEventListener("change", function(){
    readImage(this);
});

goButton.addEventListener("click", function(){
    readImage(fileInput);
});