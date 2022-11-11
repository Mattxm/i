<script lang="ts">
    import { supabase, signInWithEmail } from '$lib/supabaseClient'
    import { createEventDispatcher } from 'svelte'
    import {
        AlertCircleIcon,
        CheckCircleIcon,
        MinusCircleIcon,
    } from 'svelte-feather-icons'

    const dispatch = createEventDispatcher()

    let email = ''
    let password = ''

    $: check = password.length > 0 && email.length > 0

    let errormsg = ''

    async function handleLogin() {
        let { success, error } = await signInWithEmail(email, password)
        if (success) dispatch('connection')
        else errormsg = error ? error : ''
    }
</script>

<div class="w-screen max-w-xs">
    {#if errormsg.length > 0}
        <button
            on:click={() => {
                errormsg = ''
            }}
            class="relative mx-4 my-1 flex space-x-2 rounded-sm border border-red-500 p-2"
        >
            <AlertCircleIcon class="text-red-500" />
            <p class="text-sm">{errormsg}.</p>
        </button>
    {/if}
    <form
        autocomplete="off"
        class="flex flex-col space-y-2 bg-secondary-light px-4 pb-4 dark:bg-secondary-dark"
        on:submit|preventDefault={handleLogin}
    >
        <div>
            <label for="email">Email</label>
            <input
                class="w-full rounded-sm border border-white bg-primary-light p-1 text-sm text-black focus:border-black focus:bg-white focus:outline-none dark:border-primary-dark dark:bg-primary-dark dark:text-white dark:focus:border-white dark:focus:bg-black"
                autocomplete="email"
                name="email"
                type="text"
                bind:value={email}
            />
        </div>

        <div>
            <label for="password">Password</label>
            <input
                class="w-full rounded-sm border border-white bg-primary-light p-1 text-sm text-black focus:border-black focus:bg-white focus:outline-none dark:border-primary-dark dark:bg-primary-dark dark:text-white dark:focus:border-white dark:focus:bg-black"
                autocomplete="current-password"
                name="password"
                type="password"
                bind:value={password}
            />
        </div>

        <button
            disabled={!check}
            type="submit"
            class={`${
                check
                    ? 'bg-highlight text-black'
                    : ' cursor-not-allowed bg-primary-light dark:bg-primary-dark'
            } rounded-sm py-px leading-7`}>Log In</button
        >
    </form>
</div>
