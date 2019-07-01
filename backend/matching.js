const game = require('./gameState')

module.exports = () => {
    let players = {},
        onWait = [],
        onMatch = {}

    const loop = setInterval(checkQueu, 5000)

    function checkQueu() {
        console.log(`Queues: { Players: ${Object.keys(players).length}, OnWait: ${onWait.length}, OnMatch: ${Object.keys(onMatch).length}}`)
        while (onWait.length >= 2) {
            console.log('Constructing room...')
            // const p1 = players[onWait.pop()].user.name
            // const p2 = players[onWait.pop()].user.name
            // console.log(`We created a match for ${p1} and ${p2}`)
            createMatch(onWait.pop(), onWait.pop())
        }
    }

    function createMatch(p1_id, p2_id) {
        const roomId = p1_id + p2_id
        players[p1_id].roomId = roomId
        players[p2_id].roomId = roomId

        if (!onMatch[roomId]) onMatch[roomId] = game.newGame({
            players: [ players[p1_id], players[p2_id] ],
            roomId
        })

        players[p1_id].socket.emit('gameState',  game.newGame({
            players: [ players[p1_id], players[p2_id] ],
            roomId,
            playerId: 0,
            opponentId: 1
        }))
        players[p2_id].socket.emit('gameState',  game.newGame({
            players: [
                players[p1_id],
                players[p2_id]
            ],
            roomId,
            playerId: 1,
            opponentId: 0
        }))
    }

    return {
        userConnect: ({ socket, user }) => {
            if (!players[socket.id]) {
                players[socket.id] = { user, socket }
                onWait.push(socket.id)
            }
        },
        clear: () => clearInterval(loop),
        userDisconnect: (id) => {
            console.log('On disconnect', id)
            if (players[id].roomId && onMatch[players[id].roomId]) {
                const roomId = players[id].roomId
                onMatch[roomId].players.map(player => onWait.push(player.id))
                delete onMatch[players[id].roomId]
                if (!onMatch) onMatch = {}
            }

            onWait = onWait.filter(el => el !== id)

            if (players[id]) {
                delete players[id]
                if (!players) players = {}
            }
        }
    }

}