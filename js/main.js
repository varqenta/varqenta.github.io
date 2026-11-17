// Mobil menü
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mainNav.classList.remove("open")));

document.getElementById("year").textContent = new Date().getFullYear();

// Hero: canlı WhatsApp konuşması animasyonu
const script = [
  { side: "in",  t: "03:12", text: "Hallo! Was kostet eine Zirkon-Krone bei Ihnen? Und wie lange muss ich in Istanbul bleiben?" },
  { side: "out", t: "03:12", text: "Hallo! 😊 Zirkonkronen kosten bei uns ca. 180–250 € pro Zahn. Für die Behandlung sind meist 5 Tage nötig – Hotel und Transfer sind im Paket enthalten." },
  { side: "out", t: "03:12", text: "Darf ich Ihren Namen erfahren und haben Sie ein aktuelles Röntgenbild? Dann kann unser Arzt eine kostenlose Ersteinschätzung machen." },
  { side: "in",  t: "03:14", text: "Markus Weber. Ja, ich schicke das Röntgenbild gleich. 📎" },
  { side: "out", t: "03:14", text: "Danke, Herr Weber! Unser Team meldet sich morgen früh mit einem persönlichen Angebot bei Ihnen. 🙏" },
];
const chat = document.getElementById("chat");
const state = document.getElementById("typingState");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function bubble(m) {
  const d = document.createElement("div");
  d.className = "msg " + m.side;
  d.textContent = m.text;
  const t = document.createElement("span");
  t.className = "t";
  t.textContent = m.t + (m.side === "out" ? " ✓✓" : "");
  d.appendChild(t);
  return d;
}
const wait = ms => new Promise(r => setTimeout(r, ms));

async function play() {
  if (reduced) { script.forEach(m => chat.appendChild(bubble(m))); return; }
  while (true) {
    chat.innerHTML = "";
    for (const m of script) {
      if (m.side === "out") {
        state.textContent = "yazıyor…";
        await wait(1100);
        state.textContent = "çevrimiçi";
      } else {
        await wait(1400);
      }
      chat.appendChild(bubble(m));
      while (chat.scrollHeight > chat.clientHeight && chat.children.length > 1) chat.removeChild(chat.firstChild);
    }
    await wait(5000);
  }
}
play();

// Kaydırınca beliren bölümler
const revealEls = document.querySelectorAll(".card, .step, .price-card, .lead-card, .features li, details");
if ("IntersectionObserver" in window && !reduced) {
  revealEls.forEach(el => el.classList.add("reveal"));
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}

// İletişim formu: şimdilik doğrulama + e-posta taslağı açar (sunucuya gönderim yok)
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");
form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("[required]").forEach(i => {
    const bad = !i.value.trim();
    i.classList.toggle("err", bad);
    if (bad) ok = false;
  });
  if (!ok) { msg.textContent = "Lütfen tüm alanları doldurun."; return; }
  const f = new FormData(form);
  const body = `Ad: ${f.get("ad")}\nKlinik: ${f.get("klinik")}\nTelefon: ${f.get("tel")}\nAlan: ${f.get("alan")}`;
  window.location.href = `mailto:hello@varqenta.ai?subject=${encodeURIComponent("Demo talebi – " + f.get("klinik"))}&body=${encodeURIComponent(body)}`;
  msg.textContent = "Teşekkürler! E-posta taslağınız açıldı, göndermeniz yeterli.";
  form.reset();
});
