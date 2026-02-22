// Admin Dashboard Functionality

// Check authentication on page load
function checkAdminAuth() {
  if (localStorage.getItem("adminAuth") !== "true") {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

// Logout function
function logoutAdmin() {
  localStorage.removeItem("adminAuth");
  window.location.href = "login.html";
}

// Sample booking data used as fallback when Firestore isn't configured
const SAMPLE_BOOKINGS = [
  { id: "BK001", guestName: "Juan Dela Cruz", email: "juan@email.com", phone: "09123456789", roomType: "deluxe", checkIn: "2024-03-10", checkOut: "2024-03-12", guests: 2, totalPrice: "P1,398", status: "confirmed", requests: "Late check-in requested." },
  { id: "BK002", guestName: "Maria Santos", email: "maria@email.com", phone: "09234567890", roomType: "standard", checkIn: "2024-03-15", checkOut: "2024-03-17", guests: 1, totalPrice: "P998", status: "pending", requests: "None" }
];

let bookingsData = SAMPLE_BOOKINGS.slice();

let unsubscribeBookings = null;

function subscribeToFirestoreBookings() {
  if (!window.firebaseDb) {
    console.log('Firestore not available; using sample bookings');
    renderBookingsTable(bookingsData);
    return;
  }

  if (typeof unsubscribeBookings === 'function') unsubscribeBookings();

  const ref = window.firebaseDb.ref('bookings');

  const listener = ref.on('value', snapshot => {
    const rows = [];
    snapshot.forEach(childSnapshot => {
      rows.push({ id: childSnapshot.key, ...childSnapshot.val() });
    });
    rows.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    bookingsData = rows;
    renderBookingsTable(bookingsData);
  }, err => {
    console.error('Error fetching bookings:', err);
    renderBookingsTable(bookingsData);
  });

  unsubscribeBookings = () => ref.off('value', listener);
}

// DOM Elements
const bookingsTableBody = document.getElementById("bookingsTableBody");
const searchInput = document.getElementById("searchBooking");
const filterStatus = document.getElementById("filterStatus");
const filterRoom = document.getElementById("filterRoom");
const bookingModal = document.getElementById("bookingModal");
const closeBookingModal = document.getElementById("closeBookingModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveChanges = document.getElementById("saveChanges");
const deleteBooking = document.getElementById("deleteBooking");
const exportBookings = document.getElementById("exportBookings");
const confirmBookingEmailBtn = document.getElementById("confirmBookingEmail");
const logoutBtn = document.getElementById("logoutBtn");

// Current booking being edited
let currentBooking = null;

// Initialize the admin dashboard
function initAdmin() {
  // If Firestore is available, subscribe to live bookings; otherwise render fallback
  subscribeToFirestoreBookings();
  setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
  searchInput.addEventListener("input", filterBookings);
  filterStatus.addEventListener("change", filterBookings);
  filterRoom.addEventListener("change", filterBookings);
  closeBookingModal.addEventListener("click", () => closeModal());
  closeModalBtn.addEventListener("click", () => closeModal());
  bookingModal.addEventListener("click", (e) => {
    if (e.target === bookingModal) {
      closeModal();
    }
  });
  saveChanges.addEventListener("click", updateBooking);
  deleteBooking.addEventListener("click", removeBooking);
  exportBookings.addEventListener("click", exportBookingsData);
  if (confirmBookingEmailBtn) {
    confirmBookingEmailBtn.addEventListener("click", confirmBookingAndEmail);
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutAdmin);
  }
}

// Render bookings table
function renderBookingsTable(bookings) {
  if (bookings.length === 0) {
    bookingsTableBody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-light);">No bookings found</td></tr>';
    return;
  }

  bookingsTableBody.innerHTML = bookings.map(booking => `
    <tr>
      <td>${booking.id}</td>
      <td>${booking.guestName}</td>
      <td>${booking.email}</td>
      <td>${booking.phone}</td>
      <td>${formatRoomType(booking.roomType)}</td>
      <td>${formatDate(booking.checkIn)}</td>
      <td>${formatDate(booking.checkOut)}</td>
      <td>
        <span class="booking__status status__${booking.status}">
          ${booking.status}
        </span>
      </td>
      <td>
        <div class="table__actions">
          <button class="action__btn btn__view" onclick="openBookingModal('${booking.id}')">
            View
          </button>
          <button class="action__btn btn__delete" onclick="deleteBookingDirect('${booking.id}')">
            Delete
          </button>
        </div>
      </td>
    </tr>
  `).join("");
}

// Filter bookings based on search and filters
function filterBookings() {
  const searchTerm = searchInput.value.toLowerCase();
  const statusFilter = filterStatus.value;
  const roomFilter = filterRoom.value;

  const filtered = bookingsData.filter(booking => {
    const matchesSearch = 
      booking.guestName.toLowerCase().includes(searchTerm) ||
      booking.email.toLowerCase().includes(searchTerm) ||
      booking.id.toLowerCase().includes(searchTerm);
    
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesRoom = !roomFilter || booking.roomType === roomFilter;

    return matchesSearch && matchesStatus && matchesRoom;
  });

  renderBookingsTable(filtered);
}

// Open booking details modal
function openBookingModal(bookingId) {
  const booking = bookingsData.find(b => b.id === bookingId);
  if (!booking) return;

  currentBooking = booking;

  // Populate modal with booking data
  document.getElementById("modalGuestName").textContent = booking.guestName;
  document.getElementById("modalGuestEmail").textContent = booking.email;
  document.getElementById("modalGuestPhone").textContent = booking.phone;
  document.getElementById("modalGuestCount").textContent = booking.guests;
  document.getElementById("modalRoomType").textContent = formatRoomType(booking.roomType);
  document.getElementById("modalCheckIn").textContent = formatDate(booking.checkIn);
  document.getElementById("modalCheckOut").textContent = formatDate(booking.checkOut);
  document.getElementById("modalPrice").textContent = booking.totalPrice;
  document.getElementById("modalRequests").textContent = booking.requests || "No special requests";
  document.getElementById("modalStatus").value = booking.status;

  bookingModal.classList.add("active");
}

// Close booking modal
function closeModal() {
  bookingModal.classList.remove("active");
  currentBooking = null;
}

// Update booking status
function updateBooking() {
  if (!currentBooking) return;

  const newStatus = document.getElementById("modalStatus").value;
  if (window.firebaseDb && currentBooking.id) {
    window.firebaseDb.ref('bookings/' + currentBooking.id).update({ status: newStatus })
      .then(() => {
        alert(`Booking ${currentBooking.id} updated successfully!`);
        closeModal();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to update booking.');
      });
    return;
  }

  // Fallback: update local array
  const bookingIndex = bookingsData.findIndex(b => b.id === currentBooking.id);
  if (bookingIndex !== -1) {
    bookingsData[bookingIndex].status = newStatus;
    alert(`Booking ${currentBooking.id} updated successfully!`);
    filterBookings();
    closeModal();
  }
}

function confirmBookingAndEmail() {
  if (!currentBooking) return;
  const bookingId = currentBooking.id;
  const newStatus = "confirmed";

  const applyLocalUpdate = () => {
    const idx = bookingsData.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookingsData[idx].status = newStatus;
      filterBookings();
    }
  };

  const afterUpdate = () => {
    alert(`Booking ${bookingId} has been confirmed.`);
    sendBookingEmail(currentBooking);
    closeModal();
  };

  if (window.firebaseDb && bookingId) {
    window.firebaseDb.ref('bookings/' + bookingId).update({ status: newStatus })
      .then(() => {
        applyLocalUpdate();
        afterUpdate();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to confirm booking.');
      });
    return;
  }

  applyLocalUpdate();
  afterUpdate();
}

