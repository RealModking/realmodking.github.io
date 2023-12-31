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
        // location.reload();
        alert(`Login successful ${userData.name}`);
        window.location.href = "/profile/profile.html";

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

                // console.log("User data retrieved:", userData);
            } else {
                console.error("User document not found");
            }

            // console.log("Auto-login with Remember Me");
        } catch (error) {
            window.location.href = "./loginpage/login.html"
            console.error("Auto-login failed: " + error.message);
        }
    }
});

// Now userData is accessible in the entire script
// You can use userData in other parts of your code if needed







document.addEventListener("DOMContentLoaded", function () {
    const postForm = document.getElementById("blog-form");
    const loginMessage = document.getElementById("login-message");

    // Listen for changes in the user's authentication status
    auth.onAuthStateChanged(function (user) {
        const postButton = document.getElementById("post");

        // console.log("postForm:", postForm);
        // console.log("loginMessage:", loginMessage);
        // console.log("postButton:", postButton);

        // Show/hide the post form and login message based on the user's authentication status
        if (postForm && loginMessage) {
            if (user) {
                postForm.style.display = "block";
                loginMessage.style.display = "none";
            } else {
                postForm.style.display = "none";
                loginMessage.style.display = "block";
            }
        }

        // Enable/disable the post button based on the user's authentication status
        if (postButton) {
            postButton.disabled = !user; // Disable if user is not logged in, enable otherwise
            // console.log(disabled = "")
        }
    });

    // Add a focus event listener to clear the text when the input gains focus
    const postContent = document.getElementById("post-content");
    postContent.addEventListener("focus", function () {
        if (postContent.value.trim() === "Write your post...") {
            postContent.value = "";
        }
    });


    const posttitle = document.getElementById("post-title");
    posttitle.addEventListener("focus", function () {
        if (posttitle.value.trim() === "Write your TITLE HEADING...") {
            posttitle.value = "";
        }
    });

    // Display posts regardless of user status
    displayPosts();
});


// Updated submitPost function with rating integration
async function submitPost() {
    const postContent = document.getElementById("post-content").value;
    const postTitle = document.getElementById("post-title").value;
    const imageFile = document.getElementById("post-image-file").files[0];
    const user = auth.currentUser;

    if (user && postContent.trim() !== "") {
        try {
            // Check if the post content contains blacklisted words
            const blacklistedWord = containsBlacklistedWords(postContent);

            if (blacklistedWord) {
                alert(`Your post contains the blacklisted word: ${blacklistedWord}. The post will not be submitted.`);
                recordBlacklistedUser(user.uid, user.displayName, user.email, blacklistedWord, postContent);
                return;
            }

            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            let imageUrl = "";

            if (imageFile) {
                const storageRef = firebase.storage().ref(`images/${user.uid}/${timestamp}_${imageFile.name}`);
                await storageRef.put(imageFile);
                imageUrl = await storageRef.getDownloadURL();
            }

            const userDocRef = db.collection("users").doc(user.uid);
            const userDoc = await userDocRef.get();

            const userName = userDoc.exists ? userDoc.data().name : "Unknown User";

            // Update user's post count
            await userDocRef.update({
                postCount: firebase.firestore.FieldValue.increment(1)
            });

            // Generate a random post ID
            const postId = generateRandomPostId();

            const postRef = await db.collection("posts").doc(postId).set({
                title: postTitle,
                content: postContent,
                userId: user.uid,
                userName: userName,
                timestamp: timestamp,
                imageUrl: imageUrl,
                postId: postId
            });

            // Submit the rating for the newly created post
            const rating = 5; // You can adjust the rating as needed
            await submitRating(postId, rating);

            document.getElementById("post-content").value = "";
            document.getElementById("post-title").value = "";
            document.getElementById("post-image-file").value = "";
            // Your existing post submission logic
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    } else {
        alert("You must log in to post."); // You can replace this with a more user-friendly notification
    }
}

// Function to generate a random post ID
function generateRandomPostId(length = 20) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < length; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
}



