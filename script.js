// -------------------- STORAGE --------------------
const STORAGE_KEY = "clients";
let clients = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

if (clients.length === 0) {
  const trainingHistoryOptions = ["Cardio 20 min","Squats","Push-ups","Plank 2 min","Lunges","Deadlifts","Bench Press","Cycling","Rowing"];
  clients = [
    { name: "Sohila Omar", age: 23, gender: "Female", email: "sohila23@gmail.com", phone: "0102245670", goal: "Weight Loss", start: "2025-01-06" },
    { name: "Shahd Omar", age: 24, gender: "Female", email: "shahd@yahoo.com", phone: "0102345698", goal: "Muscle Gain", start: "2025-01-06" },
    { name: "Maya Elmalah", age: 20, gender: "Female", email: "mayaaa@gmail.com", phone: "0126729165", goal: "Personal", start: "2025-01-06" },
    { name: "Jana Refai", age: 26, gender: "Female", email: "janaa123@yahoo.com", phone: "0111267920", goal: "Muscle Gain", start: "2025-02-01" },
    { name: "Mayar Motreb", age: 29, gender: "Female", email: "mayar@yahoo.com", phone: "0108956213", goal: "Personal", start: "2025-02-02" }
  ];
  clients.forEach(c => c.trainingHistory = Array.from({length:3}, () => trainingHistoryOptions[Math.floor(Math.random() * trainingHistoryOptions.length)]));
  saveClients();
}

function saveClients() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function showToast(message="Done") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(()=>toast.classList.remove("visible"), 2600);
}

function safeText(v){ return (v===undefined||v===null)?"-":String(v); }

document.addEventListener("DOMContentLoaded", () => {

  // --- ADD CLIENT ---
  const addForm = document.getElementById("addClientForm");
  if(addForm){
    addForm.addEventListener("submit",(e)=>{
      e.preventDefault();
      const name=document.getElementById("name").value;
      const age=Number(document.getElementById("age").value);
      const gender=document.getElementById("gender").value;
      const email=document.getElementById("email").value;
      const phone=document.getElementById("phone").value;
      const goal=document.getElementById("goal").value;
      const start=document.getElementById("start").value;
      if(!name||!age||!gender||!email||!phone||!goal||!start){return showToast("Please fill all fields correctly")}
      if(age<16){return showToast("Client must be at least 16 years old")}

      const trainingHistoryOptions = ["Cardio 20 min","Squats","Push-ups","Plank 2 min","Lunges","Deadlifts","Bench Press","Cycling","Rowing"];
      const newClient = {name,age,gender,email,phone,goal,start,trainingHistory:Array.from({length:3},()=>trainingHistoryOptions[Math.floor(Math.random()*trainingHistoryOptions.length)])};

      clients.push(newClient);
      saveClients();
      addForm.reset();
      showToast("Client added successfully");
    });
  }

  // --- VIEW MEMBERS ---
  const memberListEl=document.getElementById("memberList");
  if(memberListEl){
    const searchInput=document.getElementById("searchMember");
    const searchBtn=document.getElementById("searchBtn");
    const sortSelect=document.getElementById("sortMembers");

    function applySearchAndRender(){
      const q=(searchInput.value||"").trim().toLowerCase();
      let filtered = clients.slice();
      if(q){
        filtered = filtered.filter(c => c.name.toLowerCase().includes(q)||c.email.toLowerCase().includes(q)||c.phone.toLowerCase().includes(q));
      }
      const s=sortSelect.value;
      if(s==="name") filtered.sort((a,b)=>a.name.localeCompare(b.name));
      else if(s==="age") filtered.sort((a,b)=>a.age-b.age);
      else if(s==="start") filtered.sort((a,b)=>new Date(a.start)-new Date(b.start));
      renderMemberList(filtered);
    }

    if(searchBtn) searchBtn.addEventListener("click",applySearchAndRender);
    if(searchInput) searchInput.addEventListener("keydown",(ev)=>{if(ev.key==="Enter") applySearchAndRender();});
    if(sortSelect) sortSelect.addEventListener("change",applySearchAndRender);

    renderMemberList(clients);
  }

  // --- CLIENT DETAILS PAGE ---
  const clientDetailsEl = document.getElementById("clientDetails");
  if(clientDetailsEl){
    const idx = localStorage.getItem("selectedClientIndex");
    if(idx!==null){
      const c = clients[Number(idx)];
      if(c){
        const exerciseOptions = ["Squats","Push-ups","Plank 2 min","Lunges","Deadlifts","Bench Press","Cycling","Rowing","Burpees","Mountain Climbers"];
        const nextExercises = Array.from({length:5},()=>exerciseOptions[Math.floor(Math.random()*exerciseOptions.length)]);

        clientDetailsEl.innerHTML = `
          <p><strong>Name:</strong> ${safeText(c.name)}</p>
          <p><strong>Age:</strong> ${safeText(c.age)}</p>
          <p><strong>Gender:</strong> ${safeText(c.gender)}</p>
          <p><strong>Email:</strong> ${safeText(c.email)}</p>
          <p><strong>Phone:</strong> ${safeText(c.phone)}</p>
          <p><strong>Goal:</strong> ${safeText(c.goal)}</p>
          <p><strong>Membership Start:</strong> ${safeText(c.start)}</p>
          <p><strong>Training History:</strong> ${safeText(c.trainingHistory.join(", "))}</p>
          <p><strong>Next Session Exercises:</strong> ${nextExercises.join(", ")}</p>
        `;
      }else clientDetailsEl.textContent="Client not found";
    }else clientDetailsEl.textContent="No client selected";
  }

});

