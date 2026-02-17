// Booking form Firebase handler
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.booking__form__wrapper form');
  const overlay = document.getElementById('booking-loading');
  const submitBtn = document.getElementById('booking-submit-btn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (overlay) overlay.classList.add('active');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }

    const data = {
      guestName: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      checkIn: document.getElementById('arrival').value,
      checkOut: document.getElementById('departure').value,
      guests: document.getElementById('guests').value,
      roomType: document.getElementById('room-type').value,
      requests: document.getElementById('requests').value.trim(),
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
      return;
    }

    try {
      const ref = await window.firebaseDb.ref('bookings').push(data);
      alert('Booking submitted! Reference ID: ' + ref.key);
      form.reset();
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
  });
});
