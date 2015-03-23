var IMG_WIDTH = 20;
var TAU = Math.PI * 2;

var fileInput = document.querySelector("#file-choose");
var colorToggle = document.querySelector("#color-toggle");

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

var ocanvas = document.querySelector("#output");
var octx = ocanvas.getContext("2d");

function drawDots(data){
    for (var i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];

        var lum = (255 - (0.2126 * r + 0.7152 * g + 0.0722 * b)) / 255;

        var unitWidth = ocanvas.width / IMG_WIDTH;
        
        var gy = Math.floor((i / 4) / IMG_WIDTH);
        var gx = (i / 4) % IMG_WIDTH;
        var x = unitWidth * gx + unitWidth / 2;
        var y = unitWidth * gy + unitWidth / 2;
        var r = (unitWidth / 2) * 0.8;
        var dr = r * lum;
        
        // color circle
        if (colorToggle.checked) {
            var hsl = color2color("rgb(" + [r, g, b].map(Math.round).join(",") + ")", "hsl");
            var hsl = hsl.replace(/[^,]+$/g, "50%)");

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

        console.log("rgb(" + [r, g, b].join(",") + ")", hsl);
    }
}

fileInput.addEventListener("change", function(){
    var file = this.files[0];
    if (file) {
        var img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = function(){
            img.height = IMG_WIDTH * img.height / img.width;
            img.width = IMG_WIDTH;
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            ocanvas.height = ocanvas.width * canvas.height / canvas.width;
            
            drawDots(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
        };
    }
});