export interface IUser {
    id: string;
    username: string;
    password?: string;
    email: string;
    salt?: string;
    deleted?: boolean;
    confirmed?: boolean;
    createDate?: Date;
    updateDate?: Date;
}
