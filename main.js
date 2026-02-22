const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
let menuBtnIcon = null;

if (menuBtn) {
  menuBtnIcon = menuBtn.querySelector("i");

  menuBtn.addEventListener("click", (e) => {
    if (!navLinks) return;
    navLinks.classList.toggle("open");

    const isOpen = navLinks.classList.contains("open");
    if (menuBtnIcon) menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
  });

  if (navLinks) {
    navLinks.addEventListener("click", (e) => {
      navLinks.classList.remove("open");
      if (menuBtnIcon) menuBtnIcon.setAttribute("class", "ri-menu-line");
    });
  }
}

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// header container
if (typeof ScrollReveal === 'function') {
  ScrollReveal().reveal(".header__container .section__subheader", {
    ...scrollRevealOption,
  });

  ScrollReveal().reveal(".header__container h1", {
    ...scrollRevealOption,
    delay: 500,
  });

  ScrollReveal().reveal(".header__container .btn", {
    ...scrollRevealOption,
    delay: 1000,
  });
}

// room container
ScrollReveal().reveal(".room__card", {
  ...scrollRevealOption,
  interval: 500,
});

// feature container
ScrollReveal().reveal(".feature__card", {
  ...scrollRevealOption,
  interval: 500,
});

// news container
ScrollReveal().reveal(".news__card", {
  ...scrollRevealOption,
  interval: 500,
});

// Room Modal Functionality
const roomModal = document.getElementById("room-modal");
const roomModalClose = document.querySelector(".room__modal__close");
const roomModalBack = document.getElementById("modal-back-btn");
const viewDetailsButtons = document.querySelectorAll(".btn-view-details");

const roomData = {
  standard: {
    title: "Standard Room (The \"Essentials\" Stay)",
    price: "P499",
    description: "The most budget-friendly option, usually located in a main building or a row of concrete units slightly back from the shore. Perfect for solo travelers and couples looking for an authentic beach experience.",
    images: ["assets/standard room.jpg", "assets/deluxe room.jpg", "assets/barkada room.jpg"],
    specs: ["Room Size: 250 sq ft", "Bedrooms: 1", "Bathrooms: 1", "Max Occupancy: 2", "Balcony: Basic", "Air Conditioning: Yes", "Free WiFi: Yes"],
    amenities: ["Air Conditioning", "Flat-Screen TV", "Free Wi-Fi", "Work Desk", "Private Bathroom", "Luxury Bedding", "Safe"]
  },
  deluxe: {
    title: "Deluxe Room (The Mid-Tier Upgrade)",
    price: "P699",
    description: "Slightly more spacious than the Standard, often with better views or closer proximity to the pool and beach. Ideal for guests who want extra comfort without breaking the bank.",
    images: ["assets/deluxe room.jpg", "assets/standard room.jpg", "assets/barkada room.jpg"],
    specs: ["Room Size: 350 sq ft", "Bedrooms: 1", "Bathrooms: 1", "Max Occupancy: 2-3", "Balcony: Yes", "Air Conditioning: Yes", "Free WiFi: Yes"],
    amenities: ["Air Conditioning", "Flat-Screen TV", "Free Wi-Fi", "Work Desk", "Private Bathroom", "Luxury Bedding", "Safe", "Mini Bar"]
  },
  family: {
    title: "Family Room / Barkada Suite",
    price: "P799-P999",
    description: "Since Filipino travel culture is very group-oriented, this room is perfect for larger families and friend groups. Multiple sleeping areas with a common living space for bonding.",
    images: ["assets/barkada room.jpg", "assets/deluxe room.jpg", "assets/standard room.jpg"],
    specs: ["Room Size: 550 sq ft", "Bedrooms: 2", "Bathrooms: 2", "Max Occupancy: 4-6", "Balcony: Large", "Air Conditioning: Yes", "Free WiFi: Yes"],
    amenities: ["Air Conditioning", "Flat-Screen TVs", "Free Wi-Fi", "Full Kitchen", "Living Area", "Private Bathrooms", "Luxury Bedding", "Safe", "Refrigerator"]
  }
};

function openRoomModal(roomType) {
  const data = roomData[roomType];
  
  document.getElementById("modal-title").textContent = data.title;
  document.getElementById("modal-price").innerHTML = `${data.price}<span>/night</span>`;
  document.getElementById("modal-description").textContent = data.description;
  
  const mainImage = document.getElementById("modal-main-image");
  mainImage.src = data.images[0];
  
  const thumbnails = document.getElementById("modal-thumbnails");
  thumbnails.innerHTML = data.images.map((img, idx) => 
    `<img src="${img}" alt="Room image" ${idx === 0 ? 'class="active"' : ''} onclick="changeImage(this.src)">`
  ).join("");
  
  const specsList = document.getElementById("modal-specs");
  specsList.innerHTML = data.specs.map(spec => `<li>${spec}</li>`).join("");
  
  const amenitiesList = document.getElementById("modal-amenities");
  amenitiesList.innerHTML = data.amenities.map(amenity => `<li>${amenity}</li>`).join("");
  
  if (roomModal) {
    roomModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeRoomModal() {
  if (roomModal) {
    roomModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

function changeImage(src) {
  document.getElementById("modal-main-image").src = src;
  document.querySelectorAll(".room__modal__thumbnails img").forEach(img => {
    img.classList.remove("active");
    if (img.src === src) {
      img.classList.add("active");
    }
  });
}

if (viewDetailsButtons && viewDetailsButtons.length) {
  viewDetailsButtons.forEach((btn, idx) => {
  const roomTypes = ["standard", "deluxe", "family"];
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openRoomModal(roomTypes[idx]);
  });
  });
}

if (roomModalClose) roomModalClose.addEventListener("click", closeRoomModal);
if (roomModalBack) roomModalBack.addEventListener("click", closeRoomModal);
if (roomModal) {
  roomModal.addEventListener("click", (e) => {
    if (e.target === roomModal) {
      closeRoomModal();
    }
  });
}
