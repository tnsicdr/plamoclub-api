import { IUser } from '../interfaces';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    username: string;

    @Column('text')
    email: string;

    @Column('text')
    password: string;

    @Column('text')
    salt: string;

    @Column('boolean')
    deleted: boolean;

    @Column('boolean')
    confirmed: boolean;

    @Column('datetime')
    createDate: Date;

    @Column('datetime')
    updateDate: Date;
}
