import { Router } from 'express';
import TournamentController from '../../controllers/TournamentController';

const tournamentRoutes = new Router();

tournamentRoutes.get('/tournaments', TournamentController.index);
tournamentRoutes.get('/tournament/:id', TournamentController.getById);
tournamentRoutes.post('/tournament', TournamentController.create);
tournamentRoutes.put('/tournament', TournamentController.update);
tournamentRoutes.delete('/tournament/:id', TournamentController.delete);

export default tournamentRoutes;