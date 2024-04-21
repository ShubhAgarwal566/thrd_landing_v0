const qrCodePlace = document.getElementById('qrCode');
const inputText = document.getElementById('inputText');
const qrVideo = document.getElementById('qrVideo');
let scanner = new Instascan.Scanner({ video: qrVideo });

function generateQR() {
    qrCodePlace.innerHTML = ''; // Clear previous QR code
    new QRCode(qrCodePlace, inputText.value);
}

Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
        document.getElementById('btnScanQR').onclick = function() {
            qrVideo.style.display = 'block';
            scanQR();
        };
    } else {
        console.error('No cameras found.');
    }
}).catch(function (e) {
    console.error(e);
});

function scanQR() {
    scanner.addListener('scan', function (content) {
        inputText.value = content;
        qrVideo.style.display = 'none';
        scanner.stop();
        generateQR(); // Optionally generate a QR after scanning
    });
}
