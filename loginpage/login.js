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










// // login.js
// document.addEventListener('DOMContentLoaded', function () {
//     const emailPasswordForm = document.getElementById('emailPasswordForm');
//     const googleLoginButton = document.getElementById('googleLogin');
//     const userInfoDiv = document.getElementById('userInfo');

//     // Email/Password Login
//     emailPasswordForm.addEventListener('submit', function (event) {
//         event.preventDefault();

//         const email = emailPasswordForm.email.value;
//         const password = emailPasswordForm.password.value;

//         firebase.auth().signInWithEmailAndPassword(email, password)
//             .then(userCredential => {
//                 const user = userCredential.user;
//                 displayUserInfo(user);
//             })
//             .catch(error => {
//                 console.error('Login failed:', error.message);
//             });
//     });

//     // Google Login
//     googleLoginButton.addEventListener('click', function () {
//         const provider = new firebase.auth.GoogleAuthProvider();
//         firebase.auth().signInWithPopup(provider)
//             .then(userCredential => {
//                 const user = userCredential.user;
//                 displayUserInfo(user);
//             })
//             .catch(error => {
//                 console.error('Google login failed:', error.message);
//             });
//     });

//     // Display user information
//     function displayUserInfo(user) {
//         userInfoDiv.innerHTML = `
//             <p>Welcome, ${user.displayName || user.email}!</p>
//             <p>User ID: ${user.uid}</p>
//         `;
//     }

//     // Check if the user is already signed in
//     firebase.auth().onAuthStateChanged(user => {
//         if (user) {
//             // User is signed in
//             displayUserInfo(user);
//         } else {
//             // User is signed out
//             userInfoDiv.innerHTML = '<p>User is signed out.</p>';
//         }
//     });
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

        // Reload the page after successful login
        // location.reload();
        alert(`Login successful ${userData.name}`);
        window.location.href = "./profile/profile.html";

        return { success: true, user };
    } catch (error) {
        window.location.href = "./loginpage/login.html"
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
            window.location.href = "./login.html"
            console.error("Auto-login failed: " + error.message);
        }
    }
});

function toggleForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
}



// Example usage during login
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var rememberMe = document.getElementById("remember-me").checked;
    // var buttonlogin = document.getElementById("buttonlogin");

    const loginResult = await loginUser(email, password, rememberMe);


    
    if (loginResult.success) {
        // console.log("Login successful");
        alert("Login successful");
        // buttonlogin.disabled = true
        window.location.href = "../index.html";
    } else {
        console.error("Login failed: " + loginResult.error);
        window.location.href = "../index.html"
        // buttonlogin.disabled = false
    }
});


const resetPasswordButton = document.getElementById('reset-password-button');
resetPasswordButton.addEventListener('click', () => {
  const email = document.getElementById('email').value;

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      // Password reset email sent
      alert('Password reset email sent');
    })
    .catch((error) => {
      // Error occurred
      console.error(error);
      alert(error.message);
    });
});



document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    var email = document.getElementById("signup-email").value;
    var password = document.getElementById("signup-password").value;
    var name = document.getElementById("signup-name").value;
    var username = document.getElementById("signup-username").value;

    try {
        // Create user in Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword( email , password);

        // Get the user ID
        const userId = userCredential.user.uid;

        // Add UID, name, roles, and default profile picture URL to the user document in Firestore
        const profilePictureUrl = "https://cdn.discordapp.com/attachments/716426929074602054/1192906229652144138/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.png?ex=65aac780&is=65985280&hm=30d9e1ebc03178695fc986bea05f75c74a878d0dff758e7df4f1b09b7abb1a74&"; // Replace with your default profile picture URL
        const userIdrandom = generateRandomId();
        await firebase.firestore().collection("users").doc(userId).set({
            uid: userId,
            name: name,
            email: email,
            roles: ["member"],
            profilePictureUrl: profilePictureUrl,
            tag: ["User"],
            username: username,
            followingCount: 0,
            followersCount: 0,
            following: [""],
            profileUserId: userIdrandom,
            verified: false,
            bio: "Sorry you don't have a bio yet.",
            balance: 0,
    
            // test: userIdrandom
            // Add other user data as needed
        });

        // console.log("User signed up successfully");
        alert("User signed up successfully");
    } catch (error) {
        console.error("Sign up failed: " + error.message);
    }
});


// Function to generate a random ID
function generateRandomId() {
    const randomNumber = Math.random().toString().slice(2);
    const randomId = randomNumber.substring(0, 28);
    return randomId;
  }




  var modal = document.getElementById('id01');
  var modal = document.getElementById('id02');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}