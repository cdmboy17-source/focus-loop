import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
 apiKey: "AIzaSyAvRxkbqmjk25MNmh7uYtx2Q1gyiTkmOEc",
 authDomain: "focus-loop-chat.firebaseapp.com",
 projectId: "focus-loop-chat",
 storageBucket: "focus-loop-chat.firebasestorage.app",
 messagingSenderId: "390951957158",
 appId: "1:390951957158:web:da217227b509da3a80ba67"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.googleLogin = function(){
  signInWithPopup(auth, provider);
};

onAuthStateChanged(auth, user=>{
  if(user){
    document.getElementById("loginPage").style.display="none";
    document.getElementById("appBox").style.display="flex";
  }else{
    document.getElementById("loginPage").style.display="flex";
    document.getElementById("appBox").style.display="none";
  }

});
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

window.logout = function(){
  signOut(auth);
};

