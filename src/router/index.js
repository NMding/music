import Vue from 'vue'
import Router from 'vue-router'
import Ranking from '@/views/ranking/index.vue'
import Recommend from '@/views/recommend/index.vue'
import Search from '@/views/search/index.vue'
import Singer from '@/views/singer/index.vue'
import RecommendDetail from '@/views/recommend/detail.vue'
import SingerDetail from '@/views/singer/dedtail.vue'
import RankDetail from '@/views/ranking/detail.vue'
import SearchDetail from '@/views/search/index.vue'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      redirect: "/recommend"
    },
    {
      path: '/ranking',
      name: 'Ranking',
      component: Ranking,
      children:[
        {
          path:'/ranking/:id',
          component:RankDetail
        }
      ]
    },
    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend,
      children:[
        {
          path:'/recommend/:id',
          component:RecommendDetail
        }
      ]

    },
    {
      path: '/search',
      name: 'Search',
      component: Search,
      children:[
        {
          path:'/search/:keyword',
          component:SearchDetail
        }
      ]
    },
    {
      path: '/singer',
      name: 'Singer',
      component: Singer,
      children:[
        {
          path:'/singer/:id',
          component:SingerDetail
        }
      ]
    }
  ]
})
