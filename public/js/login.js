/**
 * Created by milosberka on 5.5.2017.
 */
'use strict';
document.getElementById('loginForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const loginData = {
        'username': document.getElementById('username').value,
        'password': document.getElementById('password').value
    };

    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    console.log(loginData.username);
    const login = new Request('https://localhost:3000/api/users/login/', {
        'method': 'POST',
        'body': JSON.stringify(loginData),
        'headers': myHeaders,
        'cache': 'default'
    });
    fetch(login).then((response) => {
        if(response.ok) {
            console.log(response);
            return response;
        }
        throw new Error('Network response was not ok.');
    });
});