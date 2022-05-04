import { Router } from 'express';
import UserController from '../../controllers/UserController';

const userRoutes = new Router();

userRoutes.get('/users', UserController.index);
userRoutes.get('/user', UserController.getById);
userRoutes.post('/user', UserController.create);
userRoutes.put('/user', UserController.update);
userRoutes.delete('/user/:id', UserController.delete);

export default userRoutes;