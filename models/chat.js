class Messages {
    constructor(uid, username, msg) {
        this.uid = uid;
        this.username = username;
        this.msg = msg;
    }
}

class ChatMessages {
    constructor() {
        this.messages = [];
        this.users = {};
    }

    /** Get Last 10 Messages */
    get lastTeenMsg() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    }

    /** Get Users */
    get usersArr() {
        /** Object.values() -> Returns a Array with Users [{...}, {...}]*/
        return Object.values(this.users);
    }

    /** Send Messages */
    sendMessages(uid, username, msg) {
        this.messages.unshift(new Messages(uid, username, msg));
    }

    /** Users */
    connectUser(user) {
        // Object -> id: {uid, user}, id: {uid, user2} , ...
        this.users[user.id] = user;
    }

    disconnectUser(id) {
        delete this.users[id]
    }
}

module.exports = ChatMessages;
