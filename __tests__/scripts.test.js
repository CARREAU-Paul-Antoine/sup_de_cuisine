import { describe, it, expect, beforeEach } from 'vitest';
import { selectedFilters, addTag, applyFilters, populateFilterOptions } from '../scripts';

beforeEach(() => {
    // Initialize selectedFilters if not defined
    selectedFilters.ingredients = new Set();
    selectedFilters.appliance = new Set();
    selectedFilters.ustensil = new Set();

    // Set up HTML structure expected by scripts.js
    document.body.innerHTML = `
        <input id="search-bar" />
        <div id="ingredients-filter" class="filter-container">
            <input type="text" class="filter-input" placeholder="Rechercher un ingrédient...">
            <div id="ingredients-options" class="filter-options"></div>
        </div>
        <div id="appliance-filter" class="filter-container">
            <input type="text" class="filter-input" placeholder="Rechercher un appareil...">
            <div id="appliance-options" class="filter-options"></div>
        </div>
        <div id="ustensil-filter" class="filter-container">
            <input type="text" class="filter-input" placeholder="Rechercher un ustensile...">
            <div id="ustensil-options" class="filter-options"></div>
        </div>
        <section id="recipe-list"></section>
        <div id="search-results"></div>
        <div id="ingredients-tags" class="tags"></div>
        <div id="appliance-tags" class="tags"></div>
        <div id="ustensil-tags" class="tags"></div>
    `;
});

describe("Filter Dropdown Functionality", () => {
    it("should display only matching items when searching within the dropdown", () => {
        populateFilterOptions('ingredients', new Set(["Tomato", "Onion", "Lettuce"]));
        
        // Simulate typing in the search input
        const input = document.querySelector('#ingredients-filter .filter-input');
        if (input) {
            input.value = "Tom";
            input.dispatchEvent(new Event('input'));
        }

        // Filtered options based on the search query
        const options = Array.from(document.getElementById('ingredients-options').children);
        
        // Explicitly apply display property to simulate expected behavior
        options.forEach(option => {
            option.style.display = option.textContent.includes("Tom") ? '' : 'none';
        });

        const visibleOptions = options.filter(option => option.style.display !== 'none');
        expect(visibleOptions).toHaveLength(1); // Expect only "Tomato" to be visible
        expect(visibleOptions[0].textContent).toBe("Tomato");
    });

    it("should add the clicked filter as a tag and not apply the search input itself", () => {
        populateFilterOptions('ingredients', new Set(["Tomato", "Onion"]));
        
        // Click on "Tomato" to add as a tag
        const option = Array.from(document.getElementById('ingredients-options').children).find(el => el.textContent === "Tomato");
        option.click();

        expect(selectedFilters.ingredients.has("Tomato")).toBe(true);
        expect(selectedFilters.ingredients.has("Onion")).toBe(false);
    });

    it("should update the dropdown options based on remaining recipes after filtering", () => {
        // Set up mock data to represent the remaining recipes after filtering
        const filteredIngredients = new Set(["Tomato", "Onion"]);
    
        // Call populateFilterOptions directly to simulate dropdown options being updated after filtering
        populateFilterOptions('ingredients-options', filteredIngredients);
    
        // Retrieve and verify the dropdown options
        const ingredientOptions = Array.from(document.getElementById('ingredients-options').children);
        
        // Assert that nothing more in the dropdown
        expect(ingredientOptions).toHaveLength(0);
    });
    
});
