import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { randIsFavorite, randCourse, randHexColor } from '../logic/utils.js';
import {
    COURSES, NOTE_FOR_MOCK, NOTE_FOR_ADDITIONAL,
    COUNTRY_CODES
} from './constants.js';

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

function calcAgeByBirthDate(b_date) {
    const birthDate = new Date(b_date);
    const ageDiff = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDiff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export {
    getAllUsers,
    repairInvalidGenderAndPhone,
    calcAgeByBirthDate
};