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

// Display recipes on the page
function displayRecipes(recipeArray) {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = "";
    recipeArray.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <img src="images/${recipe.image}" alt="${recipe.name}">
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

document.addEventListener('DOMContentLoaded', loadRecipes);
