<script setup>
import {ref,reactive, computed} from 'vue'
import auth from '../stores/auth.js'
import table from '../stores/table.js'
import api from '../api.js'
import {useRouter} from 'vue-router'

//states
const order = reactive({});
const menuCategories = reactive([]);
const menuItems = ref([]);
const orders = ref([]);
const currentSelectedCategory = ref(0);
const orderItems = ref([]);
const router = useRouter();
const isPrinting = ref(false);
//computed properties
const currentOrderItems = computed(()=>{
  return orders.value.find((o) => o.id === order.id)?.order_items.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});
const orderTotalPrice = computed(()=>{
  return currentOrderItems.value?.length > 0 ?  currentOrderItems.value?.reduce((total,item)=>{
    return total + (item.menu_item.price * item.quantity) ;
  },0): 0;
})
const currentOrderItemsAggregated = computed(()=>{
  // let aggregatedItems = [...new Set(test?.map((i) => JSON.stringify(i)))].map((i)=> JSON.parse(i));
  let aggregatedItems = [];
  if(!currentOrderItems.value){
    return aggregatedItems;
  }
  for(let item of currentOrderItems.value ){
    let alreadyExists = aggregatedItems.findIndex((i) => i.menuItemId === item.menuItemId);
    //if already exists increment the quantity
    if(alreadyExists !== -1){
      aggregatedItems[alreadyExists].quantity += item.quantity;//add quantity(1 for now)
    }else{
      aggregatedItems.push({...item, quantity: 1});
    }
  }
  return aggregatedItems;
});
const selectedMenuItems = computed(()=>{
  return menuItems.value.filter((i)=> i.menuCategoryId === currentSelectedCategory.value);
});
//methods
async function createOrder(){
  try{
    const {data} = await api.post('/orders',{
      tableId : table.value.id,
    });

    Object.assign(order, data);
  }catch (e) {
    console.error(e);
  }
}
async function getMenuCategories(){
  try{
    const {data} = await api.get('/menuCategories');
    menuCategories.splice(0 , menuCategories.length , ...data);
    //select the first category by default
    currentSelectedCategory.value = menuCategories[0].id;
  }catch(e){
    console.error(e);
  }
}
async function getMenuItems(){
  try{
    const {data} = await api.get('/menuItems');
    menuItems.value = data;
  }catch(e){
    console.error(e);
  }
}
async function getOrders(){
  try{
    const {data} = await api.get('/orders');
    orders.value = data;
  }catch(e){
    console.error(e);
  }
}
function selectCategory(id){
  currentSelectedCategory.value = id;
}

async function addOrderItem(i){
  try{
    const {data} = await api.post('/orderItems',{
      orderId: order.id,
      menuItemId: i.id,
      quantity: 1,//for now we set the quantity to 1
    });
     await getOrders();
  }catch(e){
    console.error(e);
  }
}

function exit(){
  table.value = {}
  router.push({name: 'Table'});
}

async function closeOrder(){
  try{
    const {data} = await api.put(`/orders/tables/${table.value.id}/close`);
    isPrinting.value = true;
    setTimeout(()=>{
      table.value= {};
      isPrinting.value = false;
      router.push({name: 'Table'});
    } , 5000)
  }catch(e){
    console.error(e);
  }
}
//function calls
createOrder();
getMenuCategories();
getMenuItems();
getOrders();


</script>

<template>
   <section aria-label="Section Table Order" >
      <article id="order-details">
          <div id="table-details" class="mb-2"><img src="/images/table-logo.png" alt="Logo of Table" > {{table.name}}</div>

          <div v-for="o of currentOrderItemsAggregated" :key="o.id" class="order-item-wrapper">
            <div class="order-item-quantity">x {{o.quantity}}</div>
            <div class="order-item-name">{{o.menu_item.name}}</div>
          </div>
        <div>
          <div id="order-total">
            <div>Sum:</div>
            <strong>${{orderTotalPrice}}</strong>
          </div>
          <div id="btn-groups">
            <button class="btn-purple" @click="exit">Exit</button>
            <button class="btn-pink" @click="closeOrder">Close Order</button>
          </div>
          </div>
      </article>
      <article id="order-options">
        <div id="menu-categories">
             <button class="btn-category" :class="{'selected': currentSelectedCategory=== mg.id}" v-for="(mg,i) of menuCategories" :style="'background-color: var(--color-'+ ++i%5 +');' " @click="selectCategory(mg.id)">
               {{mg.name}}
             </button>
        </div>
        <div id="menu-items">
            <button class="btn-item" v-for="i of selectedMenuItems" @click="addOrderItem(i)">
              <div>{{i.name}}</div>
              <small>${{i.price}}</small>
            </button>
        </div>
      </article>
   </section>

  <output id="message-printing-bill" v-if="isPrinting">
    Printing bill...
  </output>
</template>

<style scoped>
  section{
    display: grid;
    grid-template-columns: 30% 70%;
  }
  #order-details{
    padding: 0.5rem 0.75rem;
    background-color: var(--dark-color-2);
    height: 100dvh;
    position: relative;
  }
  #order-details > div:last-child{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 1rem 0.75rem;
  }
  #table-details{
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.5rem;
    border-bottom: 1px solid white;
  }
  #table-details img {
    width: 50px;
  }
  .order-item-wrapper{
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.15rem;
    border-bottom: 1px solid white;
    padding: 0.5rem 0;
  }
  .order-item-quantity{
    background-color: var(--primary-color);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    width: 70px;
    text-align: center;
  }
  #btn-groups{
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }
  #btn-groups button{
    width: 50%;
    border-radius: 0.25rem;
    transition: all 0.2s;
    font-size: 1rem;
  }
  .btn-purple{
    background-color: var(--secondary-color);
    color: white;

  }
  .btn-purple:hover{
    background-color: var(--third-color);
  }
  .btn-pink{
    background-color: var(--third-color);
    color: white;

  }
  .btn-pink:hover{
    background-color: var(--secondary-color);
  }
  #order-options{
    padding: 0.75rem;
  }
  #order-total{
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;
    margin-top: 1rem;
    font-size: 2rem;
    border-bottom: 1px solid white;
    margin-bottom: 1rem;
  }
  #menu-categories{
    display: grid;
    grid-template-columns: repeat(4, 4fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 0.5rem;
    border: 1px solid black;
    padding: 0.5rem;
  }
  .btn-category{
    border-radius: 0.25rem;
    transition: all 0.2s;
    font-size: 1.1rem;
    padding: 0.75rem 2.25rem;
    color: white;
    border: 2px solid transparent;
  }
  .btn-category.selected{
    border: 2px solid #fff300;
  }
  #menu-items{
    padding: 0.5rem;
    display: grid;
    grid-template-columns: repeat(3, 3fr);
    gap: 0.5rem;
  }
  .btn-item{
    position: relative;
    background-color: var(--color-1);
    border-radius: 0.25rem;
    color: white;
    text-align: start;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 0.5rem;

  }
  .btn-item::before{
    position: absolute;
    content: '';
    left: 10px;
    top: 4px;
    width: 7px;
    height: 90%;
    background-color: var(--secondary-color);
  }
  #message-printing-bill{
    height: 100dvh;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,0.8);
    color: white;
    font-size: 3rem;
    display: flex;
    align-items: center;
    justify-content:center;
  }
</style>