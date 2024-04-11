import Sequelize from 'sequelize';
import { dbVars } from '../config';
const fs = require('fs');

/* const sequelize = new Sequelize(databaseUrl, {
  define: {
    freezeTableName: true
  },
  logging: console.log,
  // logging: (...msg) => console.log(msg), // Displays all log function call parameters
  // logging: false, 
}); */

const sequelize = new Sequelize(dbVars.database, dbVars.user, dbVars.password, {
  host: dbVars.host,
  port: dbVars.port,
  dialect: 'mysql',
  dialectOptions: {
    // https://www.npmjs.com/package/mysql#ssl-options
    // ssl: {
    // key: fs.readFileSync('./certs/client-key.pem'),
    // cert: fs.readFileSync('./certs/client-cert.pem‘),
    //  ca: fs.readFileSync(dbVars.caCertFile),
    //  rejectUnauthorized: dbVars.verifyServerCertificate,
    // }
  },
  define: {
    freezeTableName: true
  },
  logging: console.log,
});


export default sequelize;
