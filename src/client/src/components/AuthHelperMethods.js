import decode from 'jsonwebtoken';

export default class AuthHelperMethods {

    login = (username, password) => {
        return this.fetch(`http://localhost:3001/v1/api/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            this.setToken(res.accessToken)
            return Promise.resolve(res);
        })
    }


    loggedIn = () => {
        const token = this.getToken() 
        return !!token && !this.isTokenExpired(token) 
    }

    isTokenExpired = (token) => {
        try {
            const decoded = decode.verify(token, 'somesecret');
            if (decoded.expiresIn > Date.now()) { 
                return true;
            }
            else
                return false;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    setToken = (idToken) => {
        localStorage.setItem('id_token', idToken)
    }

    getToken = () => {
        return localStorage.getItem('id_token')
    }

    logout = () => {
        localStorage.removeItem('id_token');
    }

    getConfirm = () => {
        let answer = decode.verify(this.getToken(), 'somesecret');
        console.log("Recieved answer!");
        return answer;
    }

    fetch = (url, options) => {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus = (response) => {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}