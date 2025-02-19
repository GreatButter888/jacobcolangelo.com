// ======================
// AUTO DARK/LIGHT MODE & TOGGLE
// ======================

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle Button
  const toggleButton = document.getElementById("theme-toggle");
  const body = document.body;

  // Function to toggle theme
  function toggleTheme() {
      body.classList.toggle("light-mode");

      if (body.classList.contains("light-mode")) {
          localStorage.setItem("theme", "light");
          toggleButton.textContent = "Dark Mode";
          toggleButton.classList.remove("dark-btn");
          toggleButton.classList.add("light-btn");
      } else {
          localStorage.setItem("theme", "dark");
          toggleButton.textContent = "Light Mode";
          toggleButton.classList.remove("light-btn");
          toggleButton.classList.add("dark-btn");
      }
  }

  // Check local storage for theme preference
  if (localStorage.getItem("theme") === "light") {
      body.classList.add("light-mode");
      toggleButton.textContent = "Dark Mode";
      toggleButton.classList.add("light-btn");
  } else {
      toggleButton.textContent = "Light Mode";
      toggleButton.classList.add("dark-btn");
  }

  // Toggle theme on button click
  toggleButton.addEventListener("click", toggleTheme);

  // Toggle theme on "Q" key press
  document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "q") {
          toggleTheme();
      }
  });
});


  // ======================
  // TEXT CONTENT SWITCHER
  // ======================

  const options = document.querySelectorAll('.option');
  const texts = document.querySelectorAll('.text');

  // Remove all active classes
  options.forEach(option => option.classList.remove('is--active'));
  texts.forEach(text => text.classList.remove('is--visible'));

  // Set default selection
  const defaultOption = document.querySelector('.option.anyone');
  const defaultText = document.querySelector('.text.anyone');

  if (defaultOption && defaultText) {
      defaultOption.classList.add('is--active');
      defaultText.classList.add('is--visible');
  }

  // Click event for text switcher
  options.forEach(option => {
      option.addEventListener('click', () => {
          options.forEach(opt => opt.classList.remove('is--active'));
          texts.forEach(text => text.classList.remove('is--visible'));

          option.classList.add('is--active');
          const selectedText = document.querySelector(`.text.${option.classList[1]}`);
          if (selectedText) {
              selectedText.classList.add('is--visible');
          }
      });
  });
// ======================
// AUTO DARK/LIGHT MODE 
// ======================

function getThemeBasedOnTime() {
  const currentHour = new Date().getHours();
  return (currentHour >= 6 && currentHour < 18) ? "Light Mode" : "Dark Mode";
}

function setThemeBasedOnTime() {
  const theme = getThemeBasedOnTime();
  
  if (theme === "Light Mode") {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
  } else {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
  }
}

// Run the function on page load
setThemeBasedOnTime();

// ======================
// SHOW TIME & MODE ON "T" PRESS
// ======================

document.addEventListener("keydown", function(event) {
  if (event.key.toLowerCase() === "t") {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString(); // Format: HH:MM:SS AM/PM
      const theme = getThemeBasedOnTime();
      
      alert(`Current Time: ${formattedTime}\nSuggested Mode: ${theme}`);
  }
});
// ======================
// SHOW IP, LOCATION & TIMEZONE ON "L" PRESS
// ======================

document.addEventListener("keydown", async function (event) {
  if (event.key.toLowerCase() === "l") {
      try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();

          const ip = data.ip;
          const city = data.city;
          const region = data.region;
          const country = data.country_name;
          const countryCode = data.country_code;
          const timezone = data.timezone;
          const latitude = data.latitude;
          const longitude = data.longitude;
          const isp = data.org;
          const asn = data.asn;
          const postalCode = data.postal;
          const currency = data.currency;
          const callingCode = data.country_calling_code;
          const networkType = data.network;

          alert(
              `IP Address: ${ip}
Location: ${city}, ${region}, ${country} (${countryCode})
Timezone: ${timezone}
Latitude/Longitude: ${latitude}, ${longitude}
ISP: ${isp}
ASN: ${asn}
Postal Code: ${postalCode}
Currency: ${currency}
Calling Code: ${callingCode}
Network Type: ${networkType}`
          );
      } catch (error) {
          alert("Failed to retrieve location data. Please check your internet connection.");
          console.error("Error fetching location data:", error);
      }
  }
});


