<script setup>
import UserRecipeCard from './UserRecipeCard.vue'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()

const recipes = computed(() => {
  const allRecipes = store.state.recipe.recipes || []
  const userId = store.state.auth.userLogin?.userId

  return allRecipes.filter((recipe) => (
    Array.isArray(recipe.likes) && recipe.likes.includes(userId)
  ))
})

onMounted(() => {
  store.dispatch('recipe/getRecipeData')
})

const viewRecipe = (id) => {
  router.push({ name: 'detailPage', params: { id } })
}

const removeFavorite = async (recipe) => {
  const userId = store.state.auth.userLogin?.userId
  const likes = Array.isArray(recipe.likes) ? recipe.likes : []

  await store.dispatch('recipe/updateRecipeLikes', {
    id: recipe.id,
    previousRecipe: { ...recipe },
    newRecipe: {
      ...recipe,
      likes: likes.filter((id) => id !== userId && id !== 'null'),
    },
  })
}
</script>

<template>
  <ul class="list-group">
    <li class="list-group-item">
      <div class="mb-3 mb-sm-0">
        <p class="my-0 fs-4 fw-semibold">Favorite Recipe</p>
        <p class="my-0 text-secondary">Save the recipe that you loved here</p>
      </div>
    </li>
    <li class="list-group-item">
      <p class="mt-2 mb-4 fs-5 fw-semibold">Recipe</p>
      <div class="row">
        <p v-if="recipes.length === 0" class="text-secondary">
          You have not favorited any recipes yet.
        </p>
        <UserRecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
          :button-name="['Remove', 'View']"
          @btnRemove="removeFavorite(recipe)"
          @btnView="viewRecipe(recipe.id)"
        >
          <p v-if="recipe.createdAt" class="mb-0 text-secondary">
            {{ new Date(recipe.createdAt).toDateString() }}
          </p>
        </UserRecipeCard>
      </div>
    </li>
  </ul>
</template>