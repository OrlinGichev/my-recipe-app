import axios from 'axios'

const api = axios.create({
    baseURL: 'your-api-base-url', // Тук ще сложа базовия URL на моето API
    timeout: 10000, // 10 секунди timeout
    headers: {
        'Content-Type': 'application/json'
    }
})

// Добавяме interceptor за обработка на грешки
api.interceptors.response.use(
    response => response,
    error => {
      
        if (error.response) {
            // Грешка от сървъра
            console.error('API Error:', error.response.data)
        } else if (error.request) {
            // Грешка при изпращане на заявката
            console.error('Request Error:', error.request)
        } else {
            // Други грешки
            console.error('Error:', error.message)
        }
        return Promise.reject(error)
    }
)

export default api