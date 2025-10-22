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
    const full_name = `${_.capitalize(_.get(u, 'name.first', ''))} ${_.capitalize(_.get(u, 'name.last', ''))}`;
    const gender = _.capitalize(_.get(u, 'gender', ''));
    const b_date = _.get(u, 'dob.date', '').split('T')[0];
    const age = _.get(u, 'dob.age');
    const email = _.get(u, 'email');
    const phone = _.get(u, 'phone') || _.get(u, 'cell') || '—';
    const country = _.get(u, 'location.country');
    const city = _.get(u, 'location.city');
    const picture_large = _.get(u, 'picture.large') || '';
    const note = NOTE_FOR_MOCK;
    const color = randHexColor();
    const course = randCourse(COURSES);
    const favorite = randIsFavorite();
    const id = _.get(u, 'login.uuid');
    const latitude = _.get(u, 'location.coordinates.latitude');
    const longitude = _.get(u, 'location.coordinates.longitude');

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
