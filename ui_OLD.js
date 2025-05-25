const API_BASE = 'https://figma-plugin-images.s3.ap-south-1.amazonaws.com';

console.log("UI script loaded");

const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const iconGrid = document.getElementById('iconGrid');

let icons = [];

async function loadIcons() {
  try {
    console.log("Fetching icons...");
    const res = await fetch(`${API_BASE}/figma-3d-assets/image-index.json`);
    icons = await res.json();
    console.log("Icons loaded:", icons);
    filterIcons();
  } catch (error) {
    console.error("Failed to load icons:", error);
  }
}

function filterIcons() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categorySelect.value;

  const filtered = icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm);
    const matchesCategory = !category || icon.category === category;
    return matchesSearch && matchesCategory;
  });

  renderIcons(filtered);
}

function renderIcons(iconList) {
  iconGrid.innerHTML = '';

  iconList.forEach(icon => {
    const item = document.createElement('div');
    item.className = 'icon-item';
    item.innerHTML = `
      <img src="${API_BASE}/figma-3d-assets/${icon.thumbnail}" alt="${icon.name}" />
      <div class="icon-label">${icon.name}</div>
    `;

    item.addEventListener('click', async () => {
      const response = await fetch(`${API_BASE}/figma-3d-assets/${icon.key}`);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      parent.postMessage({
        pluginMessage: {
          type: 'insert-icon',
          icon: {
            name: icon.name,
            category: icon.category,
            bytes: Array.from(bytes)
          }
        }
      }, '*');
    });

    iconGrid.appendChild(item);
  });
}

searchInput.addEventListener('input', filterIcons);
categorySelect.addEventListener('change', filterIcons);

loadIcons();
