import { ref, onUnmounted } from 'vue'

export function useNotification() {

    const message = ref('')
    const type = ref('success')
    const isVisible = ref(false)
    let timeout = null

    const showNotification = (msg, msgType='success') =>{

        clearTimeout(timeout)

        message.value = msg
        type.value = msgType
        isVisible.value = true

        timeout = setTimeout(() => {
            isVisible.value = false
            message.value = ''
        }, 3000)
    }

    onUnmounted(() => {
        if (timeout) clearTimeout(timeout)
    })

    return {
        message,
        type,
        isVisible,
        showNotification
    }
}