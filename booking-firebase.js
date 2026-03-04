// Booking form Firebase handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.booking__form__wrapper form');
  const overlay = document.getElementById('booking-loading');
  const submitBtn = document.getElementById('booking-submit-btn');
  if (!form) return;

  function parsePriceForRoom(roomType) {
    const prices = {
      standard: 499,
      deluxe: 699,
      family: 799 // use the displayed minimum price for family rooms (P799-P999)
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

    // gather values
    const guestName = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const checkIn = document.getElementById('arrival').value;
    const checkOut = document.getElementById('departure').value;
    const guests = document.getElementById('guests').value;
    const roomType = document.getElementById('room-type').value;
    const requests = document.getElementById('requests').value.trim();

    const nights = calcNights(checkIn, checkOut);
    const pricePerNight = parsePriceForRoom(roomType);
    const totalPrice = nights * pricePerNight;

    // populate review modal
    if (reviewModal) {
      document.getElementById('reviewGuestName').textContent = guestName || '-';
      document.getElementById('reviewEmail').textContent = email || '-';
      document.getElementById('reviewPhone').textContent = phone || '-';
      document.getElementById('reviewRoomType').textContent = roomType || '-';
      document.getElementById('reviewCheckIn').textContent = checkIn || '-';
      document.getElementById('reviewCheckOut').textContent = checkOut || '-';
      document.getElementById('reviewNights').textContent = nights || 0;
      document.getElementById('reviewPricePerNight').textContent = pricePerNight ? `P${pricePerNight}` : '-';
      document.getElementById('reviewTotalPrice').textContent = totalPrice ? `P${totalPrice}` : '-';

      reviewModal.style.display = 'flex';
    }

    // handle edit (close modal)
    if (editBtn) {
      editBtn.onclick = (ev) => {
        ev.preventDefault();
        reviewModal.style.display = 'none';
      };
    }

    //firebase submission
    if (confirmBtn) {
      confirmBtn.onclick = async (ev) => {
        ev.preventDefault();
        if (overlay) overlay.classList.add('active');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting...';
        }

        const data = {
          guestName,
          email,
          phone,
          checkIn,
          checkOut,
          guests,
          roomType,
          requests,
          nights,
          pricePerNight,
          totalPrice,
          status: 'pending',
          createdAt: firebase.database.ServerValue.TIMESTAMP
        };

        if (!window.firebaseDb) {
          alert('Database not configured. Please set up Firebase and refresh.');
          if (overlay) overlay.classList.remove('active');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Complete Booking';
          }
          reviewModal.style.display = 'none';
          return;
        }

        try {
          const ref = await window.firebaseDb.ref('bookings').push(data);
          alert('Booking submitted! Reference ID: ' + ref.key);
          form.reset();
          reviewModal.style.display = 'none';
        } catch (err) {
          console.error(err);
          alert('Failed to submit booking. Check console for details.');
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
