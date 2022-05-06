import { Router } from 'express';
import TeamController from '../../controllers/TeamController';

const teamRoutes = new Router();

teamRoutes.get('/teams', TeamController.index);
teamRoutes.get('/team/:id', TeamController.getById);
teamRoutes.post('/team', TeamController.create);
teamRoutes.post('/team/member', TeamController.addTeamMember);
teamRoutes.put('/team', TeamController.update);
teamRoutes.delete('/team/:id', TeamController.delete);

export default teamRoutes;