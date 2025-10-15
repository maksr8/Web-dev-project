import { handlePopupClick } from './popups.js';
import { handleTeacherImageClick, handleAddTeacherClick } from './teachers.js';

function setupUIEvents() {
    const teachersContainer = document.querySelector('.teachers');
    if (teachersContainer) {
        teachersContainer.addEventListener('click', handleTeacherImageClick);
    }

    const favoritesContainer = document.querySelector('.favorites-wrapper');
    if (favoritesContainer) {
        favoritesContainer.addEventListener('click', handleTeacherImageClick);
    }

    const headerActions = document.querySelector('.header-lower');
    if (headerActions) {
        headerActions.addEventListener('click', handleAddTeacherClick);
    }

    const footer = document.querySelector('footer');
    if (footer) {
        footer.addEventListener('click', handleAddTeacherClick);
    }

    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.addEventListener('click', handlePopupClick);
    });
}

export { setupUIEvents };
