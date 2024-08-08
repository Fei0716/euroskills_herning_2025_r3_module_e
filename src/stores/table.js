import {ref,reactive,computed,watchEffect} from 'vue'

//states
const table = ref(
   localStorage.getItem('table') !== 'undefined' ? JSON.parse(localStorage.getItem('table')): {}
);
//set up watchers
watchEffect(()=>{
    localStorage.setItem('table' , JSON.stringify(table.value) );
});
//actions


//getters


export default table;