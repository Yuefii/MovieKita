import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useAuth = ({
    middleware,
    redirectIfAuthenticated
}: {
    middleware?: 'guest' | 'auth',
    redirectIfAuthenticated?: string
} = {}) => {
    const router = useRouter()

    const { data: user, error, mutate } = useSWR('/api/user', () =>
        axios
            .get('/api/user')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({ setErrors, setLoading, ...props }: any) => {
        setLoading?.(true)
        await csrf()

        setErrors([])

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
            .finally(() => setLoading?.(false))
    }

    const login = async ({ setErrors, setStatus, setLoading, ...props }: any) => {
        setLoading?.(true)
        await csrf()

        setErrors([])
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
            .finally(() => setLoading?.(false))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        window.location.pathname = '/login'
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated)
        if (window.location.pathname === '/verify-email' && user?.email_verified_at) router.push(redirectIfAuthenticated || '/')
        if (middleware === 'auth' && error) logout()
    }, [user, error, middleware, redirectIfAuthenticated, router])

    return {
        user,
        register,
        login,
        logout,
    }
}
