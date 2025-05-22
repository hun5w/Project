import {createRouter,createWebHashHistory} from 'vue-router'

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            redirect:'/login'
        },

        {
            
            path:'/login',
            component:()=>import('../views/login/LoginIndex.vue')
        },
        {
            path: '/register',
            component: () => import('@/views/login/RegisterIndex.vue')
        },

        {
            
            path:'/mine',
            component:()=>import('../views/mine/MineIndex.vue')
        },

        {
            path:'/finding',
            component:()=>import('../views/finding/FindingIndex.vue')
        },

        {
            path:'/note',
            component:()=>import('../views/note/NoteIndex.vue')
        },

        {
            path:'/home',
            component:()=>import('../views/home/HomeIndex.vue')
        },

        
    ]
})

export default router