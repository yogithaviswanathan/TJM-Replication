// Menu data and state
let menuData = {};
let currentFilter = 'all';

// Map filter button values to JSON category names
const categoryMap = {
  'all': 'all',
  'soups': 'Soups',
  'veg-appetizer': 'Veg Appetizer',
  'non-veg-appetizer': 'Non Veg Appetizer',
  'egg-appetizer': 'Egg Appetizer',
  'biriyani': 'Briyani',
  'veg-curries': 'Veg Curries',
  'non-veg-curries': 'Non Veg Curries',
  'south-indian-specials': 'South Indian Specials',
  'thanjai-specials': 'Thanjai Specials',
  'chinese': 'Chinese',
  'breads-parottas': 'Breads & Parottas',
  'dosai-corner': 'Dosai Corner',
  'desserts': 'Desserts',
  'beverages': 'Beverages'
};

// Convert category name to filter slug
function categoryToSlug(categoryName) {
  return categoryName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, '');
}

// Load menu data from JSON
async function loadMenuData() {
  try {
    const response = await fetch('menu-data 1.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    menuData = await response.json();
    renderMenu();
    setupFilters();
  } catch (error) {
    console.error('Error loading menu data:', error);
    const container = document.getElementById('menu-sections');
    container.innerHTML = `
      <div class="menu-load-error" style="padding: 60px 20px; text-align: center;">
        <h2>Unable to load menu</h2>
        <p>Please check your internet connection and try again later.</p>
        <p style="font-size: 12px; color: #999; margin-top: 10px;">Error: ${error.message}</p>
      </div>
    `;
  }
}

// Render menu items
function renderMenu() {
  const container = document.getElementById('menu-sections');
  const emptyState = document.getElementById('menu-empty-state');
  container.innerHTML = '';

  let hasItems = false;

  // Get categories to display based on current filter
  const categoriesToShow = currentFilter === 'all' 
    ? Object.keys(menuData) 
    : [categoryMap[currentFilter]].filter(Boolean);

  categoriesToShow.forEach(categoryName => {
    const category = menuData[categoryName];
    if (!category || !category.items || category.items.length === 0) {
      return;
    }

    hasItems = true;

    // Create category section
    const section = document.createElement('section');
    section.className = 'menu-section';
    section.setAttribute('data-category', categoryToSlug(categoryName));

    // Category title
    const title = document.createElement('h2');
    title.className = 'menu-category-title';
    title.textContent = categoryName;
    section.appendChild(title);

    // Menu grid
    const grid = document.createElement('div');
    grid.className = 'menu-grid';

    // Add each item to the grid
    category.items.forEach(item => {
      const card = createMenuItemCard(item);
      grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
  });

  // Show/hide empty state
  if (hasItems) {
    emptyState.hidden = true;
  } else {
    emptyState.hidden = false;
  }
}

// Create a menu item card
function createMenuItemCard(item) {
  const card = document.createElement('div');
  card.className = 'menu-card';

  // Image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'menu-card-image';
  
  const img = document.createElement('img');
  img.src = item['img-url'] || 'images/Tjm logo.png';
  img.alt = item['food-title'] || 'Food item';
  img.onerror = function() {
    // Fallback to logo if image fails to load
    this.src = 'images/Tjm logo.png';
  };
  imageContainer.appendChild(img);
  card.appendChild(imageContainer);

  // Content container
  const content = document.createElement('div');
  content.className = 'menu-card-content';

  // Item header (name and price)
  const header = document.createElement('div');
  header.className = 'menu-item-head';

  const name = document.createElement('h3');
  name.className = 'menu-item-name';
  name.textContent = item['food-title'] || 'Untitled Item';
  header.appendChild(name);

  // Only add price if it exists and is not empty
  if (item['food-price'] && item['food-price'].trim() !== '') {
    const price = document.createElement('span');
    price.className = 'menu-item-price';
    price.textContent = item['food-price'];
    header.appendChild(price);
  }

  content.appendChild(header);

  // Description
  if (item.description && item.description.trim() !== '') {
    const description = document.createElement('p');
    description.className = 'menu-item-description';
    description.textContent = item.description;
    content.appendChild(description);
  }

  card.appendChild(content);
  return card;
}

// Setup filter button functionality
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const categorySelect = document.getElementById('categorySelect');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Update current filter
      currentFilter = button.getAttribute('data-filter');

      // Keep dropdown in sync (for mobile)
      if (categorySelect) {
        categorySelect.value = currentFilter;
      }
      
      // Re-render menu
      renderMenu();
      
      // Scroll to top of menu sections
      const menuSections = document.getElementById('menu-sections');
      if (menuSections) {
        menuSections.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Dropdown change handler (mobile)
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      currentFilter = categorySelect.value;

      // Sync active pill (desktop)
      filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === currentFilter);
      });

      renderMenu();

      const menuSections = document.getElementById('menu-sections');
      if (menuSections) {
        menuSections.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadMenuData();
});

