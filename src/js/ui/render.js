import { COURSES } from "../data/constants.js";
import { getDisplayedUsers, getUsers } from "../data/data";
import { getAllCountries } from "../data/data.js";

let statisticsChart;

async function renderTeachers(isFavorite) {

    let container = document.querySelector('.teachers');

    let users = await getDisplayedUsers();
    if (isFavorite) {
        users = getUsers();
        users = users.filter(u => u.favorite);
        container = document.querySelector('.favorites');
    }

    container.innerHTML = '';
    if (!container) return;

    const fragment = document.createDocumentFragment();

    for (const user of users) {
        const teacher = document.createElement('div');
        teacher.classList.add('teacher');
        if (user.favorite) teacher.classList.add('favourite');
        teacher.dataset.id = user.id;

        const fullName = user.full_name || '';
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts[1] || '';
        const initials =
            (firstName && firstName.length > 0 ? firstName[0].toUpperCase() : '') + '.' +
            (lastName && lastName.length > 0 ? lastName[0].toUpperCase() : '');

        const hasImage = user.picture_large && !user.picture_large.includes('null') && !user.picture_large.includes('undefined');

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'img-wrapper';
        if (hasImage) {
            const img = document.createElement('img');
            img.src = user.picture_large;
            img.alt = user.full_name || '';
            imgWrapper.appendChild(img);
        } else {
            const noAvatar = document.createElement('div');
            noAvatar.className = 'no-avatar';
            noAvatar.textContent = initials;
            imgWrapper.appendChild(noAvatar);
        }

        const nameDiv = document.createElement('div');
        const nameH3 = document.createElement('h3');
        nameH3.className = 'name';
        nameH3.textContent = firstName || '';
        const surnameH3 = document.createElement('h3');
        surnameH3.className = 'surname';
        surnameH3.textContent = lastName || '';
        nameDiv.appendChild(nameH3);
        nameDiv.appendChild(surnameH3);

        const infoDiv = document.createElement('div');
        const subjectP = document.createElement('p');
        subjectP.className = 'subject';
        subjectP.textContent = user.course || '';
        const locationP = document.createElement('p');
        locationP.className = 'location';
        locationP.textContent = user.country || '';
        infoDiv.appendChild(subjectP);
        infoDiv.appendChild(locationP);

        teacher.appendChild(imgWrapper);
        teacher.appendChild(nameDiv);
        teacher.appendChild(infoDiv);

        fragment.appendChild(teacher);
    }

    container.appendChild(fragment);
}

function renderFilters() {
    const container = document.querySelector('.filters');
    if (!container) return;

    const countries = getAllCountries();
    const fragment = document.createDocumentFragment();
    for (const country of countries) {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        fragment.appendChild(option);
    }
    const countrySelect = container.querySelector('.filter-country select');
    if (countrySelect) {
        countrySelect.appendChild(fragment);
    }
}

async function renderTable(users = null, sortState = { key: null, direction: null }) {
    if (!users) {
        users = await getDisplayedUsers();
    }
    const wrapper = document.querySelector('.table-wrapper');
    if (!wrapper) return;

    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');

    const headers = [
        { label: 'Name', key: 'full_name' },
        { label: 'Speciality', key: 'course' },
        { label: 'Age', key: 'age' },
        { label: 'Birth Date', key: 'b_date' },
        { label: 'Nationality', key: 'country' }
    ];

    for (const { label, key } of headers) {
        const th = document.createElement('th');
        th.classList.add('sortable');

        const isActive = sortState && sortState.key === key;
        if (isActive) {
            if (sortState.direction === 'asc') {
                th.classList.add('sorted-asc');
            } else {
                th.classList.add('sorted-desc');
            }
        } else {
            th.classList.add('non-sorted');
        }

        th.textContent = label;
        headRow.appendChild(th);
    }

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const fragment = document.createDocumentFragment();

    for (const user of users) {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = user.full_name || '';
        tr.appendChild(tdName);

        const tdCourse = document.createElement('td');
        tdCourse.textContent = user.course || '';
        tr.appendChild(tdCourse);

        const tdAge = document.createElement('td');
        tdAge.textContent = String(user.age != null ? user.age : '');
        tr.appendChild(tdAge);

        const tdDate = document.createElement('td');
        const date = user.b_date ? new Date(user.b_date) : null;
        const formattedDate = date
            ? String(date.getDate()).padStart(2, '0') + '.' +
            String(date.getMonth() + 1).padStart(2, '0') + '.' +
            date.getFullYear()
            : '';
        tdDate.textContent = formattedDate;
        tr.appendChild(tdDate);

        const tdCountry = document.createElement('td');
        tdCountry.textContent = user.country || '';
        tr.appendChild(tdCountry);

        fragment.appendChild(tr);
    }

    tbody.appendChild(fragment);
    table.appendChild(tbody);

    wrapper.innerHTML = '';
    wrapper.appendChild(table);
}

async function renderPieChart() {
    const users = await getUsers();

    const courseCounts = users.reduce((acc, user) => {
        const course = user.course || 'Unknown';
        acc[course] = (acc[course] || 0) + 1;
        return acc;
    }, {});

    const ctx = document.querySelector('.statistics-chart');
    if (!ctx) return;

    if (statisticsChart) {
        statisticsChart.destroy();
    }

    statisticsChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(courseCounts),
            datasets: [{
                label: 'Users per course',
                data: Object.values(courseCounts),
                backgroundColor: [
                    '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                    '#E7E9ED', '#8D6E63', '#FF8A65', '#4DB6AC', '#BA68C8', '#A1887F'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const value = context.parsed;
                                const percentage = ((value / total) * 100).toFixed(1) + '%';
                                label += `${value} (${percentage})`;
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

function renderAddTeacherForm() {
    const form = document.querySelector('.add-teacher-popup form');
    if (!form) return;
    form.reset();
    const countrySelect = form.querySelector('.country select');
    if (countrySelect) {
        const countries = getAllCountries();
        countrySelect.innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (const country of countries) {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            fragment.appendChild(option);
        }
        countrySelect.appendChild(fragment);
    }
    const courseSelect = form.querySelector('.course select');
    if (courseSelect) {
        courseSelect.innerHTML = '';
        const fragment = document.createDocumentFragment();
        for (const course of COURSES) {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            fragment.appendChild(option);
        }
        courseSelect.appendChild(fragment);
    }


}

export { renderTeachers, renderFilters, renderTable, renderAddTeacherForm, renderPieChart };
