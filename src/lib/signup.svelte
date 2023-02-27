<script>
    import { supabase, signUpWithEmail } from '$lib/supabaseClient'
    import { onMount, createEventDispatcher } from 'svelte'
    import {
        AlertCircleIcon,
        CheckCircleIcon,
        MinusCircleIcon,
    } from 'svelte-feather-icons'

    const dispatch = createEventDispatcher()

    let email = ''
    let password = ''
    let confirmpassword = ''
    let username = ''

    let regex = new RegExp('^[^@]+@[^@]+.[^@]+$')
    let regex2 = new RegExp(
        '^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){1,22}[a-zA-Z0-9]$'
    )

    $: einvalid = !regex.test(email) && interaction[0]
    $: uinvalid = !regex2.test(username) && interaction[1]
    $: pwlength = password.length < 6 && interaction[2]
    $: pwmatch = confirmpassword != password && interaction[3]
    $: check =
        !einvalid &&
        !uinvalid &&
        !pwmatch &&
        !pwlength &&
        interaction[0] &&
        interaction[1] &&
        interaction[2] &&
        interaction[3]

    let interaction = [false, false, false, false]

    let errormsg = ''

    async function signUp() {
        let { success, error } = await signUpWithEmail(
            email,
            password,
            username
        )
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
        on:submit|preventDefault={signUp}
        class="flex flex-col space-y-2 bg-secondary-light px-4 pb-4 dark:bg-secondary-dark"
    >
        <div>
            <div class="flex items-center">
                <label for="email">Email</label>
                <span class="flex-1" />
                {#if einvalid}
                    <MinusCircleIcon class="text-red-500" size="16" />
                {:else if !einvalid && interaction[0]}
                    <CheckCircleIcon class="text-green-500" size="16" />
                {/if}
            </div>
            <input
                required
                maxlength="128"
                bind:value={email}
                type="text"
                name="email"
                autocomplete="email"
                spellcheck="false"
                on:input={() => {
                    interaction[0] = true
                }}
                class={`${
                    einvalid
                        ? 'border-red-500'
                        : 'border-white focus:border-black dark:border-primary-dark dark:focus:border-white'
                } w-full rounded-sm border bg-primary-light p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-black`}
            />
            <div
                class={`${
                    einvalid ? ' max-h-12' : 'max-h-0'
                } items-center overflow-hidden text-xs text-red-500 transition-all`}
            >
                <p>Enter a valid email.</p>
            </div>
        </div>

        <div>
            <div class="flex items-center">
                <label for="username">Username</label>
                <span class="flex-1" />
                {#if uinvalid}
                    <MinusCircleIcon class="text-red-500" size="16" />
                {/if}
            </div>
            <input
                required
                maxlength="24"
                bind:value={username}
                type="text"
                name="username"
                autocomplete="off"
                spellcheck="false"
                on:input={() => {
                    interaction[1] = true
                }}
                class={`${
                    uinvalid
                        ? 'border-red-500'
                        : 'border-white focus:border-black dark:border-primary-dark dark:focus:border-white'
                } w-full rounded-sm border bg-primary-light p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-black`}
            />
            <div
                class={`${
                    uinvalid ? ' max-h-12' : 'max-h-0'
                } items-center overflow-hidden text-xs text-red-500 transition-all`}
            >
                {#if username.length <= 24 && username.length >= 3 && uinvalid}
                    <p>
                        Usernames only allow nonconsecutive hypens '-' and
                        underscores '_', except at the beginning or end of a
                        name.
                    </p>
                {:else}
                    <p>Usernames must be 3-24 characters long.</p>
                {/if}
            </div>
        </div>

        <div>
            <div class="flex items-center">
                <label for="email">Password</label>
                <span class="flex-1" />
                {#if pwlength}
                    <MinusCircleIcon class="text-red-500" size="16" />
                {:else if !pwlength && interaction[2]}
                    <CheckCircleIcon class="text-green-500" size="16" />
                {/if}
            </div>
            <input
                required
                maxlength="24"
                bind:value={password}
                type="password"
                name="password"
                autocomplete="new-password"
                spellcheck="false"
                on:input={() => {
                    interaction[2] = true
                }}
                class={`${
                    pwlength
                        ? 'border-red-500'
                        : 'border-white focus:border-black dark:border-primary-dark dark:focus:border-white'
                } w-full rounded-sm border bg-primary-light p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-black`}
            />
            <div
                class={`${
                    pwlength ? ' max-h-12' : 'max-h-0'
                } items-center overflow-hidden text-xs text-red-500 transition-all`}
            >
                <p>Password must be at least 6 characters.</p>
            </div>
        </div>

        <div>
            <div class="flex items-center">
                <label for="email">Confirm Password</label>
                <span class="flex-1" />
                {#if pwmatch}
                    <MinusCircleIcon class="text-red-500" size="16" />
                {:else if !pwmatch && interaction[3]}
                    <CheckCircleIcon class="text-green-500" size="16" />
                {/if}
            </div>
            <input
                required
                maxlength="24"
                bind:value={confirmpassword}
                type="password"
                name="confirmpassword"
                autocomplete="new-password"
                spellcheck="false"
                on:input={() => {
                    interaction[3] = true
                }}
                class={`${
                    pwmatch
                        ? 'border-red-500'
                        : 'border-white focus:border-black dark:border-primary-dark dark:focus:border-white'
                } w-full rounded-sm border bg-primary-light p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-black`}
            />
            <div
                class={`${
                    pwmatch ? ' max-h-12' : 'max-h-0'
                } items-center overflow-hidden text-xs text-red-500 transition-all`}
            >
                <p>Password does not match.</p>
            </div>
        </div>

        <p class="text-center text-xs text-neutral-800 dark:text-neutral-400">
            Email confirmations are <strong>not</strong> enabled for this project.
        </p>
        <button
            type="submit"
            disabled={!check}
            class={`${
                check
                    ? 'bg-highlight text-black'
                    : ' cursor-not-allowed bg-primary-light dark:bg-primary-dark'
            } rounded-sm py-px leading-7`}
        >
            Sign Up</button
        >
    </form>
</div>
