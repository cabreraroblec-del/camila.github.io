// Datos 
const DATA = {
  languages: [
    { name: 'Español', level: 'Nativo', score: 100 },
    { name: 'Inglés', level: 'B2 (alto)', score: 80 },
    { name: 'Italiano', level: 'Medio/Bajo', score: 45 },
  ],
  skills: [
    { name: 'Comunicación', score: 90 },
    { name: 'Resolución de problemas', score: 90 },
    { name: 'Paquete Office', score: 85 },
    { name: 'Resultados ágiles', score: 80 },
    { name: 'Herram. digitales (diseño, App Inventor, Tinkercad, contenidos)', score: 60 },
  ],
  education: [
    { title: 'Escuela Nº36 “Santa Teresita”', period: '2014–2019', desc: 'Estudios primarios.' },
    { title: 'Cultural Inglesa', period: '2015–2023', desc: 'Estudios de idioma.' },
    { title: 'Colegio Plaza Mayor D-110', period: '2020–2024', desc: 'Secundario (en curso en ese periodo).' },
    { title: 'Escuela del CAE D-170', period: '2025', desc: 'Secundario (no finalizado).' },
  ],
  hobbies: [
    { t: 'Vóley', d: 'Practicado de forma continua durante 7 años.' },
    { t: 'Hockey', d: '2 años de práctica.' },
    { t: 'Running y gimnasio', d: 'Entrenamiento regular.' },
    { t: 'Dibujo y cerámica', d: 'Interés artístico y manual.' },
  ]
};

// Utilitarios
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

// Header typing effect
(function typing(){
  const el = $('.typing');
  const full = el.textContent.trim();
  el.textContent = '';
  let i = 0;
  const tick = () => {
    el.textContent = full.slice(0, i++);
    if (i<=full.length) requestAnimationFrame(tick);
  };
  tick();
})();

// Poblado de idiomas y habilidades
function renderChips(){
  const wrap = $('#languages'); wrap.innerHTML = '';
  DATA.languages.forEach(({name, level, score}) => {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.innerHTML = `<strong>${name}</strong> · ${level}`;
    const prog = document.createElement('div');
    prog.className = 'progress';
    const fill = document.createElement('span');
    fill.style.width = '0%';
    prog.appendChild(fill);
    chip.appendChild(prog);
    wrap.appendChild(chip);
    // animación progresiva
    requestAnimationFrame(()=>{
      fill.style.width = Math.max(score, 5) + '%';
    });
  });
}
function renderSkills(){
  const wrap = $('#skills'); wrap.innerHTML = '';
  DATA.skills.forEach(({name, score})=>{
    const el = document.createElement('div');
    el.className = 'chip';
    el.innerHTML = `<span>🛠️</span><div><div><strong>${name}</strong></div><div class="progress"><span style="width:0%"></span></div></div>`;
    wrap.appendChild(el);
    requestAnimationFrame(()=>{ el.querySelector('span+div .progress span').style.width = score + '%'; });
  });
}
renderChips();
renderSkills();

// Educación 
function renderEducation(filter=''){
  const list = $('#educationList');
  list.innerHTML = '';
  const tpl = $('#educationItem');
  DATA.education
    .filter(e => (e.title + e.desc + e.period).toLowerCase().includes(filter.toLowerCase()))
    .forEach(e => {
      const node = tpl.content.cloneNode(true);
      node.querySelector('.timecard__title').textContent = e.title;
      node.querySelector('.timecard__meta').textContent = e.period;
      node.querySelector('.timecard__desc').textContent = e.desc;
      list.appendChild(node);
    });
}
renderEducation();

$('#eduSearch').addEventListener('input', e => renderEducation(e.target.value));
window.addEventListener('keydown', e => { if (e.key === '/') { e.preventDefault(); $('#eduSearch').focus(); } });

// Hobbies
function renderHobbies(){
  const ul = $('#hobbyList'); ul.innerHTML='';
  DATA.hobbies.forEach(h => {
    const li = document.createElement('li');
    li.innerHTML = `<h4>${h.t}</h4><p class="muted">${h.d}</p>`;
    ul.appendChild(li);
  });
}
renderHobbies();

// Tabs
$$('.tab').forEach(btn => btn.addEventListener('click', () => {
  $$('.tab').forEach(b => b.classList.toggle('active', b===btn));
  $$('.panel').forEach(p => p.classList.toggle('active', p.id === btn.dataset.tab));
  // Accesibilidad ARIA
  $$('.tab').forEach(tabBtn => {
    tabBtn.setAttribute('aria-selected', tabBtn === btn ? 'true' : 'false');
  });
  $$('.panel').forEach(panel => {
    panel.setAttribute('tabindex', panel.id === btn.dataset.tab ? '0' : '-1');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}));

// Tema (oscuro/claro) + persistencia
const THEME_KEY = 'camila-theme';
function setTheme(mode){
  document.documentElement.dataset.theme = mode;
  localStorage.setItem(THEME_KEY, mode);
}
$('#themeToggle').addEventListener('click', () => {
  const isDark = document.documentElement.dataset.theme !== 'light';
  setTheme(isDark? 'light' : 'dark');
});
setTheme(localStorage.getItem(THEME_KEY) || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

// Imprimir / PDF
$('#printBtn').addEventListener('click', () => window.print());

// Edad calculada automáticamente
(function calcAge(){
  const el = document.querySelector('[data-age]');
  const birth = new Date('2008-03-11T00:00:00-03:00');
  const now = new Date();
  const years = new Date(now - birth).getUTCFullYear() - 1970;
  el.textContent = `11/03/2008 (${years} años)`;
})();

// Copiar al portapapeles
$$('[data-copy]').forEach(a => {
  a.addEventListener('click', e => {
    const txt = a.textContent.trim();
    navigator.clipboard?.writeText(txt).then(()=>{
      a.classList.add('copied');
      setTimeout(()=>a.classList.remove('copied'), 800);
    });
  });
});

//Background particles (canvas)
(function particles(){
  const canvas = document.getElementById('bg-particles');
  const ctx = canvas.getContext('2d');
  let W, H, dots;
  function resize(){
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
    dots = Array.from({length: Math.min(120, Math.floor(W*H/18000))}, () => ({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: (Math.random()-.5)*0.7,
      vy: (Math.random()-.5)*0.7
    }));
  }
  function step(){
    ctx.clearRect(0,0,W,H);
    for(const d of dots){
      d.x += d.vx; d.y += d.vy;
      if(d.x<0||d.x>W) d.vx*=-1;
      if(d.y<0||d.y>H) d.vy*=-1;
      ctx.fillStyle = 'rgba(147, 51, 234, .15)';
      ctx.beginPath(); ctx.arc(d.x, d.y, 2, 0, Math.PI*2); ctx.fill();
    }
    requestAnimationFrame(step);
  }
  addEventListener('resize', resize);
  resize(); step();
})();

// Accesos rápidos
addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'p') { e.preventDefault(); window.print(); }
  if (e.key.toLowerCase() === 'd') { e.preventDefault(); $('#themeToggle').click(); }
});

//Año actual en footer
$('#year').textContent = new Date().getFullYear();

