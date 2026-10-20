<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PersonalInfo from '../user/PersonalInfo.vue'
import FavoriteRecipe from '../user/FavoriteRecipe.vue'
import UserRecipe from '../user/UserRecipe.vue'
import UserMenu from '../user/UserMenu.vue'

const route = useRoute()

const components = {
    'personal-info': PersonalInfo,
    'favorite-recipes': FavoriteRecipe,
    'user-recipe': UserRecipe,
}

const getRoute = computed(() => {
    return components[route.params.component]
})
</script>

<template>
    <div class="container-md my-5 py-5">
        <div class="row">
            <UserMenu @changeComponent="$router.push($event)" />
            <div class="col-9">
                <component :is="getRoute" />
            </div>
        </div>
    </div>
</template>