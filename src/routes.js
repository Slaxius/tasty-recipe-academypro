import HomePage from './components/pages/HomePage.vue'
import LoginPage from './components/pages/LoginPage.vue'
import SignupPage from './components/pages/SignupPage.vue'
import DetailPage from './components/pages/DetailPage.vue'
import UserPage from './components/pages/UserPage.vue'
import Cookies from 'js-cookie'
import { store } from './store/index.js'
import NewRecipePage from "./components/pages/NewRecipePage.vue"
import EditRecipePage from "./components/pages/EditRecipePage.vue"

const checkAuth = () => {
    const jwtCookie = Cookies.get('jwt')
    const expirationDate = Cookies.get('tokenExpirationDate')
    const userId = Cookies.get('UID')

    if (jwtCookie) {
        if (expirationDate && new Date().getTime() < +expirationDate) {
            store.commit('auth/setToken', {
                idToken: jwtCookie,
                expiresIn: expirationDate,
            })
            if (userId) {
                store.dispatch('auth/getUser', userId)
            }
            return true
        } else {
            store.commit('auth/setUserLogout')
            return false
        }
    } else {
        return false
    }
}

export const routes = [
    { path: '/', name: 'homePage', component: HomePage,
        beforeEnter: () => {
            checkAuth()
            return true
        }
    },
    { path: '/signup', name: 'signup', component: SignupPage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/recipe/:id', name: 'detailPage', component: DetailPage },
    { path: '/user', redirect: '/user/personal-info' },
    { path: '/user/:component', name: 'userPage', component: UserPage,
        beforeEnter: () => {
            return checkAuth() ? true : { name: 'login' }
        }
    },
    { path: '/new-recipe', name: 'newRecipePage', component: NewRecipePage,
        beforeEnter: () => {
            return checkAuth() ? true : { name: 'login' }
        }
    },
    { path: '/recipe/edit/:id', name: 'editRecipePage', component: EditRecipePage,
        beforeEnter: () => {
            return checkAuth() ? true : { name: 'login' }
        }
    },
]