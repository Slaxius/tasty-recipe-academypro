<script setup>
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import { reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const loginData = reactive({
  email: '',
  password: '',
  isLogin: true,
})

const store = useStore()
const router = useRouter()
const loginError = ref('')
const login = async () => {
  loginError.value = ''

  try {
    await store.dispatch('auth/getLoginData', loginData)
    router.push('/')
  } catch (error) {
    loginError.value = error.message
  }
}
</script>

<template>
  <div class="container-fluid py-5" style="background-color: #f5f5f5;">
    <div style="background-color: #ffffff" class="p-5 m-auto login-form">
      <div class="text-center">
        <img src="../../assets/images/Logo.png" alt="Logo" />
        <h2 class="mt-4">Log in to your account</h2>
        <p>Welcome back! Please enter your details.</p>
      </div>
      <form @submit.prevent="login">
        <p v-if="loginError" class="alert alert-danger" role="alert">{{ loginError }}</p>
        <div class="my-4">
          <BaseInput type="email" identity="email" placeholder="Your email address" label="Email" v-model="loginData.email" />
        </div>
        <div class="my-4">
          <BaseInput type="password" identity="password" placeholder="Your password" label="Password" v-model="loginData.password" />
        </div>
      <BaseButton class="login w-100 my-3">Login</BaseButton>
      </form>
      <div class="text-center mt-4">
        <p class="fw-semibold">
          Don't have an account?<span style="color: #4c4ddc">
            <router-link to="/signup" class="text-decoration-none">
              Signup</router-link>
            </span
          >
        </p>
      </div>
    </div>
  </div>
</template>
