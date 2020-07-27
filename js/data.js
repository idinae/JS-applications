function host(endpoint) {
    return `https://api.backendless.com/2E0F50CF-1C88-E29E-FFCB-D5154F76D200/0982FDAE-51FA-486C-A1BF-56D31E76D7BF/${endpoint}`;
}

const endpoints = {
    REGISTER: 'users/register',
    LOGIN: 'users/login',
    LOGOUT: 'users/logout',
    MOVIES: 'data/movies'
}

async function register(username, password) { //после функцията се пуска с await, за да си получи данните (и без await ще се регистрира)
    return (await fetch(host(endpoints.REGISTER), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    })).json();
}

async function login(username, password) {
    const result = await (await fetch(host(endpoints.LOGIN), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login: username,
            password
        })
    })).json();

    localStorage.setItem('userToken', result['user-token']);
    localStorage.setItem('username', result.username);
    localStorage.setItem('userId', result.objectId);

    return result //ретърнваме го, за да може да се ползва после от контролера за логин (иначе резултатът ще е undefined)
}

//функциите по-долу се извикват с await, за да си получат данните (и без await ще сработят, но няма да върнат данни)
async function logout() { //после функцията се пуска с await, за да си получи данните (и без await ще се регистрира) 
    const token = localStorage.getItem('userToken'); //userToken ще го сетнем и вземем от localStorage (localStorage.setItem('name', 'value') и getItem())

    return fetch(host(endpoints.LOGOUT), {
        headers: {
            'user-token': token
        }
    });
}

//get all movies
async function getMovies() {
    const token = localStorage.getItem('userToken');

    return (await fetch(host(endpoints.MOVIES), {
        headers: {
            'user-token': token
        }
    })).json();
}

//get movie by ID
async function getMovieById(id) {
    const token = localStorage.getItem('userToken');

    return (await fetch(host(endpoints.MOVIES + '/' + id), {
        headers: {
            'user-token': token
        }
    })).json();
}

//create movie
async function createMovie(movie) {
    const token = localStorage.getItem('userToken');

    return (await fetch(host(endpoints.MOVIES), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        },
        body: JSON.stringify(movie)
    })).json();
}

//edit movie
async function updateMovie(id, updatedProps) {
    const token = localStorage.getItem('userToken');

    return (await fetch(host(endpoints.MOVIES + '/' + id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        },
        body: JSON.stringify(updatedProps)
    })).json();
}

//delete movie
async function deleteMovie(id) {
    const token = localStorage.getItem('userToken');

    return (await fetch(host(endpoints.MOVIES + '/' + id), {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        }
    })).json(); //връща кога е изтрит филма, затова json() може да остане
}

//get movies by userId - search with the Where Clause
async function getMoviesByOwner(ownerId) {
    const token = localStorage.getItem('userToken');

    return (await fetch(host(endpoints.MOVIES + `?where=ownerId%3D%27${ownerId}%27`), {
        headers: {
            'Content-Type': 'application/json',
            'user-token': token
        }
    })).json();
}

//buy ticket - композитна, защото извиква и updateMovie()
async function buyTicket(movie) {
    const movieObj = await getMovieById(movie);
    const newTickets = movieObj.tickets - 1;
    const movieId = movieObj.objectId;
    if (newTickets >= 0) {
        alert(`You have bought a ticket for ${movieObj.title}`);
        return updateMovie(movieId, {tickets: newTickets});
    } else {
        alert(`There are not tickets for ${movieObj.title}`);
    }
}