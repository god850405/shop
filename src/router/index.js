import Vue from 'vue'
import Router from 'vue-router'
import item from '@/components/item.vue'
import itemlist from '@/components/itemlist.vue'
import cart from '@/components/cart.vue'
import member from '@/components/member.vue'
import manage from '@/components/manage.vue'
Vue.use(Router)

export default new Router({
  
  routes: [
    {
      path: '/',
      name:'home',
      component:itemlist
    },
    {
      path: '/itemlist',
      name:'itemlist',
      component:itemlist
    },
    {
      path: '/item/:id',
      name:'item',
      component:item
    }
    ,
    {
      path: '/cart',
      name:'cart',
      // meta: { 
      //   requiresAuth: true 
      // },
      component:cart
    }
    ,
    {
      path: '/member',
      name:'member',
      meta: { 
        requiresAuth: true 
      },
      component:member
    }
    ,
    {
      path: '/manage',
      name:'manage',
      meta: { 
        requiresAuth: true 
      },
      component:manage
    }
  ]
})
