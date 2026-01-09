fetch('data.json')
.then(res => res.json())
.then(history => {

    const today = new Date().toLocaleDateString('vi-VN');
    document.getElementById('today').innerText = "Dự đoán ngày " + today;

    const freq = {};
    const lastSeen = {};

    history.forEach((num, i) => {
        const de = num.slice(-2);
        freq[de] = (freq[de] || 0) + 1;
        lastSeen[de] = i;
    });

    const scores = [];

    for (let de in freq){
        const tanSuat = freq[de];
        const gan = history.length - 1 - lastSeen[de];
        const score = tanSuat * 2 + gan;

        scores.push({de, tanSuat, gan, score});
    }

    scores.sort((a,b)=>b.score - a.score);

    const best = scores[0];

    document.getElementById('main').innerText = best.de;

    const ul = document.getElementById('top5');
    ul.innerHTML = "";
    scores.slice(0,5).forEach(s=>{
        const li = document.createElement('li');
        li.innerText = `${s.de} — ${s.tanSuat} lần • gan ${s.gan}`;
        ul.appendChild(li);
    });
});
