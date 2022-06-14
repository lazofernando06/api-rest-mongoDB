const express = require('express');
const cors = require('cors');
const {dbConnection}= require('../database/config')

class Server {
    constructor() {
        this._app = express();
        this._port = process.env.PORT;
        this._path = {
            auth: "/api/auth",
            category: "/api/category",
            user: "/api/users",
        }
        this.connectionDb() ;
        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async connectionDb(){
        await dbConnection;
    }

    middlewares() {

        this._app.use(cors());
        this._app.use(express.json());
        // Directorio Público
        this._app.use(express.static('public'));

    }

    routes() {
        this._app.use(this._path.auth, require('../routes/auth'));
        this._app.use(this._path.category, require('../routes/users'));
        this._app.use(this._path.user, require('../routes/users'));
    }

    listen() {
        this._app.listen(this._port, () => {
            console.log('Servidor corriendo en puerto', this._port);
        });
    }

}


module.exports = Server;
