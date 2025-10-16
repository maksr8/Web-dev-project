import { filterUsersBy } from "../logic/filter";
import { searchUsersByNameNoteAge } from "../logic/search";
import { sortUsersBy } from "../logic/sort";
import { API_URL_USERS, API_URL_DISPLAYED_USERS } from "./constants.js";

let users = [];
let displayedUsers = [];

let state = {
    searchQuery: '',
    filters: {},
    sort: { key: null, direction: null }
};

async function setUsers(newUsers) {
    users = newUsers;
    displayedUsers = [...newUsers];
    await deleteUsersServer();
    await deleteDisplayedUsersServer();
    await postUsersServer(newUsers);
    await postDisplayedUsersServer(displayedUsers);
}

async function deleteUsersServer() {
    const res = await fetch(API_URL_USERS);
    const current = await res.json();
    const responses = await Promise.all(current.map(u =>
        fetch(`${API_URL_USERS}/${u.id}`, { method: "DELETE" })
    ));
    const failed = responses.filter(res => !res.ok && res.status !== 404);
    if (failed.length > 0) throw new Error("Failed to clear some users");
}

async function deleteDisplayedUsersServer() {
    const res = await fetch(API_URL_DISPLAYED_USERS);
    const current = await res.json();
    const responses = await Promise.all(current.map(u =>
        fetch(`${API_URL_DISPLAYED_USERS}/${u.id}`, { method: "DELETE" })
    ));
    const failed = responses.filter(res => !res.ok && res.status !== 404);
    if (failed.length > 0) throw new Error("Failed to clear some displayed users");
}

async function postUsersServer(users) {
    const responses = await Promise.all(
        users.map(u =>
            fetch(API_URL_USERS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(u)
            })
        )
    );
    const failed = responses.filter(res => !res.ok);
    if (failed.length > 0) throw new Error("Failed to set some users");
}

async function postDisplayedUsersServer(displayedUsers) {
    const responses = await Promise.all(
        displayedUsers.map(u =>
            fetch(API_URL_DISPLAYED_USERS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(u)
            })
        )
    );
    const failed = responses.filter(res => !res.ok);
    if (failed.length > 0) throw new Error("Failed to set some displayed users");
}

function getUsers() {
    return users;
}

function getDisplayedUsers() {
    return displayedUsers;
}

function getState() {
    return state;
}

async function addUser(user) {
    users.push(user);
    displayedUsers.push(user);
    await updateDisplayed();
}

function getTeacherById(id) {
    return users.find(u => String(u.id) === String(id));
}

function getAllCountries() {
    const countries = new Set();
    for (const user of users) {
        if (user.country) {
            countries.add(user.country);
        }
    }
    return Array.from(countries).sort();
}

async function setSearchQuery(query) {
    state.searchQuery = query.trim().toLowerCase();
    await updateDisplayed();
}

async function setFilters(newFilters) {
    state.filters = { ...newFilters };
    await updateDisplayed();
}

async function setSort(key, direction) {
    state.sort = { key, direction };
    await updateDisplayed();
}

async function updateDisplayed() {
    let result = [...users];

    if (state.searchQuery) {
        result = searchUsersByNameNoteAge(result, state.searchQuery);
    }
    if (state.filters) {
        result = filterUsersBy(result, state.filters);
    }
    result = sortUsersBy(result, state.sort.key, state.sort.direction);

    await deleteDisplayedUsersServer();
    displayedUsers = result;
    await postDisplayedUsersServer(displayedUsers);
}

export {
    setUsers,
    getUsers,
    getTeacherById,
    getAllCountries,
    addUser,
    getDisplayedUsers,
    setSearchQuery,
    setFilters,
    setSort,
    getState,
    updateDisplayed
};