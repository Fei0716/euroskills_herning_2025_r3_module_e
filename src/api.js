import axios from  'axios';
import auth from './stores/auth.js'
import router from './router.js'
import {watchEffect} from "vue";


const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`,
    }
});

watchEffect(()=>{
    api.defaults.headers['Authorization'] = `Bearer ${auth.value.token}`;
});

//set up interceptor
api.interceptors.response.use(async function(config){
    return config;
}, async function (error){
    if(error.response.status === 401){
        //redirect to login page
        console.log(router)
        router.push({name: 'Login'})
    }
    return Promise.reject(error);
})

export default api;