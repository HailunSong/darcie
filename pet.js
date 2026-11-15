/* Darcie the desk pet: a small black pixel dog who lives along the bottom of the screen.
   She wanders on her own, reacts to being petted, eats bones and fetches balls (both earned by
   focus rounds), and lies down awake next to you while a round is running.
   The page talks to her through window.DarciePet: sync(), earned(), info(), say(). */
(function(){
"use strict";
var W = 24, H = 16;
var COL = {K:"#26242b", A:"#0f0e13", D:"#4a4652", W:"#ffffff", N:"#000000", P:"#f28b9a", C:"#e6b26a"};
var EDGE = "rgba(243,234,217,.62)";

var STAND = [
"........................",
"...............KKKKK....",
"..............KKKKKKK...",
".............AKKKKWKK...",
"..K..........AAKKKKKKDD.",
"..K..........AAKKKKKKDN.",
"..KK.........AAKKKKKDDD.",
"...KK.........AKKKKK....",
"....KKKKKKKKKKCCCKK.....",
"....KKKKKKKKKKKKKK......",
"....KKKKKKKKKKKKKK......",
"....KKKDDDDDDDKKKK......",
"....KK.KK....KK.KK......",
"....KK.KK....KK.KK......",
"....KK.KK....KK.KK......",
"....DD.DD....DD.DD......"];
var SIT = [
"........................",
"...............KKKKK....",
"..............KKKKKKK...",
".............AKKKKWKK...",
".............AAKKKKKKDD.",
".............AAKKKKKKDN.",
".............AAKKKKKDDD.",
"..............AKKKKK....",
"............KKCCCKK.....",
"...........KKKKKKKK.....",
"..........KKKKKKKKK.....",
".........KKKKKKKKKK.....",
"........KKKKKKKK.KK.....",
"..K.....KKKKKKKK.KK.....",
"..KK...KKKKKKKKK.KK.....",
"...KKKKKKDDDKKKK.DD....."];
var LIE = [
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"...............KKKKK....",
"..............KKKKKKK...",
".............AKKKKWKK...",
".............AAKKKKKKDD.",
".K...........AAKKKKKKDN.",
".KKKKKKKKKKKKAAKKKKKDDD.",
"..KKKKKKKKKKKKCCCKKKKK..",
"..DDKKKKKKKKKKKKKKKKDDD."];
var SLEEP = [
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"......KKKKKKKK..........",
"....KKKKKKKKKKKKKKKK....",
".K.KKKKKKKKKKKAAKKKKKK..",
".KKKKKKKKKKKKKAAKKKKKDD.",
"..DDKKKKKKKKKKCKKKKKDDN."];

function grid(rows){ return rows.map(function(r){ return r.split(""); }); }
function edit(rows, fn){ var g = grid(rows); fn(g); return g.map(function(r){ return r.join(""); }); }
function put(g, pts, ch){ pts.forEach(function(p){ if (g[p[1]] && p[0] >= 0 && p[0] < W) g[p[1]][p[0]] = ch; }); }
function legs(a, b, c, d){ return function(g){ [12,13,14,15].forEach(function(y, i){ var row = [a,b,c,d][i]; for (var x = 0; x < W; x++) g[y][x] = row[x] || "."; }); }; }
var TAIL_UP = [[2,4],[2,5],[2,6],[3,6],[3,7],[4,7]], TAIL_LOW = [[1,6],[2,6],[2,7],[3,7],[4,7]];
function tailLow(g){ put(g, TAIL_UP, "."); put(g, TAIL_LOW, "K"); }
function blink(g){ for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) if (g[y][x] === "W") g[y][x] = "K"; }
function tongue(g){ put(g, [[20,7],[20,8]], "P"); }

var F = {
  stand: STAND,
  stand2: edit(STAND, tailLow),
  standBlink: edit(STAND, blink),
  happy: edit(STAND, tongue),
  happy2: edit(STAND, function(g){ tongue(g); tailLow(g); }),
  walk1: edit(STAND, legs("...KK...KK..KK...KK.....", "...KK...KK..KK...KK.....", "..KK.....KK.KK....KK....", "..DD.....DD.DD....DD....")),
  walk2: edit(STAND, function(g){ tailLow(g); legs(".....KKKK.....KKKK......", ".....KKKK.....KKKK......", "......KK.......KK.......", "......DD.......DD.......")(g); }),
  sit: SIT,
  sitBlink: edit(SIT, blink),
  sit2: edit(SIT, function(g){ put(g, [[2,13],[2,14],[3,14]], "."); put(g, [[1,14],[2,15],[3,15]], "K"); }),
  lie: LIE,
  lieBlink: edit(LIE, blink),
  lie2: edit(LIE, function(g){ put(g, [[1,12]], "."); put(g, [[0,13]], "K"); }),
  chew: edit(LIE, function(g){ put(g, [[21,14],[22,14]], "P"); }),
  yawn: edit(STAND, function(g){ blink(g); put(g, [[21,6],[22,6],[21,7]], "P"); put(g, [[20,7],[22,7]], "D"); }),
  bow: (function(){ var g = grid(STAND), o = grid(STAND), x, y;           /* a stretch: front end down, tail up */
    for (y = 0; y < H; y++) for (x = 12; x < W; x++) g[y][x] = ".";
    for (y = 0; y < 12; y++) for (x = 12; x < W; x++) if (o[y][x] !== "." && y + 3 < 15) g[y + 3][x] = o[y][x];
    for (x = 13; x < 20; x++) g[15][x] = "D"; g[14][12] = "K"; g[13][12] = "K"; g[12][12] = "K"; g[11][12] = "K";
    return g.map(function(r){ return r.join(""); }); })(),
  scratch: edit(SIT, function(g){ put(g, [[19,9],[20,8],[20,9]], "K"); }),
  scratch2: edit(SIT, function(g){ put(g, [[19,10],[20,10],[20,9]], "K"); }),
  sleep: SLEEP,
  sleep2: edit(SLEEP, function(g){ for (var x = 6; x < 14; x++) g[10][x] = "K"; g[10][6] = "."; g[10][13] = "."; })
};

var BONE = ["WW....WW","WWWWWWWW","WWWWWWWW","WW....WW"];
var BALL = [".CCC.","CCCCC","CCWCC","CCCCC",".CCC."];

function paint(cv, rows, outline){
  var h = rows.length, w = rows[0].length, c = cv.getContext("2d");
  cv.width = w; cv.height = h; c.clearRect(0, 0, w, h);
  var x, y, ch;
  if (outline) for (y = 0; y < h; y++) for (x = 0; x < w; x++){
    if (rows[y][x] !== ".") continue;
    if ((rows[y-1] && rows[y-1][x] !== ".") || (rows[y+1] && rows[y+1][x] !== ".") || (rows[y][x-1] && rows[y][x-1] !== ".") || (rows[y][x+1] && rows[y][x+1] !== ".")){
      c.fillStyle = EDGE; c.fillRect(x, y, 1, 1);
    }
  }
  for (y = 0; y < h; y++) for (x = 0; x < w; x++){ ch = rows[y][x]; if (ch !== "."){ c.fillStyle = COL[ch]; c.fillRect(x, y, 1, 1); } }
}

/* ---------- dom ---------- */
var css = document.createElement("style");
css.textContent =
"#petlayer{position:fixed;left:0;right:0;bottom:max(6px,env(safe-area-inset-bottom));height:190px;pointer-events:none;z-index:5;overflow:visible}" +
"#pet{position:absolute;left:0;bottom:0;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation}" +
"#pet canvas,.item canvas{display:block;image-rendering:pixelated;image-rendering:crisp-edges}" +
"#pet .flip{transition:none}" +
".item{position:absolute;bottom:0;pointer-events:none}" +
"#bubble{position:absolute;left:50%;bottom:100%;transform:translateX(-50%);margin-bottom:8px;background:rgba(255,255,255,.94);color:#000;border-radius:16px;padding:8px 14px;white-space:nowrap;" +
"font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif;font-size:17px;font-weight:500;line-height:1.25;box-shadow:0 6px 20px rgba(0,0,0,.35);opacity:0;transition:opacity .25s;pointer-events:none;text-align:center}" +
"#bubble small{display:block;font-size:13px;font-weight:400;color:rgba(0,0,0,.55);margin-top:1px}" +
"#bubble.on{opacity:1}" +
"#bubble:after{content:'';position:absolute;left:50%;top:100%;margin-left:-6px;border:6px solid transparent;border-top-color:rgba(255,255,255,.94)}" +
"#think{position:absolute;left:50%;bottom:100%;margin:0 0 20px 6px;background:#fff;border-radius:18px;padding:10px 12px;box-shadow:0 6px 20px rgba(0,0,0,.35);opacity:0;transform:scale(.6);transform-origin:0 100%;transition:opacity .3s,transform .3s;pointer-events:none}" +
"#think.on{opacity:1;transform:scale(1)}" +
"#think:before,#think:after{content:'';position:absolute;background:#fff;border-radius:50%}" +
"#think:before{width:11px;height:11px;left:2px;bottom:-9px}" +
"#think:after{width:6px;height:6px;left:-6px;bottom:-17px}" +
"#think canvas{display:block;image-rendering:pixelated;image-rendering:crisp-edges}" +
"#think canvas.pale{filter:sepia(.9) saturate(1.6) brightness(.8)}" +
"#think b{display:block;font-size:26px;line-height:1;color:#f28b9a;font-weight:400;padding:2px 4px}" +
"#pawlayer{position:fixed;left:0;top:0;right:0;bottom:0;pointer-events:none;z-index:4;overflow:hidden}" +
".pawprint{position:absolute;width:26px;height:26px;margin:-13px 0 0 -13px;color:#fff;opacity:0;filter:drop-shadow(0 1px 3px rgba(0,0,0,.45));animation:pawprint 16s ease-out forwards}" +
".pawprint svg{display:block;width:100%;height:100%}" +
"@keyframes pawprint{0%{opacity:0}2%{opacity:.62}60%{opacity:.5}100%{opacity:0}}" +
"@media (max-width:640px),(max-height:520px){.pawprint{width:20px;height:20px;margin:-10px 0 0 -10px}}" +
".heart{position:absolute;bottom:70%;color:#f28b9a;font-size:22px;pointer-events:none;animation:heart 1.1s ease-out forwards}" +
"@keyframes heart{from{transform:translateY(0) scale(.6);opacity:1}to{transform:translateY(-56px) scale(1.15);opacity:0}}" +
".zzz{position:absolute;right:0;bottom:52%;font-family:-apple-system,sans-serif;font-size:17px;color:rgba(255,255,255,.5);display:none;animation:zzz 3s ease-in-out infinite}" +
"@keyframes zzz{0%,100%{transform:translateY(4px);opacity:.3}50%{transform:translateY(-6px);opacity:1}}" +
"#bag{position:absolute;left:100%;bottom:55%;margin-left:6px;display:flex;gap:6px;pointer-events:auto;z-index:6;opacity:0;transform:translateY(6px) scale(.9);transform-origin:0 100%;transition:opacity .2s,transform .2s;visibility:hidden}" +
"#bag.on{opacity:1;transform:none;visibility:visible}" +
"#pet.flipL #bag{left:auto;right:100%;margin:0 6px 0 0}" +
"#bag button{font:inherit;font-size:15px;color:#fff;background:rgba(255,255,255,.1);border:0;border-radius:999px;min-height:44px;padding:0 16px;" +
"display:flex;align-items:center;gap:7px;cursor:pointer}" +
"#bag button:disabled{opacity:.35;cursor:default}" +
"#bag canvas{image-rendering:pixelated;image-rendering:crisp-edges;display:block}" +
":root[data-night='1'] #petlayer{opacity:.5}" +
"@media (prefers-reduced-motion:reduce){.heart,.zzz{animation:none}}";
document.head.appendChild(css);

var layer = document.createElement("div"); layer.id = "petlayer";
var pet = document.createElement("div"); pet.id = "pet";
var flip = document.createElement("div"); flip.className = "flip";
var cv = document.createElement("canvas");
var bubble = document.createElement("div"); bubble.id = "bubble";
var zzz = document.createElement("div"); zzz.className = "zzz"; zzz.textContent = "z z";
var thought = document.createElement("div"); thought.id = "think";
var bagPop = document.createElement("div"); bagPop.id = "bag";
flip.appendChild(cv); pet.appendChild(flip); pet.appendChild(bubble); pet.appendChild(thought); pet.appendChild(bagPop); pet.appendChild(zzz); layer.appendChild(pet);
document.body.appendChild(layer);

/* ---------- state ---------- */
function load(k, d){ try{ var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }
function save(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function dayKey(){ var d = new Date(); return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate(); }
var bag = load("darcie.bag", null);
if (!bag){ bag = {bone: 1, ball: 1, fed: 0, pets: 0, day: dayKey()}; save("darcie.bag", bag); }   /* a starter bone and ball */
function rollDay(){ if (bag.day !== dayKey()){ bag.day = dayKey(); bag.fed = 0; bag.pets = 0; save("darcie.bag", bag); } }

var S = 6, mode = "idle", night = false;
var p = {x: 200, dir: 1, act: "sit", until: 0, target: null, hop: 0, tick: 0, carry: false, home: 60, speed: 1};
var item = null, lastFrame = null, bubbleTimer = 0, lastTf = "", lastFl = "";

function size(){
  S = window.innerWidth < 520 || window.innerHeight < 480 ? 3 : (window.innerWidth < 800 ? 4 : 6);
  cv.style.width = W * S + "px"; cv.style.height = H * S + "px";
  pet.style.width = W * S + "px"; pet.style.height = H * S + "px";
}
function range(){ var w = layer.clientWidth, ab = document.getElementById("albumBtn"), reserve = ab && ab.offsetWidth ? ab.offsetWidth + 20 : 100;      /* keep clear of the turned-up corner */
  return [10, Math.max(40, w - W * S - reserve)]; }
function rnd(a, b){ return a + Math.random() * (b - a); }
function now(){ return Date.now(); }

/* A thought bubble, the way The Sims shows one: no words, only a little picture of what is on her mind —
   a bone, the ball, being petted, or one of the places on her route. */
var thinkTimer = 0;
function think(){
  if (night || mode === "focus" || mode === "paused" || item || bubble.classList.contains("on")) return;
  var roll = Math.random(), c = document.createElement("canvas"), rows = null, k, keys;
  thought.innerHTML = "";
  if (roll < .2) rows = BONE; else if (roll < .35) rows = BALL;
  if (rows){ paint(c, rows, false); c.style.width = rows[0].length * 5 + "px"; c.style.height = rows.length * 5 + "px"; if (rows === BONE) c.className = "pale"; thought.appendChild(c); }
  else if (roll < .5 || !window.Souvenirs){ var b = document.createElement("b"); b.textContent = "♥"; thought.appendChild(b); }
  else { keys = Souvenirs.keys; k = keys[Math.floor(Math.random() * keys.length)]; thought.appendChild(Souvenirs.canvas(k, 5)); }
  thought.classList.add("on"); clearTimeout(thinkTimer);
  thinkTimer = setTimeout(function(){ thought.classList.remove("on"); }, 7000);
}
function unthink(){ thought.classList.remove("on"); clearTimeout(thinkTimer); }
function say(fr, zh, ms){
  unthink();
  bubble.innerHTML = ""; var s = document.createElement("span"); s.lang = "fr"; s.textContent = fr; bubble.appendChild(s);
  if (zh){ var z = document.createElement("small"); z.textContent = zh; bubble.appendChild(z); }
  bubble.classList.add("on"); clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(function(){ bubble.classList.remove("on"); }, ms || 3200);
}
function heart(n){
  for (var i = 0; i < (n || 1); i++) (function(i){ setTimeout(function(){
    var h = document.createElement("div"); h.className = "heart"; h.textContent = "♥"; h.style.left = (30 + Math.random() * 50) + "%";
    pet.appendChild(h); setTimeout(function(){ h.remove(); }, 1200);
  }, i * 180); })(i);
}
function set(act, ms){ p.act = act; p.until = now() + (ms || 0); p.tick = 0; }
function goTo(x, then, speed){ var r = range(); p.target = Math.max(r[0], Math.min(r[1], x)); p.then = then; p.speed = speed || 1; set("walk", 60000); }

function pickNext(){
  var r = range(), roll = Math.random(), h = new Date().getHours();
  if (mode === "break"){ if (roll < .6) goTo(rnd(r[0], r[1]), null, 1.6); else set("stand", rnd(2000, 4000)); return; }
  if (roll < .36) goTo(rnd(r[0], r[1]));
  else if (roll < .56){ set("sit", rnd(8000, 12000)); if (mode === "idle" && Math.random() < .5) think(); }
  else if (roll < .76){ set("lie", rnd(9000, 20000)); if (mode === "idle" && Math.random() < .35) think(); }
  else if (roll < .88) set("bow", 2400);
  else if (roll < .92) set("scratch", 2600);
  else if (roll < .95) set("yawn", 1800);
  else if (roll < .975) set("spin", 2600);
  else if (h >= 13 && h < 16) set("sleep", rnd(20000, 45000));                 /* an afternoon nap */
  else set("stand", rnd(2500, 5000));
}

function step(){
  var t = now(), r = range(); p.tick++;
  if (p.x > r[1] && p.act !== "walk") p.x = r[1];

  /* what the page is doing decides the big picture */
  if (night && p.act !== "sleep" && !item){ set("sleep", 1e12); }
  if (!night && (mode === "focus" || mode === "paused") && !item){
    if (p.act !== "lie" && p.act !== "walk"){ if (Math.abs(p.x - r[1]) > 8) goTo(r[1], function(){ set("lie", 1e12); }); else set("lie", 1e12); }
  }

  var frame = "stand";
  if (p.act === "walk"){
    var d = p.target - p.x, v = 6.2 * p.speed * (S / 6);
    if (Math.abs(d) <= v){ p.x = p.target; var th = p.then; p.then = null; p.target = null; if (th) th(); else set("stand", rnd(800, 2000)); }
    else { p.dir = d > 0 ? 1 : -1; p.x += p.dir * v; }
    frame = p.tick % 2 ? "walk1" : "walk2";
  } else if (p.act === "stand"){
    frame = p.tick % 23 === 0 ? "standBlink" : (Math.floor(p.tick / 3) % 2 ? "stand2" : "stand");
  } else if (p.act === "sit"){
    frame = p.tick % 19 === 0 ? "sitBlink" : (Math.floor(p.tick / 4) % 5 === 0 ? "sit2" : "sit");
  } else if (p.act === "lie"){
    frame = p.tick % 21 === 0 ? "lieBlink" : (Math.floor(p.tick / 5) % 6 === 0 ? "lie2" : "lie");
  } else if (p.act === "eat"){
    frame = p.tick % 2 ? "chew" : "lie";
  } else if (p.act === "sleep"){
    frame = Math.floor(p.tick / 7) % 2 ? "sleep2" : "sleep";
  } else if (p.act === "bow"){
    frame = p.tick < 3 || p.until - t < 400 ? "stand" : "bow";
  } else if (p.act === "scratch"){
    frame = p.tick % 2 ? "scratch" : "scratch2";
  } else if (p.act === "yawn"){
    frame = p.tick > 2 && p.until - t > 400 ? "yawn" : "stand";
  } else if (p.act === "spin"){
    frame = p.tick % 2 ? "walk1" : "walk2"; if (p.tick % 3 === 0) p.dir = -p.dir;
  } else if (p.act === "happy"){
    frame = p.tick % 2 ? "happy" : "happy2"; p.hop = Math.abs(Math.sin(p.tick * 0.9)) * 2.4 * S;
  }
  if (p.act !== "happy") p.hop = 0;
  zzz.style.display = p.act === "sleep" ? "block" : "none";

  if (t > p.until && p.act !== "walk"){
    if (p.act === "eat"){ if (item){ item.el.remove(); item = null; } bag.fed++; save("darcie.bag", bag); paintBag(); heart(3); say("Miam ! Merci.", "真好吃！谢谢。"); set("happy", 1600); }
    else if (night || mode === "focus" || mode === "paused"){ /* stay put */ p.until = t + 1e12; }
    else pickNext();
  }

  if (frame !== lastFrame){ paint(cv, F[frame], true); lastFrame = frame; }
  var tf = "translate(" + Math.round(p.x) + "px," + Math.round(-p.hop) + "px)", fl = p.dir < 0 ? "scaleX(-1)" : "none";
  if (tf !== lastTf){ pet.style.transform = tf; lastTf = tf; }
  if (fl !== lastFl){ flip.style.transform = fl; lastFl = fl; }
  if (item && item.kind === "ball" && p.carry){ item.el.style.left = Math.round(p.x + (p.dir > 0 ? W * S - 3 * S : -2 * S)) + "px"; item.el.style.bottom = 7 * S + "px"; }
}

/* ---------- things she can be given ---------- */
function drop(kind){
  if (item || night || mode === "focus" || mode === "paused" || bag[kind] < 1) return;
  unthink();
  rollDay(); bag[kind]--; save("darcie.bag", bag); hideBag(); paintBag();
  var r = range(), rows = kind === "bone" ? BONE : BALL, el = document.createElement("div"), c = document.createElement("canvas");
  el.className = "item"; el.appendChild(c); paint(c, rows, true);
  c.style.width = rows[0].length * S + "px"; c.style.height = rows.length * S + "px";
  var x = rnd(r[0] + 40, r[1]); if (Math.abs(x - p.x) < 140) x = p.x > (r[0] + r[1]) / 2 ? r[0] + 30 : r[1] - 10;
  el.style.left = Math.round(x + (kind === "bone" ? W * S - 4 * S : 0)) + "px";
  el.animate ? el.animate([{transform: "translateY(-150px)"}, {transform: "translateY(0)"}, {transform: "translateY(-" + (kind === "ball" ? 46 : 10) + "px)"}, {transform: "translateY(0)"}],
    {duration: 800, easing: "ease-in"}) : 0;
  layer.insertBefore(el, pet); item = {kind: kind, el: el, x: x}; p.carry = false; paintBag();
  if (kind === "bone"){
    say("Oh !", "骨头！", 1200);
    goTo(x, function(){ p.dir = 1; set("eat", 3200); }, 3.6);
  } else {
    var back = p.x; say("La balle !", "球！", 1200);
    goTo(x, function(){ p.carry = true; goTo(back, function(){
      p.carry = false; if (item){ item.el.remove(); item = null; } paintBag(); heart(2); say("Encore !", "再来一次！"); set("happy", 1800);
    }, 3); }, 4.6);
  }
}

var PET_LINES = [["Ouaf !", "汪！"], ["Encore !", "再摸摸！"], ["J'adore ça.", "我最喜欢这样了。"], ["Hihi.", "嘿嘿。"], ["Tu es là !", "你在呀！"], ["Gratte-moi l'oreille.", "挠挠耳朵。"]];
pet.addEventListener("click", function(e){
  e.stopPropagation(); rollDay(); bag.pets++; save("darcie.bag", bag); unthink();
  bubble.classList.remove("on");
  if (night){ heart(1); return; }
  if (mode === "focus" || mode === "paused"){ heart(1); return; }           /* a quiet thank-you, nothing that pulls you away */
  if (p.act === "eat" || (p.act === "walk" && item)) { heart(1); return; }
  if ((bag.bone > 0 || bag.ball > 0) && !bagPop.classList.contains("on")){ heart(2); showBag(); set("happy", 1200); return; }      /* first tap: what she could have */
  hideBag();
  heart(2); var l = PET_LINES[Math.floor(Math.random() * PET_LINES.length)];
  if (bag.pets % 7 === 0) l = ["Je t'aime.", "我爱你。"];
  say(l[0], l[1]); p.target = null; p.then = null; set("happy", 1500);
});

/* ---------- the bag: bone and ball buttons ---------- */
var bagEl = null;
var bagTimer = 0;
function showBag(){ paintBag(); bagPop.classList.add("on"); pet.classList.toggle("flipL", p.x > layer.clientWidth * .6); clearTimeout(bagTimer); bagTimer = setTimeout(hideBag, 6000); }
function hideBag(){ bagPop.classList.remove("on"); clearTimeout(bagTimer); }
function paintBag(){
  bagEl = bagEl || document.getElementById("bag"); if (!bagEl) return;
  if (!bagEl.firstChild){
    [["bone", BONE, "Os"], ["ball", BALL, "Balle"]].forEach(function(d){
      var b = document.createElement("button"), c = document.createElement("canvas"), s = document.createElement("span");
      b.type = "button"; b.id = "bag-" + d[0]; paint(c, d[1], false); c.style.width = d[1][0].length * 3 + "px"; c.style.height = d[1].length * 3 + "px";
      b.appendChild(c); b.appendChild(s); b.setAttribute("data-name", d[2]);
      b.addEventListener("click", function(e){ e.stopPropagation(); drop(d[0]); });
      bagEl.appendChild(b);
    });
  }
  ["bone", "ball"].forEach(function(k){
    var b = document.getElementById("bag-" + k); if (!b) return;
    b.lastChild.textContent = String(bag[k]);
    b.disabled = bag[k] < 1 || night || mode === "focus" || mode === "paused" || !!item;
    b.setAttribute("aria-label", (k === "bone" ? "喂 Darcie 一根骨头" : "给 Darcie 扔球") + "，还有 " + bag[k] + " 个");
  });
  if (night || mode === "focus" || mode === "paused" || item || (bag.bone < 1 && bag.ball < 1)) hideBag();
}

/* ---------- what the page can ask of her ---------- */
/* Her paw prints: now and then a short trail crosses the photo somewhere, at a time and place of its own choosing,
   as if she had just trotted through. They fade after a quarter of a minute and never take a tap. */
var PRINT = '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="16.5" rx="5" ry="4.3"/><circle cx="5.8" cy="10.2" r="2.3"/><circle cx="9.9" cy="6.3" r="2.3"/><circle cx="14.1" cy="6.3" r="2.3"/><circle cx="18.2" cy="10.2" r="2.3"/></svg>';
var pawLayer = document.createElement("div"); pawLayer.id = "pawlayer"; pawLayer.setAttribute("aria-hidden", "true"); document.body.appendChild(pawLayer);
function pawTrail(){
  if (night || mode === "focus" || mode === "paused" || document.hidden) return false;
  var w = window.innerWidth, h = window.innerHeight, small = w < 641 || h < 521, stride = small ? 34 : 46, side = small ? 8 : 11;
  var n = 4 + Math.floor(Math.random() * 4), a = Math.random() * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a);
  var x = w * (.1 + Math.random() * .8), y = h * (.14 + Math.random() * .6);
  if (x + dx * stride * n < 20 || x + dx * stride * n > w - 20) dx = -dx;       /* turn the trail back onto the screen */
  if (y + dy * stride * n < 20 || y + dy * stride * n > h - 20) dy = -dy;
  var deg = Math.atan2(dy, dx) * 180 / Math.PI + 90;
  for (var i = 0; i < n; i++) (function(i){ setTimeout(function(){
    var e = document.createElement("div"), sgn = i % 2 ? 1 : -1; e.className = "pawprint"; e.innerHTML = PRINT;
    e.style.left = Math.round(x + dx * stride * i - dy * side * sgn) + "px"; e.style.top = Math.round(y + dy * stride * i + dx * side * sgn) + "px";
    e.style.transform = "rotate(" + Math.round(deg + sgn * 9) + "deg)";
    pawLayer.appendChild(e); setTimeout(function(){ e.remove(); }, 16500);
  }, i * 380); })(i);
  return true;
}
(function schedule(first){
  setTimeout(function(){ pawTrail(); schedule(false); }, first ? rnd(25000, 80000) : rnd(120000, 540000));   /* soon after opening, then every 2–9 minutes */
})(true);

window.DarciePet = {
  paws: pawTrail,
  think: think,
  sync: function(o){
    var changed = o.mode !== mode || !!o.night !== night; var was = mode;
    mode = o.mode; night = !!o.night;
    if (!changed) return;
    if (!night && p.act === "sleep" && p.until > now() + 1e9) set("stand", 1200);            /* morning */
    if (mode === "focus" && was !== "paused") { p.target = null; p.then = null; if (p.act !== "lie") set("stand", 0); }
    if ((mode === "idle" || mode === "break") && (was === "focus" || was === "paused") && p.act === "lie") set("stand", 600);
    paintBag();
  },
  earned: function(n, goal, gift){
    rollDay(); bag.bone++; if (n === goal) bag.ball++; save("darcie.bag", bag); paintBag();
    p.target = null; p.then = null; heart(3); set("happy", 2200);
    if (gift) say("Un souvenir de " + gift[0] + " !", "我从" + gift[1] + "带回一件纪念品：" + gift[2] + "！", 5200);
    else if (n === goal) say("Quatre ! Une balle pour moi ?", "四轮！奖我一个球吧？", 4200); else say("Bravo ! Un os pour moi ?", "真棒！奖我一根骨头吧？", 4200);
  },
  remind: function(fr, zh){                       /* the hourly nudge: she stretches, then says it and keeps the bubble up for a while */
    if (night) return;
    if (!item){ p.target = null; p.then = null; set("bow", 3200); }
    say(fr, zh, 90000);
  },
  info: function(){ rollDay(); return {bone: bag.bone, ball: bag.ball, fed: bag.fed, pets: bag.pets}; },
  say: say
};

size(); window.addEventListener("resize", size);
paint(cv, F.sit, true); paintBag();
setInterval(function(){ if (!document.hidden) step(); }, 200);     /* five steps a second is plenty for a pixel dog, and nothing runs while the screen is off */
document.addEventListener("DOMContentLoaded", paintBag);
})();
