document.addEventListener('DOMContentLoaded', function () {
    const userTagsContainer = document.getElementById('userTags');

    // Initialize Firebase
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

    // Check if the user is authenticated
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            const currentUserId = user.uid;

            // Check if the user is an admin
            checkIfAdmin(currentUserId)
                .then(isAdmin => {
                    if (isAdmin) {
                        // User is an admin, fetch and display user tags
                        fetchUserTags()
                            .then(tags => {
                                // Display user tags in the container
                                displayUserTags(tags);
                            })
                            .catch(error => {
                                console.error('Error fetching user tags:', error);
                            });
                    } else {
                        // User is not an admin, handle accordingly
                        console.log('Access denied. You are not an admin.');
                    }
                })
                .catch(error => {
                    console.error('Error checking admin status:', error);
                });
        } else {
            // User is not logged in, handle accordingly
            console.log('You are not logged in.');
            // You might want to redirect to the login page
        }
    });

    // Function to check if the user is an admin
    function checkIfAdmin(userId) {
        // Implement your logic to check if the user is an admin
        // You might have an "admins" collection in Firestore or another method
        return new Promise((resolve, reject) => {
            // Placeholder logic, replace with your actual implementation
            const isAdmin = true; // Replace with your actual admin check
            resolve(isAdmin);
        });
    }

    // Function to fetch user tags from Firestore
    function fetchUserTags() {
        const usersRef = firebase.firestore().collection('users');

        // Assuming your user data structure includes a 'tags' field
        return usersRef.get()
            .then(querySnapshot => {
                const tags = [];
                querySnapshot.forEach(doc => {
                    const userData = doc.data();
                    const userTags = userData.roles || [];
                    tags.push({ userId: doc.id, userTags });
                });
                return tags;
            });
    }

    // Function to display user tags in the container
    function displayUserTags(tags) {
        tags.forEach(user => {
            const userId = user.userId;
            const userTags = user.userTags;

            // Create a div for each user and display their tags
            const userDiv = document.createElement('div');
            userDiv.innerHTML = `<strong>User ID:</strong> ${userId}<br><strong>User Tags:</strong> ${userTags.join(', ')}<br><br>`;
            userTagsContainer.appendChild(userDiv);
        });
    }
});






function showContent(contentId) {
    var contentSections = document.querySelectorAll('.page-content');
    contentSections.forEach(function (section) {
        section.style.display = 'none';
    });

    var selectedContent = document.getElementById(contentId);
    if (selectedContent) {
        selectedContent.style.display = 'block';
    }

    // If switching to the Users page, display user details from Firestore
    if (contentId === 'usersContent') {
        fetchUserDetails();
    }
}

async function fetchUserDetails() {
    var userDetailsDiv = document.getElementById('userDetails');
    userDetailsDiv.innerHTML = '';

    try {
        // Fetch user data from Firestore
        const usersSnapshot = await firestore.collection('users').get();

        usersSnapshot.forEach(function (userDoc) {
            var user = userDoc.data();
            var userDiv = document.createElement('div');
            userDiv.innerHTML = `<p>User ID: ${user.id}</p><p>Username: ${user.username}</p><p>Tag: ${user.tag}</p>`;
            userDetailsDiv.appendChild(userDiv);
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
}

function addUser() {
    // Implement logic to add a new user to Firestore (for demonstration purposes)
    console.log('Adding a new user');
    // You can show a form or perform any other action to add a user
}