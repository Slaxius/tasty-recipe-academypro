<script setup>
import SearchMenu from './SearchMenu.vue'
import SignupMenu from './SignupMenu.vue'
import ProfileMenu from './ProfileMenu.vue'
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const components = {
    'signup-menu': SignupMenu,
    'profile-menu': ProfileMenu,
}

const getToken = computed(() => {
    return store.state.auth.token
})

const menuComponent = computed(() => {
    return getToken.value ? 'profile-menu' : 'signup-menu'
})
</script>

<template>
    <div class="header__navbar row justify-content-between align-items-center" style="width:450px">
        <SearchMenu />
        <component :is="components[menuComponent]" />
    </div>
</template>