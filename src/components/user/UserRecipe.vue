<script setup>
import UserRecipeCard from './UserRecipeCard.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useStore } from "vuex"

const router = useRouter()

const goToNewRecipe = () => {
  router.push({ name: 'newRecipePage' })
}

const editRecipe = (id) => {
  router.push({ name: 'editRecipePage', params: { id } })
}

const store = useStore();
const recipes = computed(() => {
  const allRecipe = store.state.recipe.recipes || []
  const userId = store.state.auth.userLogin?.userId
  return allRecipe.filter((recipe) => recipe.userId === userId)
});

onMounted(() => {
  store.dispatch('recipe/getRecipeData')
})

const deleteRecipe = async (id) => {
  await store.dispatch('recipe/deleteRecipe', id)
}
</script>

<template>
  <ul class="list-group">
    <li class="list-group-item">
      <div class="d-flex flex-sm-row flex-column justify-content-between align-items-sm-center">
        <div class="mb-3 mb-sm-0">
          <p class="my-0 fs-4 fw-semibold">My Recipe</p>
          <p class="my-0 text-secondary">Add your original recipe here</p>
        </div>
        <div>
          <button class="btn add-btn px-3 py-2 rounded-pill" @click="goToNewRecipe">
            <i class="fa-solid fa-circle-plus pe-2"></i>Add Recipe
          </button>
        </div>
      </div>
    </li>
    <li class="list-group-item">
      <p class="mt-2 mb-4 fs-5 fw-semibold">Recipe</p>
      <div class="row">
        <UserRecipeCard 
          v-for="recipe in recipes" 
          :key="recipe.id" 
          :recipe="recipe" 
          :buttonName="['Delete', 'Edit']"
          @btnRemove="deleteRecipe(recipe.id)"
          @btnEdit="editRecipe(recipe.id)"
        >
          <p v-if="recipe.createdAt" class="mb-0 text-secondary">
            {{ new Date(recipe.createdAt).toDateString() }}
          </p>
        </UserRecipeCard>
      </div>
    </li>
  </ul>
</template>