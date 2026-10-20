<script setup>
defineProps({
    identity: { type: String, required: true },
    label: { type: String, required: true },
    placeholder: { type: String, required: true },
    modelValue: { type: [String, Number] }
})

let emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div>
        <label :for="identity" class="fw-semibold">{{ label }}</label>
            <span style="color: #cb3a31">*</span>
        <textarea 
            class="form-control" 
            :id="identity" 
            @keyup="$emit('update:modelValue', $event.target.value)" 
            v-text="modelValue"
        ></textarea>
    </div>
</template>