// -------------------- RENDER MEMBER LIST --------------------
function renderMemberList(list){
  const container=document.getElementById("memberList");
  if(!container) return;
  container.innerHTML="";
  if(!list || list.length===0){container.innerHTML=`<div class="member-item">No members found.</div>`; return;}

  const exerciseOptions=["Squats","Push-ups","Plank 2 min","Lunges","Deadlifts","Bench Press","Cycling","Rowing","Burpees","Mountain Climbers"];

  list.forEach((c,idx)=>{
    const item = document.createElement("div");
    item.className="member-item";

    item.innerHTML=`
      <div class="member-header" style="cursor:pointer;">
        <div>
          <div class="member-name">${safeText(c.name)}</div>
          <div style="font-size:13px;color:#555">${safeText(c.goal)} • ${safeText(c.email)}</div>
        </div>
        <div style="text-align:right">
          <div style="font-weight:700">${safeText(c.age)}</div>
          <div style="font-size:13px;color:#666">${safeText(c.start)}</div>
        </div>
      </div>
      <div style="margin-top:10px;display:flex;gap:8px;">
        <button class="btn" onclick="viewClient(${idx})">View</button>
        <button class="btn" onclick="editClient(${idx})">Edit</button>
        <button class="btn outline" onclick="deleteClient(${idx})">Delete</button>
      </div>
    `;
    container.appendChild(item);
  });
}

// -------------------- VIEW / EDIT / DELETE --------------------
function viewClient(index){ localStorage.setItem("selectedClientIndex",index); window.location.href="gym2client.html"; }

function editClient(index){
  const c=clients[index]; if(!c) return showToast("Client not found");
  const newName=prompt("Edit full name:",c.name); if(newName===null) return;
  const newAgeRaw=prompt("Edit age (min 16):",c.age); if(newAgeRaw===null) return; const newAge=Number(newAgeRaw); if(isNaN(newAge)||newAge<16) return showToast("Invalid age");
  const newEmail=prompt("Edit email:",c.email); if(newEmail===null) return;
  const newPhone=prompt("Edit phone:",c.phone); if(newPhone===null) return;
  const newGoal=prompt("Edit goal:",c.goal); if(newGoal===null) return;
  const newStart=prompt("Edit start date (YYYY-MM-DD):",c.start); if(newStart===null) return;
  clients[index]={name:newName,age:newAge,gender:c.gender,email:newEmail,phone:newPhone,goal:newGoal,start:newStart,trainingHistory:c.trainingHistory||[]};
  saveClients(); renderMemberList(clients); showToast("Client updated");
}

function deleteClient(index){ if(!confirm("Remove this client permanently?")) return; clients.splice(index,1); saveClients(); renderMemberList(clients); showToast("Client removed"); }
