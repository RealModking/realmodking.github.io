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


// document.addEventListener('DOMContentLoaded', function () {
//     // Initialize Firebase
//     const firebaseConfig = {
//         // Your Firebase configuration
//     };
//     firebase.initializeApp(firebaseConfig);

//     // Get post ID from the URL query parameters
//     const urlParams = new URLSearchParams(window.location.search);
//     const postId = urlParams.get('postId');

//     // Reference to the posts collection
//     const postsRef = firebase.firestore().collection('posts');

//     // Get the specific post
//     postsRef.doc(postId).get()
//         .then(doc => {
//             if (doc.exists) {
//                 const post = doc.data();
//                 displayPost(post);
//             } else {
//                 console.error('No such document!');
//             }
//         })
//         .catch(error => {
//             console.error('Error getting document:', error);
//         });

//     // Function to display the post
//     function displayPost(post) {
//         document.getElementById('post-title').textContent = post.title || 'Untitled';
//         document.getElementById('post-content').textContent = post.content || 'No content available.';
//     }
// });






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
    

    async function fetchUserPosts() {
        console.log('Fetching user posts...');
        var postsContainer = document.getElementById('postsContainer');
   
    postsContainer.innerHTML = '';

    try {
        // Fetch posts data from Firestore
        const postsSnapshot = await firestore.collection('posts').get();

        postsSnapshot.forEach(function (postDoc) {
            var post = postDoc.data();
            console.log('Post data:', post); // Log post data to the console
            var postDiv = document.createElement('div');
            postDiv.innerHTML = `
                <p>Post ID: ${post.id}</p>
                <p>User ID: ${post.userId}</p>
                <p>Title: ${post.title}</p>
                <p>Content: ${post.content}</p>
                <!-- Add more fields as needed -->
            `;
            postsContainer.appendChild(postDiv);
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
    }
    }
    