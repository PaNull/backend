import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as swaggerFile from '../swagger_output.json';
import teamRoutes from './v1/teams.routes';
import tournamentRoutes from './v1/tournaments.routes';
import usersRoutes from './v1/users.routes';


const routes = new Router();

routes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))
routes.use('/api', [usersRoutes, tournamentRoutes, teamRoutes])

export default routes;