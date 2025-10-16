import { getTeacherById, addUser, updateDisplayed } from '../data/data.js';
import { renderTable, renderTeachers } from './render.js';
import { isValid } from '../logic/validate.js';
import { STRING_KEYS_TO_VALID } from '../data/constants.js';
import { calcAgeByBirthDate } from '../data/users.js';
import { updatePaginationButtons } from './pagination.js';

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

async function handlePopupClick(e) {
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
                await updateDisplayed();
                await renderTeachers(false);
                await renderTeachers(true);
            }

        }
    }
}

async function handleAddTeacherSubmit(e) {
    e.preventDefault();
    const form = e.target.closest('form');
    if (!form) return;

    const getInput = (selector) => {
        const label = form.querySelector(selector);
        if (!label) return '';
        const input = label.querySelector('input, select, textarea');
        return input ? input.value.trim() : '';
    };

    const full_name = getInput('.name');
    const course = getInput('.course');
    const country = getInput('.country');
    const city = getInput('.city');
    const email = getInput('.email');
    const phone = getInput('.phone');
    const b_date = getInput('.date-of-birth');
    const note = getInput('.note');

    let gender = '';
    const sexDiv = form.querySelector('.sex');
    if (sexDiv) {
        const checked = sexDiv.querySelector('input[name="sex"]:checked');
        if (checked) {
            const parentLabel = checked.closest('label');
            if (parentLabel) {
                gender = parentLabel.textContent.trim();
            }
        }
    }

    const colorLabel = form.querySelector('.color-picker');
    let color = undefined;
    if (colorLabel) {
        const colorInput = colorLabel.querySelector('input[type="color"]');
        if (colorInput) color = colorInput.value;
    }
    if (!color) {
        color = '#000000';
    }

    let newTeacher = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        full_name: full_name,
        course: course,
        country: country,
        city: city,
        email: email,
        phone: phone,
        b_date: b_date,
        gender: gender,
        color: color,
        note: note,
        picture_large: '',
        favorite: false,
        age: calcAgeByBirthDate(b_date)
    };

    if (!isValid(newTeacher, STRING_KEYS_TO_VALID)) {
        alert('Not valid!');
        return;
    }

    await addUser(newTeacher);

    await renderTeachers(false);
    await renderTable();
    updatePaginationButtons();
    const popup = form.closest('.popup');
    closePopup(popup);
    form.reset();
}

export { openPopup, closePopup, handlePopupClick, openPopupWithTeacher, handleAddTeacherSubmit };
