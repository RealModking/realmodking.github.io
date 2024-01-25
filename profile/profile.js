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

function updateBio() {
    const newBio = document.getElementById("bio-input").value;
    const userId = firebase.auth().currentUser.uid;

    // Update the user's bio in Firestore
    firebase.firestore().collection("users").doc(userId).update({
        bio: newBio
    })
    .then(() => {
        console.log("Bio successfully updated!");
        // Update the displayed bio on the page
        document.getElementById("user-bio").textContent = newBio;
    })
    .catch(error => {
        console.error("Error updating bio:", error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, get the user object
            const uid = user.uid;

            // Access the user's role and purchased items from Firestore
            const userRef = firebase.firestore().collection('users').doc(uid);

            // Set up a reference to the purchased items collection
            const purchasedItemsRef = userRef.collection('purchasedItems');

            // Change the title based on the user's role
            const titleSelect = document.getElementById('titleSelect');
            const purchasedItemsTitle = document.getElementById('purchasedItemsTitle');
            const purchasedItemsContent = document.getElementById('purchasedItemsContent');

            // Set the default title for members
            purchasedItemsTitle.textContent = 'Member: Purchased Items';

            // Listen for changes in the dropdown selection
            titleSelect.addEventListener('change', () => {
                const selectedItemId = titleSelect.value;
                purchasedItemsTitle.textContent = `Purchased Item: ${titleSelect.options[titleSelect.selectedIndex].text}`;

                // Fetch and display details of the selected purchased item
                fetchAndDisplayPurchasedItemDetails(selectedItemId);
            });

            // Fetch and populate the purchased items in the dropdown
            fetchAndPopulatePurchasedItems();
        } else {
            // User is signed out, handle accordingly
            console.log('User is not signed in.');
        }
    });
});

function fetchAndPopulatePurchasedItems() {
    // Fetch all purchased items (e.g., from Firestore)
    const titleSelect = document.getElementById('titleSelect');
    titleSelect.innerHTML = ''; // Clear previous options

    const purchasedItemsRef = firebase.firestore().collection('purchasedItems');

    purchasedItemsRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // Populate each purchased item in the dropdown
            const itemData = doc.data();
            const optionElement = document.createElement('option');
            optionElement.value = doc.id; // Set the value to the item's document ID
            optionElement.textContent = `${itemData.name} - ${itemData.price}`;
            titleSelect.appendChild(optionElement);
        });
    }).catch((error) => {
        console.error('Error fetching purchased items:', error);
    });
}

function fetchAndDisplayPurchasedItemDetails(selectedItemId) {
    // Fetch details of the selected purchased item (e.g., from Firestore)
    const purchasedItemsContent = document.getElementById('purchasedItemsContent');
    purchasedItemsContent.innerHTML = ''; // Clear previous content

    const purchasedItemRef = firebase.firestore().collection('purchasedItems').doc(selectedItemId);

    purchasedItemRef.get().then((doc) => {
        if (doc.exists) {
            // Display details of the selected purchased item
            const itemData = doc.data();
            purchasedItemsContent.innerHTML = `
                <p><strong>Name:</strong> ${itemData.name}</p>
                <p><strong>Price:</strong> ${itemData.price}</p>
                <p><strong>Description:</strong> ${itemData.description}</p>
                <img src="${itemData.image}" alt="">
                <!-- Add more details as needed -->
            `;
        } else {
            console.log('Purchased item does not exist');
        }
    }).catch((error) => {
        console.error('Error fetching purchased item details:', error);
    });
}

// Get references to the authentication service
var auth = firebase.auth();
// console.log("Firebase initialized successfully");







