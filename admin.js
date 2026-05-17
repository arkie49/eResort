import { database } from './firebase.js';
import { ref, query, orderByChild, onValue, get, update, remove } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_8lc2f7c';
const EMAILJS_TEMPLATE_ID = 'template_oeiohhi';
const EMAILJS_PUBLIC_KEY = 'bLNJcScAyYYtd_kGu';

// Send email using EmailJS API directly (without library)
async function sendEmailViaEmailJS(templateParams) {
  try {
    const requestBody = {
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: templateParams
    };
    
    console.log('📧 EmailJS Request:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📧 EmailJS Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const text = await response.text();
      console.error('EmailJS API error details:', text);
      throw new Error(`EmailJS API error: ${response.status} - ${text}`);
    }

    // EmailJS returns "OK" as plain text on success, not JSON
    const responseText = await response.text();
    console.log('📧 EmailJS Response Body:', responseText);
    
    return { status: 'success', response: responseText };
  } catch (error) {
    console.error('EmailJS send failed:', error);
    throw error;
  }
}

function checkAdminAuth() {
  if (localStorage.getItem("adminAuth") !== "true") {
    window.location.href = "login.html";
    return false;
  }
  return true;
}

function logoutAdmin() {
  localStorage.removeItem("adminAuth");
  window.location.href = "login.html";
}

const SAMPLE_BOOKINGS = [
  { id: "BK001", guestName: "Juan ", email: "juan@email.com", phone: "09123456789", roomType: "deluxe", checkIn: "2024-03-10", checkOut: "2024-03-12", guests: 2, totalPrice: "P1,398", status: "confirmed", isPaid: true, requests: "Late check-in requested.", gcashNumber: "0917-123-4567", gcashRef: "REF123456" },
  { id: "BK002", guestName: "Maria Santos", email: "maria@email.com", phone: "09234567890", roomType: "standard", checkIn: "2024-03-15", checkOut: "2024-03-17", guests: 1, totalPrice: "P998", status: "pending", isPaid: false, requests: "None", gcashNumber: "0917-987-6543", gcashRef: "REF789012" }
];

let bookingsData = SAMPLE_BOOKINGS.slice();

let unsubscribeBookings = null;

function subscribeToRealtimeBookings() {
  if (!database) {
    console.log('Realtime Database not available; using local and sample bookings');
    const localBookings = JSON.parse(localStorage.getItem('eresort_bookings') || '[]');
    bookingsData = [...SAMPLE_BOOKINGS, ...localBookings];
    renderBookingsTable(bookingsData);
    return;
  }

  if (typeof unsubscribeBookings === 'function') unsubscribeBookings();

  const bookingsRef = ref(database, 'bookings');
  const bookingsQuery = query(bookingsRef, orderByChild('createdAt'));

  const unsubscribe = onValue(bookingsQuery, (snapshot) => {
    const rows = [];
    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      rows.push({ id: childSnapshot.key, ...item });
    });

    const localBookings = JSON.parse(localStorage.getItem('eresort_bookings') || '[]');
    bookingsData = [...rows.reverse(), ...localBookings];
    renderBookingsTable(bookingsData);
  }, (err) => {
    console.error('Error fetching bookings:', err);
    const localBookings = JSON.parse(localStorage.getItem('eresort_bookings') || '[]');
    bookingsData = [...SAMPLE_BOOKINGS, ...localBookings];
    renderBookingsTable(bookingsData);
  });

  unsubscribeBookings = unsubscribe;
}

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
const markPaidBtn = document.getElementById("markPaidBtn");
const logoutBtn = document.getElementById("logoutBtn");

let currentBooking = null;

function initAdmin() {
  
  subscribeToRealtimeBookings();
  setupEventListeners();
}

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
  if (markPaidBtn) {
    markPaidBtn.addEventListener("click", markBookingAsPaid);
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logoutAdmin);
  }
}


