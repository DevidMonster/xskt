async function loadData() {
  const res = await fetch("data.json?_=" + Date.now());
  const data = await res.json();

  const freq = {};
  data.forEach(day => {
    day.numbers.forEach(n => {
      const lo = n.slice(-2);
      freq[lo] = (freq[lo] || 0) + 1;
    });
  });

  const sorted = Object.entries(freq)
    .map(([n, c]) => ({ number: n, count: c }))
    .sort((a, b) => b.count - a.count);

  const recentSet = new Set();
  const RECENT_DAYS = 14;

  data.slice(0, RECENT_DAYS).forEach(day => {
    day.numbers.forEach(n => {
      recentSet.add(n.slice(-2));
    });
  });

  let candidates = sorted.filter(item => !recentSet.has(item.number));

  // 🔑 nếu bị rỗng → fallback
  if (candidates.length === 0) {
    candidates = sorted;
  }

  const today = new Date();
  const dayIndex = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const pickIndex = dayIndex % candidates.length;
  const pick = candidates[pickIndex];

  document.getElementById("today").innerText =
    "📅 " + today.toLocaleDateString("vi-VN");

  document.getElementById("top1").innerHTML =
    `🥇 ${pick.number}<div style="font-size:18px;">Lô đề hôm nay</div>`;

  const list = document.getElementById("list");
  list.innerHTML = "";

  candidates.slice(0, 15).forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = item.number;
    list.appendChild(div);
  });
}

loadData();
