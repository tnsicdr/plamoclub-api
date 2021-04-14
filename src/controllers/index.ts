import express from 'express';
import { UserController } from './user.controller';

export const getRoutes = (app: express.Application): void => {
    const userController = new UserController();

    app.use('/api/user', userController.router);
}