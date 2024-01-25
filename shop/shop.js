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
    const auth = firebase.auth();
  
    function renderProducts(products) {
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';

      products.forEach(product => {
        const productItem = document.createElement('div');
        const isAlreadyInCart = cart.some(item => item.id === product.id);
        productItem.innerHTML = `
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <img alt="${product.name}" src="${product.image}" style="width: 100px; height: 100px;">
          <p>Category: ${product.category}</p>
          <p>Price: $${product.price.toFixed(2)}</p>
          
          <button onclick="buyProduct('${product.id}', '${product.name}', ${product.price}, '${product.itemContent}')" ${isAlreadyInCart ? 'disabled' : ''}>
          ${isAlreadyInCart ? 'Already in Cart' : 'Buy'}
        </button>
        `;
        productList.appendChild(productItem);
      });
    }

// Function to filter products based on search query
function filterProducts() {
  const searchBox = document.getElementById('search-box');
  const searchTerm = searchBox.value.toLowerCase();

  // Filter products based on search term
  const filteredProducts = allProducts.filter(product =>
    (product.name && product.name.toLowerCase().includes(searchTerm)) ||
    (product.description && product.description.toLowerCase().includes(searchTerm)) ||
    (product.category && product.category.toLowerCase().includes(searchTerm))
  );

  renderProducts(filteredProducts);
}
  
   // Define an empty array to store all products
   let allProducts = [];

   // Function to fetch products from Firebase
   function getProducts() {
     db.collection('products').get()
       .then(querySnapshot => {
         allProducts = [];
         querySnapshot.forEach(doc => {
           const product = doc.data();
           product.id = doc.id;
           allProducts.push(product);
         });
         renderProducts(allProducts);
       })
       .catch(error => {
         console.error('Error getting products:', error);
       });
   }
  
    // Function to render cart items
    function renderCartItems(cartItems) {
        const cartItemsList = document.getElementById('cart-items');
        cartItemsList.innerHTML = '';
    
        cartItems.forEach(item => {
        const cartItem = document.createElement('li');
    
        if (item.id.startsWith('profilePictureId:')) {
            // Display for profile pictures
            cartItem.innerHTML = `
            <span>Profile Picture: <img src="${item.image}" alt="Profile Picture"></span>
            <span>Price: $${item.price.toFixed(2)}</span>
            `;
        } else {
            // Display for regular items
            cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>Price: $${item.price.toFixed(2)}</span>
            `;
        }
    
        cartItem.innerHTML += `<button onclick="removeFromCart('${item.id}')">Remove</button>`;
        cartItemsList.appendChild(cartItem);
        });
    }
  
  
      // Function to update the total in the UI
      function updateTotal(cartItems) {
        const totalElement = document.getElementById('total');
        const total = cartItems.reduce((acc, item) => acc + item.price, 0);
        totalElement.textContent = total.toFixed(2);
      }
  
      // Function to handle the checkout process (deducts balance, notifies user)
      function checkout() {
        const user = auth.currentUser;
      
        if (!user) {
          alert('Please sign in to make a purchase.');
          return;
        }
      
        const userRef = db.collection('users').doc(user.uid);
      
        db.runTransaction(transaction => {
          return transaction.get(userRef).then(userDoc => {
            const currentBalance = userDoc.data().balance;
            const totalCost = cart.reduce((acc, item) => acc + item.price, 0);
      
            if (currentBalance < totalCost) {
              alert('Insufficient balance. Please add funds.');
              return Promise.reject('Insufficient balance');
            }
      
            // Deduct balance
            transaction.update(userRef, { balance: currentBalance - totalCost });
      
            // Add purchase to user's profilePictures subcollection
            const purchaseRef = userRef.collection('purchases').doc();
            transaction.set(purchaseRef, {
              items: cart,
              total: totalCost,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });
      
            return Promise.resolve();
          });
        })
        .then(() => {
          alert('Purchase successful! Balance deducted.');
          cart = [];
          renderCartItems(cart);
          updateTotal(cart);
        })
        .catch(error => {
          if (error !== 'Insufficient balance') {
            console.error('Error processing transaction:', error);
          }
        });
      }
      
      // Function to buy profile picture
      function buyProfilePicture(profilePictureId, profilePictureUrl, price) {
        const cartItem = { id: profilePictureId, name: 'Profile Picture', price, imageUrl: profilePictureUrl };
        cart.push(cartItem);
        renderCartItems(cart);
        updateTotal(cart);
      }
      
  
      // Function to add a product to the cart
      function buyProduct(id, name, price, itemContent) {
        const isAlreadyInCart = cart.some(item => item.id === id);
    
        if (!isAlreadyInCart) {
          const cartItem = { id, name, price, itemContent };
          cart.push(cartItem);
          renderCartItems(cart);
          updateTotal(cart);
        }
      }
      // Function to remove an item from the cart
      function removeFromCart(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        renderCartItems(cart);
        updateTotal(cart);
      }
  
      // Fetch products and render them when the page loads
      document.addEventListener('DOMContentLoaded', () => {
        getProducts();
      });
  
      // Initial cart state
      let cart = [];


   // Fetch products and render them when the page loads
   document.addEventListener('DOMContentLoaded', () => {
    getProducts();
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