import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/Auth/Login.vue'
import Register from '../views/Auth/Register.vue'
import ListaContas from '../views/Contas/ListaContas.vue'
import Invitations from '../views/Invitations.vue'
import ListaClasseMovimentos from '../views/ClasseMovimentos/ListaClasseMovimentos.vue'
import ListaTipoMovimentos from '../views/TipoMovimentos/ListaTipoMovimentos.vue'
import ListaMovimentos from '../views/Movimentos/ListaMovimentos.vue'
import Relatorios from '../views/Relatorios/Relatorios.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/relatorios',
      name: 'Relatorios',
      component: Relatorios
    },
    {
      path: '/listaContas',
      name: 'ListaContas',
      component: ListaContas
    },
    {
      path: '/listaClasseMovimentos',
      name: 'ListaClasseMovimentos',
      component: ListaClasseMovimentos
    },
    {
      path: '/listaTipoMovimentos',
      name: 'ListaTipoMovimentos',
      component: ListaTipoMovimentos
    },
    {
      path: '/listaMovimentos/:contaId',
      name: 'ListaMovimentos',
      component: ListaMovimentos
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/invitations',
      name: 'Invitations',
      component: Invitations
    },
    // {
    //   path: '/listaContas',
    //   name: 'listaContas',
    //   component: ListaContas
    // },
    // {
    //   path: '/listaMovimentos/:idConta',
    //   name: 'listaMovimentos',
    //   component: ListaMovimentos,
    //   props: true
    // }
  ]
})

export default router
