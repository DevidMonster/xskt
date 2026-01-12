fetch("data.json")
.then(r=>r.json())
.then(data=>{

const all=[]
const last2Days = new Set([...data[0].numbers, ...data[1].numbers])

data.forEach((d,idx)=>{
  d.numbers.forEach(n=>{
    all.push({n,day:idx})
  })
})

const stats={}
all.forEach(o=>{
  if(!stats[o.n]) stats[o.n]={freq:0,last:o.day,gaps:[]}
  let s=stats[o.n]
  s.freq++
  if(s.last!=o.day) s.gaps.push(o.day - s.last)
  s.last=o.day
})

const scored=[]
Object.keys(stats).forEach(n=>{
  let s=stats[n]
  let freq = s.freq/300
  let gap = s.last/300
  let cycle = s.gaps.length ? s.gaps.reduce((a,b)=>a+b)/s.gaps.length : 0
  let penalty = last2Days.has(n) ? 0.4 : 0

  let score = 0.45*freq + 0.35*gap + 0.2*(cycle/300) - penalty
  scored.push({n,score})
})

scored.sort((a,b)=>b.score-a.score)

const top = scored.slice(0,3)

document.getElementById("today").innerHTML =
top.map((x,i)=>`<div>🎯 ${i+1}. <b>${x.n}</b></div>`).join("")
})
