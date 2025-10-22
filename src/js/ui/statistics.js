import { sortUsersBy } from '../logic/sort.js';
import { renderPieChart, renderTable } from '../ui/render.js';
import { getDisplayedUsers } from '../data/data.js';

let currentSort = { key: null, direction: 'asc' };

async function handleTableClick(event) {
    const headerCell = event.target.closest('.sortable');
    if (!headerCell) return;

    const keyMap = {
        'Name': 'full_name',
        'Speciality': 'course',
        'Age': 'age',
        'Birth Date': 'b_date',
        'Nationality': 'country'
    };

    const key = keyMap[headerCell.textContent.trim()];
    if (!key) return;

    const isSameColumn = currentSort.key === key;
    const newDirection = isSameColumn && currentSort.direction === 'asc' ? 'desc' : 'asc';

    currentSort = { key, direction: newDirection };

    const users = await getDisplayedUsers();
    const sortedUsers = sortUsersBy(users, key, newDirection);

    await renderTable(sortedUsers, currentSort);
}

async function handleStatisticsToggle(event) {
    const button = event.target.closest('.button1');
    if (!button) return;

    const isTableButton = button.textContent.trim() === 'Table';
    const chartWrapper = document.querySelector('.chart-wrapper');
    const tableWrapper = document.querySelector('.table-wrapper');

    if (isTableButton) {
        chartWrapper.classList.add('hidden');
        tableWrapper.classList.remove('hidden');
        button.disabled = true;
        const otherButton = button.nextElementSibling;
        if (otherButton) otherButton.disabled = false;
    } else {
        chartWrapper.classList.remove('hidden');
        tableWrapper.classList.add('hidden');
        button.disabled = true;
        const otherButton = button.previousElementSibling;
        if (otherButton) otherButton.disabled = false;
        await renderPieChart();
    }
}

export { handleTableClick, handleStatisticsToggle };