function sendBookingEmail(booking) {
  if (!booking || !booking.email) return;
  const subject = encodeURIComponent("Booking Confirmation - Kamayan Beach Resort");
  const lines = [
    `Dear ${booking.guestName || "Guest"},`,
    "",
    "Your booking has been confirmed. Here are your reservation details:",
    "",
    `Booking ID: ${booking.id}`,
    `Room: ${formatRoomType(booking.roomType)}`,
    `Check-in: ${formatDate(booking.checkIn)}`,
    `Check-out: ${formatDate(booking.checkOut)}`,
    `Guests: ${booking.guests}`,
    "",
    "If you have any questions or need to make changes, please reply to this email.",
    "",
    "We look forward to welcoming you to Kamayan Beach Resort.",
    "",
    "Best regards,",
    "Kamayan Beach Resort"
  ];
  const body = encodeURIComponent(lines.join("\n"));
  window.location.href = `mailto:${booking.email}?subject=${subject}&body=${body}`;
}

// Delete booking
function removeBooking() {
  if (!currentBooking) return;

  if (confirm(`Are you sure you want to delete booking ${currentBooking.id}?`)) {
    if (window.firebaseDb && currentBooking.id) {
      window.firebaseDb.ref('bookings/' + currentBooking.id).remove()
        .then(() => {
          alert(`Booking ${currentBooking.id} has been deleted.`);
          closeModal();
        })
        .catch(err => {
          console.error(err);
          alert('Failed to delete booking.');
        });
      return;
    }

    const bookingIndex = bookingsData.findIndex(b => b.id === currentBooking.id);
    if (bookingIndex !== -1) {
      const deletedBooking = bookingsData.splice(bookingIndex, 1)[0];
      alert(`Booking ${deletedBooking.id} has been deleted.`);
      filterBookings();
      closeModal();
    }
  }
}

