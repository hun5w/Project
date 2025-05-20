import {createRouter,createWebHashHistory} from 'vue-router'

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/',
            redirect:'/home'
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