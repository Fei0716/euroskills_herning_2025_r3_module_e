<script setup>
  import {ref,reactive} from 'vue'
  import auth from '../stores/auth.js'
  import table from '../stores/table.js'
  import api from '../api.js'
  import {useRouter} from 'vue-router'

  //states
  const tables = reactive([]);
  const router = useRouter();
  const error = ref(false);
  async function getTables(){
    try{
      const {data} = await api.get('/tables');
      tables.splice(0, tables.length, ...data);
    }catch(e){
      console.error(e);
    }
  }
  function tableStyle(id){
    let table = tables.find((t)=> t.id === id);
    return{
      'left': table.x + 'px',
      'top': table.y + 'px',
      'width': table.width + 'px',
      'height': table.height + 'px',
    };
  }
  //function calls
  getTables();

  function selectTable(id){
    let selectedTable = tables.find((t)=> t.id ===id);
    if(selectedTable.hasOpenOrder){
      error.value = true;
      setTimeout(()=>{
        error.value = false;
      }, 5000);
      return;
    }
    table.value = selectedTable;
    router.push({name: 'TableOrder', params: {id: id}});
  }
</script>

<template>
  <section aria-label="Select Table Section">
    <h1 class="mb-1 text-center">Select a Table</h1>
    <div id="table-wrapper">
<!--      if has open order add selected class-->
      <button class="btn-purple" :class="{'has-open-order' : table.hasOpenOrder}" v-for="table in tables" :key="table.id" :style="tableStyle(table.id)" @click="selectTable(table.id)">
        {{table.name}}
      </button>
    </div>
  </section>

  <div class="alert-danger" v-if="error">
    Table has an open order
  </div>
</template>

<style scoped>
  h1{
    border-bottom: 1px solid white;
    padding: 1rem 0;
  }
  #table-wrapper{
    position:relative;
    width: 80%;
    height: 100dvh;
    margin: 0 auto;
  }
  .btn-purple{
    background-color: var(--third-color);
  }
  button{
    position: absolute;
    color: white;
    border-radius: 0.25rem;
  }
  button.has-open-order{
    background-color: var(--secondary-color);
    cursor: default;
  }
</style>