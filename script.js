const menuToggle = document.querySelector('#menuToggle');
const navLinks = document.querySelector('#navLinks');
const themeToggle = document.querySelector('#themeToggle');

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const light = document.body.classList.contains('light-theme');
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  themeToggle.title = light ? 'Switch to dark theme' : 'Switch to light theme';
});

const filterButtons = [...document.querySelectorAll('.filter-btn')];
const projectCards = [...document.querySelectorAll('.project-card[data-category]')];
const searchInput = document.querySelector('#projectSearch');
const emptyState = document.querySelector('#emptyState');
const resultCount = document.querySelector('#resultCount');
let activeFilter = 'all';
function applyFilters() {
  const q = (searchInput?.value || '').trim().toLowerCase();
  let shown = 0;
  projectCards.forEach(card => {
    const cats = (card.dataset.category || '').split(/\s+/);
    const show = (activeFilter === 'all' || cats.includes(activeFilter)) && (!q || card.textContent.toLowerCase().includes(q));
    card.classList.toggle('is-hidden', !show);
    if (show) { card.classList.add('visible'); shown++; }
  });
  resultCount.textContent = shown + ' of ' + projectCards.length + ' projects';
  emptyState.hidden = shown > 0;
  if (!shown) {
    const robo = activeFilter === 'robotics' && !q;
    document.querySelector('#emptyTitle').textContent = robo ? 'No completed robotics builds yet.' : 'No projects match.';
    document.querySelector('#emptyText').textContent = robo ? 'Robotics is an area of interest connected to embedded and control work. Builds will be added once they are documented.' : 'Try a different keyword or category.';
  }
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach(item => { const on = item === button; item.classList.toggle('active', on); item.setAttribute('aria-pressed', String(on)); });
  applyFilters();
}));
searchInput?.addEventListener('input', applyFilters);
document.querySelector('#resetFilters')?.addEventListener('click', () => { searchInput.value = ''; filterButtons[0].click(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && navLinks.classList.contains('open')) { navLinks.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.focus(); } });
applyFilters();

const revealNodes = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealNodes.forEach(node => observer.observe(node));
} else revealNodes.forEach(node => node.classList.add('visible'));

document.querySelector('#year').textContent = new Date().getFullYear();
