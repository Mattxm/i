import { createClient } from '@supabase/supabase-js'
import { signedIn, currentUser } from '$lib/userStore'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    else {
        signedIn.set(false)
        currentUser.reset()
    }
}

export async function signUpWithEmail(
    email: string,
    password: string,
    username: string
) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { data: { username: username } },
    })
    if (data.session) {
        signedIn.set(true)
        currentUser.reset()
    }
    return {
        success: data.session ? true : false,
        error: error?.message,
    }
}

export async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })
    if (data.session) {
        signedIn.set(true)
        currentUser.reset()
    }
    return {
        success: data.session ? true : false,
        error: error?.message,
    }
}
