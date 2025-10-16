import { setFilters } from '../data/data.js';
import { renderTable, renderTeachers } from './render.js';

async function handleFiltersFormChange() {
    const filtersForm = document.querySelector('.filters');
    if (!filtersForm) return;

    const ageFilter = filtersForm.querySelector('.filter-age select').value;
    const countryFilter = filtersForm.querySelector('.filter-country select').value;
    const genderFilter = filtersForm.querySelector('.filter-gender select').value;
    const withPictureOnly = filtersForm.querySelector('.filter-with-picture input').checked;
    const favoriteOnly = filtersForm.querySelector('.filter-favorite input').checked;
    const filters = {};

    if (ageFilter && ageFilter !== 'All') {
        const [min, max] = ageFilter.split('-').map(s => parseInt(s, 10));
        filters.age = [min, max];
    }

    if (countryFilter && countryFilter !== 'All') {
        filters.country = [countryFilter];
    }

    if (genderFilter && genderFilter !== 'All') {
        filters.gender = [genderFilter];
    }

    if (withPictureOnly) {
        filters.with_picture = [true];
    }

    if (favoriteOnly) {
        filters.favorite = [true];
    }

    await setFilters(filters);
    renderTeachers(false);
    renderTable();
}

export { handleFiltersFormChange };