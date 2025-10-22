import { randomUserMock, additionalUsers } from './data/FE4U-Lab2-mock.js';
import { STRING_KEYS_TO_VALID } from './data/constants.js';
import { getAllUsers, repairInvalidGenderAndPhone } from './data/users.js';
import { isValid } from './logic/validate.js';
import { filterUsersBy } from './logic/filter.js';
import { sortUsersBy } from './logic/sort.js';
import { searchUsers } from './logic/search.js';
import { setupUIEvents } from './ui/events.js';
import { setUsers } from './data/data.js';
import { renderTeachers, renderFilters, renderTable, renderAddTeacherForm, renderPieChart } from './ui/render.js';
import { fetchUsers } from './api/fetchUsers.js';


const users = getAllUsers(randomUserMock, additionalUsers);
// console.log(new Set(users.map(user => user.country)));
// console.log(new Set(users.map(user => user.phone)));
const repairedUsers = repairInvalidGenderAndPhone(users)
console.log('Formatted users:')
console.log(repairedUsers);
// console.log(users.filter(obj => {
//   return Object.values(obj).some(value => value === null);
// }));

for (const user of repairedUsers) {
  // const valid = isValid(user, STRING_KEYS_TO_VALID);
  // console.log(`${user.id} ${valid}`);
}
const validUsers = repairedUsers.filter(u => isValid(u, STRING_KEYS_TO_VALID));
console.log('Valid users:')
console.log(validUsers);

const filters = {
  country: ['Germany', 'France', 'Iran'],
  age: [20, 65],
  gender: ['Male', 'Female'],
  favorite: [true, false],
  with_picture: [false, true]
};
console.log('Filtered users:')
console.log(filterUsersBy(validUsers, filters));

console.log('Sorted users:')
console.log(sortUsersBy(validUsers, 'country', 'desc'))

console.log('Searched users:')
console.log(searchUsers(validUsers, 'FeMale'))

const options = {
  // search: '36',
  filters: {
    // country: ['Germany', 'France', 'Iran'],
    age: ['>=', 69],
    // gender: ['Male', 'Female'],
    // favorite: [true]
  }
}
console.log(`Filtered users percent: ${getPercentFiltered(validUsers, options)}`)

function getPercentFiltered(users, options = {}) {
  const { search, filters } = options;

  const afterSearch = search ? searchUsers(users, search) : users;

  if (afterSearch.length === 0) {
    return 0;
  }

  const filtered = filters ? filterUsersBy(afterSearch, filters) : afterSearch;

  console.log('Task 6 filtered:')
  console.log(filtered);

  const percent = (filtered.length / users.length) * 100;
  return Math.round(percent);
}






// validUsers.find(u => u.id === 5).picture_large = null;
// setUsers(validUsers);

async function startApp() {
  await fetchUsers(50);
  await renderTeachers(false);
  await renderTeachers(true);
  renderFilters();
  await renderTable();
  await renderPieChart();
  renderAddTeacherForm();
  setupUIEvents();
}

window.addEventListener('load', startApp);