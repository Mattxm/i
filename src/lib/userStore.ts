import { browser } from '$app/environment'
import { writable } from 'svelte/store'
import { supabase } from '$lib/supabaseClient'

function createSignedIn() {
    const defaultValue = undefined
    const initialValue = browser ? localStorage.signIn : defaultValue
    const { subscribe, set, update } = writable(initialValue)

    async function reset() {
        const { data, error } = await supabase.auth.getSession()
        if (data.session == null) {
            signedIn.set(false)
        } else {
            signedIn.set(true)
        }
    }
    return {
        subscribe,
        set,
        update,
        reset,
    }
}

export const signedIn = createSignedIn()
signedIn.subscribe((value) => {
    if (browser) {
        localStorage.signedIn = String(value)
    }
})

function createCurrentUser() {
    const { subscribe, set, update } = writable({})

    return {
        subscribe,
        reset: async () => set(await getCurrentUser()),
    }
}

export const currentUser = createCurrentUser()

async function getCurrentUser() {
    const {
        data: { session },
    } = await supabase.auth.getSession()
    if (session?.user) {
        let { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .eq(`user_id`, session?.user?.id)
            .single()

        return {
            username: profiles?.username,
            user_id: session?.user?.id,
            email: session?.user?.email,
            avatar_url: profiles?.avatar_url
                ? profiles?.avatar_url
                : '/placeholder.jpg',
        }
    }
    return {
        username: null,
        user_id: null,
        email: null,
        avatar_url: '/placeholder.jpg',
    }
}
