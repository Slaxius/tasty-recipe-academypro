<script setup>
import RecipeForm from "../recipeForm/RecipeForm.vue";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const store = useStore()
const route = useRoute()
const recipe = computed(() => ({
    ...store.state.recipe.recipeDetail,
    id: route.params.id,
}))

onMounted(() => {
    store.dispatch('recipe/getRecipeDetail', route.params.id)
})
</script>

<template>
    <main>
        <div class="container-md my-5 py-5">
            <RecipeForm
                v-if="recipe.name"
                :initial-data="recipe"
                :is-edit="true"
            />
        </div>
    </main>
</template>