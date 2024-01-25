var firebaseConfig = {
    apiKey: "AIzaSyCDB471aXGIg3bPnhINno3pDWF9R4IaRL8",
    authDomain: "login-b6f02.firebaseapp.com",
    databaseURL: "https://login-b6f02-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "login-b6f02",
    storageBucket: "login-b6f02.appspot.com",
    messagingSenderId: "885646037965",
    appId: "1:885646037965:web:8c53ad60166c07b7662a84",
    measurementId: "G-K783G89QF5"
  };

  firebase.initializeApp(firebaseConfig);




  
  // Reference to the Firestore database
  const db = firebase.firestore();
  
  function updateBio() {
      const bioTextarea = document.getElementById('bioTextarea');
      const newBioText = bioTextarea.value;
  
      // Assume the user is logged in, and you have their UID
      const userId = sessionStorage.getItem("userId"); // Replace with the actual UID of the user
  
      // Update the bio text in the users collection
      db.collection('users').doc(userId).update({
          biotext: newBioText
      })
      .then(() => {
          console.log('Bio updated successfully!');
      })
      .catch((error) => {
          console.error('Error updating bio:', error);
      });
  }


  function updateBio() {
    const bioTextarea = document.getElementById('bioTextarea');
    const newBioText = bioTextarea.value;

    // Assume the user is logged in, and you have their UID
    const userId = sessionStorage.getItem("userId"); // Replace with the actual UID of the user

    // Update the bio text in the users collection
    db.collection('users').doc(userId).update({
        biotext: newBioText
    })
    .then(() => {
        console.log('Bio updated successfully!');
    })
    .catch((error) => {
        console.error('Error updating bio:', error);
    });
}