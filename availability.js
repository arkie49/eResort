class AvailabilityCalendar {
  constructor() {
    this.currentDate = new Date();
    this.bookings = [];
    this.allRooms = ['standard', 'deluxe', 'family'];
    this.selectedRoom = '';
    this.roomPrices = {
      standard: 499,
      deluxe: 699,
      family: 799
    };
    this.calendarReady = false;
    this.init();
  }

  init() {
    console.log('AvailabilityCalendar: Initializing...');
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    console.log('AvailabilityCalendar: Setting up...');
    try {
      this.attachEventListeners();
      // First render with empty bookings
      console.log('Rendering with 0 bookings initially');
      this.renderCalendar();
      // Then load bookings from Firebase
      console.log('Loading bookings from Firebase...');
      this.loadBookings();
    } catch (error) {
      console.error('AvailabilityCalendar: Setup error:', error);
      this.showError('Failed to initialize calendar. Please refresh the page.');
    }
  }

  attachEventListeners() {
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');
    const filterSelect = document.getElementById('roomFilter');
    
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevMonth());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextMonth());
    if (filterSelect) filterSelect.addEventListener('change', (e) => {
      this.selectedRoom = e.target.value;
      this.renderCalendar();
    });
  }

  async loadBookings() {
    try {
      console.log('AvailabilityCalendar: Loading bookings...');
      
      let attempts = 0;
      while (!window.firebaseDb && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.firebaseDb) {
        console.warn('AvailabilityCalendar: Firebase not initialized yet, retrying...');
        setTimeout(() => this.loadBookings(), 1000);
        return;
      }

      const ref = window.firebaseDb.ref('bookings');
      
      ref.on('value', (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.bookings = Object.keys(data)
            .map(key => ({
              id: key,
              ...data[key]
            }))
            .filter(booking => booking && booking.checkIn && booking.checkOut);
          
          console.log('AvailabilityCalendar: Loaded', this.bookings.length, 'bookings');
          this.bookings.forEach(b => {
            console.log(`  - ${b.guestName} (${b.roomType}): ${b.checkIn} to ${b.checkOut} [${b.status}]`);
          });
        } else {
          console.log('AvailabilityCalendar: No bookings found in database');
          this.bookings = [];
        }
        this.renderCalendar();
      }, (error) => {
        console.error('AvailabilityCalendar: Firebase error:', error);
        this.showError('Note: Using cached data. Real-time updates unavailable.');
      });
    } catch (error) {
      console.error('AvailabilityCalendar: Error loading bookings:', error);
      this.showError('Unable to load live booking data.');
    }
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderCalendar();
  }

  renderCalendar() {
    try {
      const container = document.getElementById('calendarContent');
      if (!container) {
        console.error('AvailabilityCalendar: calendarContent element not found');
        return;
      }
      
      container.innerHTML = '';

      const monthYear = this.currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
      const monthDisplay = document.getElementById('currentMonth');
      if (monthDisplay) {
        monthDisplay.textContent = monthYear;
      }
      const roomsToDisplay = this.selectedRoom 
        ? [this.selectedRoom] 
        : this.allRooms;

      roomsToDisplay.forEach((roomType) => {
        try {
          const roomSection = this.createRoomSection(roomType);
          container.appendChild(roomSection);
        } catch (error) {
          console.error('AvailabilityCalendar: Error creating room section for', roomType, error);
        }
      });

      console.log('AvailabilityCalendar: Calendar rendered successfully');
    } catch (error) {
      console.error('AvailabilityCalendar: Error rendering calendar:', error);
      this.showError('Error rendering calendar. Please refresh the page.');
    }
  }

  createRoomSection(roomType) {
    const section = document.createElement('div');
    section.className = 'room__section';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'room__title';
    const roomNames = {
      standard: 'Standard Room (The "Essentials" Stay)',
      deluxe: 'Deluxe Room (The Mid-Tier Upgrade)',
      family: 'Family Room / Barkada Suite'
    };
    titleDiv.innerHTML = `${roomNames[roomType]} <span class="room__price">₱${this.roomPrices[roomType]}/night</span>`;
    section.appendChild(titleDiv);

    const table = this.createCalendarTable(roomType);
    section.appendChild(table);

    return section;
  }

  createCalendarTable(roomType) {
    const table = document.createElement('table');
    table.className = 'calendar__table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    daysOfWeek.forEach((day) => {
      const th = document.createElement('th');
      th.textContent = day;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    let currentWeek = document.createElement('tr');

    for (let d = new Date(startDate); d <= lastDay; d.setDate(d.getDate() + 1)) {
      if (currentWeek.children.length === 7) {
        tbody.appendChild(currentWeek);
        currentWeek = document.createElement('tr');
      }

      const td = document.createElement('td');
      const dateCell = document.createElement('div');
      dateCell.className = 'date__cell';

      const dateNum = d.getDate();
      const dateStr = d.toISOString().split('T')[0];

      if (d.getMonth() !== this.currentDate.getMonth()) {
        dateCell.classList.add('other-month');
      } else {

        const availability = this.checkAvailability(dateStr, roomType);
        dateCell.classList.add(availability.status);

        if (availability.count > 0) {
          const tooltip = document.createElement('div');
          tooltip.className = 'tooltip';
          tooltip.title = availability.tooltip;
          dateCell.appendChild(tooltip);
        }
      }

      dateCell.innerHTML = `<span class="date__number">${dateNum}</span>`;
      
      if (d.getMonth() === this.currentDate.getMonth()) {
        const badge = document.createElement('span');
        badge.className = 'availability__badge';
        const availability = this.checkAvailability(dateStr, roomType);
        
        if (availability.status === 'available') {
          badge.textContent = 'Available';
        } else if (availability.status === 'booked') {
          badge.textContent = 'Booked';
        } else if (availability.status === 'partial') {
          badge.textContent = 'Limited';
        }
        dateCell.appendChild(badge);
      }

      td.appendChild(dateCell);
      currentWeek.appendChild(td);
    }

    while (currentWeek.children.length < 7) {
      const td = document.createElement('td');
      const dateCell = document.createElement('div');
      dateCell.className = 'date__cell other-month';
      td.appendChild(dateCell);
      currentWeek.appendChild(td);
    }

    tbody.appendChild(currentWeek);
    table.appendChild(tbody);

    return table;
  }

  checkAvailability(dateStr, roomType) {
    try {
      console.log(`Checking availability for ${roomType} on ${dateStr}, Total bookings: ${this.bookings.length}`);

      const overlappingBookings = this.bookings.filter((booking) => {
        if (!booking) {
          return false;
        }

        const bookingRoomType = booking.roomType || booking['room-type'];
        const checkIn = booking.checkIn || booking['check-in'];
        const checkOut = booking.checkOut || booking['check-out'];
        const status = booking.status;

        if (!bookingRoomType || !checkIn || !checkOut) {
          console.warn('Invalid booking structure:', booking);
          return false;
        }

    
        if (status === 'cancelled' || status === 'pending') {
          return false;
        }

        if (bookingRoomType !== roomType) {
          return false;
        }

        const isBooked = dateStr >= checkIn && dateStr < checkOut;
        
        if (isBooked) {
          console.log(`Found booking: ${booking.guestName} at ${bookingRoomType} from ${checkIn} to ${checkOut}`);
        }

        return isBooked;
      });

      if (overlappingBookings.length === 0) {
        return {
          status: 'available',
          count: 0,
          tooltip: 'This room is available on this date'
        };
      } else {
        return {
          status: 'booked',
          count: overlappingBookings.length,
          tooltip: `${overlappingBookings.length} booking(s) on this date`
        };
      }
    } catch (error) {
      console.error('AvailabilityCalendar: Error checking availability:', error);
      return {
        status: 'available',
        count: 0,
        tooltip: 'Unable to determine availability'
      };
    }
  }

  showError(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
      errorContainer.innerHTML = `<div class="error__message">${message}</div>`;
    } else {
      console.error('AvailabilityCalendar Error:', message);
    }
  }
}

console.log('AvailabilityCalendar: Script loaded, initializing...');
let calendar = null;

function initializeCalendar() {
  if (!calendar) {
    calendar = new AvailabilityCalendar();
  }
}

initializeCalendar();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCalendar);
}
