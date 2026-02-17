Firebase setup (quick steps)

1. Create a Firebase project
   - Go to https://console.firebase.google.com/ and create a new project.
   - Enable Firestore (in Native mode) in the Database section.

2. Obtain Web App config
   - In Project Settings -> Your apps -> Add web app
   - Copy the Firebase config object (apiKey, authDomain, projectId, ...)

3. Add the config to `firebase.js`
   - Open `firebase.js` and replace the `firebaseConfig` placeholder values with your project's values.

4. Firestore rules (basic)
   - For testing you can allow read/write, but for production lock it down.
   - Example (not for production):
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }

5. Test locally
   - Open `booking.html` in a browser, fill the booking form and submit.
   - Check Firestore Console to see the new document in `bookings` collection.
   - Open `admin.html` to see bookings listed live.

Notes
- The project uses the compat Firebase SDK for simple integration in non-module pages.
- All client-side writes are unauthenticated; for production you should restrict access (add authentication and secure rules).
- If you prefer Realtime Database or a server-side integration, I can help change the implementation.
