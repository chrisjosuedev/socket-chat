const { checkJWT } = require('../helpers');
const { ChatMessages } = require('../models');

const chatMessages = new ChatMessages();

/** io -> Global */
/** socket -> Server - Client */

const socketController = async (socket, io) => {
    /**
     * Get Token from Headers and Verify if it's valid (Token & User.status = true) with checkJWT() function:
     * * Is valid -> Show connected
     * * Is invalid -> Disconnect the User
     **/

    /** ['authorization'] is the header name where we save the JWT */
    const token = socket.handshake.headers['authorization'];

    const user = await checkJWT(token);

    if (!user) {
        return socket.disconnect();
    }

    // Notify Connected Users
    chatMessages.connectUser(user);
    io.emit('activeUsers', chatMessages.usersArr);
    socket.emit('receiveMsg', chatMessages.lastTeenMsg);

    /**
     * Socket is linked to two rooms -> Global & Socket.id, with socket.join(some id or array) we add
     * another room to the user.
     **/

    // Connect to a Specified Room, casting a new Room Chat
    socket.join(user._id.toString());

    // Notify Disconnected Users
    socket.on('disconnect', () => {
        chatMessages.disconnectUser(user._id);
        // Emit Users Active to Users
        io.emit('activeUsers', chatMessages.usersArr);
    });

    // Received Msg

    socket.on('send-msg', ({ uid, msg }) => {
        
        if (uid) {
            /** Private Msg */
            socket.to(uid).emit('privateMsg', {
                from: user.name,
                msg
            })
        } else {
            /** Public msg */
            chatMessages.sendMessages(user._id, user.name, msg);
            io.emit('receiveMsg', chatMessages.lastTeenMsg);
        }
    });
};

module.exports = {
    socketController,
};
