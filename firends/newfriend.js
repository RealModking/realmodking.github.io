// Replace with your Firebase configuration
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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);






// Get references to the authentication service
var auth = firebase.auth();
console.log("Firebase initialized successfully");




document.addEventListener("DOMContentLoaded", function () {
    const friendsList = document.getElementById("friends-list");

    // Assuming you have a function to fetch the friends list from Firebase
    function fetchFriendsList() {
        // Fetch friends list and populate friendsList HTML
        // Example:
        db.collection("friends").get().then((querySnapshot) => {
            friendsList.innerHTML = ""; // Clear previous friends list
            querySnapshot.forEach((doc) => {
                const friend = doc.data();
                const friendCard = createFriendCard(friend);
                friendsList.appendChild(friendCard);
            });
        });
    }

    // Create a friend card HTML element
    function createFriendCard(friend) {
        const friendCard = document.createElement("li");
        friendCard.classList.add("friend-card");

        // Add friend details to the card
        friendCard.innerHTML = `
            <img src="${friend.profilePictureUrl}" alt="Profile Picture" class="profile-picture">
            <h3>Friend: ${friend.username}</h3>
            <p>Status: ${friend.online ? 'Online' : 'Offline'}</p>
        `;

        return friendCard;
    }

    // Fetch friends list on page load
    fetchFriendsList();

    // Refresh friends list when user clicks on "Offline" status
    friendsList.addEventListener("click", function (event) {
        const target = event.target;
        if (target.tagName === 'P' && target.textContent.includes('Offline')) {
            fetchFriendsList();
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const friendsList = document.getElementById("friends-list");

    // ... rest of your code
});
