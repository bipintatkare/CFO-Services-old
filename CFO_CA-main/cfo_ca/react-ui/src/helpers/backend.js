import cookie from "react-cookies";

// Gets the logged in user data from local session 
const getLoggedInUser = () => {
    const user = localStorage.getItem('user');
    if (user)
        return JSON.parse(user);
    return null;
}

//is user is logged in
const isUserAuthenticated = () => {
    return getLoggedInUser() !== null;
}


const postBackend = (url, data) => {

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "X-CSRFToken": cookie.load("csrftoken"),
            "Authorization": `token ${cookie.load("token")}`
        },
        body: JSON.stringify(data)
    };
    console.log(requestOptions)
    fetch(process.env.REACT_APP_BASEURL_BACKEND + url, requestOptions)
        .then(response => {
            console.log(response.status)
            if (response.status === 400 || response.status === 500)
                throw response.data;

            console.log(response)
            return response.data;
        })
        .catch(err => {
            console.log(err)
            var message;
            if (err.response && err.response.status) {
                switch (err.response.status) {
                    case 404: message = "Sorry! the page you are looking for could not be found"; break;
                    case 500: message = "Sorry! something went wrong, please contact our support team"; break;
                    case 401: message = "Invalid credentials"; break;
                    default: message = err[1]; break;
                }
            }
            throw message;
        })
}

export { isUserAuthenticated, postBackend }