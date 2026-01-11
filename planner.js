var PLANS = JSON.parse(localStorage.getItem("PLANS")) || [];

function savePlan(){
  const d = document.getElementById("planDate").value;
  const t = document.getElementById("planText").value;

  if(!d || !t){
    alert("Fill both fields");
    return;
  }

  PLANS.push({d,t});
  localStorage.setItem("PLANS", JSON.stringify(PLANS));
  document.getElementById("planText").value="";
  renderPlans();
}

function renderPlans(){
  const box = document.getElementById("planList");
  if(!box) return;
  box.innerHTML="";
  PLANS.forEach((p,i)=>{
    box.innerHTML += box.innerHTML += `
  <div class="planCard">
     <span>${p.d} – ${p.t}</span>
     <button onclick="delPlan(${i})">✖</button>
  </div>
`;

  });
}

function delPlan(i){
  PLANS.splice(i,1);
  localStorage.setItem("PLANS", JSON.stringify(PLANS));
  renderPlans();
}

renderPlans();
