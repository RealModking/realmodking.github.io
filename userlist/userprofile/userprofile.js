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


// userprofile.js

document.addEventListener("DOMContentLoaded", function () {
    const userDetailContainer = document.getElementById("user-details");

    // Extract user ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("uid");

    // Assuming you have a function to fetch detailed user information from Firebase
    function fetchUserDetails(userId) {
        db.collection("users").doc(userId).get().then((doc) => {
            if (doc.exists) {
                const user = doc.data();
                displayUserDetails(user);
            } else {
                console.error("User not found");
            }
        }).catch((error) => {
            console.error("Error fetching user details:", error);
        });
    }

    // Display user details on the page 
    // <img src="${user.profilePictureUrl}" alt="Profile Picture" class="profile-picture">
    //<h3>Username: ${user.username}</h3>
    // <img src="${user.profilePictureUrl}" width="200" alt="Profile Picture" class="profile-picture">
            
    // <h3 class="user-name">${user.username}</h3>
    // <p>Name:${user.name} </p>
    // <p>Rank: ${user.roles}</p>
    // <p>Tag: ${user.tag}</p>
    // <p id="followersCount">Followers: ${user.Followers}</p>
    // <p id="followingCount">following: ${user.following}</p>
    // <p>Status: ${user.online ? 'Online' : 'Offline'}</p>
    //                <button class="chatbtn" id="chatBtn"><i class="fa fa-comment"></i> Chat</button>              <div class="myDIV">Hover over me to display the profilepageId</div>
              // <div class="hide"><p class="user-mail"><i class="fa fa-envelope"></i> <span id="">${user.profileUserId}</span></p></div>  
    //<button class="createbtn" id="Create-post"><i class="fa fa-plus"></i> Friend request</button>  Lorem ipsum dolor sit amet, hello how consectetur adipisicing elit. Sint consectetur provident magni yohoho consequuntur, voluptatibus ghdfff exercitationem at quis similique. Optio, amet!

    function displayUserDetails(user) {
        userDetailContainer.innerHTML = `
        
        <div class="container" id="user-details">
        <div class="profile-header">
          <div class="profile-img">
            <img  width="200" id="profilePicture" src="${user.profilePictureUrl}" alt="Profile Picture">
          </div>
          <div class="profile-nav-info">
            <h3 class="user-name">username:${user.username}</h3>
            <p  id="state" class="state">Rank:${user.roles}</p>
            <div class="address">
              <p id="state" class="state">@${user.name}</p>
              <span id="country" class="country"></span>
            </div>
          </div>
        </div>
        <div class="main-bd">
          <div class="left-side">
            <div class="profile-side">
              <div class="myDIV">Hover over me to display the verified user.</div>
              <div class="hide"><p class="user-mail"><i class="fa fa-envelope"></i> <span id="">verified  ${user.verified}</span></p></div>              
              <p class="mobile-no"><i class="fa fa-phone"></i></p>
      
              <br>      
            
              <div class="user-bio">
                <h3>Bio</h3>
                <p class="bio">
                  
                </p>
              </div>
              <div class="profile-btn">

              </div>

            </div>
      
          </div>
          <div class="right-side">
      
            <div class="nav">
              <ul>
                <li onclick="tabs(0)" class="user-post active">Posts</li>
                <li onclick="tabs(1)" class="user-review">Reviews</li>
                <li onclick="tabs(2)" class="user-setting"> Settings</li>
              </ul>
            </div>
            <div class="profile-body">
              <div class="profile-posts tab">
                <h1>Your Post</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa quia sunt itaque ut libero cupiditate ullam qui velit laborum placeat doloribus, non tempore nisi ratione error rem minima ducimus. Accusamus adipisci quasi at itaque repellat sed
                  magni eius magnam repellendus. Quidem inventore repudiandae sunt odit. Aliquid facilis fugiat earum ex officia eveniet, nisi, similique ad ullam repudiandae molestias aspernatur qui autem, nam? Cupiditate ut quasi iste, eos perspiciatis maiores
                  molestiae.</p>
              </div>
              <div class="profile-reviews tab">
                <h1>User reviews</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam pariatur officia, aperiam quidem quasi, tenetur molestiae. Architecto mollitia laborum possimus iste esse. Perferendis tempora consectetur, quae qui nihil voluptas. Maiores debitis
                  repellendus excepturi quisquam temporibus quam nobis voluptatem, reiciendis distinctio deserunt vitae! Maxime provident, distinctio animi commodi nemo, eveniet fugit porro quos nesciunt quidem a, corporis nisi dolorum minus sit eaque error
                  sequi ullam. Quidem ut fugiat, praesentium velit aliquam!</p>
              </div>
              <div class="profile-settings tab">
                <div class="account-setting">
                  <h1>Acount Setting</h1>
                  <p>adsadLorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit omnis eaque, expedita nostrum, facere libero provident laudantium. Quis, hic doloribus! Laboriosam nemo tempora praesentium. Culpa quo velit omnis, debitis maxime, sequi
                    animi dolores commodi odio placeat, magnam, cupiditate facilis impedit veniam? Soluta aliquam excepturi illum natus adipisci ipsum quo, voluptatem, nemo, commodi, molestiae doloribus magni et. Cum, saepe enim quam voluptatum vel debitis
                    nihil, recusandae, omnis officiis tenetur, ullam rerum.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            <!-- Add other user details as needed -->
        `;
    }

    // Fetch and display user details on page load
    fetchUserDetails(userId);
});





