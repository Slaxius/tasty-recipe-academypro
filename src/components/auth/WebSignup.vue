<script setup>
import BaseInput from '../ui/BaseInput.vue'
import BaseButton from '../ui/BaseButton.vue'
import { reactive, ref } from 'vue'
import userPlaceholder from '../../assets/images/user.png'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const signupData = reactive({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  confirmationPassword: '',
  isLogin: false,
  imageLink: '',
})

const passwordStatusDisplay = ref("none")
const passwordCheck = () => {
    if ( signupData.password.length < 8 ) {
        passwordStatusDisplay.value = "block"
    } else {
        passwordStatusDisplay.value = "none"
    }
}

const confirmationPasswordDoesNotMatch = ref("none")
const confirmationPasswordMatch = ref("none")
const confirmationPasswordCheck = () => {
    if (signupData.confirmationPassword === '') {
        confirmationPasswordDoesNotMatch.value = "none"
        confirmationPasswordMatch.value = "none"
        return;
    }
    
    if (signupData.confirmationPassword !== signupData.password) {
        confirmationPasswordDoesNotMatch.value = "block"
        confirmationPasswordMatch.value = "none"
    } else {
        confirmationPasswordDoesNotMatch.value = "none"
        confirmationPasswordMatch.value = "block"
    }
}

const checkImage = (e) => {
    const file = e.target.files[0]
    if (!file) {
        signupData.imageLink = ''
        return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.addEventListener('load', () => {
        signupData.imageLink = reader.result
    })
}

const store = useStore()
const router = useRouter()
const registrationError = ref('')
const register = async () => {
    passwordCheck()
    confirmationPasswordCheck()
    registrationError.value = ''

    if (!signupData.email || !signupData.email.includes('@')) {
        registrationError.value = 'Enter a valid email address.'
    } else if (signupData.password.length >= 8 &&
        signupData.confirmationPassword === signupData.password) {
      try {
        await store.dispatch('auth/getRegisterData', signupData)
        router.push('/')
      } catch (err) {
        registrationError.value = err.message
      }
    }
}
</script>

<template>
  <div class="container-fluid py-5" style="background-color: #f5f5f5">
    <div style="background-color: #ffffff" class="p-5 m-auto signup-form">
      <div class="text-center">
        <router-link to="/">
            <img src="../../assets/images/Logo.png" alt="Logo" />
        </router-link>
        <h2 class="mt-4">Create your account</h2>
        <p>Enter your details to use all the app features.</p>
      </div>
      <form class="mt-3" @submit.prevent="register">
        <p v-if="registrationError" class="text-danger">{{ registrationError }}</p>
        <div class="row">
          <div class="col-md-6">
            <BaseInput type="text" identity="firstname" placeholder="Ex: Silverius" label="Firstname" v-model="signupData.firstname" />
          </div>
          <div class="col-md-6">
            <BaseInput type="text" identity="lastname" placeholder="Ex: Calvin" label="Lastname" v-model="signupData.lastname" />
          </div>
        </div>
        <div class="my-4">
            <BaseInput type="text" identity="username" placeholder="Your username" label="Username" v-model="signupData.username" />
        </div>
        <div class="my-4">
            <BaseInput type="email" identity="email" placeholder="Your email address" label="Email" v-model="signupData.email" />
        </div>
        <div class="my-4">
            <BaseInput type="password" identity="password" placeholder="Your password" label="Password" v-model="signupData.password" @keyInput="passwordCheck" />
            <p class="text-danger mt-1 fw-medium" 
                style="font-size: 11px" 
                :style="{ display: passwordStatusDisplay }">
                The password field must be at least 8 characters
            </p>
        </div>
        <div class="my-4">
            <BaseInput type="password" identity="confirmationPassword" placeholder="Same with password" label="Confirmation Password" v-model="signupData.confirmationPassword" @keyInput="confirmationPasswordCheck" />
            <p class="text-danger mt-1 fw-medium" style="font-size: 11px" :style="{ display: confirmationPasswordDoesNotMatch }">
                The password confirmation does not match
            </p>
            <p class="text-success mt-1 fw-medium" style="font-size: 11px" :style="{ display: confirmationPasswordMatch }">
                The password confirmation does match
            </p>
        </div>
        <div class="my-4">
            <BaseInput 
                type="file" 
                identity="profilePhoto" 
                label="Profile Photo" 
                :isImage="true" 
                @input="checkImage" 
            >
            <div class="border p-1 mt-2 rounded-circle">
                <img :src="signupData.imageLink || userPlaceholder" class="rounded-circle" 
                width="140" height="140" style="object-fit:cover"
                />
            </div>
            <div class="text-center" style="transform: translateY(-24px)">
                <i class="fa-solid fa-camera fs-5 p-2 rounded-circle bg-white"></i>
            </div>
            </BaseInput>
        </div>
        <BaseButton class="login w-100 my-3">Register</BaseButton>
      </form>
      <div class="text-center mt-4">
        <p class="fw-semibold">
          Already have account?<span style="color: #4c4ddc"
            >
            <router-link to="/login" class="text-decoration-none"> Login</router-link>
          </span
          >
        </p>
      </div>
    </div>
  </div>
</template>
