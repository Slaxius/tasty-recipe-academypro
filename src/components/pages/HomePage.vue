<script setup>
import RecipeList from '../recipe/RecipeList.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const recipeListStatus = ref(false)
const recipes = computed(() => store.state.recipe.recipes || [])
const searchTerm = computed(() => String(route.query.search || '').trim().toLowerCase())
const recipeList = computed(() => {
    if (!searchTerm.value) {
        return recipes.value
    }

    return recipes.value.filter((recipe) => {
        const searchableText = [
            recipe.name,
            recipe.category,
            recipe.description,
            recipe.username,
        ].join(' ').toLowerCase()

        return searchableText.includes(searchTerm.value)
    })
})

onMounted(async () => {
    try {
        await store.dispatch('recipe/getRecipeData')
        recipeListStatus.value = true
    } catch (err) {
        console.log(err)
    }
})
</script>


<template>
    <div class="container-md my-5 py-5">
        <div class="recipe__title text-center">
            <h2>All Recipe</h2>
            <p style="font-size: 15px;">
                Find and share everyday cooking inspiration on Allrecipes.Discover recipes, cooks, videos, and how-tos based on the food you love and the friends you follow.
            </p>
        </div>
        <p v-if="recipeListStatus && recipeList.length === 0" class="text-center text-secondary">
            No recipes found.
        </p>
        <RecipeList :recipes="recipeList" v-if="recipeListStatus && recipeList.length"></RecipeList>
    </div>
</template>