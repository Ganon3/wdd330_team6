import { loginRequest, signupRequest } from "./externalServices.mjs";
import { alertMessage, getLocalStorage, setLocalStorage } from "./utils.mjs";
import { jwtDecode } from "jwt-decode";

const tokenKey = "so-token";

export async function login(creds, redirect = "/") {
    try {
        const token = await loginRequest(creds);
        setLocalStorage(tokenKey, token);
        window.location = redirect;
    } catch (err) {
        alertMessage(err.message.message);
    }
}
export async function signup(creds, redirect = "/login/index.html") {
    try {
        const message = await signupRequest(creds);
        if(message.indexOf("User created") != -1) {
            alertMessage(message);
            // setLocalStorage(tokenKey, token);
            window.location = redirect;

        } else {
            alertMessage(message);
        }
    } catch (err) {
        alertMessage(err.message.message);
    }
}

export function updateAuth(){
    const authResult = checkLogin();
    if(authResult) {
        document.querySelector(".login-header").innerHTML = `<a href="/login/index.html"><button id="loginBtn" class="login-btn">Logout</button></a>`
    } else {
        document.querySelector(".login-header").innerHTML = `<a href="/login/index.html"><button id="loginBtn" class="login-btn">Login</button></a>`
    }
}

export function checkLogin() {
    const token = getLocalStorage(tokenKey);
    const valid = isTokenValid(token);
    if (!valid) {
        localStorage.removeItem(tokenKey);
        // const location = window.location;
        // console.log(location);
        // window.location = `/login/index.html?redirect=${location.pathname}`;
    }   else return token;
}

function isTokenValid(token) {
    if (token) {
        const decoded = jwtDecode(token);
        let currentDate = new Date();
        if (decoded.exp * 1000 < currentDate.getTime()) {
            console.log("Token expired.");
            return false;
        } else {
            console.log("Valid Token");
            return true;
        }
    } else return false;
}