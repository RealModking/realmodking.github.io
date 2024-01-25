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
const db = firebase.firestore();
// Get references to the authentication service
var auth = firebase.auth();
// console.log("Firebase initialized successfully");




// user-list.js
document.addEventListener("DOMContentLoaded", function () {
    const userList = document.getElementById("user-list");

    // Assuming you have a function to fetch the user list from Firebase
    function fetchUserList() {
        // Fetch user list and populate userList HTML
        // Example:
        db.collection("users").get().then((querySnapshot) => {
            userList.innerHTML = ""; // Clear previous user list
            querySnapshot.forEach((doc) => {
                const user = doc.data();
                const userCard = createUserCard(user);
                userList.appendChild(userCard);
            });
        });
    }

    // Create a user card HTML element
    function createUserCard(user) {
        const userCard = document.createElement("li");
        
        userCard.classList.add("user-card");

        // Add user details to the card<p>${user.roles}</p>
        userCard.innerHTML = `
            <img src="${user.profilePictureUrl}" alt="Profile Picture" class="profile-picture">
            <h3>Username: ${user.username}</h3>
            <h4>verified: ${user.verified}</h4>
            <p>Rank: ${user.roles}</p>
            <p>Tag: ${user.tag}</p>
            <p>Bio: ${user.bio}</p>
            <p>Followers: ${user.followersCount}</p>
            <!-- Include the necessary HTML elements -->
            <button class="follow-btn" onclick="followUser('${user.uid}')">Follow</button>
            <button class="message-btn" id="openMessageMenu" onclick="sendMessage('${user.uid}')">Message</button>
            <p>Status: ${user.online ? 'Online' : 'Offline'}</p>
        `;

        // Add a click event listener to navigate to the user profile page
        // userCard.addEventListener("click", function () {
        //     // Navigate to the detailed user profile page with user ID
        //     window.location.href = `/userlist/userprofile/userprofile.html?uid=${user.uid}`;
        // });

        return userCard;
        
    }

    
    // Fetch user list on page load
    fetchUserList();

    // Refresh user list when user clicks on "Offline" status
    userList.addEventListener("click", function (event) {
        const target = event.target;
        if (target.tagName === 'P' && target.textContent.includes('Offline')) {
            fetchUserList();
        }
    });
});    

function followUser(uid, followersCount) {
    const user = auth.currentUser;

    // Check if the user is authenticated
    if (!user) {
        console.error("User not authenticated");
        return;
    }

    // Check if the user is trying to follow themselves
    if (user.uid === uid) {
        console.error("Cannot follow yourself");
        return;
    }

    // Reference to the current user's document
    const userDocRef = db.collection("users").doc(user.uid);

    // Reference to the user being followed
    const followedUserDocRef = db.collection("users").doc(uid);

    // Fetch documents using Promise.all
    Promise.all([
        userDocRef.get(),
        followedUserDocRef.get()
    ]).then(([userDoc, followedUserDoc]) => {
        // Check if documents exist
        if (!userDoc.exists || !followedUserDoc.exists) {
            console.log("User documents not found");
            return;
        }

        // Get necessary data from documents
        const followingList = userDoc.data().following || [];
        const followersCount = followedUserDoc.data().followersCount || 0;
        const followingCount = userDoc.data().followingCount || 0;

        if (followingList.includes(uid)) {
            // Already following, unfollow
            return Promise.all([
                userDocRef.update({
                    following: firebase.firestore.FieldValue.arrayRemove(uid),
                    followingCount: Math.max(0, followingCount - 1),
                }),
                followedUserDocRef.update({
                    followersCount: Math.max(0, followersCount - 1),
                })
            ]);
        } else {
            // Not following, follow
            return Promise.all([
                userDocRef.update({
                    following: firebase.firestore.FieldValue.arrayUnion(uid),
                    followingCount: followingCount + 1,
                }),
                followedUserDocRef.update({
                    followersCount: followersCount + 1,
                })
            ]);
        }
    }).then(() => {
        // Reload the page after the follow action is completed
        location.reload();
    }).catch(error => {
        console.error("Error in followUser:", error);
    });
}



function sendMessage(uid) {
    const user = auth.currentUser;

    // Check if the user is authenticated
    if (!user) {
        console.error("User not authenticated");
        return;
    }

    // Check if the user is trying to send a message to themselves
    if (user.uid === uid) {
        console.error("Cannot send a message to yourself");
        return;
    }

    // You can implement your messaging logic here
    // For simplicity, let's just log a message
    console.log(`Sending a message from user ${user.uid} to user ${uid}`);
}

// Example of using the sendMessage function
sendMessage("targetUserId");








// When a user logs in, set their online status to true
auth.onAuthStateChanged(async function (user) {
    if (user) {
        const userRef = db.collection("users").doc(user.uid);
        await userRef.update({ online: true });
    }
});

// When a user logs out, set their online status to false
auth.onAuthStateChanged(async function (user) {
    if (!user) {
        const userRef = db.collection("users").doc(user.uid);
        await userRef.update({ online: false });
    }
});


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
                // const UsernameElement = document.getElementById("username");
                // const userRankElement = document.getElementById("user-Rank");

                if (userUsernameElement) {
                    userUsernameElement.textContent = userData.name;
                    // UsernameElement.textContent = userData.username;
                }

                // if (userRankElement) {
                //     userRankElement.textContent = userData.Rank;
                // }

                // console.log("User data retrieved:", userData);
            } else {
                console.error("User document not found");
            }

            // console.log("Auto-login with Remember Me");
        } catch (error) {
            console.error("Auto-login failed: " + error.message);
        }
    }
});

// Now userData is accessible in the entire script
// You can use userData in other parts of your code if needed
// Function to check if a user is banned
async function isUserBanned(userId) {
    try {
        const userDoc = await firebase.firestore().collection("bannedUsers").doc(userId).get();

        return userDoc.exists; // Return true if the user is banned, false otherwise
    } catch (error) {
        console.error("Error checking if user is banned:", error);
        return false; // Assume not banned in case of an error
    }
}

// Example usage
const userId = sessionStorage.getItem("userId"); // Replace with the actual user ID

isUserBanned(userId).then(isBanned => {
    if (isBanned) {
        console.log("User is banned.");
        // Implement logic for handling a banned user (e.g., display a message, restrict access)
        window.location.href = '../accountdisable/accountdisable.html'
    } else {
        console.log("User is not banned.");
        // Implement logic for handling a non-banned user
    }
});