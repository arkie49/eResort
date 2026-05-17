# Button Reference Guide
## eResort - Kamayan Beach Resort

This document provides a comprehensive reference for all buttons in the application with their unique IDs and attributes.

---

## index.html - Buttons

| Button ID | Text | Action | Data Attributes | Location |
|-----------|------|--------|-----------------|----------|
| `header-tour-btn` | Take A Tour | tour | `data-action="tour"` | Header Section |
| `check-availability-btn` | Check Availability | check-availability | `data-action="check-availability"` | Booking Form Section |
| `intro-book-btn` | Book Now | book-now | `data-action="book-now"` | Intro/Video Section |
| `about-book-btn` | Book Now | book-now | `data-action="book-now"` | About Section |

---

## about.html - Buttons

| Button ID | Text | Action | Data Attributes | Location |
|-----------|------|--------|-----------------|----------|
| `about-explore-rooms-btn` | Explore Our Rooms | explore-rooms | `data-action="explore-rooms"` | About Story Section |
| `about-view-rooms-btn` | View Rooms | view-rooms | `data-action="view-rooms"` | CTA Section |
| `about-book-now-btn` | Book Now | book-now | `data-action="book-now"` | CTA Section |

---

## room.html - Buttons

| Button ID | Text | Action | Data Attributes | Location |
|-----------|------|--------|-----------------|----------|
| `view-details-standard` | View Details | view-details | `data-action="view-details"` `data-room="standard"` | Standard Room Card |
| `book-standard-btn` | Book Now | book-now | `data-action="book-now"` `data-room="standard"` | Standard Room Card |
| `view-details-deluxe` | View Details | view-details | `data-action="view-details"` `data-room="deluxe"` | Deluxe Room Card |
| `book-deluxe-btn` | Book Now | book-now | `data-action="book-now"` `data-room="deluxe"` | Deluxe Room Card |
| `view-details-family` | View Details | view-details | `data-action="view-details"` `data-room="family"` | Family Room Card |
| `book-family-btn` | Book Now | book-now | `data-action="book-now"` `data-room="family"` | Family Room Card |
| `room-book-btn` | Book a Room | book-now | `data-action="book-now"` | CTA Section |
| `room-learn-more-btn` | Learn More | learn-more | `data-action="learn-more"` | CTA Section |
| `book-this-room-btn` | Book This Room | book-now | `data-action="book-now"` | Room Detail Modal |
| `modal-back-btn` | Back | N/A | (Navigation button) | Room Detail Modal |

---

## booking.html - Buttons

| Button ID | Text | Action | Data Attributes | Location |
|-----------|------|--------|-----------------|----------|
| `booking-submit-btn` | Complete Booking | submit | N/A | Booking Form |
| `booking-edit-btn` | Edit | edit | N/A | Booking Review Modal |
| `booking-confirm-btn` | Confirm & Submit | confirm | N/A | Booking Review Modal |
| `view-standard-btn` | View Details | view-details | `data-action="view-details"` `data-room="standard"` | Featured Rooms Section |
| `view-deluxe-btn` | View Details | view-details | `data-action="view-details"` `data-room="deluxe"` | Featured Rooms Section |
| `view-family-btn` | View Details | view-details | `data-action="view-details"` `data-room="family"` | Featured Rooms Section |
| `cta-book-btn` | Book Now | book-now | `data-action="book-now"` | CTA Section |

---

## admin.html - Buttons

| Button ID | Text | Action | Data Attributes | Location |
|-----------|------|--------|-----------------|----------|
| `logoutBtn` | Logout | logout | N/A | Admin Header |
| `exportBookings` | Export | export | N/A | Admin Controls |
| `saveChanges` | Save Changes | save | N/A | Booking Modal Actions |
| `confirmBookingEmail` | Confirm & Email | confirm-email | N/A | Booking Modal Actions |
| `deleteBooking` | Delete | delete | N/A | Booking Modal Actions |
| `closeModalBtn` | Close | close | N/A | Booking Modal Actions |
| `closeBookingModal` | Close | close | N/A | Booking Modal Header |

---

## login.html - Buttons

| Button ID | Text | Action | Data Attributes | Location |
|-----------|------|--------|-----------------|----------|
| `loginBtn` | Sign In | login | N/A | Login Form |

---

## JavaScript Integration

Each button now has:
1. **Unique ID** - Allows direct element selection via `document.getElementById()`
2. **data-action attribute** - Classifies button purpose for event delegation
3. **data-room attribute** (optional) - Identifies room type for room-related buttons

### Example: Event Listener Using data-action

```javascript
document.addEventListener('click', function(e) {
  if (e.target.dataset && e.target.dataset.action) {
    const action = e.target.dataset.action;
    const roomType = e.target.dataset.room;
    
    switch(action) {
      case 'book-now':
        console.log(`Booking room: ${roomType || 'general'}`);
        // Handle booking action
        break;
      case 'view-details':
        console.log(`Viewing details for: ${roomType}`);
        // Handle view details action
        break;
      // ... more actions
    }
  }
});
```

### Example: Direct Selection by ID

```javascript
document.getElementById('header-tour-btn').addEventListener('click', function() {
  // Handle tour action
  console.log('User clicked "Take A Tour"');
});
```

---

## Summary

- **Total Buttons**: 37 buttons across all pages
- **Buttons with IDs**: 37 (100%)
- **Buttons with data-action**: 24 (65%)
- **Buttons with data-room**: 6 (16%)

All buttons now have unique identifiers, making it easy to:
- Track button clicks in analytics
- Apply specific event handlers
- Distinguish between different button actions
- Add tracking/logging for user interactions
