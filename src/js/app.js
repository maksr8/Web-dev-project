import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';

const COURSES = [
  'Mathematics',
  'Physics',
  'English',
  'Computer Science',
  'Dancing',
  'Chess',
  'Biology',
  'Chemistry',
  'Law',
  'Art',
  'Medicine',
  'Statistics'
];
const NOTE_FOR_MOCK = 'Note1...';
const NOTE_FOR_ADDITIONAL = 'Note2...';
const STRING_KEYS_TO_VALID = [
  'full_name',
  'gender',
  'note',
  'state',
  'city',
  'country'
];
const COUNTRY_CODES = {
  Germany: 'DE',
  Ireland: 'IE',
  Australia: 'AU',
  'United States': 'US',
  Finland: 'FI',
  Turkey: 'TR',
  Switzerland: 'CH',
  'New Zealand': 'NZ',
  Spain: 'ES',
  Norway: 'NO',
  Denmark: 'DK',
  Iran: 'IR',
  Canada: 'CA',
  France: 'FR',
  Netherlands: 'NL',
};

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
  const valid = isValid(user, STRING_KEYS_TO_VALID);
  // console.log(`${user.id} ${valid}`);
}
const validUsers = repairedUsers.filter(u => isValid(u, STRING_KEYS_TO_VALID));
console.log('Valid users:')
console.log(validUsers);

