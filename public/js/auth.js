const url = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080/api/auth/'
    : 'https://some.website';

/** HTML References */
const myForm = document.querySelector('form')


/** LOCAL AUTH */
myForm.addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = {}

    for (let element of myForm.elements) {
        if (element.name.length > 0) {
            // Add Element to Object, [key]
            formData[element.name] = element.value
        }        
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(resp => resp.json())
    .then( (resp) => {
        if (resp.errors) {
            return console.error('Errors: ', resp.errors)
        } 
        
        if (!resp.ok) {
            return console.error('Error: ', resp.msg)
        }

        // Get JWT
        localStorage.setItem('token', resp.token)
        window.location = 'chat.html'
    })
    .catch(err => {
        console.error(err)
    })
})

    
/** GOOGLE AUTH */
function handleCredentialResponse(response) {
    // Google Token ID_TOKEN
    const body = { id_token: response.credential };

    // Enviar Token Google al Backend
    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
        .then((resp) => resp.json())
        .then(({ token }) => {
            /** Save JWT Only */
            localStorage.setItem('token', token);
            window.location = 'chat.html'
        })
        .catch(console.warn);
}

function logOut() {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'), (done) => {
        localStorage.clear();
        location.reload();
    });
}
