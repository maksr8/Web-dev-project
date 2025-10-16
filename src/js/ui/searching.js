import { setSearchQuery } from "../data/data";
import { renderTable, renderTeachers } from "./render";

async function handleSearch(event) {
    event.preventDefault();
    const searchInput = event.target.querySelector('input[type="text"]');
    if (searchInput) {
        const query = searchInput.value.trim().toLowerCase();
        await setSearchQuery(query);
        renderTeachers(false);
        renderTable();
    }
}

export { handleSearch };