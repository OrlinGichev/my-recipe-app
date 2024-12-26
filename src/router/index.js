import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../components/layouts/MainLayout.vue";
import AuthLayout from '../components/layouts/AuthLayout.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth',
            component: AuthLayout,
            children: [
              {
                path: 'login',
                name: 'Login',
                component: () => import('../views/LoginView.vue')
              },
              {
                path: 'register',
                name: 'Register',
                component: () => import('../views/RegisterView.vue')
              }
            ]
          },
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

})

export default router