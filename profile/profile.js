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
// console.log("Firebase initialized successfully");














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
                const UsernameElement = document.getElementById("username");
                const userRankElement = document.getElementById("user-Rank");

                if (userUsernameElement) {
                    userUsernameElement.textContent = userData.name;
                    UsernameElement.textContent = userData.username;
                }

                if (userRankElement) {
                    userRankElement.textContent = userData.Rank;
                }

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











const db = firebase.firestore();






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
                const storageRef = firebase.storage().ref(`profilePictures/${user.uid}/${file.name}`);
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

    document.getElementById("settings-button").addEventListener("click", function() {
        // Redirect the user to the user settings page
        window.location.href = "./userprofilesettings/usersettings.html"; // Replace with the actual path of your settings page
    });

    document.getElementById("submit-a-post").addEventListener("click", function() {
        // Redirect the user to the user settings page
        window.location.href = "./userprofilepostbox/userprofilepostbox.html"; // Replace with the actual path of your settings page
    });





    function displayLinks() {
        const linksContainer = document.getElementById("links-container");
        const user = firebase.auth().currentUser;
    
        if (user) {
            // Fetch link data from Firestore based on user's UID
            db.collection("twitterLinks").doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const linkData = doc.data();
    
                        // Display links in the linksContainer
                        linksContainer.innerHTML = `
                            <a class="link" href="${twitterLinks.user.uid.userData.url}" target="_blank"><i class="fa fa-twitter"></i></a> 
                            <a class="link" href="${linkData.youtubeLinks.user.uid.url}" target="_blank"><i class="fa fa-youtube"></i></a> 
                            <!-- Add other links as needed -->
                        `;
                    } else {
                        console.error("No link data found for the user");
                    }
                })
                .catch((error) => {
                    console.error("Error getting link data:", error);
                });
        }
    }

// Call the displayLinks function when the page loads
document.addEventListener("DOMContentLoaded", function () {
    displayLinks();
});

document.addEventListener("DOMContentLoaded", async function () {
    // Add an authentication state change listener
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is logged in, fetch and display the user's profile
            const userNameElement = document.getElementById("user-name");
            const userEmailElement = document.getElementById("user-email");
            const userIdElement = document.getElementById("user-id");
            const userRankElement = document.getElementById("user-rank");
            const userUsernameElement = document.getElementById("username");
            const UserUsernameElement = document.getElementById("uusername");
            const profilePictureElement = document.getElementById("profile-picture");
            const usertitleElement = document.getElementById("user-title");
            const postsContainer = document.getElementById("user-posts");

            try {
                // Fetch user data from Firestore based on user's UID
                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    userNameElement.textContent = userData.name || "Unknown";
                    userEmailElement.textContent = user.email || "Unknown Email";
                    userIdElement.textContent = user.uid || "Unknown id";
                    userRankElement.textContent = userData.roles || "Unknown Rank";
                    userUsernameElement.textContent = `User Profile: ${userData.username}` || "Unknown Username";
                    UserUsernameElement.textContent = userData.username || "Unknown Username";
                    usertitleElement.textContent = userData.tag || "Unknown tag";
                    postsContainer.textContent = userData.postCount || "No posts found.";
                    

                    // Display profile picture with rounded corners
                    const profilePictureUrl = userData.profilePictureUrl;
                    if (profilePictureElement && profilePictureUrl) {
                        profilePictureElement.src = profilePictureUrl;
                        profilePictureElement.style.borderRadius = "50%";
                        profilePictureElement.style.width = "100px";
                        profilePictureElement.style.height = "100px";

                        profilePictureElement.title = "Edit Profile Picture";
                        // Add event listener to the profile picture for changing the picture
                        profilePictureElement.addEventListener("click", function () {
                            // Trigger file input click
                            document.getElementById("profile-picture-input").click();
                        });
                    }
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

// Function to display user's posts
async function displayUserPosts(userId, container) {
    try {
        const postsSnapshot = await firebase.firestore().collection("user").doc(user.uid).get(postCount);

        if (!postsSnapshot.empty) {
            container.innerHTML = ""; // Clear previous posts

            postsSnapshot.forEach((postDoc) => {
                const post = postDoc.data();
                const postElement = createPostElement(post);
                container.appendChild(postElement);
            });
        } else {
            container.innerHTML = "<p>No posts found.</p>";
        }
    } catch (error) {
        console.error("Error fetching user posts:", error);
    }
}

// Function to create a post element



async function displayUserPosts(userId) {
    try {
        const userPostsElement = document.getElementById("user-posts");

        if (!userPostsElement) {
            console.error("Element with ID 'user-posts' not found");
            return;
        }

        // Fetch and display user posts based on userId
        const userPostsSnapshot = await db.collection("posts").where("userId", "==", userId).get();

        userPostsElement.innerHTML = ""; // Clear previous posts

        userPostsSnapshot.forEach((doc) => {
            const post = doc.data();
            const timestamp = post.timestamp ? post.timestamp.toDate().toLocaleString() : "Unknown";

            const postElement = document.createElement("div");
            postElement.classList.add("user-post");
            postElement.innerHTML = `
                
                <h2>${post.title || "Untitled"}</h2>
                <p>${post.content}</p>
                ${post.imageUrl ? `<img class="post-image" src="${post.imageUrl}" alt="Post Image">` : ''}
                <small>Posted at ${timestamp}</small>
            `;

            userPostsElement.appendChild(postElement);
        });
    } catch (error) {
        console.error("Error fetching user posts:", error);
    }
}

// Usage example: Call this function with the user's UID to display their posts
const userId = "exampleUserId"; // Replace with the actual user ID
displayUserPosts(userId);

