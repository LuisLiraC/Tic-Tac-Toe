const matching = require('./matching')()

module.exports = (io) => {
    io.on('connection', socket => {
        socket.on('register', user => {
            console.info(`User registered: ${user.name}, id: ${user.id}`)
            matching.userConnect({ socket, user })
        })
        socket.on('disconnect', () => {
            console.info(`User with id: ${socket.id} was disconnected`)
            matching.userDisconnect(socket.id)
        })
        socket.on('message', (id, msg) => {
            console.log(id, msg)
            console.info(`Message sent to ${id}`)
            socket.to(id).emit(msg.type, msg.body)
        })
    })
}