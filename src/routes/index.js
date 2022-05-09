import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerFile from '../swagger_output.json';
import matchRoutes from './v1/matches.routes';
import teamRoutes from './v1/teams.routes';
import tournamentRoutes from './v1/tournaments.routes';
import usersRoutes from './v1/users.routes';


const routes = new Router();

routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
routes.use('/api', [usersRoutes, tournamentRoutes, teamRoutes, matchRoutes])

export default routes;