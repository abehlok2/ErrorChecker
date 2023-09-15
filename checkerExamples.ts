export const errorInput = `
Process exited with code 1
Uncaught SyntaxError /home/abehlok/Typescript/Error Checker/test.ts:1
interface User {
          ^^^^

SyntaxError: Unexpected identifier 'User'
    at internalCompileFunction (internal/vm:73:18)
    at wrapSafe (internal/modules/cjs/loader:1153:20)
    at Module._compile (internal/modules/cjs/loader:1205:27)
    at Module._extensions..js (internal/modules/cjs/loader:1295:10)
    at Module.load (internal/modules/cjs/loader:1091:32)
    at Module._load (internal/modules/cjs/loader:938:12)
    at executeUserEntryPoint (internal/modules/run_main:83:12)
    at <anonymous> (internal/main/run_main_module:23:47)

`

export const codeInput = 
`interface User {
    id: number;
    name: string;
    friends?: User[];
}

function getUserNameById(users: User[], userId: number): string | undefined {
    const user = users.find(u => u.ide === userId); // Error: Property 'ide' does not exist on type 'User'. 
    return user && user.name;
}

function getFriendNames(user: User): string[] {
    return user.friends.map(friend => friend.name); // Error: Object is possibly 'undefined'.
}

let userList: Users[] = [ // Error: Cannot find name 'Users'.
    { id: 1, name: "John", friends: [{ id: 2, name: "Jane" }] },
    { id: 2, name: "Jane", friends: [{ id: 1, name: "John" }, { id: 3, name: "Jack" }] },
    { id: 3, name: "Jack" },
];

console.log(getUserNameById(userList, 2));
console.log(getFriendNames(userList[1]));
`
