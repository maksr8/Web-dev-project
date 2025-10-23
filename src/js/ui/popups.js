import { getTeacherById, addUser, updateDisplayed } from '../data/data.js';
import { renderPieChart, renderPivotTable, renderTable, renderTeachers } from './render.js';
import { isValid } from '../logic/validate.js';
import { STRING_KEYS_TO_VALID } from '../data/constants.js';
import { calcAgeByBirthDate } from '../data/users.js';
import { updatePaginationButtons } from './pagination.js';
import { getDaysToBirthday } from '../logic/utils.js';
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

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
    popup.dataset.lat = teacher.latitude;
    popup.dataset.lon = teacher.longitude;

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

    const subjectEl = popup.querySelector('.info-popup-subject');
    if (subjectEl) {
        subjectEl.textContent = teacher.course || '';
    }

    const locEl = popup.querySelector('.info-popup-location');
    if (locEl) {
        locEl.textContent = [teacher.city, teacher.country].filter(Boolean).join(', ');
    }

    const ageGenderEl = popup.querySelector('.info-popup-age-gender');
    if (ageGenderEl) {
        ageGenderEl.textContent = `${teacher.age}, ${teacher.gender}`;
    }

    const birthdayEl = popup.querySelector('.birthday-countdown');
    if (birthdayEl) {
        const daysLeft = getDaysToBirthday(teacher.b_date);

        if (daysLeft === null) {
            birthdayEl.textContent = 'Birthday info not available';
        } else if (daysLeft === 0) {
            birthdayEl.textContent = 'Today is the birthday!';
        } else {
            const dayString = daysLeft === 1 ? 'day' : 'days';
            birthdayEl.textContent = `${daysLeft} ${dayString} until next birthday`;
        }
    }

    const emailEl = popup.querySelector('.div-info a');
    if (emailEl) {
        emailEl.textContent = teacher.email || '';
        emailEl.href = `mailto:${teacher.email || ''}`;
    }

    const phoneEl = popup.querySelector('.info-popup-phone');
    if (phoneEl) {
        phoneEl.textContent = teacher.phone || '';
    }

    const noteEl = popup.querySelector('.teacher-desc');
    if (noteEl) {
        noteEl.textContent = teacher.note || '';
    }

    const mapWrapper = popup.querySelector('.map-wrapper');
    if (mapWrapper) {
        mapWrapper.innerHTML = '';
        mapWrapper.classList.add('hidden');
    }

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
        if (!mapWrapper) return;

        const lat = parseFloat(popup.dataset.lat);
        const lon = parseFloat(popup.dataset.lon);

        const isHidden = mapWrapper.classList.toggle('hidden');

        if (!isHidden) {
            mapWrapper.innerHTML = '';

            const mapContainer = document.createElement('div');
            mapContainer.className = 'teacher-map';
            mapWrapper.appendChild(mapContainer);

            if (!isNaN(lat) && !isNaN(lon)) {
                const map = L.map(mapContainer, {
                    zoomControl: true,
                    scrollWheelZoom: false
                }).setView([lat, lon], 6);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    maxZoom: 18,
                }).addTo(map);

                L.marker([lat, lon]).addTo(map);

                setTimeout(() => map.invalidateSize(), 200);
            } else {
                mapWrapper.innerHTML = `<p style="text-align:center;">No coordinates available</p>`;
            }
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
                await renderPieChart();
                await renderPivotTable();
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
    await renderPieChart();
    await renderPivotTable();
    const popup = form.closest('.popup');
    closePopup(popup);
    form.reset();
}

export { openPopup, closePopup, handlePopupClick, openPopupWithTeacher, handleAddTeacherSubmit };
