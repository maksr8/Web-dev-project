import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);

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

function capitalizeFirstLetter(string) {
    if (typeof string !== 'string' || string.length === 0) {
        return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getDaysToBirthday(b_date) {
    if (!b_date) return null;

    const today = dayjs().startOf('day');
    const birthDate = dayjs(b_date);

    let nextBirthday = birthDate.year(today.year());

    if (nextBirthday.isToday()) {
        return 0;
    }

    if (nextBirthday.isBefore(today)) {
        nextBirthday = nextBirthday.add(1, 'year');
    }

    return nextBirthday.diff(today, 'day');
}

export { randIsFavorite, randCourse, randHexColor, capitalizeFirstLetter, getDaysToBirthday };