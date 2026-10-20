<script setup>
import RecipeFormHeader from './RecipeFormHeader.vue'
import RecipeFormBody from './RecipeFormBody.vue'

defineProps({
    initialData: { type: Object, default: () => ({}) },
    isEdit: { type: Boolean, default: false },
})
</script>

<template>
    <ul class="list-group">
        <RecipeFormHeader :is-edit="isEdit" />
        <RecipeFormBody
            :initial-data="initialData"
            :is-edit="isEdit"
        />
    </ul>
</template>