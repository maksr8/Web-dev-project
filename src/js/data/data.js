let users = [];

function setUsers(newUsers) {
    users = newUsers;
}

function getUsers() {
    return users;
}

export { users, setUsers, getUsers };