document.addEventListener('click', function(e) {
  const target = e.target.closest('button[data-action]');
  
  if (!target) return;
  
  const action = target.dataset.action;
  const roomType = target.dataset.room;
  
  console.log(`[Button Click] Action: ${action}, Room: ${roomType || 'N/A'}`);
  
  switch(action) {
    case 'tour':
      handleTourAction(target);
      break;
    case 'check-availability':
      handleCheckAvailability(target);
      break;
    case 'book-now':
      handleBookNow(target, roomType);
      break;
    case 'view-details':
      handleViewDetails(target, roomType);
      break;
    case 'explore-rooms':
      handleExploreRooms(target);
      break;
    case 'view-rooms':
      handleViewRooms(target);
      break;
    case 'learn-more':
      handleLearnMore(target);
      break;
    default:
      console.log(`Unknown action: ${action}`);
  }
});

const headerTourBtn = document.getElementById('header-tour-btn');
if (headerTourBtn) {
  headerTourBtn.addEventListener('click', function() {
    console.log('User clicked: Take A Tour');
  });
}

const checkAvailabilityBtn = document.getElementById('check-availability-btn');
if (checkAvailabilityBtn) {
  checkAvailabilityBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('User clicked: Check Availability');
    window.location.href = 'availability.html';
  });
}

// index.html - Intro Book Now Button
const introBookBtn = document.getElementById('intro-book-btn');
if (introBookBtn) {
  introBookBtn.addEventListener('click', function() {
    console.log('User clicked: Book Now (Intro Section)');
  });
}

// index.html - About Book Now Button
const aboutBookBtn = document.getElementById('about-book-btn');
if (aboutBookBtn) {
  aboutBookBtn.addEventListener('click', function() {
    console.log('User clicked: Book Now (About Section)');
    // window.location.href = 'booking.html';
  });
}

// about.html - Explore Rooms Button
const exploreRoomsBtn = document.getElementById('about-explore-rooms-btn');
if (exploreRoomsBtn) {
  exploreRoomsBtn.addEventListener('click', function() {
    console.log('User clicked: Explore Our Rooms');
    // window.location.href = 'room.html';
  });
}

// about.html - View Rooms Button
const viewRoomsBtn = document.getElementById('about-view-rooms-btn');
if (viewRoomsBtn) {
  viewRoomsBtn.addEventListener('click', function() {
    console.log('User clicked: View Rooms (About CTA)');
    // window.location.href = 'room.html';
  });
}

// about.html - Book Now Button
const aboutCTABookBtn = document.getElementById('about-book-now-btn');
if (aboutCTABookBtn) {
  aboutCTABookBtn.addEventListener('click', function() {
    console.log('User clicked: Book Now (About CTA)');
    // window.location.href = 'booking.html';
  });
}

// room.html - View Details Buttons
const viewDetailsButtons = document.querySelectorAll('[data-action="view-details"]');
viewDetailsButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const roomType = this.dataset.room;
    console.log(`User clicked: View Details (${roomType})`);
    // Open modal with room details
  });
});

// room.html - Book Now Buttons (per room)
const roomBookButtons = document.querySelectorAll('button[id$="-btn"][data-action="book-now"]');
roomBookButtons.forEach(btn => {
  btn.addEventListener('click', function() {
    const roomType = this.dataset.room;
    console.log(`User clicked: Book Now (${roomType})`);
    // Store room selection in sessionStorage/localStorage
    // window.location.href = 'booking.html';
  });
});

// room.html - Book a Room Button
const roomCTABookBtn = document.getElementById('room-book-btn');
if (roomCTABookBtn) {
  roomCTABookBtn.addEventListener('click', function() {
    console.log('User clicked: Book a Room (CTA)');
    // window.location.href = 'booking.html';
  });
}

// room.html - Learn More Button
const learnMoreBtn = document.getElementById('room-learn-more-btn');
if (learnMoreBtn) {
  learnMoreBtn.addEventListener('click', function() {
    console.log('User clicked: Learn More');
    // window.location.href = 'about.html';
  });
}

// room.html - Book This Room (Modal)
const bookThisRoomBtn = document.getElementById('book-this-room-btn');
if (bookThisRoomBtn) {
  bookThisRoomBtn.addEventListener('click', function() {
    console.log('User clicked: Book This Room');
    // window.location.href = 'booking.html';
  });
}

// room.html - Modal Back Button
const modalBackBtn = document.getElementById('modal-back-btn');
if (modalBackBtn) {
  modalBackBtn.addEventListener('click', function() {
    console.log('User clicked: Modal Back Button');
    // Close modal, return to room list
  });
}

// booking.html - Complete Booking Button
const bookingSubmitBtn = document.getElementById('booking-submit-btn');
if (bookingSubmitBtn) {
  bookingSubmitBtn.addEventListener('click', function(e) {
    console.log('User clicked: Complete Booking');
    // Form submission logic handled by booking-firebase.js
  });
}

