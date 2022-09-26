import { browser } from '$app/environment'
import { writable } from 'svelte/store'

const defaultValue = undefined
const initialValue = browser ? localStorage.signIn : defaultValue

export const signedIn = writable(initialValue)

signedIn.subscribe((value) => {
    if (browser)
        localStorage.signedIn = String(value)
})