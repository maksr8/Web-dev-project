import { COURSES, NOTE_FOR_MOCK } from '../data/constants.js';
import { setUsers } from '../data/data.js';
import { capitalizeFirstLetter, randCourse, randHexColor, randIsFavorite } from '../logic/utils.js';

async function fetchUsers(count = 50) {
    try {
        const response = await fetch(`https://randomuser.me/api/?results=${count}`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        const users = data.results.map(mapRandomUserToTeacher);

        await setUsers(users);
    } catch (error) {
        console.error('Failed to fetch users:', error);
    }
}

function mapRandomUserToTeacher(u) {
    const full_name = `${capitalizeFirstLetter(u.name.first)} ${capitalizeFirstLetter(u.name.last)}`;
    const gender = capitalizeFirstLetter(u.gender);
    const b_date = u.dob.date.split('T')[0];
    const age = u.dob.age;
    const email = u.email;
    const phone = u.phone || u.cell || '—';
    const country = u.location.country;
    const city = u.location.city;
    const picture_large = u.picture && u.picture.large || '';
    const note = NOTE_FOR_MOCK;
    const color = randHexColor();
    const course = randCourse(COURSES);
    const favorite = randIsFavorite();
    const id = u.login.uuid;
    const latitude = u.location.coordinates.latitude;
    const longitude = u.location.coordinates.longitude;

    return {
        id,
        full_name,
        gender,
        b_date,
        age,
        email,
        phone,
        country,
        city,
        latitude,
        longitude,
        picture_large,
        note,
        color,
        course,
        favorite
    };
}

export { fetchUsers };
