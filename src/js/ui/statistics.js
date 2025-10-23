import { sortUsersBy } from '../logic/sort.js';
import { renderPieChart, renderPivotTable, renderTable } from '../ui/render.js';
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

    const toggleContainer = button.closest('.statistics-toggle');
    const allButtons = toggleContainer.querySelectorAll('.button1');

    const statisticsSection = button.closest('.statistics');
    const chartWrapper = statisticsSection.querySelector('.chart-wrapper');
    const tableWrapper = statisticsSection.querySelector('.table-wrapper');
    const pivotWrapper = statisticsSection.querySelector('#pivot-container');

    [chartWrapper, tableWrapper, pivotWrapper].forEach(el => el.classList.add('hidden'));
    allButtons.forEach(btn => btn.disabled = false);

    const view = button.textContent.trim();
    if (view === 'Chart') {
        chartWrapper.classList.remove('hidden');
        await renderPieChart();
    } else if (view === 'Table') {
        tableWrapper.classList.remove('hidden');
    } else if (view === 'Report') {
        pivotWrapper.classList.remove('hidden');
        await renderPivotTable(false);
    } else if (view === 'Flat') {
        pivotWrapper.classList.remove('hidden');
        await renderPivotTable(true);
    }

    button.disabled = true;
}

export { handleTableClick, handleStatisticsToggle };