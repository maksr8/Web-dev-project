import { getTeacherById } from '../data/data.js';
import { renderTeachers } from './render.js';

function openPopup(popup) {
    popup.classList.remove('hidden');
}

function closePopup(popup) {
    popup.classList.add('hidden');
}

function openPopupWithTeacher(teacher) {
    const popup = document.querySelector('.teacher-info-popup');
    if (!popup) return;

    popup.dataset.id = teacher.id || 0;

    const img = popup.querySelector('img');
    if (img) {
        img.src = teacher.picture_large || 'images/sticker.webp';
        img.alt = teacher.full_name || '';
    }

    const nameEl = popup.querySelector('.teacher-fullname');
    if (nameEl) {
        nameEl.textContent = teacher.full_name || '';
    }

    const starFilled = popup.querySelector('.star-filled');
    const starEmpty = popup.querySelector('.star-empty');
    if (teacher.favorite) {
        if (starFilled) starFilled.classList.remove('hidden');
        if (starEmpty) starEmpty.classList.add('hidden');
    } else {
        if (starFilled) starFilled.classList.add('hidden');
        if (starEmpty) starEmpty.classList.remove('hidden');
    }

    const subjectEl = popup.querySelector('.subject');
    if (subjectEl) {
        subjectEl.textContent = teacher.course || '';
    }

    const locEl = popup.querySelector('.div-info p:nth-of-type(2)');
    if (locEl) {
        locEl.textContent = [teacher.city, teacher.country].filter(Boolean).join(', ');
    }

    const ageGenderEl = popup.querySelector('.div-info p:nth-of-type(3)');
    if (ageGenderEl) {
        ageGenderEl.textContent = `${teacher.age}, ${teacher.gender}`;
    }

    const emailEl = popup.querySelector('.div-info a');
    if (emailEl) {
        emailEl.textContent = teacher.email || '';
        emailEl.href = `mailto:${teacher.email || ''}`;
    }

    const phoneEl = popup.querySelector('.div-info p:nth-of-type(4)');
    if (phoneEl) {
        phoneEl.textContent = teacher.phone || '';
    }

    const noteEl = popup.querySelector('.teacher-desc');
    if (noteEl) {
        noteEl.textContent = teacher.note || '';
    }

    //since no free google maps api, map is not added

    popup.classList.remove('hidden');
}

function handlePopupClick(e) {
    const closeBtn = e.target.closest('.close');
    if (closeBtn) {
        const popup = closeBtn.closest('.popup');
        closePopup(popup);
    }

    const toggleMapLink = e.target.closest('.toggle-map');
    if (toggleMapLink) {
        e.preventDefault();
        const popup = toggleMapLink.closest('.popup');
        const mapWrapper = popup.querySelector('.map-wrapper');
        if (mapWrapper) {
            mapWrapper.classList.toggle('hidden');
        }
    }

    const starBtn = e.target.closest('.star');
    if (starBtn) {
        const popup = starBtn.closest('.popup');
        const starFilled = popup.querySelector('.star-filled');
        const starEmpty = popup.querySelector('.star-empty');
        if (starFilled && starEmpty) {
            starFilled.classList.toggle('hidden');
            starEmpty.classList.toggle('hidden');
            const id = popup.dataset.id;
            const teacher = getTeacherById(id);
            if (teacher) {
                teacher.favorite = !teacher.favorite;
                renderTeachers(false);
                renderTeachers(true);
            }

        }
    }
}

export { openPopup, closePopup, handlePopupClick, openPopupWithTeacher };
