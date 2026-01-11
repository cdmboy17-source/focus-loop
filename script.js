let profile = JSON.parse(localStorage.getItem("profile")) || {};
let streak = Number(localStorage.getItem("streak")) || 0;

let posts = JSON.parse(localStorage.getItem("posts")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

function showTab(id){
  document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if(id==="home") renderPosts();
  if(id === "analytics") renderAnalytics();

}

function addPost(){

  let text = document.getElementById("postBox").value;
  let sub  = document.getElementById("subjectBox").value;
  let img  = document.getElementById("imageBox").files[0];

  if(text === "") return alert("Type something!");

  if(img){
    let reader = new FileReader();
    reader.onload = ()=>{
      posts.unshift({text,sub,likes:0,img:reader.result});
      localStorage.setItem("posts",JSON.stringify(posts));
      document.getElementById("postBox").value="";
      document.getElementById("imageBox").value="";
      showTab("home");
      renderPosts();
    };
    reader.readAsDataURL(img);
  } else {
    posts.unshift({text,sub,likes:0,img:""});
    localStorage.setItem("posts",JSON.stringify(posts));
    document.getElementById("postBox").value="";
    showTab("home");
    renderPosts();
    refreshProfileStats();
  }
}

function renderPosts(){

  let search = document.getElementById("searchBox").value.toLowerCase();
  let filter = document.getElementById("filterBox").value;
  let box = document.getElementById("postsBox");

  box.innerHTML = "";

  posts.filter(p => {
      return p.text.toLowerCase().includes(search) &&
             (filter === "" || p.sub === filter);
  }).forEach((p,i) => {

    box.innerHTML += `
      <div class="card">
        <b>${p.sub}</b><br>
        ${p.text}<br>
        <input placeholder="Write comment & press Enter" 
         onkeydown="if(event.key==='Enter')addComment(${i},this.value)">
         <div class="comments">
  ${(p.comments||[]).map(c=>`<div>💬 ${c}</div>`).join("")}
</div>

        ${p.img ? `<img src="${p.img}" class="postImg">` : ""}<br>

        ❤️ ${p.likes}
        <button onclick="toggleStar(${i})">⭐</button>
        <button onclick="likePost(${i})">Like</button>
        <button onclick="sharePost(${i})">🔗 Share</button>

        <button onclick="editPost(${i})">✏️</button>
        <button onclick="showConfirm('Delete this post?','post',${i})">🗑️</button>


      </div>
    `;
  });
}


function likePost(i){
  posts[i].likes++;
  localStorage.setItem("posts",JSON.stringify(posts));
  renderPosts();
}

function bookmarkPost(i){
  bookmarks.push(posts[i]);
  localStorage.setItem("bookmarks",JSON.stringify(bookmarks));
  renderBookmarks();
}

function addNote(){
  let t=document.getElementById("noteTitle").value;
  let c=document.getElementById("noteContent").value;
  notes.push({t,c});
  localStorage.setItem("notes",JSON.stringify(notes));
  renderNotes();
  refreshProfileStats();

}

function renderNotes(){
  notesBox.innerHTML="";
  notes.forEach((n,i)=>{
    notesBox.innerHTML += `
      <div class="card">
        <b>${n.t}</b><br>${n.c}<br>
        <button onclick="deleteNote(${i})">🗑️ Delete</button>
      </div>
    `;
  });
}


function renderBookmarks(){
  let box = document.getElementById("bookmarksBox");
  box.innerHTML = "";

  bookmarks.forEach((b,i)=>{
    box.innerHTML += `
      <div class="card">
        ${b.text}<br>
        <button onclick="showConfirm('Remove this bookmark?','bookmark',${i})">🗑️ Remove</button>
      </div>
    `;
  });
}




function changePic(){
  let file = picInput.files[0];
  let reader = new FileReader();
  reader.onload = ()=>{
    profile.pic = reader.result;
    localStorage.setItem("profile",JSON.stringify(profile));
    loadProfile();
  };
  reader.readAsDataURL(file);
}


function changePic(){
  let file = picInput.files[0];
  let reader = new FileReader();
  reader.onload = ()=>{
    profile.pic = reader.result;
    localStorage.setItem("profile",JSON.stringify(profile));
    loadProfile();
  };
  reader.readAsDataURL(file);
}

function saveProfile(){
  profile.name = profileName.value;
  profile.bio  = profileBio.value;
  localStorage.setItem("profile",JSON.stringify(profile));
  loadProfile();
}

function loadProfile(){
  if(profile.pic) profilePic.src = profile.pic;
  showName.innerText = profile.name || "Your Name";
  showBio.innerText  = profile.bio || "Your bio appears here";
  profileName.value = profile.name;
  profileBio.value  = profile.bio;

  statPosts.innerText = posts.length;
  statNotes.innerText = notes.length;
}
loadProfile();




function updateStreak(){
  streak++;
  localStorage.setItem("streak",streak);
  streakBox.innerText="🔥 Study Streak: "+streak+" days";
}
updateStreak();
streakBox.innerText="🔥 Study Streak: "+streak+" days";

function exportPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  notes.forEach((n,i)=>{
    doc.text(`${i+1}. ${n.t}`, 10, y);
    y += 8;
    doc.text(n.c, 10, y);
    y += 12;
  });

  doc.save("FocusLoopNotes.pdf");
}

let deleteType="", deleteIndex=-1;

const confirmBox = document.getElementById("confirmBox");
const confirmText = document.getElementById("confirmText");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

function showConfirm(msg,type,index){
  deleteType = type;
  deleteIndex = index;
  confirmText.innerText = msg;
  confirmBox.classList.remove("hidden");
}