// Delete booking directly from table
function deleteBookingDirect(bookingId) {
  if (!confirm(`Are you sure you want to delete booking ${bookingId}?`)) return;

  if (window.firebaseDb) {
    window.firebaseDb.ref('bookings/' + bookingId).remove()
      .then(() => {
        alert(`Booking ${bookingId} has been deleted.`);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete booking.');
      });
    return;
  }

  const bookingIndex = bookingsData.findIndex(b => b.id === bookingId);
  if (bookingIndex !== -1) {
    bookingsData.splice(bookingIndex, 1);
    alert(`Booking ${bookingId} has been deleted.`);
    filterBookings();
  }
}

// Export bookings to CSV
function exportBookingsData() {
  const buildAndDownload = (rows) => {
    let csvContent = "Booking ID,Guest Name,Email,Phone,Room Type,Check-in,Check-out,Guests,Status,Special Requests\n";
    rows.forEach(booking => {
      csvContent += `"${booking.id}","${booking.guestName}","${booking.email}","${booking.phone}","${formatRoomType(booking.roomType)}","${booking.checkIn}","${booking.checkOut}","${booking.guests}","${booking.status}","${booking.requests || ''}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert("Bookings exported successfully!");
  };

  if (window.firebaseDb) {
    window.firebaseDb.ref('bookings').once('value')
      .then(snapshot => {
        const rows = [];
        snapshot.forEach(childSnapshot => {
          rows.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        buildAndDownload(rows);
      })
      .catch(err => {
        console.error(err);
        buildAndDownload(bookingsData);
      });
    return;
  }

  buildAndDownload(bookingsData);
}

// Helper functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatRoomType(roomType) {
  const roomTypes = {
    standard: "Standard Room",
    deluxe: "Deluxe Room",
    family: "Family Room"
  };
  return roomTypes[roomType] || roomType;
}

function calculateNights(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

document.addEventListener("DOMContentLoaded", function() {
  if (checkAdminAuth()) {
    initAdmin();
  }
});