function containsBlacklistedWords(content) {
    // Replace this array with your actual list of blacklisted words
    const blacklist = [
    "word1",
    "word2",
    "word3",
    ",",
    "<",
    ">",
    "arse",
    "ass",
    "asshole",
    "homosexual"
    


];
    // Convert content to lowercase for case-insensitive matching
    const lowercaseContent = content.toLowerCase();

    // Check if any blacklisted word is present in the content
    const foundWord = blacklist.find(word => lowercaseContent.includes(word));

    return foundWord || null;
}
// Function to check for blacklisted words
// async function containsBlacklistedWords(text) {
//     try {
//         // Fetch the blacklist words from the database
//         const blacklistSnapshot = await db.collection("blacklist").get();
//         const blacklistWords = blacklistSnapshot.docs.map(doc => doc.data().word);

//         // Convert text to lowercase for case-insensitive matching
//         const lowercaseText = text.toLowerCase();

//         // Check if any blacklisted word is present in the text
//         const foundWord = blacklistWords.find(word => new RegExp(`\\b${word}\\b`, 'i').test(lowercaseText));

//         return foundWord || null;
//     } catch (error) {
//         console.error("Error fetching blacklist words:", error);
//         return null;
//     }
// }

// // Example usage
// const postContent = "This is a sample post with a <word1> and word2.";
// const blacklistedWord = await containsBlacklistedWords(postContent);

// if (blacklistedWord) {
//     alert(`Your post contains the blacklisted word: ${blacklistedWord}. The post will not be submitted.`);
// } else {
//     // Continue with processing or submitting the content
//     // Call your submitPost function here
//     submitPost();
// }


