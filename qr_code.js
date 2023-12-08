document.getElementById('numberInput').addEventListener('input', function() {
    var number = this.value;
    var qrCodeContainer = document.getElementById('qrCode');
    qrCodeContainer.innerHTML = '';
    if (number) {
        var qrCode = new QRCode(qrCodeContainer, {
            text: number,
            width: Math.min(window.innerWidth, 300),
            height: Math.min(window.innerWidth, 300),
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    }
});
