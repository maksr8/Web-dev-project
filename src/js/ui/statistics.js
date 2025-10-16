import { sortUsersBy } from '../logic/sort.js';
import { renderTable } from '../ui/render.js';
import { getDisplayedUsers } from '../data/data.js';

let currentSort = { key: null, direction: 'asc' };

function handleTableClick(event) {
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

    const users = getDisplayedUsers();
    const sortedUsers = sortUsersBy(users, key, newDirection);

    renderTable(sortedUsers, currentSort);
}

export { handleTableClick };