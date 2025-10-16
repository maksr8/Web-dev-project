import { getDisplayedUsers, prevPageAvailable, subtractPage, nextPageAvailable, addPage } from '../data/data.js';
import { renderTable, renderTeachers } from '../ui/render.js';

async function handleTeachersPaginationClick(event) {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.textContent.includes('Previous') && prevPageAvailable()) {
        subtractPage();
    } else if (button.textContent.includes('Next') && nextPageAvailable()) {
        addPage();
    }

    updatePaginationButtons();
    await renderTeachers(false);
    await renderTable();
    const gridSection = document.querySelector('.top-teachers');
    if (gridSection) {
        gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updatePaginationButtons() {
    const prevBtn = document.querySelector('.teachers-pagination button:nth-child(1)');
    const nextBtn = document.querySelector('.teachers-pagination button:nth-child(2)');

    if (prevBtn) prevBtn.disabled = !prevPageAvailable();
    if (nextBtn) nextBtn.disabled = !nextPageAvailable();
}

export { handleTeachersPaginationClick, updatePaginationButtons };
