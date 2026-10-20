<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

defineProps({
    recipes: Array
})

const store = useStore()
const router = useRouter()
const userId = computed(() => store.state.auth.userLogin?.userId)

const isFavorite = (recipe) => {
    return Array.isArray(recipe.likes) && recipe.likes.includes(userId.value)
}

const toggleFavorite = async (recipe) => {
    if (!userId.value) {
        router.push({ name: 'login' })
        return
    }

    const likes = Array.isArray(recipe.likes)
        ? recipe.likes.filter((id) => id !== 'null')
        : []
    const newLikes = isFavorite(recipe)
        ? likes.filter((id) => id !== userId.value)
        : [...likes, userId.value]

    await store.dispatch('recipe/updateRecipeLikes', {
        id: recipe.id,
        previousRecipe: { ...recipe },
        newRecipe: {
            ...recipe,
            likes: newLikes,
        },
    })
}
</script>

<template>
    <div class="recipe__list-recipe row">
  <div
    v-for="recipe in recipes"
    :key="recipe.id"
    class="col-12 col-lg-3 col-sm-4 position-relative"
    style="padding-top: 12px; padding-bottom: 12px"
  >
    <router-link :to="{ name: 'detailPage', params: { id: recipe.id } }" class="text-decoration-none">
      <div class="card" style="height: 398px">
        <img
          :src="recipe.imageLink"
          class="card-img-top"
          :alt="recipe.name"
          height="240"
          width="285"
          style="object-fit: cover"
        />
        <div class="card-body" style="color: #0a0a0a">
          <p class="mb-0">{{ recipe.category }}</p>
          <div class="h-50">
            <h4 class="fs-5 mb-0">{{ recipe.name }}</h4>
          </div>
          <p>Recipe By {{ recipe.username }}</p>
        </div>
      </div>
    </router-link>
    <div
      class="position-absolute px-2 py-1 rounded-circle top-0 end-0 m-4 like-icon"
      :class="isFavorite(recipe) ? 'text-danger bg-white' : 'text-secondary bg-light'"
      role="button"
      tabindex="0"
      :aria-label="isFavorite(recipe) ? 'Remove from favorites' : 'Add to favorites'"
      @click.stop.prevent="toggleFavorite(recipe)"
      @keydown.enter.stop.prevent="toggleFavorite(recipe)"
    >
      <i :class="isFavorite(recipe) ? 'fas fa-heart' : 'far fa-heart'"></i>
    </div>
  </div>
    </div>
</template>