import express from 'express';
import routes from './routes';
const cors = require('cors')
class App {

  constructor() {
    this.server = express()
    this.middlewares()
    this.cors()
    this.routes()
  }

  cors() {
    this.server.use(cors())
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes)
  }
  
}

export default new App().server;