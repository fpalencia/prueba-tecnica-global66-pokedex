import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/layout',
      component: () => import('../layout/Layout.vue'),
      children: [
        {
          path: '/pokemons',
          name: 'pokemons',
          component: () => import('../views/pokemons/PokemonsView.vue')
        },
        {
          path: '/favorites',
          name: 'favorites',
          component: () => import('../views/pokemons-favorite/PokemonsFavoriteView.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
})

export default router
