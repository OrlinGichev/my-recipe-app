import { createRouter, createWebHistory } from "vue-router";
import TestComponents from "../views/TestComponents.vue";

const routes = [
    {
        path:'/',
        name: 'home',
        component:() => import('../views/HomeView.vue')
    },
    {
        path:'/login',
        name: 'login',
        component:() => import('../views/LoginView.vue')
    },
    {
        path:'/register',
        name: 'register',
        component:() => import('../views/RegisterView.vue')
    },
    {
        path:'/test-components',
        name: 'testComponents',
        component:TestComponents
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router