// booking.html - Booking Edit Button
const bookingEditBtn = document.getElementById('booking-edit-btn');
if (bookingEditBtn) {
  bookingEditBtn.addEventListener('click', function() {
    console.log('User clicked: Edit Booking');
    // Return to form editing
  });
}

// booking.html - Booking Confirm Button
const bookingConfirmBtn = document.getElementById('booking-confirm-btn');
if (bookingConfirmBtn) {
  bookingConfirmBtn.addEventListener('click', function() {
    console.log('User clicked: Confirm & Submit Booking');
    // Submit booking to Firebase/backend
  });
}

// booking.html - CTA Book Now Button
const bookingCTABtn = document.getElementById('cta-book-btn');
if (bookingCTABtn) {
  bookingCTABtn.addEventListener('click', function() {
    console.log('User clicked: Book Now (Booking CTA)');
    // Scroll to form or navigate
  });
}

// admin.html - Logout Button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('User clicked: Logout');
    // Clear admin auth and redirect
    // localStorage.removeItem('adminAuth');
    // window.location.href = 'login.html';
  });
}

// admin.html - Export Button
const exportBtn = document.getElementById('exportBookings');
if (exportBtn) {
  exportBtn.addEventListener('click', function() {
    console.log('User clicked: Export Bookings');
    // Generate and download CSV/Excel file
  });
}

// admin.html - Modal Buttons
const saveChangesBtn = document.getElementById('saveChanges');
if (saveChangesBtn) {
  saveChangesBtn.addEventListener('click', function() {
    console.log('User clicked: Save Changes');
    // Update booking in database
  });
}

const confirmEmailBtn = document.getElementById('confirmBookingEmail');
if (confirmEmailBtn) {
  confirmEmailBtn.addEventListener('click', function() {
    console.log('User clicked: Confirm & Email');
    // Send confirmation email
  });
}

const deleteBookingBtn = document.getElementById('deleteBooking');
if (deleteBookingBtn) {
  deleteBookingBtn.addEventListener('click', function() {
    console.log('User clicked: Delete Booking');
    // Confirm and delete booking
    if (confirm('Are you sure you want to delete this booking?')) {
      // Delete from database
    }
  });
}

const closeModalBtn = document.getElementById('closeModalBtn');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', function() {
    console.log('User clicked: Close Modal');
    // Close modal
  });
}

const closeBookingModalBtn = document.getElementById('closeBookingModal');
if (closeBookingModalBtn) {
  closeBookingModalBtn.addEventListener('click', function() {
    console.log('User clicked: Close Booking Modal');
    // Close modal
  });
}

// login.html - Login Button
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
  loginBtn.addEventListener('click', function(e) {
    console.log('User clicked: Sign In');
    // Form submission logic handled by login.html inline script
  });
}

// ============================================
// 3. HELPER FUNCTIONS
// ============================================

function handleTourAction(button) {
  console.log('Handling tour action');
  // Scroll to features or open video modal
}

function handleCheckAvailability(button) {
  console.log('Handling check availability');
  window.location.href = 'availability.html';
}

function handleBookNow(button, roomType) {
  console.log(`Handling book now (${roomType || 'general'})`);
  // Store room selection if roomType specified
  if (roomType) {
    sessionStorage.setItem('selectedRoom', roomType);
  }
  // Redirect to booking page
  // window.location.href = 'booking.html';
}

function handleViewDetails(button, roomType) {
  console.log(`Handling view details for ${roomType}`);
  // Show room modal or navigate to room details page
}

function handleExploreRooms(button) {
  console.log('Handling explore rooms');
  // Navigate to rooms page
  // window.location.href = 'room.html';
}

function handleViewRooms(button) {
  console.log('Handling view rooms');
  // Navigate to rooms page
  // window.location.href = 'room.html';
}

function handleLearnMore(button) {
  console.log('Handling learn more');
  // Navigate to about page
  // window.location.href = 'about.html';
}

// ============================================
// 4. ANALYTICS/TRACKING INTEGRATION
// ============================================

// Example: Send button clicks to analytics service
function trackButtonClick(buttonId, action, data = {}) {
  const eventData = {
    timestamp: new Date().toISOString(),
    buttonId: buttonId,
    action: action,
    ...data
  };
  
  console.log('[Analytics]', eventData);
  
  // Send to your analytics service
  // Example: Google Analytics, Mixpanel, etc.
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', action, eventData);
  // }
}

// Add to global click handler
document.addEventListener('click', function(e) {
  if (e.target.id && (e.target.tagName === 'BUTTON' || e.target.closest('button'))) {
    const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
    if (button) {
      trackButtonClick(button.id, button.textContent.trim(), {
        action: button.dataset.action,
        room: button.dataset.room
      });
    }
  }
});
