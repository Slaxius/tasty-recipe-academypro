<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const logout = () => {
  store.commit('auth/setUserLogout')
  router.push('/')
}
</script>

<template>
  <div
    class="header__signup col-8 col-sm-4 fw-semibold d-flex justify-content-evenly align-items-center text-decoration-none"
    style="text-align: right"
  >
    <i class="fa-solid fa-user" style="color: #4c4ddc"></i>
    <ul class="navbar-nav">
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle"
          href="#"
          role="button"
          data-bs-toggle="dropdown"
        >
          My Profile
        </a>
        <ul class="dropdown-menu">
          <router-link class="dropdown-item" to="/user/personal-info">My Profile</router-link>
          <router-link class="dropdown-item" to="/user/favorite-recipes">Favorited Recipes</router-link>
          <router-link class="dropdown-item" to="/user/user-recipe">My Recipes</router-link>
          <li><hr class="dropdown-divider" /></li>
          <li class="dropdown-item logout-menu-item" @click="logout">Logout</li>
        </ul>
      </li>
    </ul>
  </div>
</template>