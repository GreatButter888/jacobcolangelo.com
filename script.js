document.addEventListener('DOMContentLoaded', () => {
    // =====================
    // THEME MANAGEMENT
    // =====================
    const toggleButton = document.getElementById("theme-toggle");
    const body = document.body;
    
    // Function to get theme based on time
    function getThemeBasedOnTime() {
      const currentHour = new Date().getHours();
      return (currentHour >= 6 && currentHour < 18) ? "light" : "dark";
    }
    
    // Function to set theme
    function setTheme(theme) {
      if (theme === "light") {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        toggleButton.textContent = "Dark Mode";
      } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        toggleButton.textContent = "Light Mode";
      }
      localStorage.setItem("theme", theme);
    }
    
    function toggleTheme() {
      // Get current theme from body class, fallback to localStorage or time-based
      let currentTheme;
      
      if (body.classList.contains("light-mode")) {
        currentTheme = "light";
      } else if (body.classList.contains("dark-mode")) {
        currentTheme = "dark";
      } else {
        // Fallback if no class is set for some reason
        currentTheme = localStorage.getItem("theme") || getThemeBasedOnTime();
      }
      
      // Toggle to opposite theme
      const newTheme = currentTheme === "light" ? "dark" : "light";
      
      // Force remove both classes before setting the new one
      body.classList.remove("light-mode", "dark-mode");
      
      // Apply the new theme
      setTheme(newTheme);
      
      console.log(`Toggled from ${currentTheme} to ${newTheme}`);
    }    
    
    // Initialize theme (preference > time-based)
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(getThemeBasedOnTime());
    }
    
    // Toggle theme on button click
    toggleButton.addEventListener("click", toggleTheme);
    
    // Toggle theme on "Q" key press
    document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "q") {
        toggleTheme();
      }
    });
    
    // =====================
    // TEXT CONTENT SWITCHER
    // =====================
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
      // Click handler
      const handleSelection = () => {
        options.forEach(opt => opt.classList.remove('is--active'));
        texts.forEach(text => text.classList.remove('is--visible'));
        
        option.classList.add('is--active');
        const selectedText = document.querySelector(`.text.${option.classList[1]}`);
        if (selectedText) {
          selectedText.classList.add('is--visible');
        }
      };
      
      // Add click event
      option.addEventListener('click', handleSelection);
      
      // Add keyboard support
      option.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelection();
        }
      });
    });
    
    // =====================
    // MOBILE SCROLL EFFECTS
    // =====================
    const optionsContainer = document.querySelector('.options');
    const contentContainer = document.querySelector('.content');
    
    if (optionsContainer && contentContainer) {
      // Check scroll position on load
      checkScroll();
      
      // Check scroll position when scrolling
      optionsContainer.addEventListener('scroll', checkScroll);
      
      function checkScroll() {
        // If scrolled at all, show left fade
        if (optionsContainer.scrollLeft > 10) {
          if (!contentContainer.classList.contains('scrolled')) {
            contentContainer.classList.add('scrolled');
          }
        } else {
          contentContainer.classList.remove('scrolled');
        }
      }
    }
    
    // =====================
    // KEYBOARD SHORTCUTS
    // =====================
    
    // Show time & mode on "T" press
    document.addEventListener("keydown", function(event) {
      if (event.key.toLowerCase() === "t") {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString();
        const suggestedTheme = getThemeBasedOnTime() === "light" ? "Light Mode" : "Dark Mode";
        
        alert(`Current Time: ${formattedTime}\nSuggested Mode: ${suggestedTheme}`);
      }
    });
    
    // Show IP, location & timezone on "L" press
    document.addEventListener("keydown", async function(event) {
      if (event.key.toLowerCase() === "l") {
        try {
          const response = await fetch("https://ipapi.co/json/");
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          
          const ip = data.ip;
          const city = data.city || 'Unknown';
          const region = data.region || 'Unknown';
          const country = data.country_name || 'Unknown';
          const countryCode = data.country_code || 'Unknown';
          const timezone = data.timezone || 'Unknown';
          const latitude = data.latitude || 'Unknown';
          const longitude = data.longitude || 'Unknown';
          const isp = data.org || 'Unknown';
          const asn = data.asn || 'Unknown';
          const postalCode = data.postal || 'Unknown';
          const currency = data.currency || 'Unknown';
          const callingCode = data.country_calling_code || 'Unknown';
          const networkType = data.network || 'Unknown';
          
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
  });
