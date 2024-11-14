import { describe, it, expect, beforeEach } from 'vitest';
import { selectedFilters, addTag, removeTag, populateFilterOptions, applyFilters } from '../scripts';

beforeEach(() => {
    // Set up the HTML structure that `scripts.js` expects
    document.body.innerHTML = `
        <input id="search-bar" />
        <select id="ingredients-filter"></select>
        <select id="appliance-filter"></select>
        <select id="ustensil-filter"></select>
        <section id="recipe-list"></section>
        <div id="search-results"></div>
        <div id="ingredients-tags"></div>
        <div id="appliance-tags"></div>
        <div id="ustensil-tags"></div>
    `;

    // Reset selectedFilters for each test
    selectedFilters.ingredients.clear();
    selectedFilters.appliance.clear();
    selectedFilters.ustensil.clear();
});

describe("Filter Functions", () => {
    it("should add a tag and update selectedFilters", () => {
        addTag("ingredients", "Tomato");
        expect(selectedFilters.ingredients.has("Tomato")).toBe(true);
    });

    it("should remove a tag and update selectedFilters", () => {
        addTag("ingredients", "Tomato");
        removeTag("ingredients", "Tomato");
        expect(selectedFilters.ingredients.has("Tomato")).toBe(false);
    });

    it("should populate options in the dropdown", () => {
        populateFilterOptions("ingredients-filter", new Set(["Tomato", "Lettuce"]));
        const options = document.querySelectorAll("#ingredients-filter option");
        expect(options).toHaveLength(2);
        expect(options[0].value).toBe("Tomato");
        expect(options[1].value).toBe("Lettuce");
    });
});
