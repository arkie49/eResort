import { database, firebaseTimestamp } from './firebase.js';
import { ref, push } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js';

// Local fallback storage for offline/file:// mode
function getLocalBookings() {
  const stored = localStorage.getItem('eresort_bookings');
  return stored ? JSON.parse(stored) : [];
}

function saveLocalBooking(bookingData) {
  const bookings = getLocalBookings();
  const id = 'LOCAL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  bookings.push({ id, ...bookingData, savedAt: new Date().toISOString() });
  localStorage.setItem('eresort_bookings', JSON.stringify(bookings));
  return id;
}

function createBookingData(guestName, email, phone, checkIn, checkOut, guests, roomType, requests, gcashNumber, gcashRef, nights, pricePerNight, totalPrice) {
  return {
    guestName,
    email,
    phone,
    checkIn,
    checkOut,
    guests,
    roomType,
    requests,
    gcashNumber,
    gcashRef,
    nights,
    pricePerNight,
    totalPrice,
    status: 'pending',
    createdAt: firebaseTimestamp ? firebaseTimestamp() : Date.now()
  };
}

async function submitBookingToRealtime(data) {
  const bookingsRef = ref(database, 'bookings');
  return push(bookingsRef, data);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.booking__form__wrapper form');
  const overlay = document.getElementById('booking-loading');
  const submitBtn = document.getElementById('booking-submit-btn');
  if (!form) return;

  function parsePriceForRoom(roomType) {
    const prices = {
      standard: 499,
      deluxe: 699,
      family: 799
    };
    return prices[roomType] || 0;
  }

  function calcNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  const reviewModal = document.getElementById('booking-review-modal');
  const confirmBtn = document.getElementById('booking-confirm-btn');
  const editBtn = document.getElementById('booking-edit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const guestName = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const checkIn = document.getElementById('arrival').value;
    const checkOut = document.getElementById('departure').value;
    const guests = document.getElementById('guests').value;
    const roomType = document.getElementById('room-type').value;
    const requests = document.getElementById('requests').value.trim();
    const gcashNumber = document.getElementById('gcash-number').value.trim();
    const gcashRef = document.getElementById('gcash-ref').value.trim();

    const nights = calcNights(checkIn, checkOut);
    const pricePerNight = parsePriceForRoom(roomType);
    const totalPrice = nights * pricePerNight * parseInt(guests);

    if (reviewModal) {
      document.getElementById('reviewGuestName').textContent = guestName || '-';
      document.getElementById('reviewEmail').textContent = email || '-';
      document.getElementById('reviewPhone').textContent = phone || '-';
      document.getElementById('reviewRoomType').textContent = roomType || '-';
      document.getElementById('reviewCheckIn').textContent = checkIn || '-';
      document.getElementById('reviewCheckOut').textContent = checkOut || '-';
      document.getElementById('reviewGcashNumber').textContent = gcashNumber || '-';
      document.getElementById('reviewGcashRef').textContent = gcashRef || '-';
      document.getElementById('reviewNights').textContent = nights || 0;
      document.getElementById('reviewPricePerNight').textContent = pricePerNight ? `P${pricePerNight}` : '-';
      document.getElementById('reviewTotalPrice').textContent = totalPrice ? `P${totalPrice}` : '-';
      reviewModal.style.display = 'flex';
    }

    if (editBtn) {
      editBtn.onclick = (ev) => {
        ev.preventDefault();
        reviewModal.style.display = 'none';
      };
    }

    if (confirmBtn) {
      confirmBtn.onclick = async (ev) => {
        ev.preventDefault();
        if (overlay) overlay.classList.add('active');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
        }

        const data = createBookingData(guestName, email, phone, checkIn, checkOut, guests, roomType, requests, gcashNumber, gcashRef, nights, pricePerNight, totalPrice);
        const isFileProtocol = window.location.protocol === 'file:';

        const fallback = () => {
          const localId = saveLocalBooking(data);
          alert(`Booking saved locally (ID: ${localId}).\n\nNote: Run the app on a web server to sync with Firebase.\n\nTo test Firebase:\n1. Enable Realtime Database in your Firebase project\n2. Set Realtime Database rules to allow writes\n3. Run from a web server (not file://)`);
          form.reset();
          reviewModal.style.display = 'none';
          if (overlay) overlay.classList.remove('active');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Complete Booking';
          }
        };

        if (isFileProtocol || !database) {
          fallback();
          return;
        }

        try {
          const submissionPromise = submitBookingToRealtime(data);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout - saving locally')), 5000)
          );
          const bookingRef = await Promise.race([submissionPromise, timeoutPromise]);
          alert(`🎉 Booking Confirmed!\n\nThank you for choosing Kamayan Beach Resort.\n\nYour booking has been successfully submitted.\nReference ID: ${bookingRef.key}\n\nYou will receive a confirmation email shortly with all the details.\n\nWe look forward to welcoming you!`);
          form.reset();
          reviewModal.style.display = 'none';
        } catch (err) {
          console.warn('Firebase submission failed:', err);
          fallback();
        } finally {
          if (overlay) overlay.classList.remove('active');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Complete Booking';
          }
        }
      };
    }
  });
});
