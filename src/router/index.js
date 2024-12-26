import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../components/layouts/MainLayout.vue";

const routes = [
   {
    path:'/',
    component: MainLayout,
    children:[
        {
            path:'',
            name: 'home',
            component:() => import('../views/HomeView.vue')
        },
        {
            path:'/recipes',
            name: 'Recipes',
            component:() => import('../views/RecipesView.vue')
        },
        {
            path:'/about',
            name: 'About',
            component:() => import('../views/AboutView.vue')
        },
        {
            path:'/test-components',
            name: 'testComponents',
            component:() => import('../views/TestComponents.vue')
        },
    ]
   }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router