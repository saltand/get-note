import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:path',
      name: 'getnote',
      component: () => import('@/views/NotePage.vue')
    }
  ]
})

function getRandomLowercaseLetters(length = 5) {
  let result = ''
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}

router.beforeEach((to) => {
  if (!to.params?.path) {
    return {
      name: 'getnote',
      params: { path: getRandomLowercaseLetters() }
    }
  }
})

export default router
