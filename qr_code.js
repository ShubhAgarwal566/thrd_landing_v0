<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive QR Code Generator and Scanner</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            font-family: Arial, sans-serif;
        }
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            height: 80vh;
            padding: 20px;
        }
        #qrVideoContainer {
            width: 100%;
            position: relative;
            display: none;
        }
        video {
            width: 100%;
            height: auto;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 100;
            font-size: 24px;
            cursor: pointer;
            color: #fff;
            background-color: rgba(0,0,0,0.5);
            border: none;
            border-radius: 10px;
            padding: 5px 10px;
        }
        #inputText {
            width: 100%;
            font-size: 32px;
            padding: 8px 10px;
            box-sizing: border-box;
            border: 1px solid #ccc;
        }
        #btnScanQR {
            padding: 12px 24px;
            font-size: 18px;
            background-color: #bbbbbb;
            color: black;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="reader" width="600px"></div>
        <div id="qrCode"></div>
        <input type="text" id="inputText" placeholder="Enter number" oninput="generateQR()">
    </div>

    <script src="https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js"></script>
    <script src="https://unpkg.com/html5-qrcode" type="text/javascript"></script>
    <script>
        const qrCodePlace = document.getElementById('qrCode');
        const inputText = document.getElementById('inputText');

        function generateQR() {
            qrCodePlace.innerHTML = ''; // Clear previous QR code
            if (inputText.value.trim() !== '') {
                new QRCode(qrCodePlace, inputText.value);
            }
        }

        function onScanSuccess(decodedText, decodedResult) {
            inputText.value = decodedText;
            generateQR();
          }
          
          function onScanFailure(error) {         
          }
          
          let html5QrcodeScanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: {width: 250, height: 250} },
            /* verbose= */ false);
          html5QrcodeScanner.render(onScanSuccess, onScanFailure);
    </script>
</body>
</html>
