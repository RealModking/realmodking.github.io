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
                window.location.href = "../loginpage/login.html";
            }

            // console.log("Auto-login with Remember Me");
        } catch (error) {
            console.error("Auto-login failed: " + error.message);
            window.location.href = "../loginpage/login.html";
        }
    }
});


function signOut() {
    firebase.auth().signOut()
        .then(() => {
            console.log('User signed out successfully');

            // Clear user data from session storage
            // sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userAuthenticated');
            sessionStorage.removeItem('IsThisFirst Time_Log_From_LiveServer')

            // Fetch online toggle from Firebase
            var onlineToggleRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/online');
            onlineToggleRef.once('value').then(function (snapshot) {
                var onlineToggle = snapshot.val();

                // Check if the user was online before signing out
                if (onlineToggle) {
                    // Set the user's online status to offline in Firebase
                    var userStatusRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/online');
                    userStatusRef.set({
                        state: 'offline',
                        lastChanged: firebase.database.ServerValue.TIMESTAMP
                    });
                }
            });

            window.location.href = "../loginpage/login.html";
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
}

if (!isLoggedIn) {
    window.location.href = '../loginpage/login.html'; // Replace with your login page URL
}


firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in, continue with your code or allow access to the page
        // console.log('User is signed in:', user);
    } else {
        // User is not signed in, redirect to the login page
        console.log('User is not signed in. Redirecting to login page...');
        window.location.href = '../loginpage/login.html'; // Replace '/login' with the actual path to your login page
    }
});