confirmNo.onclick = () => confirmBox.classList.add("hidden");

confirmYes.onclick = () => {
  if(deleteType === "post"){
    posts.splice(deleteIndex,1);
    localStorage.setItem("posts",JSON.stringify(posts));
    renderPosts();
  }
  if(deleteType === "bookmark"){
    bookmarks.splice(deleteIndex,1);
    localStorage.setItem("bookmarks",JSON.stringify(bookmarks));
    renderBookmarks();
  }
  confirmBox.classList.add("hidden");
};

function editPost(i){
  let newText = prompt("Edit your post:", posts[i].text);
  if(newText !== null){
    posts[i].text = newText;
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  }
}
function toggleStar(i){
  posts[i].star = !posts[i].star;
  localStorage.setItem("posts",JSON.stringify(posts));
  renderPosts();
}
function addComment(i,text){
  if(text.trim()==="") return;
  posts[i].comments = posts[i].comments || [];
  posts[i].comments.push(text);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
}

function sharePost(i){
  navigator.clipboard.writeText(posts[i].text);
  alert("Post copied! Now paste & share it anywhere.");
}



loadProfile();









loadProfile();

renderProfile();

renderPosts();renderNotes();renderBookmarks();
function deleteNote(i){
  if(confirm("Delete this note?")){
    notes.splice(i,1);
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();
  }
}

function toggleTheme(){
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme",document.documentElement.classList.contains("dark")?"dark":"light");
}

function loadTheme(){
  if(localStorage.getItem("theme")==="dark"){
    document.documentElement.classList.add("dark");
  }
}
loadTheme();


async function startRecording(){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
    recorder = new MediaRecorder(stream);
    audioChunks = [];

    recorder.ondataavailable = e => audioChunks.push(e.data);

    recorder.onstop = ()=>{
      const blob = new Blob(audioChunks,{type:"audio/webm"});
      const reader = new FileReader();
      reader.onload = ()=>{
        audioNotes.push(reader.result);
        localStorage.setItem("audioNotes",JSON.stringify(audioNotes));
        renderAudioNotes();
      };
      reader.readAsDataURL(blob);
      recStatus.innerText = "Recording saved!";
    };

    recorder.start();
    recStatus.innerText = "🔴 Recording...";
  }catch(e){
    alert("Recording failed.");
  }
}

function stopRecording(){
  if(recorder && recorder.state==="recording"){
    recorder.stop();
  }
}

function renderAudioNotes(){
  audioList.innerHTML="";
  audioNotes.forEach(a=>{
    audioList.innerHTML+=`<audio controls src="${a}"></audio>`;
  });
}
renderAudioNotes();
function backupData(){
  const data = {
    posts,
    notes,
    bookmarks,
    profile,
    audioNotes
  };

  const blob = new Blob([JSON.stringify(data)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "FocusLoopBackup.json";
  a.click();
}

function restoreData(){
  const file = restoreFile.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    const data = JSON.parse(reader.result);
    posts = data.posts || [];
    notes = data.notes || [];
   
    profile = data.profile || {};
    
    audioNotes = data.audioNotes || [];
    localStorage.setItem("posts",JSON.stringify(posts));
    localStorage.setItem("notes",JSON.stringify(notes));
    localStorage.setItem("bookmarks",JSON.stringify(bookmarks));
    localStorage.setItem("profile",JSON.stringify(profile));
   
    localStorage.setItem("audioNotes",JSON.stringify(audioNotes));
    location.reload();
  };
  reader.readAsText(file);
}

let goal = JSON.parse(localStorage.getItem("dailyGoal")) || {text:"",target:0,done:0};

function saveGoal(){
  goal.text = goalText.value;
  goal.target = Number(goalTarget.value);
  goal.done = 0;
  localStorage.setItem("dailyGoal", JSON.stringify(goal));
  renderGoal();
}

function completeOneHour(){
  if(goal.done < goal.target){
    goal.done++;
    localStorage.setItem("dailyGoal", JSON.stringify(goal));
    renderGoal();
  }
}

function renderGoal(){
  if(goal.text){
    goalView.innerText = goal.text + " – " + goal.done + "/" + goal.target + " hrs";
    goalProgress.value = (goal.done/goal.target)*100;
  }
}

renderGoal();
let badges = JSON.parse(localStorage.getItem("badges")) || [];

function checkBadges(){
  if(posts.length>=1 && !badges.includes("First Post")) badges.push("First Post");
  if(notes.length>=1 && !badges.includes("First Note")) badges.push("First Note");
  
  if(goal && goal.done>=goal.target && goal.target>0 && !badges.includes("Goal Crusher"))
      badges.push("Goal Crusher");

  localStorage.setItem("badges",JSON.stringify(badges));
  renderBadges();
}


function renderBadges(){
  badgesBox.innerHTML="";
  badges.forEach(b=>{
    badgesBox.innerHTML += `<span class="badge">${b}</span>`;
  });
}
renderBadges();
checkBadges();
function openAnalytics(){
  document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"));
  document.getElementById("analytics").classList.remove("hidden");
  renderAnalytics();
}
function renderAnalytics(){
  statsPosts.innerText = "Total Posts: " + (posts||[]).length;
  statsNotes.innerText = "Total Notes: " + (notes||[]).length;
  statsBookmarks.innerText = "Total Bookmarks: " + (bookmarks||[]).length;
}

function updateAll(){
  checkBadges();
  renderBadges();
}
function refreshProfileStats(){
  if(document.getElementById("statPosts")){
    statPosts.innerText = posts.length;
    statNotes.innerText = notes.length;
    
  }
}






