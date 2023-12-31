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



// Function to handle user login
// async function loginUser(email, password, rememberMe) {
//     try {
//         const userCredential = await auth.signInWithEmailAndPassword(email, password);
//         const user = userCredential.user;

//         // Store user authentication status in sessionStorage
//         sessionStorage.setItem("userAuthenticated", "true");

//         // Store the user ID in sessionStorage if "Remember Me" is checked
//         if (rememberMe) {
//             sessionStorage.setItem("userId", user.uid);
//         }

//         return { success: true, user };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// Function to handle user login
async function loginUser(email, password, rememberMe) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Store user authentication status in sessionStorage
        sessionStorage.setItem("userAuthenticated", "true");

        // Store the user ID in sessionStorage if "Remember Me" is checked
        if (rememberMe) {
            sessionStorage.setItem("userId", user.uid);
        }

        // Reload the page after successful login
        location.reload();

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


// Function to check authentication status on page load
let userData; // Declare userData in a higher scope

document.addEventListener("DOMContentLoaded", async function () {
    const userAuthenticated = sessionStorage.getItem("userAuthenticated");
    const userId = sessionStorage.getItem("userId");

    if (userAuthenticated === "true" && userId) {
        try {
            // User is already authenticated, no need to sign in again
            // Retrieve user data from Firestore
            const userDoc = await firebase.firestore().collection("users").doc(userId).get();

            if (userDoc.exists) {
                // Access user's data
                userData = userDoc.data();

                // Display username and rank in HTML elements
                const userUsernameElement = document.getElementById("user-username");
                const userRankElement = document.getElementById("user-Rank");

                if (userUsernameElement) {
                    userUsernameElement.textContent = userData.name;
                }

                if (userRankElement) {
                    userRankElement.textContent = userData.Rank;
                }

                console.log("User data retrieved:", userData);
            } else {
                console.error("User document not found");
            }

            console.log("Auto-login with Remember Me");
        } catch (error) {
            console.error("Auto-login failed: " + error.message);
        }
    }
});

// Now userData is accessible in the entire script
// You can use userData in other parts of your code if needed




document.addEventListener("DOMContentLoaded", async function () {
    // Add an authentication state change listener
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            try {
                // Fetch user data from Firestore based on user's UID
                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    // Rest of your code that uses userData
                } else {
                    console.error("User document not found");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        } else {
            // User is not logged in, redirect to the login page or handle accordingly
            window.location.href = "login.html";
        }
    });
});




// friends.js
document.addEventListener("DOMContentLoaded", async function () {
    const user = firebase.auth().currentUser;
    const friendsList = document.getElementById("friends-list");

    if (user) {
        try {
            // Fetch user data from Firestore based on user's UID
            const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                const friends = userData.friends || [];
                const incomingRequests = userData.incomingRequests || [];

                // Display friends
                friendsList.innerHTML = ""; // Clear existing content

                friends.forEach(async (friendId) => {
                    // Fetch friend data from Firestore
                    const friendDoc = await firebase.firestore().collection("users").doc(friendId).get();

                    if (friendDoc.exists) {
                        const friendData = friendDoc.data();

                        // Create friend card HTML
                        const friendCard = document.createElement("div");
                        friendCard.classList.add("friend-card");
                        friendCard.innerHTML = `
                            <img src="${friendData.profilePictureUrl || "default-profile-pic.jpg"}" alt="Friend Profile Picture" class="friend-profile-picture">
                            <h3>${friendData.username}</h3>
                            <p>${friendData.roles || "Unknown Rank"}</p>
                            <!-- Add other friend details as needed -->
                        `;

                        // Add friend card to the container
                        friendsList.appendChild(friendCard);
                    } else {
                        console.error(`Friend document not found for user with ID: ${friendId}`);
                    }
                });

                // Display incoming friend requests
                const incomingRequestsContainer = document.getElementById("incoming-requests-container");
                incomingRequestsContainer.innerHTML = ""; // Clear existing content

                incomingRequests.forEach(async (requestId) => {
                    // Fetch friend request data from Firestore
                    const requestDoc = await firebase.firestore().collection("users").doc(requestId).get();

                    if (requestDoc.exists) {
                        const requestData = requestDoc.data();

                        // Create friend request card HTML
                        const requestCard = document.createElement("div");
                        requestCard.classList.add("friend-request-card");
                        requestCard.innerHTML = `
                            <img src="${requestData.profilePictureUrl || "default-profile-pic.jpg"}" alt="Requester Profile Picture" class="requester-profile-picture">
                            <h3>${requestData.username}</h3>
                            <button onclick="acceptFriendRequest('${requestId}')">Accept</button>
                            <button onclick="rejectFriendRequest('${requestId}')">Reject</button>
                        `;

                        // Add request card to the container
                        incomingRequestsContainer.appendChild(requestCard);
                    } else {
                        console.error(`Friend request document not found for user with ID: ${requestId}`);
                    }
                });
            } else {
                console.error("User document not found");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        // User is not logged in, redirect to the login page or handle accordingly
        window.location.href = "login.html";
    }
});

// Function to send friend request
function sendFriendRequest(targetUserId) {
    const user = firebase.auth().currentUser;
    if (user) {
        // Add target user to the incoming requests of the target user
        db.collection("users").doc(targetUserId).update({
            incomingRequests: firebase.firestore.FieldValue.arrayUnion(user.uid)
        });
        console.log("Friend request sent successfully");
    } else {
        console.error("User not logged in");
    }
}

// Function to accept friend request
function acceptFriendRequest(requesterUserId) {
    const user = firebase.auth().currentUser;
    if (user) {
        // Remove requester from incoming requests
        db.collection("users").doc(user.uid).update({
            incomingRequests: firebase.firestore.FieldValue.arrayRemove(requesterUserId)
        });

        // Add requester to friends list
        db.collection("users").doc(user.uid).update({
            friends: firebase.firestore.FieldValue.arrayUnion(requesterUserId)
        });

        // Add user to requester's friends list
        db.collection("users").doc(requesterUserId).update({
            friends: firebase.firestore.FieldValue.arrayUnion(user.uid)
        });

        console.log("Friend request accepted successfully");
    } else {
        console.error("User not logged in");
    }
}

// Function to reject friend request
function rejectFriendRequest(requesterUserId) {
    const user = firebase.auth().currentUser;
    if (user) {
        // Remove requester from incoming requests
        db.collection("users").doc(user.uid).update({
            incomingRequests: firebase.firestore.FieldValue.arrayRemove(requesterUserId)
        });
        console.log("Friend request rejected successfully");
    } else {
        console.error("User not logged in");
    }
}







const db = firebase.firestore();













document.addEventListener("DOMContentLoaded", async function () {
    // Add an authentication state change listener
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is logged in, fetch and display the list of friends
            const friendsList = document.getElementById("friend-requests-list");

            // Example: Fetch friends from Firestore based on user's data
            const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
            const friends = userDoc.exists ? userDoc.data().friends || [] : [];

            // Display friends in the list
            friendsList.innerHTML = "";
            friends.forEach((friend) => {
                const listItem = document.createElement("li");
                listItem.textContent = friend.name;
                friendsList.appendChild(listItem);
            });
        } else {
            // User is not logged in, redirect to the login page or handle accordingly
            window.location.href = "login.html";
        }
    });
});



