/* script.js */

// Hard-coded users and passwords
const users = {
    "student1": "pass123",
    "student2": "pass456",
    "student3": "pass789"
};

// Hard-coded campus locations at the University of Dundee
// Extended sample data for Dundee locations
const locations = [
    // Accommodations
    {
        name: "City Centre Apartments",
        category: "Accommodation",
        description: "Modern apartments located in the heart of Dundee, offering excellent facilities and convenience."
    },
    {
        name: "Student Housing Dundee",
        category: "Accommodation",
        description: "Affordable student accommodation with easy access to the University of Dundee."
    },
    {
        name: "Riverside Residences",
        category: "Accommodation",
        description: "Luxury riverside accommodation with stunning views and modern amenities."
    },
    {
        name: "Dundee Student Village",
        category: "Accommodation",
        description: "A lively student village offering community events and affordable rates."
    },

    // Sports Clubs
    {
        name: "Dundee United FC",
        category: "Sports Club",
        description: "Local professional football club with a passionate fanbase and a long history."
    },
    {
        name: "Dundee Rugby Club",
        category: "Sports Club",
        description: "Community rugby club offering training and matches for various skill levels."
    },
    {
        name: "Dundee Cricket Club",
        category: "Sports Club",
        description: "Historic cricket club with regular fixtures and a welcoming atmosphere."
    },
    {
        name: "Fit & Active Dundee",
        category: "Sports Club",
        description: "Local gym and sports centre with various fitness classes and training facilities."
    },

    // Study Areas
    {
        name: "College Park Library",
        category: "Study",
        description: "The main library at the University of Dundee, offering extensive study spaces and resources."
    },
    {
        name: "Student Union Study Lounge",
        category: "Study",
        description: "A quiet study area in the Student Union for collaborative and independent study."
    },
    {
        name: "Innovation Hub",
        category: "Study",
        description: "A modern workspace designed for research, group projects, and creative innovation."
    },
    {
        name: "Quiet Corner Café",
        category: "Study",
        description: "A peaceful spot with free Wi-Fi and comfortable seating perfect for studying."
    },

    // Food Venues
    {
        name: "Morrison Café",
        category: "Food",
        description: "A popular on-campus café serving coffee, sandwiches, and snacks."
    },
    {
        name: "Campus Bistro",
        category: "Food",
        description: "A modern bistro offering a variety of meals and a friendly atmosphere."
    },
    {
        name: "Dundee Diner",
        category: "Food",
        description: "A local diner known for its hearty meals and casual vibe."
    },
    {
        name: "The Food Market",
        category: "Food",
        description: "A vibrant market offering fresh produce, street food, and international flavors."
    },

    // Clubs & Societies
    {
        name: "Creative Arts Society",
        category: "Club",
        description: "A club for students passionate about arts, music, and performance, hosting regular events and workshops."
    },
    {
        name: "Tech Innovators Club",
        category: "Club",
        description: "A society focused on technology and innovation, offering hackathons, coding sessions, and industry talks."
    },
    {
        name: "Environmental Action Group",
        category: "Club",
        description: "A club dedicated to sustainability and environmental projects across Dundee."
    },
    {
        name: "International Students Society",
        category: "Club",
        description: "A welcoming community for international students with cultural events and support sessions."
    }
];


/* Utility Functions */

// Returns the current logged-in user from sessionStorage
function getCurrentUser() {
    return sessionStorage.getItem("currentUser");
}

// Checks if a user is logged in; if not, redirects to the login page
function checkLogin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = "login.html";
    }
    return user;
}

// Logs out the user by clearing the session and redirecting to the login page
function logout() {
    sessionStorage.removeItem("currentUser");
    window.location.href = "login.html";
}

/* Page Initializations */
// Initialize login page functionality
function initLogin() {
    // If a user is already logged in, redirect to home
    if (getCurrentUser()) {
        window.location.href = "login.html";
        return;
    }
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        if (users[username] && users[username] === password) {
        sessionStorage.setItem("currentUser", username);
        window.location.href = "main.html";
        } else {
        document.getElementById("loginMessage").textContent = "Invalid username or password.";
        }
    });
}
  
  
  