function renderBookingsTable(bookings) {
  if (bookings.length === 0) {
    bookingsTableBody.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: 2rem; color: var(--text-light);">No bookings found</td></tr>';
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
      <td>${booking.gcashNumber || '-'}</td>
      <td>${booking.gcashRef || '-'}</td>
      <td>
        <span class="booking__status status__${booking.status}">
          ${booking.status}
        </span>
      </td>
      <td>
        <span class="booking__payment ${booking.isPaid ? 'paid' : 'unpaid'}" style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
          ${booking.isPaid ? '✓ Paid' : 'Unpaid'}
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

function openBookingModal(bookingId) {
  const booking = bookingsData.find(b => b.id === bookingId);
  if (!booking) return;

  currentBooking = booking;

  document.getElementById("modalGuestName").textContent = booking.guestName;
  document.getElementById("modalGuestEmail").textContent = booking.email;
  document.getElementById("modalGuestPhone").textContent = booking.phone;
  document.getElementById("modalGuestCount").textContent = booking.guests;
  document.getElementById("modalRoomType").textContent = formatRoomType(booking.roomType);
  document.getElementById("modalCheckIn").textContent = formatDate(booking.checkIn);
  document.getElementById("modalCheckOut").textContent = formatDate(booking.checkOut);
  document.getElementById("modalPrice").textContent = booking.totalPrice;
  document.getElementById("modalGcashNumber").textContent = booking.gcashNumber || '-';
  document.getElementById("modalGcashRef").textContent = booking.gcashRef || '-';
  document.getElementById("modalPaymentStatus").textContent = booking.isPaid ? '✓ Paid' : 'Unpaid';
  document.getElementById("modalPaymentStatus").style.color = booking.isPaid ? '#10b981' : '#ef4444';
  document.getElementById("modalRequests").textContent = booking.requests || "No special requests";
  document.getElementById("modalStatus").value = booking.status;

  bookingModal.classList.add("active");
}

function closeModal() {
  bookingModal.classList.remove("active");
  currentBooking = null;
}

function updateBooking() {
  if (!currentBooking) return;

  const newStatus = document.getElementById("modalStatus").value;
  if (database && currentBooking.id) {
    update(ref(database, `bookings/${currentBooking.id}`), { status: newStatus })
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

  if (database && bookingId) {
    update(ref(database, `bookings/${bookingId}`), { status: newStatus })
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

  const templateParams = {
    to_email: booking.email,
    reply_to: booking.email,
    guest_name: booking.guestName || "Guest",
    booking_id: booking.id,
    room_type: formatRoomType(booking.roomType),
    check_in: formatDate(booking.checkIn),
    check_out: formatDate(booking.checkOut),
    guests: booking.guests,
    total_price: booking.totalPrice,
    special_requests: booking.requests || "None",
    gcash_number: booking.gcashNumber || "0917-123-4567",
    gcash_ref: booking.gcashRef || "N/A"
  };

  console.log('📧 Template params being sent:', JSON.stringify(templateParams, null, 2));

  sendEmailViaEmailJS(templateParams)
    .then((response) => {
      console.log('Email sent successfully!', response);
      alert('✓ Confirmation email sent to customer.');
    })
    .catch((error) => {
      console.error('Failed to send email:', error);
      alert('Booking confirmed, but email delivery failed.\nPlease try again or contact customer manually.');
    });
}

function markBookingAsPaid() {
  if (!currentBooking) return;
  const bookingId = currentBooking.id;
  const newPaidStatus = !currentBooking.isPaid;

  const applyLocalUpdate = () => {
    const idx = bookingsData.findIndex(b => b.id === bookingId);
    if (idx !== -1) {
      bookingsData[idx].isPaid = newPaidStatus;
      openBookingModal(bookingId);
      filterBookings();
    }
  };

  const statusMessage = newPaidStatus ? 'marked as paid' : 'marked as unpaid';

  if (database && bookingId) {
    update(ref(database, `bookings/${bookingId}`), { isPaid: newPaidStatus })
      .then(() => {
        applyLocalUpdate();
        alert(`Booking ${bookingId} has been ${statusMessage}.`);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to update payment status.');
      });
    return;
  }

  applyLocalUpdate();
  alert(`Booking ${bookingId} has been ${statusMessage}.`);
}

function removeBooking() {
  if (!currentBooking) return;

  if (confirm(`Are you sure you want to delete booking ${currentBooking.id}?`)) {
if (database && currentBooking.id) {
    remove(ref(database, `bookings/${currentBooking.id}`))
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

function deleteBookingDirect(bookingId) {
  if (!confirm(`Are you sure you want to delete booking ${bookingId}?`)) return;

  if (database) {
    remove(ref(database, `bookings/${bookingId}`))
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

function exportBookingsData() {
  const buildAndDownload = (rows) => {
    let csvContent = "Booking ID,Guest Name,Email,Phone,Room Type,Check-in,Check-out,GCash Number,Reference Number,Guests,Status,Special Requests\n";
    rows.forEach(booking => {
      csvContent += `"${booking.id}","${booking.guestName}","${booking.email}","${booking.phone}","${formatRoomType(booking.roomType)}","${booking.checkIn}","${booking.checkOut}","${booking.gcashNumber || ''}","${booking.gcashRef || ''}","${booking.guests}","${booking.status}","${booking.requests || ''}"\n`;
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

  if (database) {
    get(ref(database, 'bookings'))
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

window.openBookingModal = openBookingModal;
window.deleteBookingDirect = deleteBookingDirect;

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
