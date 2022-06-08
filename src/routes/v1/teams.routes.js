import { Router } from 'express';
import TeamController from '../../controllers/TeamController';

const teamRoutes = new Router();

teamRoutes.get('/teams', TeamController.index);
teamRoutes.get('/teams/members', TeamController.playersOfTeams);
teamRoutes.get('/team/:id', TeamController.getById);
teamRoutes.post('/team', TeamController.create);
teamRoutes.post('/team/member', TeamController.addTeamMember);
teamRoutes.put('/team', TeamController.update);
teamRoutes.delete('/team/:id', TeamController.delete);

teamRoutes.get('/team/matches/:id', TeamController.getMatches)

export default teamRoutes;