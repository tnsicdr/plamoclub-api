import 'reflect-metadata';
import express from 'express';
import { Connection, createConnection, Db } from 'typeorm';
import { getRoutes } from './controllers';

const PORT = 9090; // todo: change this to env
 
class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    private config() {
        this.app.set('port', PORT);
        this.app.use(express.json());
    }

    private async routes() {
        await createConnection();
        getRoutes(this.app);
    }

    public start() {
        this.app
            .listen(this.app.get('port'), () => {
                console.log(`Starting server on port ${PORT}`);
            })
            .on('error', (err) => {
                console.error(err);
                process.exit(1);
            });
    }
}

const app = new App();
app.start();