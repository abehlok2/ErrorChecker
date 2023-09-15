interface User {
    id: number;
    name: string;
    friends?: User[];
}

function getUserNameById(users: User[], userId: number): string | undefined {
    const user = users.find(u => u.id === userId);
    return user && user.name;
}

function getFriendNames(user: User): string[] {
    return user.friends.map(friend => friend.name);
}

let userList: Users[] = [
    { id: 1, name: "John", friends: [{ id: 2, name: "Jane" }] },
    { id: 2, name: "Jane", friends: [{ id: 1, name: "John" }, { id: 3, name: "Jack" }] },
    { id: 3, name: "Jack" },
];

console.log(getUserNameById(userList, 2));
console.log(getFriendNames(userList[1]));
