<script setup>
import RecipeDescription from './RecipeDescription.vue'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import RecipeDirections from './RecipeDirections.vue'
import RecipeIngredients from './RecipeIngredients.vue'

const store = useStore()
const route = useRoute()
const recipeDetail = computed(() => store.state.recipe.recipeDetail)

watch(
    () => route.params.id,
    (recipeId) => {
        store.dispatch('recipe/getRecipeDetail', recipeId)
    },
    { immediate: true },
)
</script>

<template>
    <div class="col-12 col-sm-8">
        <RecipeDescription />
        <template v-if="recipeDetail">
            <RecipeIngredients />
            <RecipeDirections />
        </template>
    </div>
</template>