// document.addEventListener("DOMContentLoaded", function () {
//     const sendFriendRequestButton = document.getElementById("sendFriendRequestButton");

//     if (sendFriendRequestButton) {
//         sendFriendRequestButton.addEventListener("click", async function () {
//             // Assuming you have a function to get the profile user ID
//             const profileUserId = getProfileUserId();

//             if (profileUserId) {
//                 try {
//                     await sendFriendRequest(profileUserId);
//                     console.log("Friend request sent successfully!");
//                 } catch (error) {
//                     console.error("Error sending friend request:", error);
//                 }
//             } else {
//                 console.error("Profile user ID not available");
//                 // You can add logic here to handle when the profile user ID is not available
//             }
//         });
//     } else {
//         console.error("Button with ID 'sendFriendRequestButton' not found");
//     }

//     // Function to get the profile user ID (you need to implement this based on your logic)
//     function getProfileUserId() {
//         // Implement your logic to get the profile user ID
//         // e.g., using URL parameters or other methods
//         // For example, if you are using URL parameters:
//         const urlParams = new URLSearchParams(window.location.search);
//         return urlParams.get("uid"); // Adjust the parameter name as needed
//     }

//     // Function to send friend request (copy the function from the previous response)
//     async function sendFriendRequest(receiverId) {
//         // Copy the sendFriendRequest function code here
//             const senderId = firebase.auth().currentUser.uid;
        
//             // Check if the friend request already exists
//             const existingRequest = await db.collection("users").doc(receiverId).collection("friends")
//                 .where("senderId", "==", senderId)
//                 .where("status", "==", "pending")
//                 .get();
        
//             if (existingRequest.empty) {
//                 // Create a new friend request
//                 await db.collection("users").doc(receiverId).collection("friends").add({
//                     status: "pending",
//                     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
//                     senderId: senderId,
//                     // other relevant data
//                 });
        
//                 console.log("Friend request sent!");
//             } else {
//                 console.log("Friend request already sent.");
//             }
//         }
// });







async function acceptFriendRequest(requestId) {
    const userId = firebase.auth().currentUser.uid;

    // Update the friend request status to "accepted"
    await db.collection("users").doc(userId).collection("friends").doc(requestId).update({
        status: "accepted",
    });

    // Perform any additional actions, e.g., add the friend to the user's friend list
    console.log("Friend request accepted!");
}


async function acceptFriendRequest(requestId) {
    const userId = firebase.auth().currentUser.uid;

    // Get the friend request details
    const requestSnapshot = await db.collection("users").doc(userId).collection("friends").doc(requestId).get();
    const { senderId } = requestSnapshot.data();

    // Update the friend request status to "accepted"
    await db.collection("users").doc(userId).collection("friends").doc(requestId).update({
        status: "accepted",
    });

    // Add a notification for the user who sent the friend request
    await db.collection("notifications").add({
        userId: senderId,
        content: "Your friend request has been accepted by [friendName]",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        // other relevant data
    });

    console.log("Friend request accepted!");
}



