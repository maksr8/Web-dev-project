import { openPopup, openPopupWithTeacher } from './popups.js';
import { getTeacherById } from '../data/data.js';

function handleTeacherImageClick(e) {
    const imgWrapper = e.target.closest('.img-wrapper');
    if (!imgWrapper) {
        return;
    }
    const card = imgWrapper.closest('.teacher');
    if (!card) {
        return;
    }

    const id = card.dataset.id;
    const teacher = getTeacherById(id);
    if (teacher) {
        openPopupWithTeacher(teacher);
    }
}

function handleFavoritesClick(e) {
    const imgWrapper = e.target.closest('.img-wrapper');
    if (imgWrapper) {
        handleTeacherImageClick(e);
        return;
    }

    const prevArrow = e.target.closest('.prev-arrow');
    if (prevArrow) {
        const favoritesContainer = document.querySelector('.favorites');
        if (favoritesContainer) {
            favoritesContainer.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        }
    }

    const nextArrow = e.target.closest('.next-arrow');
    if (nextArrow) {
        const favoritesContainer = document.querySelector('.favorites');
        if (favoritesContainer) {
            favoritesContainer.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        }
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

export { handleTeacherImageClick, handleFavoritesClick, handleAddTeacherClick };
