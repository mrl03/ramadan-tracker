// Automatically request location when the page loads
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(sendLocation, showError);
  } else {
    document.getElementById("status").innerText =
      "Geolocation is not supported by your browser.";
  }
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
