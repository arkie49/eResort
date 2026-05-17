Firebase setup (quick steps)

1. Create a Firebase project
   - Go to https://console.firebase.google.com/ and create a new project.
   - Enable Realtime Database in the Database section.

2. Obtain Web App config
   - In Project Settings -> Your apps -> Add web app
   - Copy the Firebase config object (apiKey, authDomain, projectId, ...)

3. Add the config to `firebase-config.js`
   - Open `firebase-config.js` and replace the placeholder values with your Firebase project's values.

4. Realtime Database rules (basic)
   - This project uses Realtime Database in the browser with the modular SDK.
   - For testing you can allow read/write, but for production lock it down.
   - Example Realtime Database rules (not for production):
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
   - If you see a permission denied error when submitting bookings, update these rules in the Firebase Console under Realtime Database -> Rules.

5. EmailJS Setup for Booking Confirmations
   - Create an EmailJS account at https://www.emailjs.com/
   - Create a new email service (Gmail, Outlook, etc.)
   - Create a new email template using the content from `emailjs-template.txt`
   - Get your Service ID, Template ID, and Public Key from the EmailJS dashboard
   - Update the constants in `admin.js`:
     - `EMAILJS_SERVICE_ID`
     - `EMAILJS_TEMPLATE_ID`
     - `EMAILJS_PUBLIC_KEY`

6. Test locally
   - Run a local web server (do not use `file://`) and open `booking.html` from `http://localhost...`.
   - Fill the booking form and submit.
   - Check Realtime Database Console to see the new booking in the `bookings` node.
   - Open `admin.html` to see bookings listed live and confirm them to send emails.

Notes
- Realtime Database may fail from `file://` pages. Use a local HTTP server such as `python -m http.server` or VS Code Live Server.
- The project now uses the modular Realtime Database SDK in `firebase.js`.
- All client-side writes are unauthenticated; for production you should restrict access (add authentication and secure rules).
- Email confirmations are sent automatically when bookings are confirmed in the admin panel.
