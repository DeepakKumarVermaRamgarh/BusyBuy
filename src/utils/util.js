// Function to scroll the window to the top with a smooth animation
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Function to get the formatted date string in ISO format (YYYY-MM-DD) from a given date
export const getDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};


// Function to toggle the navigation menu
export const toggleMenu = () => {
  // Get the navigation links container element
  const navLinksContainer = document.querySelector(".nav-links-container");
  navLinksContainer.classList.toggle("openMenu");
};

// Get all navigation links inside the navigation links container
const navLinks = document.querySelectorAll(".nav-links-container ul li");
const navLinksContainer = document.querySelector(".nav-links-container");
// Add event listener to each navigation link to close the menu when clicked
navLinks.forEach((navlink) => {
  navlink.addEventListener("click", () => {
    if (navLinksContainer.classList.contains("openMenu")) {
      navLinksContainer.classList.remove("openMenu");
    }
  });
});
