import { Router } from 'express';
import TournamentController from '../../controllers/TournamentController';

const tournamentRoutes = new Router();

tournamentRoutes.get('/tournaments', TournamentController.index);
tournamentRoutes.get('/tournament/:id', TournamentController.getById);
tournamentRoutes.get('/tournament/registeredTeamsChampionship/:id', TournamentController.registeredTeamsChampionship);
tournamentRoutes.get('/tournament/shuffleMatches/:id', TournamentController.shuffleMatches);
tournamentRoutes.post('/tournament/registerTeamChampionship', TournamentController.registerTeamChampionship);
tournamentRoutes.post('/tournament', TournamentController.create);
tournamentRoutes.put('/tournament', TournamentController.update);
tournamentRoutes.delete('/tournament/:id', TournamentController.delete);

export default tournamentRoutes;