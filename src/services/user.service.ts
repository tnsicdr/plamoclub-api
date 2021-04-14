import { scryptSync, randomBytes } from 'crypto';
import { IOperationResult, IUser } from '../interfaces';
import { User } from '../models/user';
import { getConnection, Repository } from 'typeorm';

export class UserService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = getConnection().getRepository(User);
    }

    public deleteUser = async (id: string): Promise<IOperationResult> => {
        return await this.userRepository
            .findOneOrFail(id)
            .then(async (user) => {
                const result: IOperationResult = {
                    success: false,
                    message: 'Unable to delete user.',
                };
                const updateResult = await this.userRepository.update(user.id, {
                    deleted: true,
                });

                const updatedRows = updateResult.affected ?? 0;

                if (updatedRows > 0) {
                    result.success = true;
                    result.message = 'User deleted';
                }

                return result;
            })
            .catch((err) => {
                return {
                    success: false,
                    message: err,
                };
            });
    };

    public updatePassword = async (
        id: string,
        password: string
    ): Promise<IOperationResult<IUser>> => {
        return await this.userRepository
            .findOneOrFail(id)
            .then(async (user) => {
                let result: IOperationResult<IUser> = {
                    success: false,
                    message: 'Unable to update password.',
                };

                const hashInfo = this.getPasswordHash(password);
                const updatedUser: IUser = { ...user, ...hashInfo };
                const saveResult = await this.userRepository.save(updatedUser);

                if (saveResult) {
                    result.success = true;
                    result.message = '';
                    result.result = this.sanitize(saveResult);
                }

                return result;
            })
            .catch((err) => {
                return {
                    success: false,
                    message: err,
                };
            });
    };

    /**
     * Removes fields that API consumers should not have access to
     * @param {IUser} user User
     * @returns {IUser} sanitized user object
     */
    private sanitize(user: IUser): IUser {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            createDate: user.createDate,
            updateDate: user.updateDate,
        };
    }

    /**
     * Generates a hash and salt for a password.
     * @param {string} password Password to generate a hash for
     * @returns {Partial<IUser>} IUser partial with updated hash
     */
    private getPasswordHash = (password: string): Partial<IUser> => {
        const salt = randomBytes(16);
        const hashBuf = scryptSync(password.normalize(), salt, 64, {
            N: 1024,
        });

        const result: Partial<IUser> = {
            password: hashBuf.toString('base64'),
            salt: salt.toString('base64'),
        };

        return result;
    };

    /**
     * Determines whether a password is vaid for a user.
     * @param {IUser} user user to validate against
     * @param {string} password password to validate
     * @returns {boolean} whether the password is valid for the user
     */
    private validatePassword = (user: IUser, password: string): boolean => {
        if (user.salt == null || user.password == null) return false;

        const salt = Buffer.from(user.salt, 'base64');
        const hashBuf = scryptSync(password.normalize(), salt, 64, {
            N: 1024,
        });

        const storedHash = Buffer.from(user.password, 'base64');

        return hashBuf === storedHash;
    };
}
