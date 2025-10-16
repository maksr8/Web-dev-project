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
const API_URL_USERS = "http://localhost:3000/users";
const API_URL_DISPLAYED_USERS = "http://localhost:3000/displayedUsers";

export {
    COURSES,
    NOTE_FOR_MOCK,
    NOTE_FOR_ADDITIONAL,
    STRING_KEYS_TO_VALID,
    COUNTRY_CODES,
    API_URL_USERS,
    API_URL_DISPLAYED_USERS
};