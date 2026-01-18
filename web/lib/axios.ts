import Axios from 'axios'
import { BACKEND_URL } from './env'

const axios = Axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true
})

export default axios