// // Get the current URL
// const currentUrl = window.location.href;

// // Extract the userId from the URL using a regular expression
// const userIdMatch = currentUrl.match(/\/profiles\/([^\/?#]+)/);

// // Check if userIdMatch is not null, and get the userId from the first capturing group
// const profileUserId = userIdMatch ? userIdMatch[1] : null;

// console.log('Profile User ID:', profileUserId);

// document.addEventListener('DOMContentLoaded', function () {
//     const followButton = document.getElementById('followButton');
//     const followersCount = document.getElementById('followersCount');
//     const followingCount = document.getElementById('followingCount');

//     // Check if the user is authenticated
//     firebase.auth().onAuthStateChanged(user => {
//         if (user) {
//             // User is signed in
//             const currentUserId = user.uid;

//             // Get the profileUserId from the URL
//             const urlParams = new URLSearchParams(window.location.search);
//             const profileUserId = urlParams.get('userId') || currentUserId;

//             // Disable the follow button if the user is viewing their own profile
//             if (currentUserId === profileUserId) {
//                 followButton.disabled = false;
//             }

//             // Check if the current user is already following the profile user
//             checkIfFollowing(currentUserId, profileUserId);

//             // Add click event listener to handle follow/unfollow
//             followButton.addEventListener('click', () => {
//                 toggleFollow(currentUserId, profileUserId);
//             });

//             // Display the number of followers and following
//             displayFollowersCount(profileUserId);
//             displayFollowingCount(currentUserId);
//         } else {
//             // User is signed out, handle accordingly
//             // For example, you might redirect to the login page
//         }
//     });

//     // Function to check if the current user is following the profile user
//     // ... (Same as before)

//     // Function to toggle follow/unfollow
//     // ... (Same as before)

//     // Function to display the number of followers
//     function displayFollowersCount(profileUserId) {
//         const userRef = firebase.firestore().collection('users').doc(profileUserId);

//         userRef.get()
//             .then(doc => {
//                 if (doc.exists) {
//                     const followers = doc.data().followers || [];
//                     followersCount.textContent = followers.length;
//                 } else {
//                     console.error('User document does not exist.');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error getting user document:', error);
//             });
//     }

//     // Function to display the number of following
//     function displayFollowingCount(currentUserId) {
//         const userRef = firebase.firestore().collection('users').doc(currentUserId);

//         userRef.get()
//             .then(doc => {
//                 if (doc.exists) {
//                     const following = doc.data().following || [];
//                     followingCount.textContent = following.length;
//                 } else {
//                     console.error('User document does not exist.');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error getting user document:', error);
//             });
//     }
// });





// Trigger this function when the user submits the verification code
function verifyCode(code) {
    const uid = firebase.auth().currentUser.uid;

    // Check the code against the stored code in Firestore
    const verificationCodesRef = firebase.firestore().collection('verificationCodes').doc(uid);

    verificationCodesRef.get().then(doc => {
        if (doc.exists) {
            const storedCode = doc.data().code;

            if (code === storedCode) {
                // Code is correct, update user claims or perform necessary actions
                firebase.auth().currentUser.getIdToken(true).then(token => {
                    // Update user's custom claims
                    return fetch('/verify', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ idToken: token }),
                    });
                }).then(response => {
                    if (response.ok) {
                        console.log('User is verified!');
                        // Display the verified badge or perform other actions
                    } else {
                        console.error('Failed to update user verification status');
                    }
                }).catch(error => {
                    console.error('Error updating user verification status:', error);
                });
            } else {
                console.log('Incorrect code');
            }
        } else {
            console.log('Verification code not found');
        }
    }).catch(error => {
        console.error('Error retrieving verification code:', error);
    });
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
                const UserUsernameElement = document.getElementById("user-uusername");
                const userRankElement = document.getElementById("user-Rank");

                if (userUsernameElement) {
                    userUsernameElement.textContent = userData.name;
                }
                if (UserUsernameElement) {
                  UserUsernameElement.textContent = `Profile - ${userData.username}`;
              }
                if (userRankElement) {
                  UserUsernameElement.textContent = userData.Rank;
                }

                // console.log("User data retrieved:", userData);
            } else {
                console.error("User document not found");
            }

            // console.log("Auto-login with Remember Me");
        } catch (error) {
            window.location.href = "../loginpage/login.html"
            console.error("Auto-login failed: " + error.message);
        }
    }
});