// Initialize home page functionality
function initHome() {
    const user = checkLogin();
    document.getElementById("currentUser").textContent = user;
    document.getElementById("logoutLink").addEventListener("click", function(e) {
        e.preventDefault();
        logout();
    });
}

// Initialize search page functionality
function initSearch() {
    // Check login and set the current user
    const user = checkLogin();
    document.getElementById("currentUser").textContent = user;
  
    // Logout event listener
    document.getElementById("logoutLink").addEventListener("click", function(e) {
      e.preventDefault();
      logout();
    });
  
    // Search button logic
    const searchButton = document.getElementById("searchButton");
    searchButton.addEventListener("click", function() {
      const query = document.getElementById("searchQuery").value.trim().toLowerCase();
      const resultsDiv = document.getElementById("searchResults");
      resultsDiv.innerHTML = ""; // Clear previous results
  
      if (!query) {
        resultsDiv.innerHTML = "<p>Please enter a keyword or category to search.</p>";
        return;
      }
  
      // Filter 'locations' based on the query (assumes 'locations' array is globally available)
      const results = locations.filter(loc =>
        loc.name.toLowerCase().includes(query) ||
        loc.category.toLowerCase().includes(query) ||
        loc.description.toLowerCase().includes(query)
      );
  
      if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No locations found matching your query.</p>";
      } else {
        results.forEach(loc => {
          // Create a 'search-result' card
          const locDiv = document.createElement("div");
          locDiv.className = "search-result"; // We'll style this in CSS
  
          // Build the HTML structure for each location
          locDiv.innerHTML = `
            <strong class="loc-name">${loc.name}</strong>
            <span class="loc-category"> (${loc.category})</span>
            <p class="loc-description">${loc.description}</p>
          `;
  
          // Create the 'Add to Favourites' button
          const favBtn = document.createElement("button");
          favBtn.textContent = "Add to Favourites";
          favBtn.className = "fav-btn"; // We'll style this in CSS
          favBtn.addEventListener("click", function() {
            addFavourite(loc.name);
          });
  
          // Append button to the result card
          locDiv.appendChild(favBtn);
  
          // Finally, append the card to the results container
          resultsDiv.appendChild(locDiv);
        });
      }
    });
  }
  

// Add a location to the current user's favourites (stored in localStorage)
function addFavourite(locationName) {
    const user = getCurrentUser();
    if (!user) return;
    let favs = JSON.parse(localStorage.getItem("favourites_" + user)) || [];
    // Prevent duplicate favourites
    if (favs.some(fav => fav.name === locationName)) {
        alert("Location already in your favourites.");
        return;
    }
    const loc = locations.find(l => l.name === locationName);
    if (loc) {
        favs.push(loc);
        localStorage.setItem("favourites_" + user, JSON.stringify(favs));
        alert(`${loc.name} added to your favourites.`);
    }
}

// Initialize favourites page functionality
function initFavourites() {
    const user = checkLogin();
    document.getElementById("logoutLink").addEventListener("click", function(e) {
        e.preventDefault();
        logout();
    });
    const favs = JSON.parse(localStorage.getItem("favourites_" + user)) || [];
    const favListDiv = document.getElementById("favouritesList");
    if (favs.length === 0) {
        favListDiv.innerHTML = "<p>You have no favourite locations yet.</p>";
    } else {
        favs.forEach(loc => {
        const locDiv = document.createElement("div");
        locDiv.className = "location";
        locDiv.innerHTML = `<strong>${loc.name}</strong> (${loc.category})<br>${loc.description}`;
        favListDiv.appendChild(locDiv);
        });
    }
}

function displayLocations() {
    // Group locations by category
    const grouped = {};
  locations.forEach(loc => {
    if (!grouped[loc.category]) {
      grouped[loc.category] = [];
    }
    grouped[loc.category].push(loc);
  });

  let html = "";
  for (const category in grouped) {
    // Capitalize the category name for display
    html += `<h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>`;
    grouped[category].forEach(loc => {
      html += `<div class="location"><strong>${loc.name}</strong><br>${loc.description}</div>`;
    });
  }
  const locationList = document.getElementById("locationList");
  if (locationList) {
    locationList.innerHTML = html;
  }
}