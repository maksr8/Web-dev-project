import { openPopup } from './popups.js';

function handleTeacherImageClick(e) {
    const imgWrapper = e.target.closest('.img-wrapper');
    if (!imgWrapper) {
        return;
    }

    const popup = document.querySelector('.teacher-info-popup');
    if (popup) {
        openPopup(popup);
    }
}

function handleAddTeacherClick(e) {
    const button = e.target.closest('.add-teacher-button');
    if (!button) {
        return;
    }

    const popup = document.querySelector('.add-teacher-popup');
    if (popup) {
        openPopup(popup);
    }
}

export { handleTeacherImageClick, handleAddTeacherClick };
