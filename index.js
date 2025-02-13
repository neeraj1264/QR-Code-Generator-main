let input = document.getElementById("inp");
let colorInput = document.getElementById("colorInput");
let img = document.getElementById("img");
let downloadBtn = document.getElementById("downloadBtn");
let qrimg = document.getElementById("img")

function myFun() { 
  let value = input.value.trim();
  let colorValue = colorInput.value.trim();
  
  if (value) {
    // Add border and padding for better visual appearance
    img.style.border = "1px solid silver";
    img.style.padding = "8px";
    img.style.margin = "2rem auto"
    // Set crossOrigin to allow fetching the image data later
    img.crossOrigin = "anonymous";

    // Default to black if no color is provided
    let foregroundColor = "000000"; 
    if (colorValue) {
      foregroundColor = getHexColor(colorValue);
    }
    
    // Generate the QR code with the custom foreground color and white background
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(value)}&color=${foregroundColor}&bgcolor=FFFFFF`;
    
    // Display the download button once the image loads
    img.onload = function () {
      downloadBtn.style.display = "block";
      qrimg.style.display = "block";
    };
  } else {
    alert("Please enter text to generate a QR code!");
  }
}

function downloadQR() {
  if (img.src) {
    fetch(img.src, { mode: "cors" })
      .then(response => response.blob())
      .then(blob => {
        let url = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = url;
        link.download = "qr-code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error("Download error:", error);
        alert("Failed to download QR code.");
      });
  }
}

// Helper function: Convert color names or hex codes to a proper hex string (without "#")
function getHexColor(colorStr) {
  // Remove any leading '#' if present
  if (colorStr.charAt(0) === "#") {
    colorStr = colorStr.substring(1);
  }
  
  // Check if the input is already a valid hex string (3 or 6 hex digits)
  let hexRegex = /^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (hexRegex.test(colorStr)) {
    return colorStr.toUpperCase();
  }
  
  // If not, try converting a color name (or other CSS color) to hex
  let tempElem = document.createElement("div");
  tempElem.style.color = colorStr;
  document.body.appendChild(tempElem);
  let computedColor = window.getComputedStyle(tempElem).color;
  document.body.removeChild(tempElem);
  
  // The computed color should be in the format "rgb(r, g, b)"
  let rgbRegex = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/;
  let result = rgbRegex.exec(computedColor);
  if (result) {
    let r = parseInt(result[1]).toString(16).padStart(2, "0");
    let g = parseInt(result[2]).toString(16).padStart(2, "0");
    let b = parseInt(result[3]).toString(16).padStart(2, "0");
    return (r + g + b).toUpperCase();
  }
  
  // Fallback to black if conversion fails
  return "000000";
}
