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

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

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
                const UsernameElement = document.getElementById("username");
                const userRankElement = document.getElementById("user-Rank");

                if (userUsernameElement) {
                    userUsernameElement.textContent = userData.name;
                    UsernameElement.textContent = userData.username;
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




// // Example usage during login
// document.getElementById("login-form").addEventListener("submit", async function (event) {
//     event.preventDefault();

//     var email = document.getElementById("email").value;
//     var password = document.getElementById("password").value;
//     var rememberMe = document.getElementById("remember-me").checked;

//     const loginResult = await loginUser(email, password, rememberMe);

//     if (loginResult.success) {
//         console.log("Login successful");
//     } else {
//         console.error("Login failed: " + loginResult.error);
//     }
// });

















// app.js
document.addEventListener("DOMContentLoaded", function () {
    const friendsTab = document.getElementById("friends-tab");

    if (friendsTab) {
        friendsTab.addEventListener("click", function () {
            window.location.href = "friends.html";
        });
    }
    // Add logic for other tabs and functionality
});

document.addEventListener("DOMContentLoaded", async function () {
    // Add an authentication state change listener
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is logged in, fetch and display the user's profile
            const userNameElement = document.getElementById("user-name");
            // const userEmailElement = document.getElementById("user-email");
            // const userIdElement = document.getElementById("user-id");
            // const userRankElement = document.getElementById("user-rank");
            const userUsernameElement = document.getElementById("username");
            const profilePictureElement = document.getElementById("profile-picture");
            // const usertitleElement = document.getElementById("user-title");
            const postsContainer = document.getElementById("user-posts");
            const followercount = document.getElementById("user-Followers");
            

            try {
                // Fetch user data from Firestore based on user's UID
                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    userNameElement.textContent = userData.name || "Unknown";
                    // userEmailElement.textContent = user.email || "Unknown Email";
                    // userIdElement.textContent = user.uid || "Unknown id";
                    // userRankElement.textContent = userData.roles || "Unknown Rank";
                    userUsernameElement.textContent = userData  .username || "Unknown Username";
                    // usertitleElement.textContent = userData.tag || "Unknown tag";
                    postsContainer.textContent = userData.postCount || "No posts found.";
                    followercount.textContent = userData.Followers || "No Followers"

                    // Display profile picture with rounded corners
                    const profilePictureUrl = userData.profilePictureUrl;
                    if (profilePictureElement && profilePictureUrl) {
                        profilePictureElement.src = profilePictureUrl;
                        // profilePictureElement.style.borderRadius = "50%";
                        profilePictureElement.style.width = "100px";
                        profilePictureElement.style.height = "100px";


                        profilePictureElement.title = "Edit Profile Picture";
                        // Add event listener to the profile picture for changing the picture
                        profilePictureElement.addEventListener("click", function () {
                            // Trigger file input click
                            document.getElementById("profile-picture-input").click();
                        });
                    }
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

// Add event listener to the file input for handling file selection
const profilePictureInput = document.getElementById("profile-picture-input");
if (profilePictureInput) {
    profilePictureInput.addEventListener("change", handleProfilePictureChange);
}

    async function handleProfilePictureChange(event) {
        const user = firebase.auth().currentUser;
        const file = event.target.files[0];
    
        if (user && file) {
            try {
                const storageRef = firebase.storage().ref(`profilePictureUrl/${user.uid}/${file.name}`);
                await storageRef.put(file);
                const imageUrl = await storageRef.getDownloadURL();
    
                // Update the user's profile picture URL in Firestore
                await firebase.firestore().collection("users").doc(user.uid).update({
                    profilePictureUrl: imageUrl,
                });
    
                // Display the updated profile picture
                const profilePictureElement = document.getElementById("profile-picture");
                if (profilePictureElement) {
                    profilePictureElement.src = imageUrl;
                }
            } catch (error) {
                console.error("Error updating profile picture:", error);
            }
        }
    }

   
    function submitLinkToFirebase(title, url, platform) {
        const user = firebase.auth().currentUser;
    
        if (user) {
            const linkData = {
                title: title,
                url: url,
                userId: user.uid
            };
    
            // Choose the appropriate collection based on the platform
            const collectionName = platform === 'twitter' ? 'twitterLinks' : 'youtubeLinks';
    
            db.collection(collectionName).doc(user.uid).set(linkData)
                .then(() => {
                    console.log("Link submitted successfully");
                })
                .catch((error) => {
                    console.error("Error submitting link:", error);
                });
        } else {
            console.error("User not logged in");
        }
    }
    

   