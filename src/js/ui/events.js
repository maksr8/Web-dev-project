import { handlePopupClick, handleAddTeacherSubmit } from './popups.js';
import { handleTeacherImageClick, handleFavoritesClick, handleAddTeacherClick } from './teachers.js';
import { handleFiltersFormChange } from './filters.js';
import { handleSearch } from './searching.js';
import { handleTableClick } from './statistics.js';
import { handleTeachersPaginationClick } from './pagination.js';

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
        filtersForm.addEventListener('change', handleFiltersFormChange);
    }

    const teachersPagination = document.querySelector('.teachers-pagination');
    if (teachersPagination) {
        teachersPagination.addEventListener('click', handleTeachersPaginationClick);
    }

    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }

    const statisticsTable = document.querySelector('.statistics .table-wrapper');
    if (statisticsTable) {
        statisticsTable.addEventListener('click', handleTableClick);
    }

    const addTeacherForm = document.querySelector('.add-teacher-popup form');
    if (addTeacherForm) {
        addTeacherForm.addEventListener('submit', handleAddTeacherSubmit);
    }
}

export { setupUIEvents };
