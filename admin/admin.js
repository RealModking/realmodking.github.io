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


firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in, continue with your code or allow access to the page
        // console.log('User is signed in:', user);
    } else {
        // User is not signed in, redirect to the login page
        console.log('User is not signed in. Redirecting to login page...');
        window.location.href = './loginpage/login.html'; // Replace '/login' with the actual path to your login page
    }
});

// Function to check if the user is an admin
function checkIfAdmin() {
    return new Promise((resolve, reject) => {
        const currentUserId = firebase.auth().currentUser.uid;

        // Placeholder logic, replace with your actual implementation
        // For example, check if the user ID is present in an "admins" collection
        const adminRef = firebase.firestore().collection('users').doc(currentUserId);

        adminRef.get()
            .then(doc => {
                const isAdmin = doc.exists;
                alert(`Welcome: ${user.uid}`)
                resolve(isAdmin);
            })
            .catch(error => {
                console.error('Error checking admin status:', error);
                window.location.href = '../index.html';
                reject(error);
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, get the user object
            const uid = user.uid;

            // Access the user's role from Firestore
            const userRef = firebase.firestore().collection('users').doc(uid);

            userRef.get().then((doc) => {
                if (doc.exists) {
                    const userRole = doc.data().role;

                    // Show the admin button only to admins
                    if (userRole === 'admin') {
                        alert(`Welcome: ${user.uid}`)
                    }
                } else {
                    console.log('User document does not exist');
                    window.location.href = '../index.html';
                }
            }).catch((error) => {
                console.error('Error getting user document:', error);
            });
        } else {
            // User is signed out, handle accordingly
            console.log('User is not signed in.');
        }
    });
});






// Function to ban a user
async function banUser(userId) {
    const currentUser = firebase.auth().currentUser;
    
    // Check if the current user is an admin or owner
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'owner')) {
        alert("Admins and owners cannot be banned.");
        return;
    }

    const banReason = prompt("Enter the reason for banning:");

    if (banReason !== null) {
        const userRef = firebase.firestore().collection("bannedUsers").doc(userId);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            // Document exists, check if the current user is an admin or owner
            if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'owner')) {
                // Admins and owners can cancel bans
                await userRef.update({
                    banned: false,
                    banReason: null,
                });
            } else {
                // Regular users can't cancel bans
                alert("You don't have permission to cancel this ban.");
                return;
            }
        } else {
            // Document doesn't exist, create a new one
            const user = await getUserInfo(userId);
            await userRef.set({
                banned: true,
                banReason: banReason,
                userId: userId,
                name: user.name,
                email: user.email,
            });
        }

        displayUsers(); // Refresh the user list after banning
    }
}






// Function to get user information
async function getUserInfo(userId) {
    const userDoc = await firebase.firestore().collection("users").doc(userId).get();
    return userDoc.exists ? userDoc.data() : null;
}


// Function to unban a user
async function unbanUser(userId) {
    try {
        // Remove the user from the bannedUsers collection
        await firebase.firestore().collection("bannedUsers").doc(userId).delete();
        unbanUser = alert(`unbanned: ${userId}`)
        // Refresh the user list after unbanning
        displayUsers();
        window.location.href = "admin.html";
    } catch (error) {
        console.error("Error unbanning user:", error);
    }
}

// Function to display the list of users on the admin page
function displayUsers() {
    const usersContainer = document.getElementById("users-container");

    firebase.firestore().collection("users").get()
        .then(snapshot => {
            usersContainer.innerHTML = "";

            snapshot.forEach(doc => {
                const user = doc.data();

                const userElement = document.createElement("div");
                userElement.classList.add("user");

                userElement.innerHTML = `
                    <p>User ID: ${doc.id}</p>
                    <p>Name: ${user.name || "Unknown"}</p>
                    <p>Email: ${user.email || "Unknown"}</p>
                    <p>Role: ${user.role || "User"}</p>
                    <p>Role: ${user.banReason || "Unknown"}</p>
                    <button onclick="banUser('${doc.id}')">Ban</button>
                    <button onclick="unbanUser('${doc.id}')">Unban</button>
                    <hr>
                `;

                usersContainer.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error("Error getting users:", error);
        });
}



// Call the function to display users on page load or as needed
document.addEventListener('DOMContentLoaded', () => {
    displayUsers();
});
