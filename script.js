document.addEventListener('DOMContentLoaded', () => {
  // --- THEME MANAGEMENT ---
  const htmlElement = document.documentElement; // Target <html> instead of body
  const themeToggleButton = document.getElementById('theme-toggle-button');

  function getThemeBasedOnTime() {
      const currentHour = new Date().getHours();
      return (currentHour >= 6 && currentHour < 18) ? "light" : "dark";
  }
  
  function setTheme(theme, manual = false) {
      if (theme === "light") {
          htmlElement.classList.add("light-mode");
          htmlElement.classList.remove("dark-mode");
          if (manual) htmlElement.classList.add("theme-manually-toggled");
          else htmlElement.classList.remove("theme-manually-toggled"); // Ensure manual toggle class is removed if not manual
      } else {
          htmlElement.classList.remove("light-mode");
          htmlElement.classList.add("dark-mode");
          if (manual) htmlElement.classList.add("theme-manually-toggled");
          else htmlElement.classList.remove("theme-manually-toggled"); // Ensure manual toggle class is removed if not manual
      }
      if (manual) {
          localStorage.setItem("theme", theme);
      }
  }
  
  function toggleTheme() {
      let currentTheme;
      
      if (htmlElement.classList.contains("light-mode")) {
          currentTheme = "light";
      } else if (htmlElement.classList.contains("dark-mode")) {
          currentTheme = "dark";
      } else {
          // Fallback if no class is set
          currentTheme = localStorage.getItem("theme") || getThemeBasedOnTime();
      }
      
      const newTheme = currentTheme === "light" ? "dark" : "light";
      
      setTheme(newTheme, true);
      
      console.log(`Toggled from ${currentTheme} to ${newTheme}`);
  }
  
  // Add click listener to the theme toggle button
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }
  
  function initializeTheme() {
      const savedTheme = localStorage.getItem("theme");
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      
      if (savedTheme) {
          setTheme(savedTheme);
      } else if (prefersLight) {
          setTheme("light");
      } else {
          setTheme(getThemeBasedOnTime());
      }
  }
  
  initializeTheme();
  
  // Theme toggle shortcut: Ctrl + Q
  document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "q" && event.ctrlKey) {
          toggleTheme();
      }
  });
  
  // --- TEXT CONTENT SWITCHER ---
  const options = document.querySelectorAll('.option');
  const texts = document.querySelectorAll('.text');
  
  options.forEach(option => option.classList.remove('is--active'));
  texts.forEach(text => text.classList.remove('is--visible'));
  
  // Default selection
  const defaultOption = document.querySelector('.option.anyone');
  const defaultText = document.querySelector('.text.anyone');
  
  if (defaultOption && defaultText) {
    defaultOption.classList.add('is--active');
    defaultText.classList.add('is--visible');
  }
  
  options.forEach(option => {
    const handleSelection = () => {
      options.forEach(opt => opt.classList.remove('is--active'));
      texts.forEach(text => text.classList.remove('is--visible'));

      option.classList.add('is--active');
      const selectedText = document.querySelector(`.text.${option.classList[1]}`);
      if (selectedText) {
        selectedText.classList.add('is--visible');
      }

      // Auto-scroll clicked option into view
      option.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    };

    option.addEventListener('click', handleSelection);
    
    // Keyboard support (Enter/Space)
    option.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSelection();
      }
    });
  });

  // --- DYNAMIC INTRO TEXT HEIGHT ---
  const setIntroTextContainerHeight = () => {
    const textsContainer = document.querySelector('.texts');
    const textElements = document.querySelectorAll('.texts .text');
    if (!textsContainer || textElements.length === 0) return;

    let maxHeight = 0;

    // Store original styles to reset
    const originalStyles = new Map();

    textElements.forEach(text => {
      const style = text.style;
      originalStyles.set(text, {
        position: style.position,
        visibility: style.visibility,
        display: style.display,
        height: style.height // Store original height if any
      });

      // Temp styles for measurement
      style.position = 'absolute'; // Take out of flow
      style.visibility = 'hidden'; // Keep invisible
      style.display = 'block';     // Ensure it's block for scrollHeight
      style.height = 'auto';

      maxHeight = Math.max(maxHeight, text.scrollHeight);

      // Reset original styles
      const original = originalStyles.get(text);
      style.position = original.position;
      style.visibility = original.visibility;
      style.display = original.display;
      style.height = original.height;
    });

    // Apply calculated max height as min-height
    if (maxHeight > 0) {
      textsContainer.style.minHeight = `${maxHeight}px`;
      console.log(`Set .texts min-height to: ${maxHeight}px`);
    } else {
      textsContainer.style.minHeight = ''; // Clear if no height found
      console.log("Could not determine max height for .texts");
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  setIntroTextContainerHeight(); // Initial calculation
  window.addEventListener('resize', debounce(setIntroTextContainerHeight, 250)); // Recalculate on resize

  // --- OPTIONS BAR SCROLLING & GRADIENTS ---
  const optionsContainer = document.querySelector('.options');
  // Select masks within the intro section's content area
  const introContent = document.querySelector('.section.intro .content');
  const leftMask = introContent?.querySelector('.gradient-mask.left');
  const rightMask = introContent?.querySelector('.gradient-mask.right');

  if (optionsContainer && leftMask && rightMask) {
    let isDown = false;
    let startX;
    let scrollLeft;

    const updateGradients = () => {
      const maxScrollLeft = optionsContainer.scrollWidth - optionsContainer.clientWidth;
      // Show left gradient if scrolled away from the start
      leftMask.classList.toggle('is--visible', optionsContainer.scrollLeft > 1);
      // Show right gradient if not scrolled to the very end
      rightMask.classList.toggle('is--visible', optionsContainer.scrollLeft < maxScrollLeft - 1);
    };

    updateGradients(); // Initial check

    // Update gradients on scroll (passive listener for performance)
    optionsContainer.addEventListener('scroll', updateGradients, { passive: true });

    // Click and Drag scroll
    optionsContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      optionsContainer.style.cursor = 'grabbing';
      startX = e.pageX - optionsContainer.offsetLeft;
      scrollLeft = optionsContainer.scrollLeft;
      e.preventDefault(); // Prevent text selection
    });

    optionsContainer.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      optionsContainer.style.cursor = 'grab';
    });

    optionsContainer.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      optionsContainer.style.cursor = 'grab';
    });

    optionsContainer.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - optionsContainer.offsetLeft;
      const walk = (x - startX) * 2; // Adjust multiplier for scroll speed
      optionsContainer.scrollLeft = scrollLeft - walk;
    });

    // Note: Auto-scroll on click is in handleSelection (TEXT CONTENT SWITCHER section)
  }
  
  // --- KEYBOARD SHORTCUTS ---
  
  // Show time & mode: Ctrl + T
  document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "t" && event.ctrlKey) {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString();
      const suggestedTheme = getThemeBasedOnTime() === "light" ? "Light Mode" : "Dark Mode";
      
      alert(`Current Time: ${formattedTime}\nSuggested Mode: ${suggestedTheme}`);
    }
  });
  
  // Show IP/Location: Ctrl + L
  document.addEventListener("keydown", async function(event) {
    if (event.key.toLowerCase() === "l" && event.ctrlKey) {
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


  // --- PROJECTS TOGGLE ---
  const projectHeaders = document.querySelectorAll('.project-header');
  
  projectHeaders.forEach(header => {
    const handleProjectToggle = () => {
      const project = header.parentElement;
      const iconElement = header.querySelector('.project-toggle i');
      const isActive = project.classList.contains('active');

      // Close all other projects and reset their icons
      const allProjects = document.querySelectorAll('.project');
      allProjects.forEach(p => {
        if (p !== project || isActive) { // Don't reset icon if we are opening this one
          p.classList.remove('active');
          const otherIcon = p.querySelector('.project-toggle i');
          if (otherIcon) {
            otherIcon.setAttribute('data-lucide', 'chevron-down');
          }
        }
      });

      // Toggle the clicked project and update its icon
      if (!isActive) {
        project.classList.add('active');
        if (iconElement) {
          iconElement.setAttribute('data-lucide', 'chevron-up');
        }
      } else {
        // If it was active (now closed), ensure icon is chevron-down
        if (iconElement) {
          iconElement.setAttribute('data-lucide', 'chevron-down');
        }
      }

      // Re-render Lucide icons after changing data-lucide attributes
      lucide.createIcons();
    };

    header.addEventListener('click', handleProjectToggle);
    
    // Keyboard support (Enter/Space)
    header.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleProjectToggle();
      }
    });
  });

  // --- SCROLL ANIMATIONS (Intersection Observer) ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    const observerOptions = {
      root: null, // Viewport root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Observe only once
        }
      });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
      scrollObserver.observe(el);
    });
  }

  lucide.createIcons(); // Initialize Lucide icons

  // --- INITIAL SCROLL POSITION ---
  // Scroll to #about section, adjusted for navbar height
  const initialSection = document.querySelector('#about');
  const navbar = document.querySelector('.navbar');
  if (initialSection && navbar) {
    const navbarHeightInitial = navbar.offsetHeight;
    // setTimeout ensures layout (navbar height) is calculated
    setTimeout(() => {
        const sectionTop = initialSection.offsetTop;
        window.scrollTo({
            top: sectionTop - navbarHeightInitial - 10, // Adjust buffer if needed
            behavior: 'auto' // Instant scroll
        });

        // Set 'About' link as active after initial scroll
        const allSidebarLinks = document.querySelectorAll('.sidebar a');
        const aboutLink = document.querySelector('.sidebar a[href="#about"]');
        allSidebarLinks.forEach(link => link.classList.remove('active'));
        if (aboutLink) {
            aboutLink.classList.add('active');
        }

    }, 0); // Execute immediately after current context
  }

  // --- SIDEBAR ACTIVE LINK HIGHLIGHTING ---
  const sections = document.querySelectorAll('.main-content section[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
  let isClickScrolling = false; // Flag to prevent observer override during click-triggered scroll
  let clickScrollTimeout;

  // Handle sidebar link clicks for immediate active state update
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      isClickScrolling = true;
      clearTimeout(clickScrollTimeout); // Handle rapid clicks

      sidebarLinks.forEach(l => l.classList.remove('active')); // Remove from all
      link.classList.add('active'); // Add to clicked

      // Reset flag after a delay to allow scroll to finish
      clickScrollTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 1000); // Adjust delay if needed

      // Browser handles the actual scroll
    });
  });

  if (sections.length > 0 && sidebarLinks.length > 0) {
    const observerOptions = {
      root: null, // Viewport
      rootMargin: `-${navbarHeight + 10}px 0px 0px 0px`, // Offset for navbar height + buffer
      threshold: 0 // Trigger as soon as section enters adjusted view
    };

    const observerCallback = (entries) => {
      // Ignore observer updates during click-triggered scroll
      if (isClickScrolling) return;

      entries.forEach(entry => {
        const correspondingLink = document.querySelector(`.sidebar a[href="#${entry.target.id}"]`);
        if (entry.isIntersecting) {
          // Section enters view: make its link active
          sidebarLinks.forEach(link => link.classList.remove('active'));
          if (correspondingLink) {
            correspondingLink.classList.add('active');
          }
        }
      });

      // Fallback: If no section is 'intersecting' (e.g., at top/bottom of page),
      // highlight the link for the section closest to the top of the viewport.
      let closestSectionId = null;
      let minDistance = Infinity;
      const scrollPosition = window.scrollY + navbarHeight + 10; // Adjusted scroll position

      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const distance = Math.abs(scrollPosition - sectionTop);

          if (sectionTop <= scrollPosition && scrollPosition < sectionTop + section.offsetHeight) {
              // Prioritize if currently within a section
              closestSectionId = section.id;
              minDistance = 0; // Ensure this one is chosen
          } else if (minDistance > 0 && distance < minDistance) {
              // Otherwise, find closest based on top position
              minDistance = distance;
              closestSectionId = section.id;
          }
      });

      const activeLinkExists = document.querySelector('.sidebar a.active');

      // Apply fallback only if observer didn't set an active link
      if (!activeLinkExists && closestSectionId) {
          sidebarLinks.forEach(link => link.classList.remove('active'));
          const fallbackLink = document.querySelector(`.sidebar a[href="#${closestSectionId}"]`);
          if (fallbackLink) {
              fallbackLink.classList.add('active');
          }
      }
    };

    const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  }

  // --- MOBILE MENU TOGGLE ---
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileSidebar = document.querySelector('.sidebar');

  if (menuToggle && mobileSidebar) {
    menuToggle.addEventListener('click', () => {
      mobileSidebar.classList.toggle('is-open');
      // Toggle aria-expanded for accessibility
      const isExpanded = mobileSidebar.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close mobile menu when a link inside is clicked
    const sidebarLinksMobile = mobileSidebar.querySelectorAll('a');
    sidebarLinksMobile.forEach(link => {
      link.addEventListener('click', () => {
        mobileSidebar.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

});

// --- FORM SUBMISSION (AJAX) ---
var form = document.getElementById("my-form");

async function handleSubmit(event) {
  event.preventDefault();
  var status = document.getElementById("my-form-status");
  var data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      status.innerHTML = "Thanks for your submission!";
      form.reset()
    } else {
      response.json().then(data => {
        if (Object.hasOwn(data, 'errors')) {
          status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
        } else {
          status.innerHTML = "Oops! There was a problem submitting your form"
        }
      })
    }
  }).catch(error => {
    status.innerHTML = "Oops! There was a problem submitting your form"
  });
}
form.addEventListener("submit", handleSubmit)
