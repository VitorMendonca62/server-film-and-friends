const admin = require('firebase-admin');

const serviceAccount = require('../../movieandfriends-4dd41-firebase-adminsdk-nxijw-1eeff3134c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseConfig = {
  apiKey: 'AIzaSyBxO_ezqafercRtmDQQULiGwkpSWR5n2Yw',
  authDomain: 'movieandfriends-4dd41.firebaseapp.com',
  projectId: 'movieandfriends-4dd41',
  storageBucket: 'movieandfriends-4dd41.appspot.com',
  messagingSenderId: '302692697354',
  appId: '1:302692697354:web:27232a48d54949ba1166f3',
  measurementId: 'G-GWQW9CTMFZ',
};

const usersRef = admin.firestore().collection('users');

module.exports = { admin, usersRef };
