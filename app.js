async function loadData() {
  const res = await fetch("data.json?_=" + Date.now());
  const data = await res.json();

  const freq = {};
  data.forEach(day => {
    day.numbers.forEach(n => {
      freq[n] = (freq[n] || 0) + 1;
    });
  });

  const sorted = Object.entries(freq)
    .map(([n, c]) => ({ number: n, count: c }))
    .sort((a, b) => b.count - a.count);

  const today = new Date();
  document.getElementById("today").innerText =
    "📅 " + today.toLocaleDateString("vi-VN");

  document.getElementById("top1").innerHTML =
    `🥇 ${sorted[0].number}<div style="font-size:18px;">Xác suất cao nhất</div>`;

  const list = document.getElementById("list");
  list.innerHTML = "";

  sorted.slice(1, 16).forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = item.number;
    list.appendChild(div);
  });
}

loadData();
