import { Router } from 'express';
import UserController from '../../controllers/UserController';

const userRoutes = new Router();

userRoutes.get('/users', UserController.index);
userRoutes.get('/user/:id', UserController.getById);
userRoutes.post('/user', UserController.create);
userRoutes.post('/user/login', UserController.login);
userRoutes.put('/user', UserController.update);
userRoutes.delete('/user/:id', UserController.delete);

export default userRoutes;