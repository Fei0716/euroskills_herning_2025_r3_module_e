import {ref,reactive,computed,watchEffect} from 'vue'

//states
const auth = ref({
    'token': localStorage.getItem('token')||null,
});
//set up watchers
watchEffect(()=>{
    localStorage.setItem('token' , auth.value.token);
});
//actions


//getters
auth.isAuthenticated = computed(()=>{
    return auth.value.token !== null;
});

export default auth;