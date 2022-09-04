/** HTML Referencies*/
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const btnSalir = document.querySelector('#btnSalir');

/** URL to FETCH */
const url = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080/api/auth/'
    : 'https://some.website';
let user = null;
let socket = null;

const validateJWT = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location = 'index.html';
        throw new Error('No token en servidor');
    }

    const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const { user: userDB, token: tokenDB } = await resp.json();

    localStorage.setItem('token', tokenDB);

    user = userDB;

    document.title = user.name;

    await connectSocket();
};

const connectSocket = async () => {
    socket = io({
        extraHeaders: {
            Authorization: localStorage.getItem('token'),
        },
    });

    socket.on('connect', () => {
        console.log('Sockets Online')
    })

    socket.on('disconnect', () => {
        console.log('Sockets Offline')
    })

    socket.on('receiveMsg', showMessages)
    
    socket.on('activeUsers', showUsersConnected)

    /** Receive Private Msg from a User */
    socket.on('privateMsg', (payload) => {
        console.log('Msg->', payload)
    })
};


const showUsersConnected = (users = []) => {
    let usersHtml = ''
    users.forEach(({name, uid}) => {
        usersHtml += `
            <li>
                <p>
                    <h5 class="text-success"> ${name} </h5>
                    <span class="fs-6 text-muted"> ${uid} </span>
                </p>
            </li>
        `
    })

    ulUsers.innerHTML = usersHtml
}

const showMessages = (msgs = []) => {
    let msgHtml = ''
    msgs.forEach(({username, msg}) => {
        msgHtml += `
            <li>
                <p>
                    <span class="text-primary"> ${username}: </span>
                    <span> ${msg} </span>
                </p>
            </li>
        `
    })

    ulMessages.innerHTML = msgHtml
}

const main = async () => {
    await validateJWT();
};

/** Listener */
txtMessage.addEventListener('keyup', (event) => {

    const msg = txtMessage.value
    const uid = txtUid.value

    if (event.keyCode !== 13) {
        return
    }

    if (msg.length === 0) {
        return
    }

    socket.emit('send-msg', { msg, uid })

    txtMessage.value = ''


})

/** Calling Main Function */
main();
