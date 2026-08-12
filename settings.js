// Simple localStorage-backed settings UI
const LS_REPS = 'lm_reps_v1';
const LS_CATS = 'lm_cats_v1';

function load(key){ try { return JSON.parse(localStorage.getItem(key))||[] } catch(e){ return [] } }
function save(key, v){ localStorage.setItem(key, JSON.stringify(v)) }

function el(id){ return document.getElementById(id) }

function renderReps(){
  const list = el('rep-list'); list.innerHTML = '';
  const reps = load(LS_REPS);
  reps.forEach((r, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${escapeHtml(r.name)}</strong>
        <div class="item-meta">${escapeHtml(r.email||'')}</div>
      </div>
      <div class="actions">
        <button data-i="${i}" class="del-rep">Delete</button>
      </div>`;
    list.appendChild(li);
  });
}
function renderCats(){
  const list = el('cat-list'); list.innerHTML = '';
  const cats = load(LS_CATS);
  cats.forEach((c, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div><strong>${escapeHtml(c)}</strong></div>
      <div class="actions">
        <button data-i="${i}" class="del-cat">Delete</button>
      </div>`;
    list.appendChild(li);
  });
}

function escapeHtml(s){ return (s||'').toString().replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])) }

document.addEventListener('DOMContentLoaded', () => {
  renderReps(); renderCats();

  el('rep-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = el('rep-name').value.trim();
    const email = el('rep-email').value.trim();
    if (!name) return;
    const reps = load(LS_REPS);
    reps.push({name, email});
    save(LS_REPS, reps);
    el('rep-name').value=''; el('rep-email').value='';
    renderReps();
  });

  el('cat-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = el('cat-name').value.trim();
    if (!name) return;
    const cats = load(LS_CATS);
    if (!cats.includes(name)) cats.push(name);
    save(LS_CATS, cats);
    el('cat-name').value='';
    renderCats();
  });

  document.body.addEventListener('click', e => {
    if (e.target.matches('.del-rep')){
      const i = +e.target.dataset.i;
      const reps = load(LS_REPS); reps.splice(i,1); save(LS_REPS,reps); renderReps();
    }
    if (e.target.matches('.del-cat')){
      const i = +e.target.dataset.i;
      const cats = load(LS_CATS); cats.splice(i,1); save(LS_CATS,cats); renderCats();
    }
  });

  el('clear-data').addEventListener('click', () => {
    if (confirm('Clear demo data?')) {
      localStorage.removeItem(LS_REPS); localStorage.removeItem(LS_CATS);
      renderReps(); renderCats();
    }
  });
});
