console.log("UI script loaded");
const API_BASE = 'https://97baaa5b9b939cb01d74193689d81a01.r2.cloudflarestorage.com'; // replace with your actual deployed backend URL

// Initialize select menu
selectMenu.init();

// DOM elements
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const iconGrid = document.getElementById('iconGrid');
const feedbackButton = document.getElementById('feedback');

let icons = []; // Will be filled after fetch

// Load icons from backend
async function loadIcons() {
  const res = await fetch(`${API_BASE}/figma-3d-assets/image-index.json`, {
    headers: {
      Authorization: 'Bearer AU0koHn6PYf2CsN-C1cvs-0mCu1J2h7DLcCNZAlm'
    }
  });
  icons = await res.json();
  filterIcons();
}

// Filter icons based on search and category
function filterIcons() {
  const searchTerm = searchInput.value.toLowerCase();
  const category = categorySelect.value;

  const filteredIcons = icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm);
    const matchesCategory = !category || icon.category === category;
    return matchesSearch && matchesCategory;
  });

  renderIcons(filteredIcons);
}

// Render icons in the grid
function renderIcons(iconsToRender) {
  iconGrid.innerHTML = '';
  
  iconsToRender.forEach(icon => {
    const iconElement = document.createElement('div');
    iconElement.className = 'icon-item';
    iconElement.innerHTML = `
      <img src="${API_BASE}/figma-3d-assets/${icon.thumbnail}" alt="${icon.name}">
      <div class="type type--small">${icon.name}</div>
    `;
    
    iconElement.addEventListener('click', async () => {
      const response = await fetch(`${API_BASE}/figma-3d-assets/${icon.key}`, {
        headers: {
          Authorization: 'AU0koHn6PYf2CsN-C1cvs-0mCu1J2h7DLcCNZAlm'
        }
      });
      const arrayBuffer = await response.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      parent.postMessage({ 
        pluginMessage: { 
          type: 'insert-icon',
          icon: {
            name: icon.name,
            category: icon.category,
            bytes: Array.from(bytes),
          }
        }
      }, '*');
    });
    
    iconGrid.appendChild(iconElement);
  });
}

// Event listeners
searchInput.addEventListener('input', filterIcons);
categorySelect.addEventListener('change', filterIcons);

// feedbackButton.addEventListener('click', () => {
//   window.open('https://github.com/yourusername/airbnb-icon-plugin/issues', '_blank');
// });

// Initial load
console.log('Loading icons...');
loadIcons();