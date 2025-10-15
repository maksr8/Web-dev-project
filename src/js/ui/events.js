import { handlePopupClick } from './popups.js';
import { handleTeacherImageClick, handleFavoritesClick, handleAddTeacherClick } from './teachers.js';
import { handleFormChange } from './filters.js';
import { handleSearch } from './searching.js';
import { handleTableClick } from './statistics.js';

function setupUIEvents() {
    const teachersContainer = document.querySelector('.teachers');
    if (teachersContainer) {
        teachersContainer.addEventListener('click', handleTeacherImageClick);
    }

    const favoritesContainer = document.querySelector('.favorites-wrapper');
    if (favoritesContainer) {
        favoritesContainer.addEventListener('click', handleFavoritesClick);
    }

    const headerLower = document.querySelector('.header-lower');
    if (headerLower) {
        headerLower.addEventListener('click', handleAddTeacherClick);
    }

    const footer = document.querySelector('footer');
    if (footer) {
        footer.addEventListener('click', handleAddTeacherClick);
    }

    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.addEventListener('click', handlePopupClick);
    });

    const filtersForm = document.querySelector('.filters');
    if (filtersForm) {
        filtersForm.addEventListener('change', handleFormChange);
    }

    const headerUpper = document.querySelector('.header-upper');
    if (headerUpper) {
        headerUpper.addEventListener('submit', handleSearch);
    }

    const statisticsTable = document.querySelector('.statistics .table-wrapper');
    if (statisticsTable) {
        statisticsTable.addEventListener('click', handleTableClick);
    }
}

export { setupUIEvents };
