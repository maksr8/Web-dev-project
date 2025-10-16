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

export { randIsFavorite, randCourse, randHexColor, capitalizeFirstLetter };