export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: Role;
}

export enum Role {
    Admin = 'ADMIN',
    User = 'USER',
    Guest = 'GUEST'
}
