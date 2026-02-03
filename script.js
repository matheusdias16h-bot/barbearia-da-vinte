// ===== DADOS =====
const services = [
  { id: "barba", name: "Barba", price: 20 },
  { id: "bigode_limpeza", name: "Bigode / Limpeza", price: 5 },
  { id: "cartaozinho_completo", name: "Cartãozinho completo", price: 0 },
  { id: "cavanhaque", name: "Cavanhaque", price: 15 },
  { id: "corte", name: "Corte", price: 30 },
  { id: "luzes", name: "Luzes", price: 60 },
  { id: "pezinho", name: "Pezinho", price: 10 },
  { id: "pigmentacao", name: "Pigmentação", price: 25 },
  { id: "pigmentacao_colorida", name: "Pigmentação Colorida", price: 90 },
  { id: "platinado_nevou", name: "Platinado / Nevou", price: 90 },
  { id: "sobrancelha", name: "Sobrancelha", price: 10 }
];

const barbers = [
  { id: "alisson", name: "Alisson", rating: 4.8 },
  { id: "vene", name: "Venê", rating: 4.6 },
  { id: "yuri", name: "Yuri", rating: 4.9 }
];

let selectedDate, selectedTime, selectedService, selectedBarber;
let occupiedSlots = JSON.parse(localStorage.getItem('occupiedSlots')) || [];

// ===== FUNÇÕES =====
function showSection(id){
  const sections = ["bookingSection","servicesSection","barbersSection","signupSection","confirmationSection","ratingSection"];
  sections.forEach(s => document.getElementById(s).style.display = "none");
  document.getElementById(id).style.display = "block";
  if(id==="servicesSection") renderServices();
  if(id==="barbersSection") renderBarbers();
  if(id==="confirmationSection") renderSummary();
  if(id==="bookingSection") renderTimeSlots();
}

// ===== CALENDÁRIO =====
const calendar = document.getElementById("calendar");
const today = new Date();
for(let i=0;i<7;i++){
  const day = new Date(today);
  day.setDate(today.getDate() + i);
  const btn = document.createElement("div");
  btn.className = "time-slot";
  btn.innerText = day.toLocaleDateString("pt-BR",{weekday:'short', day:'2-digit', month:'2-digit'});
  btn.onclick = () => {
    selectedDate = day.toLocaleDateString("pt-BR");
    renderTimeSlots();
  };
  calendar.appendChild(btn);
}

// ===== HORÁRIOS =====
function generateTimeSlots(date){
  let slots = [];
  const day = new Date(date).getDay();
  let start = day===6 ? 9 : 10; // sábado 9h, seg-sex 10h
  let end = day===6 ? 16 : 19; // sábado 16h, seg-sex 19h
  for(let h=start; h<=end; h++){
    for(let m=0; m<60; m+=15){
      const hour = String(h).padStart(2,'0');
      const min = String(m).padStart(2,'0');
      const time = `${hour}:${min}`;
      if(h===end && m>0) continue;
      slots.push(time);
    }
  }
  return slots;
}

function renderTimeSlots(){
  if(!selectedDate) return;
  const container = document.getElementById("timeSlots");
  container.innerHTML = "";
  const slots = generateTimeSlots(selectedDate);
  slots.forEach(t=>{
    const slot = document.createElement("div");
    slot.className = "time-slot";
    slot.innerText = t;
    if(occupiedSlots.includes(`${selectedDate}-${t}`)) slot.classList.add("blocked");
    slot.onclick = ()=>{
      if(slot.classList.contains("blocked")) return;
      selectedTime = t;
      document.querySelectorAll(".time-slot").forEach(s=>s.classList.remove("selected"));
      slot.classList.add("selected");
      showSection("servicesSection");
    };
    container.appendChild(slot);
  });
}

// ===== SERVIÇOS =====
function renderServices(){
  const container = document.getElementById("servicesList");
  container.innerHTML = "";
  services.forEach(s=>{
    const card = document.createElement("div");
    card.className="service-card";
    card.innerHTML=`<strong>${s.name}</strong><br>R$${s.price.toFixed(2)}`;
    card.onclick = ()=>{
      selectedService=s;
      document.querySelectorAll(".service-card").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      showSection("barbersSection");
    };
    container.appendChild(card);
  });
}

// ===== BARBEIROS =====
function renderBarbers(){
  const container = document.getElementById("barbersList");
  container.innerHTML="";
  barbers.forEach(b=>{
    const card=document.createElement("div");
    card.className="barber-card";
    card.innerHTML=`<strong>${b.name}</strong><br>⭐ ${b.rating}`;
    card.onclick=()=>{
      selectedBarber=b;
      document.querySelectorAll(".barber-card").forEach(c=>c.classList.remove("selected"));
      card.classList.add("selected");
      showSection("signupSection");
    };
    container.appendChild(card);
  });
}

// ===== CONFIRMAÇÃO =====
function renderSummary(){
  const summary=document.getElementById("summaryCard");
  summary.innerHTML=`
    <p><strong>Data:</strong> ${selectedDate || "-"}</p>
    <p><strong>Horário:</strong> ${selectedTime || "-"}</p>
    <p><strong>Serviço:</strong> ${selectedService?selectedService.name:"-"}</p>
    <p><strong>Barbeiro:</strong> ${selectedBarber?selectedBarber.name:"-"}</p>
    <p><strong>Valor:</strong> R$${selectedService?selectedService.price.toFixed(2):"0,00"}</p>
  `;
}

function confirmBooking(){
  if(!selectedDate||!selectedTime||!selectedService||!selectedBarber){
    alert("Preencha todos os campos!");
    return;
  }
  occupiedSlots.push(`${selectedDate}-${selectedTime}`);
  localStorage.setItem('occupiedSlots',JSON.stringify(occupiedSlots));
  alert(`Agendamento confirmado!\nData: ${selectedDate}\nHorário: ${selectedTime}`);
  selectedDate=null; selectedTime=null; selectedService=null; selectedBarber=null;
  showSection("bookingSection");
}

// ===== AVALIAÇÃO =====
const stars = document.querySelectorAll(".stars span");
stars.forEach((star,i)=>{
  star.addEventListener("mouseover",()=>stars.forEach((s,j)=>s.classList.toggle("hover", j<=i)));
  star.addEventListener("mouseout",()=>stars.forEach(s=>s.classList.remove("hover")));
  star.addEventListener("click",()=>stars.forEach((s,j)=>s.classList.toggle("selected", j<=i)));
});
function submitRating(){
  const starsCount=document.querySelectorAll(".stars span.selected").length;
  const comment=document.getElementById("ratingComment").value;
  alert(`Avaliação enviada: ${starsCount}⭐\nComentário: ${comment}`);
}
