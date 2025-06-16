const firebaseConfig = {
  apiKey: "AIzaSyDwrFJHXGuHZL95lMhMHAPBwZGAaY4bi90",
  authDomain: "ktl-employee-login.firebaseapp.com",
  databaseURL: "https://ktl-employee-login-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ktl-employee-login",
  storageBucket: "ktl-employee-login.firebasestorage.app",
  messagingSenderId: "733033006704",
  appId: "1:733033006704:web:aaa6c7f7147e833fbb16b5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

function showLogin() {
  document.getElementById("authModal").style.display = "flex";
  switchToLogin();
}

function closeModal() {
  document.getElementById("authModal").style.display = "none";
}

function switchToSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
}

function switchToLogin() {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

function signUp() {
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const termsAccepted = document.getElementById("signupTerms").checked;

  if (!fullName || !email || !password || !confirmPassword) {
    alert("Please fill all fields.");
    return;
  }

  if (!termsAccepted) {
    alert("You must accept the terms and conditions to sign up.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      db.ref("users/" + user.uid).set({
        fullName,
        email,
        createdAt: new Date().toISOString()
      });
      alert("Signup successful! Please login.");
      switchToLogin();
    })
    .catch((error) => {
      alert(error.message);
    });
}

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      db.ref("users/" + user.uid).once("value")
        .then((snapshot) => {
          if (snapshot.exists()) {
            window.location.href = "main.html";
          } else {
            alert("User data not found. Please sign up again.");
            auth.signOut();
            switchToSignup();
          }
        });
    })
    .catch((error) => {
      alert(error.message);
    });
}

function forgotPassword() {
  const email = document.getElementById("loginEmail").value.trim();

  if (!email) {
    alert("Please enter your email first.");
    return;
  }

  auth.sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent! Please check your inbox.");
    })
    .catch((error) => {
      alert(error.message);
    });
}

function downloadApp() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(userAgent)) {
    window.location.href = "https://play.google.com/store/apps/details?id=com.yourcompany.yourapp";
  } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    window.location.href = "https://apps.apple.com/app/id1234567890";
  } else {
    alert("Unsupported device.");
  }
}

window.onclick = function (event) {
  const modal = document.getElementById("authModal");
  if (event.target === modal) {
    closeModal();
  }
};
