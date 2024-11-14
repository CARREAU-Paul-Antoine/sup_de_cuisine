let recipes = [];
let uniqueIngredients = new Set(), uniqueAppliances = new Set(), uniqueUstensil = new Set();
let selectedFilters = { ingredients: new Set(), appliance: new Set(), ustensil: new Set() };

// Load recipes and populate filters
async function loadRecipes() {
    try {
        const response = await fetch('recettes.json');
        recipes = await response.json();

        recipes.forEach(recipe => {
            recipe.ingredients.forEach(ing => uniqueIngredients.add(ing.ingredient));
            uniqueAppliances.add(recipe.appliance);
            recipe.ustensils.forEach(ut => uniqueUstensil.add(ut));
        });

        populateFilterOptions('ingredients-filter', uniqueIngredients);
        populateFilterOptions('appliance-filter', uniqueAppliances);
        populateFilterOptions('ustensil-filter', uniqueUstensil);
        displayRecipes(recipes);
    } catch (error) {
        console.error("Error loading recipes:", error);
    }
}

// Populate options in a dropdown
function populateFilterOptions(elementId, items) {
    const selectElement = document.getElementById(elementId);
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        selectElement.appendChild(option);
    });
}

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

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = query.length < 3 || recipe.name.toLowerCase().includes(query) || recipe.description.toLowerCase().includes(query) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(query));
        const matchesIngredients = [...selectedFilters.ingredients].every(selected => recipe.ingredients.some(ing => ing.ingredient === selected));
        const matchesAppliances = [...selectedFilters.appliance].every(selected => recipe.appliance === selected);
        const matchesUstensil = [...selectedFilters.ustensil].every(selected => recipe.ustensils.includes(selected));

        return matchesSearch && matchesIngredients && matchesAppliances && matchesUstensil;
    });

    displayRecipes(filteredRecipes);
    document.getElementById('search-results').textContent = filteredRecipes.length === 0 ? (query.length >= 3 ? `Aucune recette ne convient à '${query}'` : "Aucune recette ne correspond aux critères") : `${filteredRecipes.length} recette(s) trouvée(s)`;
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

['ingredients-filter', 'appliance-filter', 'ustensil-filter'].forEach(filterId => {
    const filterElement = document.getElementById(filterId);
    if (filterElement) {
        filterElement.addEventListener('change', event => {
            const selectedValue = event.target.value;
            if (selectedValue) addTag(filterId.split('-')[0], selectedValue);
            event.target.value = "";
        });
    }
});

document.addEventListener('DOMContentLoaded', loadRecipes);

export { selectedFilters, addTag, removeTag, applyFilters, populateFilterOptions };