async function getUserData() {
    firebase.auth().onAuthStateChanged(async function(user) {
       if (user) {
         // User is signed in
         try {
           const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();
           const verified = userDoc.data().verified;
           const userData = userDoc.data();
           console.log(verified); // Log the verified status to the console
           document.getElementById('status').innerHTML = verified ? `${userData.username} <i class="fa fa-check"></i>` :`${userData.username}`; // Update the HTML element with the id 'status'
         } catch (error) {
           console.error(error); // Log any errors to the console
         }
       } else {
         // No user is signed in
         console.log('No user is signed in');
       }
    });
   }
   
   // Call the function to get the user data
   getUserData();







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
            // const UserUsernameElement = document.getElementById("uusername");
            const profilePictureElement = document.getElementById("profile-picture");
            const usertitleElement = document.getElementById("user-title");
            const postsContainer = document.getElementById("user-posts");
            const PointsContainer = document.getElementById("user-points");
            const FollowersContainer = document.getElementById("user-Followers");
            const followingCountCantainer = document.getElementById("user-followingCount");
            const biotextelement = document.getElementById("user-Bio");

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
                    // UserUsernameElement.textContent = userData.username || "Unknown Username";
                    usertitleElement.textContent = userData.tag || "Unknown tag";
                    postsContainer.textContent = userData.postCount || "No posts found.";
                    PointsContainer.textContent = userData.balance || "Sorry you don't have any points.";
                    FollowersContainer.textContent = userData.followersCount || "Sorry you don't have any Followers";
                    followingCountCantainer.textContent = userData.followingCount || "Sorry you are not following any one";
                    biotextelement.textContent = userData.bio || "Sorry you don't have a Bio set.";

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
            window.location.href = "../loginpage/login.html";
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

 function openBiotextModal() {
    const modal = document.getElementById('BiotextModal')
    modal.style.display = 'flex';
 }

 function closeBiotextModal() {
    const modal = document.getElementById('BiotextModal');
    modal.style.display = 'none';
  }
    // Function to open the modal for changing profile picture
    function openChangeProfileModal() {
        const modal = document.getElementById('changePictureModal');
        modal.style.display = 'flex';
        displayPurchasedItemsModal();
      }
  
      // Function to close the modal for changing profile picture
      function closeChangePictureModal() {
        const modal = document.getElementById('changePictureModal');
        modal.style.display = 'none';
      }
  
      // Function to fetch and display purchased items in the modal
      function displayPurchasedItemsModal() {
        const user = auth.currentUser;
  
        if (user) {
          const userRef = db.collection('users').doc(user.uid).collection('purchases');
  
          userRef.get()
            .then(querySnapshot => {
              const purchasedItemsListModal = document.getElementById('purchasedItemsListModal');
              purchasedItemsListModal.innerHTML = '';
  
              querySnapshot.forEach(doc => {
                const purchase = doc.data();
                const listItem = document.createElement('li');
  
                purchase.items.forEach(item => {
                  const itemElement = document.createElement('div');
                  itemElement.innerHTML = `
                    <img src="${item.itemContent}" alt="Item Image" width="60px" height="60px">
                  `;
                  listItem.appendChild(itemElement);
                });
  
                purchasedItemsListModal.appendChild(listItem);
              });
            })
            .catch(error => {
              console.error('Error fetching purchased items:', error);
            });
        }
      }
  
// Function to submit the new profile picture (replace with your logic)
function submitProfilePicture() {
    // Add your logic to handle the profile picture submission here
    alert('profile Picture Updated!');
    closeChangePictureModal(); // Close the modal after submission

    // Display profile picture with rounded corners

    // Add event listener to the profile picture for changing the picture

}

function submitBiotextModal() {
    const newBioText = bioInput.value;
    const uid = firebase.auth().currentUser.uid;
    const bioRef = firebase.database().ref(`users/${uid}/biotext`);

    bioRef.set(newBioText).then(() => {
        console.log('Bio text updated successfully.');
        closeBioModal(); // Close the modal after submission
    }).catch((error) => {
        console.error('Error updating bio text:', error.message);
        // Handle error as needed
    });
}

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

// if (!isLoggedIn) {
//     window.location.href = '../loginpage/login.html'; // Replace with your login page URL
// }


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


