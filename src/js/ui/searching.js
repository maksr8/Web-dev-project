import { getUsers } from "../data/data";
import { searchUsersByNameNoteAge } from "../logic/search";
import { renderTeachers } from "./render";

function handleSearch(event) {
    event.preventDefault();
    const searchInput = event.target.querySelector('input[type="text"]');
    if (searchInput) {
        const query = searchInput.value.trim().toLowerCase();
        let users = getUsers();
        users = searchUsersByNameNoteAge(users, query);
        renderTeachers(false, users);
    }
}

export { handleSearch };