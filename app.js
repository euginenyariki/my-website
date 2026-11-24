/* Aster Resume Studio — local-only résumé builder. No account, no server, no keys. */
const KEY = 'aster:resume:v1';
const starter = {
  name: 'Eugine Nyariki',
  title: 'Full-stack Developer & IT Consultant',
  email: 'euginenyariki100@gmail.com',
  phone: '+254 712 345 678',
  location: 'Nairobi, Kenya',
  links: 'github.com/euginenyariki',
  summary: 'Full-stack developer and IT consultant building reliable web systems, payment platforms and security tooling for small teams.',
  experience: [
    { role: 'Full-stack Developer', company: 'Independent', period: '2023 — Present', details: 'Designed and shipped payment, marketplace and operations platforms.\nOwned architecture, implementation and deployment end to end.' },
    { role: 'IT & Network Engineer', company: 'Consulting', period: '2021 — 2023', details: 'Implemented networks, security audits and managed support for SMEs.' },
  ],
  education: [{ school: 'University', degree: 'BSc, Computer Science', period: '2018 — 2022' }],
  projects: [
    { name: 'HotspotPay', url: 'github.com/euginenyariki/hotspotpay', details: 'M-Pesa WiFi voucher platform with MikroTik and Linux agent provisioning.' },
    { name: 'ForgeKit Studio', url: 'github.com/euginenyariki/forgekit-studio', details: 'Template scaffolding engine with web UI, CLI and shared core.' },
  ],
  skills: 'TypeScript, Next.js, React, Node.js, PostgreSQL, Prisma, Azure, Docker, Network security',
};
let state = load();
let saveTimer;

function load() {
  try { const raw = localStorage.getItem(KEY); if (raw) return { ...structuredClone(starter), ...JSON.parse(raw) }; } catch (_) {}
  return structuredClone(starter);
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); document.getElementById('updated').textContent = 'Saved'; } catch (_) { document.getElementById('updated').textContent = 'Storage full'; }
}
function esc(v) { return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function toast(m) { const t = document.getElementById('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200); }
function bullets(text) { return String(text || '').split('\n').map(s => s.trim()).filter(Boolean); }

function renderPreview() {
  const s = state;
  const exp = s.experience.filter(x => x.role || x.company).map(x => `<div class="entry"><div class="entry-head"><strong>${esc(x.role) || 'Role'}</strong><span>${esc(x.period)}</span></div><div class="entry-sub">${esc(x.company)}</div>${bullets(x.details).length ? '<ul>' + bullets(x.details).map(b => `<li>${esc(b)}</li>`).join('') + '</ul>' : ''}</div>`).join('');
  const edu = s.education.filter(x => x.school || x.degree).map(x => `<div class="entry"><div class="entry-head"><strong>${esc(x.school)}</strong><span>${esc(x.period)}</span></div><div class="entry-sub">${esc(x.degree)}</div></div>`).join('');
  const proj = s.projects.filter(x => x.name).map(x => `<div class="entry"><div class="entry-head"><strong>${esc(x.name)}</strong><span>${esc(x.url)}</span></div><div class="entry-sub">${esc(x.details)}</div></div>`).join('');
  const skills = String(s.skills || '').split(',').map(x => x.trim()).filter(Boolean).map(x => `<span class="chip">${esc(x)}</span>`).join('');
  document.getElementById('resume').innerHTML = `
    <h1>${esc(s.name) || 'Your name'}</h1>
    <p class="headline">${esc(s.title) || 'Your headline'}</p>
    <p class="contact">[${[s.email, s.phone, s.location, s.links].filter(Boolean).map(esc).join(' · ')}]</p>
    ${s.summary ? `<h2>Profile</h2><p class="summary">${esc(s.summary)}</p>` : ''}
    ${exp ? `<h2>Experience</h2>${exp}` : ''}
    ${edu ? `<h2>Education</h2>${edu}` : ''}
    ${proj ? `<h2>Projects</h2>${proj}` : ''}
    ${skills ? `<h2>Skills</h2><div class="skills">${skills}</div>` : ''}`;
}

function renderItems(kind) {
  const config = {
    experience: { list: 'experienceList', fields: [['role', 'Role'], ['company', 'Company'], ['period', 'Period']], area: ['details', 'Achievements, one per line'] },
    education: { list: 'educationList', fields: [['school', 'School'], ['degree', 'Qualification'], ['period', 'Period']] },
    projects: { list: 'projectsList', fields: [['name', 'Project name'], ['url', 'Link']], area: ['details', 'Short description'] },
  }[kind];
  const host = document.getElementById(config.list);
  host.innerHTML = state[kind].map((item, i) => `<div class="item" data-kind="${kind}" data-index="${i}">
    <div class="item-top"><strong>#${i + 1}</strong><button class="remove" data-remove="${i}">Remove</button></div>
    <div class="row">${config.fields.map(([key, label]) => `<label>${label}<input data-item="${key}" value="${esc(item[key])}" /></label>`).join('')}</div>
    ${config.area ? `<label>${config.area[1]}<textarea data-item="${config.area[0]}" rows="2">${esc(item[config.area[0]])}</textarea></label>` : ''}
  </div>`).join('') || '<p class="muted">Nothing here yet — add an entry above.</p>';
}
function renderAll() { renderPreview(); ['experience', 'education', 'projects'].forEach(renderItems); }

document.addEventListener('DOMContentLoaded', () => {
  for (const el of document.querySelectorAll('[data-field]')) el.value = state[el.dataset.field] || '';
  renderAll();

  document.querySelector('.editor').addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.field) state[el.dataset.field] = el.value;
    if (el.dataset.item) {
      const box = el.closest('[data-kind]');
      state[box.dataset.kind][Number(box.dataset.index)][el.dataset.item] = el.value;
    }
    document.getElementById('updated').textContent = 'Saving…';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { persist(); renderPreview(); }, 180);
  });

  document.querySelector('.editor').addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const kind = add.dataset.add;
      const blank = { experience: { role: '', company: '', period: '', details: '' }, education: { school: '', degree: '', period: '' }, projects: { name: '', url: '', details: '' } }[kind];
      state[kind].push(blank); renderItems(kind); persist(); return;
    }
    const rm = e.target.closest('[data-remove]');
    if (rm) {
      const box = rm.closest('[data-kind]');
      state[box.dataset.kind].splice(Number(rm.dataset.remove), 1);
      renderItems(box.dataset.kind); renderPreview(); persist();
    }
  });

  document.getElementById('printBtn').addEventListener('click', () => { persist(); window.print(); });
  document.getElementById('saveBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'aster-resume.json'; a.click(); URL.revokeObjectURL(a.href);
    toast('Résumé exported as JSON');
  });
  document.getElementById('loadBtn').addEventListener('click', () => document.getElementById('fileInput').click());
  document.getElementById('fileInput').addEventListener('change', async e => {
    const file = e.target.files[0]; if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data || typeof data !== 'object') throw new Error('Invalid file');
      state = { ...structuredClone(starter), ...data };
      for (const key of ['experience', 'education', 'projects']) if (!Array.isArray(state[key])) state[key] = [];
      for (const el of document.querySelectorAll('[data-field]')) el.value = state[el.dataset.field] || '';
      renderAll(); persist(); toast('Résumé imported');
    } catch (_) { toast('Could not read that JSON file'); }
    e.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Replace your details with the sample résumé?')) return;
    state = structuredClone(starter);
    for (const el of document.querySelectorAll('[data-field]')) el.value = state[el.dataset.field] || '';
    renderAll(); persist(); toast('Sample résumé restored');
  });
});
