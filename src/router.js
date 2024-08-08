import {createRouter, createWebHistory} from 'vue-router'
import auth from './stores/auth.js'
import Login from './views/Login.vue'
import Table from './views/Table.vue'
import TableOrder from './views/TableOrder.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: Login,
        meta: {
            guard: 'guest'
        }
    },
    {
        path: '/table',
        name: 'Table',
        component: Table,
        meta: {
            guard: 'auth'
        }
    },
    {
        path: '/table/:id',
        name: 'TableOrder',
        component: TableOrder,
        meta: {
            guard: 'auth'
        }
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to,from,next)=>{
    if(to.meta.guard === 'auth' && !auth.isAuthenticated){
        next({name: 'Login'});
    }else{
        next();
    }
});

export default router;