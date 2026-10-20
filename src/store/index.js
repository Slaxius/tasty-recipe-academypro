import { createStore } from 'vuex'
import recipe from './recipe.js'
import auth from './auth.js'

export const store = createStore({
    modules: {
        recipe,
        auth,
    }
})