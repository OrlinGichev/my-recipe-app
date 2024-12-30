import { createRouter, createWebHistory } from "vue-router";
import MainLayout from "../components/layouts/MainLayout.vue";
import AuthLayout from '../components/layouts/AuthLayout.vue'
import { useAuthStore } from '../stores/auth'

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
                component: () => import('../views/LoginView.vue'),
                meta:{ requiresGuest: true}
              },
              {
                path: 'register',
                name: 'Register',
                component: () => import('../views/RegisterView.vue'),
                meta:{ requiresGuest: true}
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
              path:'/about',
              name: 'About',
              component:() => import('../views/AboutView.vue')
             },
             {
              path: '/contacts',
              name: 'Contacts',
              component: () => import('../views/ContactsView.vue')
            },
            {
              path: '/terms',
              name: 'Terms',
              component: () => import('../views/TermsView.vue')
            },
             {
                 path:'/recipes',
                 name: 'Recipes',
                 component:() => import('../views/RecipesView.vue'),
                 meta: { requiresAuth: true }
             },
             {
              path:'/recipes/create',
              name: 'CreateRecipe',
              component:() => import('../views/CreateRecipeView.vue'),
              meta: { requiresAuth: true }
             },
             
             {
              path: '/recipes/:id',
              name: 'RecipeDetails',
              component: () => import('../views/RecipeDetailsView.vue'),
              meta: { requiresAuth: true },
              props: true 
             },
             {
              path: '/recipes/:id/edit',
              name: 'EditRecipe',
              component: () => import('../views/EditRecipeView.vue'),
              meta: { requiresAuth: true },
              props: true
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

// Навигационен guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth/login');
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router