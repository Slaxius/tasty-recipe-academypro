import axios from 'axios'

const databaseUrl = import.meta.env.VITE_FIREBASE_DATABASE_URL

export default {
    namespaced: true,
    state() {
        return {
            recipes: [],
            recipeDetail: null,
            recipeDetailRequestId: 0,
        }
    },
    getters: {},
    mutations: {
        setRecipeData(state, payload){
            state.recipes = payload
        },
        setRecipeDetail(state, payload){
            state.recipeDetail = payload
        },
        setRecipeDetailRequestId(state, payload) {
            state.recipeDetailRequestId = payload
        },
        updateRecipeInList(state, payload) {
            const recipeIndex = state.recipes.findIndex((recipe) => recipe.id === payload.id)
            if (recipeIndex !== -1) {
                state.recipes[recipeIndex] = payload
            }
        },
        setNewRecipe(state, payload){
            state.recipes.push(payload)
        }
    },
    actions: {
        async getRecipeData({ commit }) {
            try {
                const { data } = await axios.get(`${databaseUrl}/recipes.json`)

                const arr = []
                for (const [key, recipe] of Object.entries(data || {})) {
                    if (recipe) {
                        arr.push({ ...recipe, id: key })
                    }
                }
                commit('setRecipeData', arr)
            } catch (err) {
                console.log(err)
            }
        },
        async getRecipeDetail({ commit, state }, payload) {
            const requestId = state.recipeDetailRequestId + 1
            commit('setRecipeDetailRequestId', requestId)
            commit('setRecipeDetail', null)

            try {
                const { data } = await axios.get(`${databaseUrl}/recipes/${payload}.json`)
                if (state.recipeDetailRequestId === requestId) {
                    commit('setRecipeDetail', { ...data, id: payload })
                }
            } catch (err) {
                console.log(err)
            }
        },
        async addNewRecipe ({ commit, rootState }, payload ) {
            const newData = {
                ...payload,
                username: rootState.auth.userLogin.username,
                createdAt: Date.now(),
                likes: ['null'],
                userId: rootState.auth.userLogin.userId,
            }

            try {
                const { data } = await axios.post(`${databaseUrl}/recipes.json?auth=${rootState.auth.token}`, newData)

                commit('setNewRecipe', { id: data.name, ...newData})
            } catch (err) {
                console.log(err)
            }
        },
        async updateRecipe({ commit, rootState }, payload) {
            const { id, ...recipeData } = payload

            try {
                await axios.patch(
                    `${databaseUrl}/recipes/${id}.json?auth=${rootState.auth.token}`,
                    recipeData,
                )
                commit('setRecipeDetail', { id, ...recipeData })
            } catch (err) {
                console.log(err)
            }
        },
        async deleteRecipe({ dispatch, rootState }, payload) {
            try {
                const { data } = await axios.delete(`${databaseUrl}/recipes/${payload}.json?auth=${rootState.auth.token}`)
                
                await dispatch('getRecipeData')
            } catch (err) {
                console.log(err)
            }
        },
        async updateRecipeLikes({ commit, rootState }, { id, newRecipe, previousRecipe }) {
            commit('setRecipeDetail', { id, ...newRecipe })
            commit('updateRecipeInList', { id, ...newRecipe })

            try {
                await axios.put(
                    `${databaseUrl}/recipes/${id}.json?auth=${rootState.auth.token}`, newRecipe)
            } catch (err) {
                if (previousRecipe) {
                    commit('setRecipeDetail', previousRecipe)
                    commit('updateRecipeInList', previousRecipe)
                }
                console.log(err)
                throw err
            }
        }
    }
}