// $(".nav ul li").click(function() {
//     $(this)
//       .addClass("active")
//       .siblings()
//       .removeClass("active");
//   });
  
  const tabBtn = document.querySelectorAll(".nav ul li");
  const tab = document.querySelectorAll(".tab");
  
  function tabs(panelIndex) {
    tab.forEach(function(node) {
      node.style.display = "none";
    });
    // tab[panelIndex].style.display = "block";
  }
  tabs(0);
  
  let bio = document.querySelector(".bio");
  const bioMore = document.querySelector("#see-more-bio");
  // const bioLength = bio.innerText.length;
  
  function bioText() {
    // bio.oldText = bio.innerText;
  
    // bio.innerText = bio.innerText.substring(0, 100) + "...";
    // bio.innerHTML += `<span onclick='addLength()' id='see-more-bio'>See More</span>`;
  }
  //        console.log(bio.innerText)
  
  bioText();
  
  function addLength() {
    bio.innerText = bio.oldText;
    bio.innerHTML +=
      "&nbsp;" + `<span onclick='bioText()' id='see-less-bio'>See Less</span>`;
    document.getElementById("see-less-bio").addEventListener("click", () => {
      document.getElementById("see-less-bio").style.display = "none";
    });
  }
  // if (document.querySelector(".alert-message").innerText > 9) {
    // document.querySelector(".alert-message").style.fontSize = ".7rem";
  // }




  
  document.addEventListener("DOMContentLoaded", async function () {
    // Add an authentication state change listener
    firebase.auth().onAuthStateChanged(async function (user) {
        if (user) {
            // User is logged in, fetch and display the user's profile
            // const userNameElement = document.getElementById("user-name");
            // const userEmailElement = document.getElementById("user-email");
            // const userIdElement = document.getElementById("user-id");
            // const userRankElement = document.getElementById("user-rank");
            // const userUsernameElement = document.getElementById("username");
            const UserUsernameElement = document.getElementById("uusername");
            // const profilePictureElement = document.getElementById("profile-picture");
            // const usertitleElement = document.getElementById("user-title");
            // const postsContainer = document.getElementById("user-posts");

            try {
                // Fetch user data from Firestore based on user's UID
                const userDoc = await firebase.firestore().collection("users").doc(user.uid).get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    // userNameElement.textContent = userData.name || "Unknown";
                    // userEmailElement.textContent = user.email || "Unknown Email";
                    // userIdElement.textContent = user.uid || "Unknown id";
                    // userRankElement.textContent = userData.roles || "Unknown Rank";
                    UserUsernameElement.textContent = `User Profile: ${userData.username}` || "Unknown Username";
                    // UserUsernameElement.textContent = userData.username || "Unknown Username";
                    // usertitleElement.textContent = userData.tag || "Unknown tag";
                    // postsContainer.textContent = userData.postCount || "No posts found.";
                    

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

  // Initialize Firebase
// (Already included in your HTML file)

// // Check user authentication state
// firebase.auth().onAuthStateChanged(function(user) {
//   var verifiedIcon = document.getElementById('verifiedIcon');
//   var unverifiedIcon = document.getElementById('unverifiedIcon');

//   if (user) {
//     // User is signed in
//     if (user.emailVerified) {
//       // User is verified
//       verifiedIcon.style.display = 'block';
//       unverifiedIcon.style.display = 'none';
//     } else {
//       // User is not verified
//       verifiedIcon.style.display = 'none';
//       unverifiedIcon.style.display = 'block';
//     }
//   } else {
//     // User is signed out
//     verifiedIcon.style.display = 'none';
//     unverifiedIcon.style.display = 'none';
//   }
// });
