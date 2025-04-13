document.addEventListener('DOMContentLoaded', () => {
  // =====================
  // THEME MANAGEMENT
  // =====================
  const body = document.body;
  
  // Function to get theme based on time
  function getThemeBasedOnTime() {
      const currentHour = new Date().getHours();
      return (currentHour >= 6 && currentHour < 18) ? "light" : "dark";
  }
  
  // Function to set theme
  function setTheme(theme, manual = false) {
      if (theme === "light") {
          body.classList.add("light-mode");
          body.classList.remove("dark-mode");
          if (manual) body.classList.add("theme-manually-toggled");
      } else {
          body.classList.remove("light-mode");
          body.classList.add("dark-mode");
          if (manual) body.classList.add("theme-manually-toggled");
      }
      if (manual) {
          localStorage.setItem("theme", theme);
      }
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
      
      // Apply the new theme
      setTheme(newTheme, true);
      
      console.log(`Toggled from ${currentTheme} to ${newTheme}`);
  }    
  
  // Initialize theme (preference > time-based)
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

      // Auto-scroll the clicked option into view
      option.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
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
  // OPTIONS BAR SCROLLING & GRADIENTS (Based on Example)
  // =====================
  const optionsContainer = document.querySelector('.options');
  // Need to select the masks within the specific intro section's content area
  const introContent = document.querySelector('.section.intro .content');
  const leftMask = introContent?.querySelector('.gradient-mask.left');
  const rightMask = introContent?.querySelector('.gradient-mask.right');

  if (optionsContainer && leftMask && rightMask) {
    let isDown = false;
    let startX;
    let scrollLeft;

    // Function to update gradient visibility
    const updateGradients = () => {
      const maxScrollLeft = optionsContainer.scrollWidth - optionsContainer.clientWidth;
      // Show left gradient if scrolled away from the start
      leftMask.classList.toggle('is--visible', optionsContainer.scrollLeft > 1);
      // Show right gradient if not scrolled to the very end
      rightMask.classList.toggle('is--visible', optionsContainer.scrollLeft < maxScrollLeft - 1);
    };

    // Initial check
    updateGradients();

    // Update gradients on scroll
    optionsContainer.addEventListener('scroll', updateGradients, { passive: true }); // Use passive listener

    // Click and Drag Logic
    optionsContainer.addEventListener('mousedown', (e) => {
      isDown = true;
      optionsContainer.style.cursor = 'grabbing';
      startX = e.pageX - optionsContainer.offsetLeft;
      scrollLeft = optionsContainer.scrollLeft;
      e.preventDefault(); // Prevent text selection/drag behavior
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
      const walk = (x - startX) * 2; // Adjust multiplier for scroll speed if needed
      optionsContainer.scrollLeft = scrollLeft - walk;
      // No need to call updateGradients here, scroll event handles it
    });

    // Note: The auto-scroll on click logic was added directly into the
    // handleSelection function within the TEXT CONTENT SWITCHER section above.
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


  // =====================
  // PROJECTS TOGGLE
  // =====================
  const projectHeaders = document.querySelectorAll('.project-header');
  
  projectHeaders.forEach(header => {
    // Click handler for project toggle
    const handleProjectToggle = () => {
      const project = header.parentElement;
      const iconElement = header.querySelector('.project-toggle i'); // Get the icon element
      const isActive = project.classList.contains('active');

      // Close all projects first and reset their icons
      const allProjects = document.querySelectorAll('.project');
      allProjects.forEach(p => {
        if (p !== project || isActive) { // Don't reset the icon if we are about to open it
          p.classList.remove('active');
          const otherIcon = p.querySelector('.project-toggle i');
          if (otherIcon) {
            otherIcon.setAttribute('data-lucide', 'chevron-down');
          }
        }
      });

      // If the clicked project wasn't active, open it and set icon to chevron-up
      if (!isActive) {
        project.classList.add('active');
        if (iconElement) {
          iconElement.setAttribute('data-lucide', 'chevron-up');
        }
      } else {
        // If it was active (meaning we just closed it above), ensure icon is chevron-down
        if (iconElement) {
          iconElement.setAttribute('data-lucide', 'chevron-down');
        }
      }

      // Re-render icons after changing attributes
      lucide.createIcons();
    };

    // Add click event
    header.addEventListener('click', handleProjectToggle);
    
    // Add keyboard support
    header.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleProjectToggle();
      }
    });
  });

  // =====================
  // SCROLL ANIMATIONS (Intersection Observer)
  // =====================
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0) {
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Stop observing once visible
        }
      });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    animatedElements.forEach(el => {
      scrollObserver.observe(el);
    });
  }

  // Initialize Lucide icons
  lucide.createIcons();

  // =====================
  // INITIAL SCROLL POSITION
  // =====================
  // Scroll to the top section adjusted for navbar height on load
  const initialSection = document.querySelector('#about');
  const navbar = document.querySelector('.navbar');
  if (initialSection && navbar) {
    const navbarHeightInitial = navbar.offsetHeight;
    // Use setTimeout to ensure layout is fully calculated, especially navbar height
    setTimeout(() => {
        const sectionTop = initialSection.offsetTop;
        window.scrollTo({
            top: sectionTop - navbarHeightInitial - 10, // Adjust with a small buffer if needed
            behavior: 'auto' // Instant scroll on load
        });

        // Explicitly set the 'About' link as active after initial scroll
        const allSidebarLinks = document.querySelectorAll('.sidebar a');
        const aboutLink = document.querySelector('.sidebar a[href="#about"]');
        allSidebarLinks.forEach(link => link.classList.remove('active'));
        if (aboutLink) {
            aboutLink.classList.add('active');
        }

    }, 0); // Execute after current execution context
  }

  // =====================
  // SIDEBAR ACTIVE LINK HIGHLIGHTING
  // =====================
  const sections = document.querySelectorAll('.main-content section[id]');
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0; // Get navbar height for offset

  if (sections.length > 0 && sidebarLinks.length > 0) {
    const observerOptions = {
      root: null, // relative to document viewport
      rootMargin: `-${navbarHeight + 10}px 0px -40% 0px`, // Adjust top margin for navbar, bottom margin to trigger earlier
      threshold: 0 // Trigger as soon as any part enters the adjusted root margin
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        const correspondingLink = document.querySelector(`.sidebar a[href="#${entry.target.id}"]`);
        if (entry.isIntersecting) {
          // When a section enters the observed area, make its link active
          sidebarLinks.forEach(link => link.classList.remove('active'));
          if (correspondingLink) {
            correspondingLink.classList.add('active');
          }
        }
        // Optional: Remove active class if section completely leaves the viewport
        // else {
        //   if (correspondingLink) {
        //     correspondingLink.classList.remove('active');
        //   }
        // }
      });

      // Fallback: If no section is 'intersecting' according to the observer (e.g., at the very top/bottom)
      // Find the link whose section is closest to the top of the viewport (adjusted for navbar)
      let closestSectionId = null;
      let minDistance = Infinity;
      const scrollPosition = window.scrollY + navbarHeight + 10; // Adjust scroll position check

      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const distance = Math.abs(scrollPosition - sectionTop);

          if (sectionTop <= scrollPosition && scrollPosition < sectionTop + section.offsetHeight) {
              // If currently within a section, prioritize it
              closestSectionId = section.id;
              minDistance = 0; // Ensure this section is chosen
          } else if (minDistance > 0 && distance < minDistance) {
              // Otherwise, find the closest one based on top position
              minDistance = distance;
              closestSectionId = section.id;
          }
      });

      // Check if any link is already active from the observer logic
      const activeLinkExists = document.querySelector('.sidebar a.active');

      // Only apply fallback if observer didn't set an active link
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

  // =====================
  // MOBILE MENU TOGGLE
  // =====================
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileSidebar = document.querySelector('.sidebar'); // Re-select sidebar for this scope

  if (menuToggle && mobileSidebar) {
    menuToggle.addEventListener('click', () => {
      mobileSidebar.classList.toggle('is-open');
      // Toggle aria-expanded attribute for accessibility
      const isExpanded = mobileSidebar.classList.contains('is-open');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link inside is clicked
    const sidebarLinksMobile = mobileSidebar.querySelectorAll('a');
    sidebarLinksMobile.forEach(link => {
      link.addEventListener('click', () => {
        mobileSidebar.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

});
