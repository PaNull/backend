import { Router } from 'express';
import MatchController from '../../controllers/MatchController';

const matchRoutes = new Router();

matchRoutes.get('/matches', MatchController.index);
matchRoutes.get('/matchesTournament/:id', MatchController.getByTournamentId);
matchRoutes.get('/match/:id', MatchController.getById);
matchRoutes.post('/match', MatchController.create);
matchRoutes.put('/match', MatchController.update);
matchRoutes.delete('/match/:id', MatchController.delete);

export default matchRoutes;