const filters = {
  country: ['Germany', 'France', 'Iran'],
  age: [20, 65],
  gender: ['Male', 'Female'],
  favorite: [true, false]
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










function getAllUsers(randomUserMock, additionalUsers) {
  let allUsers = [];
  let id = 0;
  for (const user of randomUserMock) {
    allUsers.push(normalize(user, id++));
  }
  for (const user of additionalUsers) {
    addUser(allUsers, user);
  }
  return allUsers;
}

function addUser(allUsers, user) {
  let userClone = renameB_dayToB_date(user);
  const existingIndex = allUsers.findIndex(
    u => u.id === userClone.id || u.full_name === userClone.full_name
  );
  if (existingIndex !== -1) {
    for (let key in userClone) {
      if (userClone[key] !== null && userClone[key] !== undefined) {
        allUsers[existingIndex][key] = userClone[key];
      }
    }
  } else {
    userClone = fillKeysWithData(userClone);
    allUsers.push(userClone);
  }
  return allUsers;
}

function renameB_dayToB_date(user) {
  const clone = structuredClone(user);
  if ('b_day' in clone) {
    clone.b_date = clone.b_day;
    delete clone.b_day;
  }
  return clone;
}

function fillKeysWithData(user) {
  const userClone = structuredClone(user);
  for (let key in userClone) {
    if (userClone[key] === null || userClone[key] === undefined) {
      switch (key) {
        case 'course':
          userClone[key] = randCourse(COURSES);
          break;
        case 'bg_color':
          userClone[key] = randHexColor();
          break;
        case 'favorite':
          userClone[key] = randIsFavorite(20);
          break;
        case 'note':
          userClone[key] = NOTE_FOR_ADDITIONAL;
          break;
        default:
          userClone[key] = '';
      }
    }
  }
  return userClone;
}

function normalize(user, id) {
  let normalizedUser = {
    gender: user.gender,
    title: user.name.title,
    full_name: `${user.name.first} ${user.name.last}`,
    city: user.location.city,
    state: user.location.state,
    country: user.location.country,
    postcode: user.location.postcode,
    coordinates: structuredClone(user.location.coordinates),
    timezone: structuredClone(user.location.timezone),
    email: user.email,
    b_date: user.dob.date,
    age: user.dob.age,
    phone: user.phone,
    picture_large: user.picture.large,
    picture_thumbnail: user.picture.thumbnail,
    id: id,
    favorite: randIsFavorite(20),
    course: randCourse(COURSES),
    bg_color: randHexColor(),
    note: NOTE_FOR_MOCK
  };
  return normalizedUser;
}

function randIsFavorite(probability = 20) {
  if (typeof probability !== 'number' || probability < 0 || probability > 100) {
    throw new Error('Invalid probability');
  }
  const randomNumber = Math.random() * 100;
  return randomNumber <= probability;
}

function randCourse(courses) {
  const randomIndex = Math.floor(Math.random() * courses.length);
  return courses[randomIndex];
}

function randHexColor() {
  const randomColor = Math.floor(Math.random() * 0xFFFFFF);
  return `#${randomColor.toString(16).padStart(6, '0')}`;
}

function isValid(user, stringKeysToValid) {
  for (const key of stringKeysToValid) {
    const val = user[key];
    if (typeof val !== 'string') {
      return false;
    }
    if (val && val[0] !== val[0].toUpperCase()) {
      return false;
    }
  }
  if (typeof user.age !== 'number') {
    return false;
  }
  const phone = parsePhoneNumberFromString(user.phone);
  if (!phone || !phone.isValid()) {
    return false;
  }
  // example@domain.com
  if (!(/^[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(user.email))) {
    return false;
  }

  return true;
}

function repairInvalidGenderAndPhone(users) {
  return users.map(user => {
    const userClone = structuredClone(user);
    return repairPhone(repairGender(userClone), COUNTRY_CODES);
  });
}

function repairGender(user) {
  if (typeof user.gender === 'string' && user.gender.length > 0) {
    user.gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
  }
  return user;
}

function repairPhone(user, countryCodes) {
  if (typeof user.phone === 'string' && user.phone.trim() !== '') {
    const countryCode = countryCodes[user.country] || 'US';
    const cleaned = user.phone.replace(/[\s()-]/g, '');
    let phone = parsePhoneNumberFromString(cleaned, countryCode);

    if (!phone || !phone.isValid()) {
      for (const cc of Object.values(countryCodes)) {
        phone = parsePhoneNumberFromString(cleaned, cc);
        if (phone && phone.isValid()) {
          user.phone = phone.number;
          return user;
        }
      }
    } else {
      user.phone = phone.number;
    }
  }
  return user;
}

function filterUsersBy(users, filters) {
  return users.filter(u => {
    if (filters.country && !filters.country.includes(u.country)) {
      return false;
    }

    if (filters.age) {
      const [first, second] = filters.age;

      if (typeof first === 'number' && second === undefined) {
        if (u.age !== first) {
          return false;
        }
      } else if (typeof first === 'string' && typeof second === 'number') {
        const opMatch = first.trim().match(/^(>=|<=|>|<|=)$/);
        if (opMatch && !compareNumber(u.age, opMatch[0], second)) {
          return false;
        }
      } else if (typeof first === 'number' && typeof second === 'number') {
        if (u.age < first || u.age > second) {
          return false;
        }
      }
    }

    if (filters.gender && !filters.gender.includes(u.gender)) {
      return false;
    }

    if (filters.favorite && !filters.favorite.includes(u.favorite)) {
      return false;
    }

    return true;
  });
}

function compareNumber(value, op, num) {
  switch (op) {
    case '>': return value > num;
    case '<': return value < num;
    case '>=': return value >= num;
    case '<=': return value <= num;
    default: return value === num;
  }
}

function sortUsersBy(users, key, direction = 'asc') {
  const sorted = structuredClone(users);

  sorted.sort((u1, u2) => {
    const val1 = u1[key];
    const val2 = u2[key];

    if (typeof val1 === 'string' && typeof val2 === 'string') {
      const cmp = val1.localeCompare(val2);
      return direction === 'asc' ? cmp : -cmp;
    }

    const numA = key === 'b_date' ? new Date(val1).getTime() : val1;
    const numB = key === 'b_date' ? new Date(val2).getTime() : val2;
    const cmp = numA - numB;
    return direction === 'asc' ? cmp : -cmp;
  });

  return sorted;
}

function searchUsers(users, query) {
  const lowerQuery = String(query).toLowerCase().trim();

  return users.filter(user => {
    for (const key in user) {
      const value = user[key];

      if (typeof value === 'object' && value !== null) {
        continue;
      }

      if (String(value).toLowerCase().includes(lowerQuery)) {
        return true;
      }
    }

    return false;
  });
}

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