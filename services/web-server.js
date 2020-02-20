const http = require('http');
const express = require('express');
const morgan = require('morgan');
const webServerConfig = require('../config/web-server.js');
const router = require('./router.js');

const database = require('./database.js');
 
let httpServer;
 
function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);
    app.use(morgan('combined'));
    morgan.token('date', function() {
      var p = new Date().toString().replace(/[A-Z]{3}\+/,'+').split(/ /);
      var hora = p[4].split(':');
      p[4] = (hora[0] - 1) + ':' + hora[1] + ':' + hora[2];
      return( p[2]+'/'+p[1]+'/'+p[3]+':'+p[4]+' '+p[5] );
    });
    app.use(express.json()) // for parsing application/json
    app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    app.use('/api', router);
    app.get('/', async (req, res) => {
        const result = await database.simpleExecute('select user, systimestamp from dual');
        const user = result.rows[0].USER;
        const date = result.rows[0].SYSTIMESTAMP;
   
        res.end(`DB user: ${user}\nDate: ${date}`);
      });
 
    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${webServerConfig.port}`);
 
        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}
 
module.exports.initialize = initialize;

function close() {
    return new Promise((resolve, reject) => {
      httpServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }
   
        resolve();
      });
    });
  }
   
module.exports.close = close;