async function recordBlacklistedUser(userId, userName, userEmail, blacklistedWord, blacklistedContent) {
    try {
        // Record blacklisted user information in the blacklist collection
        await db.collection("blacklist").add({
            userId: userId,
            userName: userName,
            userEmail: userEmail,
            blacklistedWord: blacklistedWord,
            blacklistedContent: blacklistedContent,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error("Error recording blacklisted user: ", error);
    }
}








const db = firebase.firestore();




// Function to generate star rating HTML with clickable stars
function generateClickableStarRating(postId, currentRating) {
    const maxRating = 5;

    // Create a container for stars
    const starsContainer = document.createElement("div");
    starsContainer.classList.add("star-rating");

    // Create HTML for star rating
    for (let i = 1; i <= maxRating; i++) {
        const star = document.createElement("span");
        star.textContent = "☆"; // Default empty star
        star.addEventListener("click", () => handleStarClick(postId, i));
        starsContainer.appendChild(star);
    }

    // Highlight the stars based on the current rating
    highlightStars(starsContainer, currentRating);

    return starsContainer;
}

// Function to handle star click event
async function handleStarClick(postId, clickedRating) {
    const user = auth.currentUser;

    if (user) {
        try {
            // Update or add the rating to the post
            const postRef = db.collection("posts").doc(postId);
            await postRef.set(
                {
                    rating: clickedRating,
                },
                { merge: true }
            );

            // Update the star rating display
            const starsContainer = document.getElementById(`stars-${postId}`);
            if (starsContainer) {
                highlightStars(starsContainer, clickedRating);
            }
        } catch (error) {
            console.error("Error updating rating: ", error);
        }
    } else {
        alert("You must log in to rate posts."); // You can replace this with a more user-friendly notification
    }
}

// Function to highlight stars based on the rating
function highlightStars(starsContainer, rating) {
    const stars = starsContainer.children;

    for (let i = 0; i < stars.length; i++) {
        stars[i].textContent = i < rating ? "★" : "☆";
    }
}

// Update the blog post creation to use the new function
function displayPosts() {
    const blogPostsContainer = document.getElementById("blog-posts");

    db.collection("posts")
        .orderBy("timestamp", "desc")
        .onSnapshot(snapshot => {
            blogPostsContainer.innerHTML = "";

            snapshot.forEach(doc => {
                const post = doc.data();
                const timestamp = post.timestamp ? post.timestamp.toDate().toLocaleString() : "Unknown";

                const blogPost = document.createElement("div");
                blogPost.classList.add("blog-post");
                blogPost.innerHTML = `
                    <h3 class="title">${post.title || "Untitled"}</h3> 
                    <p>${post.content}</p>                    
                    <small>Posted by <a class="links" href="../userlist/userprofile/userprofile.html?uid=${post.userId}"> @${post.userName || "Unknown User"} </a> at ${timestamp}</small>                    
                `;


                // Check if the rating property is defined and not null <img class="fakeimg" src="${post.imageUrl}" alt="Post Image">
                if (typeof post.rating === 'number' && !isNaN(post.rating)) {
                    // Create a rating element
                    const ratingElement = document.createElement("div");
                    ratingElement.classList.add("rating");

                    // Add star icons based on the rating value
                    for (let i = 0; i < post.rating; i++) {
                        const starIcon = document.createElement("span");
                        starIcon.innerHTML = "★"; // You can use an actual star icon here

                        ratingElement.appendChild(starIcon);
                    }

                    // Append the rating element to the blog post
                    blogPost.appendChild(ratingElement);
                }

                // Append the blog post to the container
                blogPostsContainer.appendChild(blogPost);
            });
        });
}







document.addEventListener("DOMContentLoaded", function () {
    // Call the displayPosts function after the DOM is fully loaded
    displayPosts();
  });

// const userUsernameElement = document.getElementById("user-username");

// if (userUsernameElement) {
//     userUsernameElement.textContent = userData.name;
// } else {
//     console.error("Element with ID 'user-username' not found");
// }

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



// document.getElementById("signup-form").addEventListener("submit", async function (event) {
//     event.preventDefault();

//     var email = document.getElementById("signup-email").value;
//     var password = document.getElementById("signup-password").value;
//     var name = document.getElementById("signup-name").value;
//     var username = document.getElementById("signup-username").value;

//     try {
//         // Create user in Firebase Authentication
//         const userCredential = await auth.createUserWithEmailAndPassword(email, password);

//         // Get the user ID
//         const userId = userCredential.user.uid;

//         // Add UID, name, roles, and default profile picture URL to the user document in Firestore
//         const profilePictureUrl = "https://cdn.discordapp.com/attachments/1132871893045751930/1186473953770868878/Screenshot_2022-06-11_192629.png?ex=659360fa&is=6580ebfa&hm=3754c9ccb88215ef3570a2fe2c51f5cb91ae393602321a9e67345c07ba83914c&"; // Replace with your default profile picture URL
//         await firebase.firestore().collection("users").doc(userId).set({
//             uid: userId,
//             name: name,
//             email: email,
//             roles: ["member"],
//             profilePictureUrl: profilePictureUrl,
//             tag: ["User"],
//             username: username,
//             following: 0,
//             Followers: 0,
//             profileUserId: userId,
//             // Add other user data as needed
//         });

//         console.log("User signed up successfully");
//     } catch (error) {
//         console.error("Sign up failed: " + error.message);
//     }
// });








// Function to submit a rating for a post
async function submitRating(postId, rating) {
    const user = auth.currentUser;

    if (user) {
        try {
            // Check if the user has already rated the post
            const existingRating = await db.collection("ratings").where("postId", "==", postId).where("userId", "==", user.uid).get();

            if (existingRating.empty) {
                // User hasn't rated the post yet, add a new rating
                await db.collection("ratings").add({
                    postId: postId,
                    userId: user.uid,
                    rating: rating
                });

                // Update the average rating in the "posts" collection
                await updateAverageRating(postId);
            } else {
                alert("You have already rated this post.");
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    } else {
        // alert("You must log in to rate posts.");
    }
}

// Function to update the average rating in the "posts" collection
async function updateAverageRating(postId) {
    const ratingsSnapshot = await db.collection("ratings").where("postId", "==", postId).get();

    const totalRatings = ratingsSnapshot.size;
    const sumRatings = ratingsSnapshot.docs.reduce((sum, doc) => sum + doc.data().rating, 0);
    const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

    // Update the "posts" collection with the new average rating
    await db.collection("posts").doc(postId).update({ averageRating: averageRating });
}

// Example usage
const postId = "postId1";
const rating = 4;
submitRating(postId, rating);




        // Function to generate star rating HTML
        function generateStarRating(rating) {
            const maxRating = 5;
            const starCount = Math.round(rating); // Assuming rating is out of 5

            // Create HTML for star rating
            let starsHtml = "";
            for (let i = 0; i < maxRating; i++) {
                if (i < starCount) {
                    starsHtml += "★"; // Solid star for rated
                } else {
                    starsHtml += "☆"; // Empty star for not rated
                }
            }

            return starsHtml;
        }

        // Function to create a post element
        function createPostElement(post) {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            // Other post details
            postElement.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <p>Posted by: ${post.userName}</p>
                <p>Rating: ${generateStarRating(post.rating)}</p>
            `;

            return postElement;
        }

// // Get the modal
// var modal = document.getElementById('id01');

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }

function signOut() {
    firebase.auth().signOut()
        .then(() => {
            console.log('User signed out successfully');
            
            // Clear user data from session storage
            // sessionStorage.removeItem('userId');
            sessionStorage.removeItem('userAuthenticated');
            sessionStorage.removeItem('IsThisFirstTime_Log_From_LiveServer')
            window.location.href = "index2.html";
        })
        .catch((error) => {
            console.error('Error signing out:', error);
        });
}







// const passwordResetForm = document.getElementById('passwordResetForm');

// passwordResetForm.addEventListener('submit', function (event) {
//     event.preventDefault();

//     const email = document.getElementById('email').value;

//     // Send password reset email
//     firebase.auth().sendPasswordResetEmail(email)
//         .then(() => {
//             console.log('Password reset email sent successfully');
//         })
//         .catch((error) => {
//             console.error('Error sending password reset email:', error);
//         });
// });
document.getElementById('adminButton').addEventListener("click", function() {
    checkIfAdmin()
        .then(isAdmin => {
            if (isAdmin) {
                window.location.href = "../admin/admin.html";
            } else {
                console.log("You do not have admin privileges.");
                // Optionally, you can show an error message or handle it in another way.
            }
        })
        .catch(error => {
            console.error("Error checking admin status:", error);
            // Handle the error, show an error message, or redirect to another page if needed.
        });
});

// Function to check if the user is an admin
function checkIfAdmin() {
    return new Promise((resolve, reject) => {
        const currentUserId = firebase.auth().currentUser.uid;

        // Placeholder logic, replace with your actual implementation
        // For example, check if the user ID is present in an "admins" collection
        const adminRef = firebase.firestore().collection('admins').doc(currentUserId);

        adminRef.get()
            .then(doc => {
                const isAdmin = doc.exists;
                resolve(isAdmin);
            })
            .catch(error => {
                console.error('Error checking admin status:', error);
                reject(error);
            });
    });
}

// Show or hide the admin button based on the user's role (admin or not)
const adminButton = document.getElementById('adminButton');

// Check if the user is authenticated
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        adminButton.style.display = 'block';
    } else {
        // User is signed out
        adminButton.style.display = 'none';
    }
});


let currentTab = 'allPosts';

function openTab(tabId) {
  document.getElementById(currentTab).classList.remove('active-tab');
  document.getElementById(tabId).classList.add('active-tab');
  currentTab = tabId;
      // Show the selected tab

}


  // Check if user is logged in
const isLoggedIn = sessionStorage.getItem('userAuthenticated');

// If not logged in, redirect to the login page
if (!isLoggedIn) {
    window.location.href = '../loginpage/login.html'; // Replace with your login page URL
}

   

    const bannerRef = firebase.firestore().collection('bannerText').doc('test');

    bannerRef.get('text').then((doc) => {
    if (doc.exists) {
        const text = doc.data(); // Access the data of the document
        const bannerTextElement = document.getElementById('bannerText');
        bannerTextElement.textContent = text.bannerText;
      
      
    } else {
        console.log('No such document!');
    }
    }).catch((error) => {
    console.error('Error getting document:', error);
    });

    // Function to update banner text
    function updateBanner(text) {
      const bannerTextElement = document.getElementById('bannerText');
      bannerTextElement.textContent = text;
    }

 