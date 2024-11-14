let recipes = [];
let uniqueIngredients = new Set(), uniqueAppliances = new Set(), uniqueUstensil = new Set();
let selectedFilters = { ingredients: new Set(), appliance: new Set(), ustensil: new Set() };

// Load recipes and populate filters
document.addEventListener('DOMContentLoaded', loadRecipes);

async function loadRecipes() {
    try {
        const response = await fetch('recettes.json');
        recipes = await response.json();

        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ing => uniqueIngredients.add(ing.ingredient));
            uniqueAppliances.add(recipe.appliance);
            recipe.ustensils.forEach(ut => uniqueUstensil.add(ut));
        });

        populateFilterOptions('ingredients', uniqueIngredients);
        populateFilterOptions('appliance', uniqueAppliances);
        populateFilterOptions('ustensil', uniqueUstensil);
        displayRecipes(recipes);
    } catch (error) {
        console.error("Error loading recipes:", error);
    }
}

// Function to populate options without applying them as a filter
function populateFilterOptions(type, items) {
    const optionsContainer = document.getElementById(`${type}-options`);
    
    // Check if the options container exists
    if (!optionsContainer) {
        console.error(`Error: Element with id '${type}-options' not found.`);
        return;
    }

    optionsContainer.innerHTML = ''; // Clear existing options

    // Add each item as an option in the dropdown
    items.forEach(item => {
        const option = document.createElement('div');
        option.className = 'filter-option';
        option.textContent = item;

        // Add the clicked option as a filter tag
        option.addEventListener('click', () => {
            addTag(type, item);
            applyFilters(); // Reapply filters when an option is selected
        });

        optionsContainer.appendChild(option);
    });
}

// Event listener to filter displayed options based on input search, without applying the input as a filter
document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', event => {
        const filterType = event.target.parentNode.parentNode.id.split('-')[0];
        const searchQuery = event.target.value.toLowerCase();

        const options = Array.from(document.getElementById(`${filterType}-options`).children);
        options.forEach(option => {
            // Show/hide options based on the search query
            option.style.display = option.textContent.toLowerCase().includes(searchQuery) ? '' : 'none';
        });
    });
});

// Add or remove tags, update displayed recipes
function addTag(type, value) {
    if (value && !selectedFilters[type].has(value)) {
        selectedFilters[type].add(value);
        displayTags(type);
        applyFilters();
    }
}

function removeTag(type, value) {
    selectedFilters[type].delete(value);
    displayTags(type);
    applyFilters();
}

// Display selected tags under filters
function displayTags(type) {
    const tagContainer = document.getElementById(`${type}-tags`);
    tagContainer.innerHTML = '';
    selectedFilters[type].forEach(value => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = value;
        tag.onclick = () => removeTag(type, value);
        tagContainer.appendChild(tag);
    });
}

// Filter recipes by search and selected filters
function applyFilters() {
    const query = document.getElementById('search-bar').value.toLowerCase();

    // Filter recipes based on search query and selected tags
    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = query.length < 3 || 
            recipe.name.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query) ||
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(query));
        const matchesIngredients = [...selectedFilters.ingredients].every(selected => 
            recipe.ingredients.some(ing => ing.ingredient === selected));
        const matchesAppliances = [...selectedFilters.appliance].every(selected => 
            recipe.appliance === selected);
        const matchesUstensil = [...selectedFilters.ustensil].every(selected => 
            recipe.ustensils.includes(selected));

        return matchesSearch && matchesIngredients && matchesAppliances && matchesUstensil;
    });

    // Update filter options based on filtered recipes
    updateFilterOptions(filteredRecipes);

    // Display filtered recipes
    displayRecipes(filteredRecipes);

    // Display the number of results or a no-result message
    document.getElementById('search-results').textContent = filteredRecipes.length === 0 
        ? (query.length >= 3 ? `Aucune recette ne convient à '${query}'` : "Aucune recette ne correspond aux critères") 
        : `${filteredRecipes.length} recette(s) trouvée(s)`;
}

// Function to update filter options based on remaining recipes
function updateFilterOptions(filteredRecipes) {
    const remainingIngredients = new Set();
    const remainingAppliances = new Set();
    const remainingUstensils = new Set();

    // Calculate unique items for each filter from the filtered recipes
    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => remainingIngredients.add(ingredient.ingredient));
        remainingAppliances.add(recipe.appliance);
        recipe.ustensils.forEach(utensil => remainingUstensils.add(utensil));
    });

    // Update each filter dropdown with the remaining items
    populateFilterOptions('ingredients', remainingIngredients);
    populateFilterOptions('appliance', remainingAppliances);
    populateFilterOptions('ustensil', remainingUstensils);
}

// Display recipes on the page
function displayRecipes(recipeArray) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = "";
    recipeArray.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="images/${recipe.image.replace(/\.\w+$/, '.webp')}" alt="${recipe.name}">
            <h3>${recipe.name}</h3>
            <div class="recipe-details">
                <h4 class="section-title">RECETTE</h4>
                <p class="recipe-description">${recipe.description}</p>
                <h4 class="section-title">INGRÉDIENTS</h4>
                <div class="ingredients">
                    ${recipe.ingredients.map(ingredients => `<div class="ingredient-item">${ingredients.ingredient}<br><span class="ingredient-quantity">${ingredients.quantity || ''} ${ingredients.unit || ''}</span></div>`).join('')}
                </div>
            </div>`;
        recipeList.appendChild(recipeCard);
    });
}

// Event Listeners (only if elements are found)
const searchBar = document.getElementById('search-bar');
if (searchBar) {
    searchBar.addEventListener('input', applyFilters);
}

// Toggle dropdown visibility on header click
document.querySelectorAll('.filter-header').forEach(header => {
    header.addEventListener('click', (event) => {
        const dropdown = event.target.nextElementSibling;
        dropdown.classList.toggle('open'); // Toggle the 'open' class
    });
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.filter-container')) {
        document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }
});


export { selectedFilters, addTag, applyFilters, populateFilterOptions };
