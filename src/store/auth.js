import axios from 'axios'
import Cookies from 'js-cookie'

const firebaseErrorMessages = {
    EMAIL_EXISTS: 'This email address is already registered. Use another email or log in.',
    INVALID_EMAIL: 'Enter a valid email address.',
    INVALID_PASSWORD: 'The email or password is incorrect.',
    EMAIL_NOT_FOUND: 'The email or password is incorrect.',
    INVALID_LOGIN_CREDENTIALS: 'The email or password is incorrect.',
    WEAK_PASSWORD: 'The password must be at least 6 characters.',
    OPERATION_NOT_ALLOWED: 'Email/password sign-up is disabled. Enable it in Firebase Authentication.',
    TOO_MANY_ATTEMPTS_TRY_LATER: 'Too many attempts. Try again later.'
}

export default {
    namespaced: true,
    state: {
        token: null,
        tokenExpiration: null,
        userLogin: {},
        isLogin: false,
    },
    mutations: {
        setToken(state, { idToken, expiresIn }) {
            state.token = idToken
            state.tokenExpiration = expiresIn
            Cookies.set('tokenExpirationDate', expiresIn)
            Cookies.set('jwt', idToken)
        },
        setUserLogin(state, { userData, loginStatus }) {
            state.userLogin = userData
            state.isLogin = loginStatus
        },
        setUserLogout(state) {
            state.token = null
            state.tokenExpiration = null
            state.userLogin = {}
            state.isLogin = false
            Cookies.remove('jwt')
            Cookies.remove('tokenExpirationDate')
            Cookies.remove('UID')
        }
    },
    actions: {
        async getRegisterData({ commit, dispatch }, payload) {
            const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
            const authUrl = import.meta.env.VITE_FIREBASE_AUTH_URL

            if (!apiKey || !authUrl) {
                throw new Error('Firebase authentication is not configured.')
            }

            try {
                const { data } = await axios.post(`${authUrl}${apiKey}`, {
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })

                const expiresIn = new Date().getTime() + Number.parseInt(data.expiresIn) * 1000
                commit('setToken', {
                    idToken: data.idToken,
                    expiresIn,
                })

                const newUserData = {
                    userId: data.localId,
                    firstname: payload.firstname,
                    lastname: payload.lastname,
                    username: payload.username,
                    email: payload.email,
                    imageLink: payload.imageLink,
                }

                Cookies.set('UID', newUserData.userId)
                await dispatch('addNewUser', newUserData)

                return newUserData
            } catch (err) {
                const code = err.response?.data?.error?.message
                throw new Error(firebaseErrorMessages[code] || `Registration failed${code ? `: ${code}` : '.'}`)
            }
        },
        async addNewUser({ commit, state }, payload) {
            const databaseUrl = import.meta.env.VITE_FIREBASE_DATABASE_URL

            try {
                await axios.post(`${databaseUrl}/users.json?auth=${state.token}`, payload)
                commit('setUserLogin', { userData: payload, loginStatus: true })
            } catch (err) {
                const message = err.response?.data?.error || 'Saving the user profile failed.'
                throw new Error(message)
            }
        },

        async getLoginData({ commit, dispatch }, payload) {
            const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
            const authUrl = import.meta.env.VITE_FIREBASE_LOGIN_URL

            if (!apiKey || !authUrl) {
                throw new Error('Firebase login is not configured.')
            }

            try {
                const { data } = await axios.post(`${authUrl}${apiKey}`, {
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                })

                commit('setToken', {
                    idToken: data.idToken,
                    expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000,
                })
                Cookies.set('UID', data.localId)
                await dispatch('getUser', data.localId)
            } catch (error) {
                const code = error.response?.data?.error?.message
                throw new Error(firebaseErrorMessages[code] || `Login failed${code ? `: ${code}` : '.'}`)
            }
        },
        async getUser({ commit, state }, payload) {
            try {
                const { data } = await axios.get(
                    `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/users.json?auth=${state.token}`,
                )
                for ( let key in data ) {
                    if ( data[key].userId === payload ) {
                        commit('setUserLogin', 
                            { userData: data[key], loginStatus: true }
                        )
                    }
                }
            } catch (error) {
                const message = error.response?.data?.error || 'Failed to fetch user data.'
                throw new Error(message)
            }
        }
    },
}
