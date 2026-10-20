<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const searchTerm = ref(String(route.query.search || ''))

watch(
  () => route.query.search,
  (value) => {
    searchTerm.value = String(value || '')
  },
)

const searchRecipes = () => {
  router.replace({
    path: '/',
    query: searchTerm.value.trim() ? { search: searchTerm.value.trim() } : {},
  })
}
</script>

<template>
  <div class="col-sm-8 col-4 py-0">
    <div class="d-none d-sm-block">
      <div
        class="header__searchbar input-group align-items-center border rounded-pill"
      >
        <span class="px-2"><i class="fa-solid fa-magnifying-glass"></i></span>
        <input
          type="text"
          class="form-control form-control-sm border-0 rounded-pill"
          placeholder="Search Recipe"
          v-model="searchTerm"
          @input="searchRecipes"
        />
      </div>
    </div>
    <div class="d-block d-sm-none border-end text-end px-3">
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>
  </div>
</template>
