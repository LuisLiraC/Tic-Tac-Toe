/**
 * 
 * ***************
 *  Comience aqui
 * ***************
 * 
 */

const server = require('http').createServer()
const io = require('socket.io')(server)
const { SERVER_PORT: port } = require('./config')

require('./backend/connect')(io)

const banner = `
************************************
      Curso básico de Node.js
         Tic tac toe Server
************************************
Status: online
Listening on port: ${port}
`

server.listen(port, () => {
    console.info(banner)
})