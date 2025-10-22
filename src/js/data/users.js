import _ from 'lodash';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { randIsFavorite, randCourse, randHexColor } from '../logic/utils.js';
import {
    COURSES, NOTE_FOR_MOCK, NOTE_FOR_ADDITIONAL,
    COUNTRY_CODES
} from './constants.js';

function getAllUsers(randomUserMock, additionalUsers) {
    let allUsers = _.map(randomUserMock, (user, id) => normalize(user, id));
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
        _.forEach(userClone, (value, key) => {
            if (value !== null && value !== undefined) {
                allUsers[existingIndex][key] = value;
            }
        });
    } else {
        userClone = fillKeysWithData(userClone);
        allUsers.push(userClone);
    }
    return allUsers;
}

function renameB_dayToB_date(user) {
    const clone = _.cloneDeep(user);
    if (_.has(clone, 'b_day')) {
        clone.b_date = clone.b_day;
        return _.omit(clone, 'b_day');
    }
    return clone;
}

function fillKeysWithData(user) {
    const userClone = _.cloneDeep(user);
    _.forEach(userClone, (value, key) => {
        if (value === null || value === undefined) {
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
    });
    return userClone;
}

function normalize(user, id) {
    let normalizedUser = {
        gender: _.get(user, 'gender'),
        title: _.get(user, 'name.title'),
        full_name: `${_.get(user, 'name.first', '')} ${_.get(user, 'name.last', '')}`,
        city: _.get(user, 'location.city'),
        state: _.get(user, 'location.state'),
        country: _.get(user, 'location.country'),
        postcode: _.get(user, 'location.postcode'),
        coordinates: _.cloneDeep(_.get(user, 'location.coordinates')),
        timezone: _.cloneDeep(_.get(user, 'location.timezone')),
        email: _.get(user, 'email'),
        b_date: _.get(user, 'dob.date'),
        age: _.get(user, 'dob.age'),
        phone: _.get(user, 'phone'),
        picture_large: _.get(user, 'picture.large'),
        picture_thumbnail: _.get(user, 'picture.thumbnail'),
        id: id,
        favorite: randIsFavorite(20),
        course: randCourse(COURSES),
        bg_color: randHexColor(),
        note: NOTE_FOR_MOCK
    };
    return normalizedUser;
}

function repairInvalidGenderAndPhone(users) {
    return _.map(users, user => {
        const userClone = _.cloneDeep(user);
        return repairPhone(repairGender(userClone), COUNTRY_CODES);
    });
}

function repairGender(user) {
    const gender = _.get(user, 'gender');
    if (_.isString(gender) && gender.length > 0) {
        user.gender = _.capitalize(gender);
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