/*
    Name: Main functions
    Created: 24.02.19
    Author: Mika Haeberli

    Changes:
    --------------------------------
    Created                 24.02.19

*/

// Function to select image from local storage

function cancelUpload() {
    var wrap = document.getElementById("wrap");
    wrap.innerHTML = '<input type="file" name="file" id="file" class="invis" accept="image/jpeg, image/png" onchange="displayGen(event)">\n' +
        '                                <span id="invis"><u>Browse</u></span>\n' +
        '\n' +
        '                                <div id="innerOut">\n' +
        '                                    <u id="fill"></u>\n' +
        '                                    <button class="upl-button" name="upl" id="upl" onclick="progressPredict()">' +
        '                                        <i class=\'fas fa-arrow-up\'></i>' +
        '                                    </button>\n' +
        '                                    <button class="upl-button" name="can" id="can" onclick="cancelUpload()">\n' +
        '                                        <i class="fas fa-times"></i>\n' +
        '                                    </button>\n' +
        '                                </div>'
}

// Function to draw selected image into canvas

function displayGen(event) {

    // Get file
    const inp = document.getElementById("file").files[0].name;

    // Blend out boxes
    document.getElementById("file").style.display = "none";
    document.getElementById("invis").style.display = "none";
    document.getElementById("innerOut").style.display = "block";
    document.getElementById("fill").innerText = inp;

    //Draw image into canvas
    let ctx = document.getElementById('upl-image').getContext('2d');
    let img = new Image;
    img.src = URL.createObjectURL(document.getElementById("file").files[0]);

    img.onload = function () {
        // if (img.height !== 224) {
        //     var per = 224 / img.height;
        //     img.height = 224;
        //     img.width = img.width * per;
        // }
        let w = img.width;
        let h = img.height;
        let canvas = document.querySelector("#upl-image");
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

    }
}

// Function to switch pages

function progressPredict() {

    document.getElementById("uploader").style.opacity = "0";
    document.getElementById("identify").style.opacity = "100";

    document.getElementById("identify").style.height = "100%";
    document.getElementById("uploader").style.height = "0";
    document.getElementById("uploader").style.marginTop = "0";

}