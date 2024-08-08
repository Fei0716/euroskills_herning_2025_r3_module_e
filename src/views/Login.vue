<script setup>
  import {ref} from 'vue'
  import auth from '../stores/auth.js'
  import api from '../api.js'
  import {useRouter} from 'vue-router'

  const router = useRouter();
  const pin = ref([]);
  const error = ref(false);
  async function login(){
    try{
      const {data} = await api.post('login/pin',{
        pin: pin.value.join(''),
      })

      auth.value.token = data.token;
      await router.push({name: 'Table'});

    }catch(e){
      //show error message and reset the pin
      error.value = true;
      setTimeout(()=>{
        error.value = false;
      }, 5000);
      pin.value.splice(0 , pin.value.length);
      console.log(e);
    }
  }

  function enter( input){
      if(input === 'clear'){
        pin.value = [];
        return;
      }
      if(pin.value.length < 4){
        pin.value.push(input);
        if(pin.value.length === 4){
          login();
        }
      }
  }
</script>

<template>
  <section aria-label="Pin Input Section" id="section-pin">
      <div id="pin-wrapper">
        <h1 class="mb-1">Enter Your PIN</h1>
        <div id="pin-display" class="mt-3 mb-2">
          <div class="pin-asterisk" v-for=" n of pin.length">
            *
          </div>
        </div>
        <article id="input-buttons">
          <button class="btn-purple" @click="enter(7)">7</button>
          <button class="btn-purple" @click="enter(8)">8</button>
          <button class="btn-purple" @click="enter(9)">9</button>

          <button class="btn-purple" @click="enter(4)">4</button>
          <button class="btn-purple" @click="enter(5)">5</button>
          <button class="btn-purple" @click="enter(6)">6</button>

          <button class="btn-purple" @click="enter(1)">1</button>
          <button class="btn-purple" @click="enter(2)">2</button>
          <button class="btn-purple" @click="enter(3)">3</button>

          <button class="btn-purple btn-purple-big" @click="enter(0)">0</button>
          <button class="btn-purple" @click="enter('clear')">Clear</button>
        </article>
      </div>
  </section>
  <div class="alert-danger" v-if="error">
    Incorrect PIN. Try again!
  </div>
</template>

<style scoped>
 #section-pin{
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   padding: 2rem 1rem;
   background-color: var(--primary-color);
   width: 500px;
   text-align: center;
   border: 1px solid white;
 }
 h1{
   border-bottom: 1px solid white;
   padding: 1rem;
 }
 #pin-display{
   border-bottom: 1px solid white;
   height: 3rem;
   width: 150px;
   margin-left: auto;
   margin-right: auto;
   display: flex;
   justify-content: center;
   gap: 1rem;
   padding: 0.25rem;
 }
 .pin-asterisk{
   font-size: 2rem;
   color: var(--third-color);
 }

 #input-buttons{
   display: grid;
   margin: 0 auto;
   width: 170px;
   grid-template-columns: repeat(3, 50px);
    gap: 0.75rem;
   justify-items: center;
 }
 .btn-purple{
   background-color: var(--secondary-color);
   color: white;
   width: 50px;
   display: flex;
   align-items: center;
   justify-content: center;
   border-radius: 0.25rem;
 }
 .btn-purple:hover{
   background-color: var(--third-color);
 }
 .btn-purple-big{
    grid-column: span 2;
    width: 100%;
 }

</style>