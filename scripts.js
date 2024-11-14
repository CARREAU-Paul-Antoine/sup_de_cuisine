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

document.addEventListener('DOMContentLoaded', loadRecipes);
