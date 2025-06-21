let qrCode;

const textInput = document.querySelector("#link");
const qrContainer = document.querySelector("#qr-code");
const img = document.querySelector("img");
const colorInput = document.querySelector("#co-qr-code");
const bgInput = document.querySelector("#bg-qr-code");
const logoInput = document.querySelector("#logo-file");
const logoSizeInput = document.querySelector("#logo-size");
const btn = document.querySelector("button");
const qrSize = 200;

function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

function getImageSize(qrSize, logoSize) {
    return logoSize / qrSize;
}

function generateQRCode() {
    const link = textInput.value;
    const coColor = colorInput.value;
    const bgColor = bgInput.value;
    const logoFile = logoInput.files[0];
    const logoSizeValue = parseInt(logoSizeInput.value) || 40;

    const options = {
        width: qrSize,
        height: 150,
        type: "svg",
        data: link,
        image: "",
        dotsOptions: {
            color: coColor,
            type: "rounded"
        },
        backgroundOptions: {
            color: bgColor
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 10,
            imageSize: getImageSize(qrSize, logoSizeValue)
        }
    };

    if (!qrCode) {
        qrCode = new QRCodeStyling(options);
    } else {
        qrCode.update(options);
    }
    
    qrContainer.innerHTML = "";

    if (logoFile && logoFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            qrCode.update({ image: e.target.result });
            qrCode.append(qrContainer);
        };
        reader.readAsDataURL(logoFile);
    } else {
        qrCode.append(qrContainer);
    }
}

function downloadQRCode() {
    if (qrCode) {
        qrCode.download({ name: "qr-code", extension: "png" });
    }
}

const debouncedGenerateQRCode = debounce(generateQRCode, 300);

textInput.addEventListener("input", debouncedGenerateQRCode);
colorInput.addEventListener("input", debouncedGenerateQRCode);
bgInput.addEventListener("input", debouncedGenerateQRCode);
logoSizeInput.addEventListener("input", debouncedGenerateQRCode);
logoInput.addEventListener("change", generateQRCode);
btn.addEventListener("click", downloadQRCode);