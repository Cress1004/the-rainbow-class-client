import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    RESET_PASSWORD,
} from './types';
import { USER_API } from '../config';

export function registerUser(dataToSubmit){
    const request = axios.post(`${USER_API}/register`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit){
    const request = axios.post(`${USER_API}/login`,dataToSubmit)
                .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get(`${USER_API}/auth`)
    .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser(){
    const request = axios.get(`${USER_API}/logout`)
    .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

export function resetPassword(){
    const request = axios.get(`${USER_API}/reset-password`)
    .then(response => response.data);

    return {
        type: RESET_PASSWORD,
        payload: request
    }
}
