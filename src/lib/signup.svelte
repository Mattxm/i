<script>
    import { supabase } from "$lib/supabaseClient"
    import { signedIn } from "$lib/userStore";
    import { onMount } from "svelte";
    import { AlertCircleIcon, CheckCircleIcon, MinusCircleIcon } from "svelte-feather-icons";

    let email = ""
    let password = ""
    let confirmpassword = ""
    let username = ""

    let regex = new RegExp("^[^@\s]+@[^@\s]+\.[^@\s]+$");
    let regex2 = new RegExp("^[a-zA-Z0-9]([_-](?![_-])|[a-zA-Z0-9]){1,22}[a-zA-Z0-9]$")
    
    $: einvalid = !regex.test(email) && interaction[0]
    $: uinvalid = !regex2.test(username) && interaction[1]
    $: pwlength = password.length < 6 && interaction[2]
    $: pwmatch = confirmpassword != password && interaction[3]
    $: check = !einvalid && !uinvalid && !pwmatch && !pwlength && interaction[0] && interaction[1] && interaction[2] && interaction[3] 

    let interaction = [false, false, false, false]

    async function signUpWithEmail(){
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {data: {username: username}}
        })
        if (data.session){
            signedIn.set(true)
            window.location.replace("/")
        }
        else
            alert(error?.message)
    }
    
</script>

<div class="max-w-xs w-screen">
    <form on:submit|preventDefault={signUpWithEmail} class="flex flex-col bg-secondary-light dark:bg-secondary-dark px-4 pb-4 space-y-2">
        <div>
            <div class="flex items-center">
                <label for="email">Email</label>
                <span class="flex-1"/>
                {#if einvalid}
                    <MinusCircleIcon class="text-red-500" size="16" />
                {:else if !einvalid && interaction[0]}
                    <CheckCircleIcon class="text-green-500" size="16" />
                {/if}
            </div>
            <input required maxlength="128" bind:value={email} type="text" name="email" autocomplete="false" spellcheck="false" on:input={()=>{interaction[0] = true}}
            class={`${einvalid ? "border-red-500" : "focus:border-black dark:focus:border-white border-white dark:border-primary-dark"} w-full text-black dark:text-white bg-primary-light dark:bg-primary-dark focus:bg-white dark:focus:bg-black rounded-sm border text-sm p-1 focus:outline-none`}
            /> 
            <div class={`${einvalid ? " max-h-12" : "max-h-0"} transition-all text-red-500 items-center text-xs overflow-hidden`} >
                <p>Enter a valid email.</p>
            </div>
        </div>

        <div>
            <div class="flex items-center">
                <label for="username">Username</label>
                <span class="flex-1"/>
                {#if uinvalid}
                    <MinusCircleIcon class="text-red-500" size="16" />
                {:else if !uinvalid && interaction[1]}
                    <CheckCircleIcon class="text-green-500" size="16" />
                {/if}
            </div>
            <input required maxlength="24" bind:value={username} type="text" name="username" autocomplete="false" spellcheck="false" on:input={()=>{interaction[1] = true}}
            class={`${uinvalid ? "border-red-500" : "focus:border-black dark:focus:border-white border-white dark:border-primary-dark"} w-full text-black dark:text-white bg-primary-light dark:bg-primary-dark focus:bg-white dark:focus:bg-black rounded-sm border text-sm p-1 focus:outline-none`}
            /> 
            <div class={`${uinvalid ? " max-h-12" : "max-h-0"} transition-all text-red-500 items-center text-xs overflow-hidden`} >
                {#if (username.length <= 24) && (username.length >= 3) && uinvalid }
                    <p>Usernames only allow nonconsecutive hypens '-' and underscores '_', except at the beginning or end of a name.</p> 
                {:else}
                    <p>Usernames must be 3-24 characters long.</p>
                {/if}
                
            </div>
        </div>

        <div>
            <div class="flex items-center">
                <label for="email">Password</label>
                <span class="flex-1"/>
                {#if pwlength}
                    <MinusCircleIcon class="text-red-500" size="16" />
                {:else if !pwlength && interaction[2]}
                    <CheckCircleIcon class="text-green-500" size="16" />
                {/if}
            </div>
            <input required maxlength="24" bind:value={password} type="password" name="password" autocomplete="false" spellcheck="false" on:input={()=>{interaction[2] = true}}
            class={`${pwlength ? "border-red-500" : "focus:border-black dark:focus:border-white border-white dark:border-primary-dark"} w-full text-black dark:text-white bg-primary-light dark:bg-primary-dark focus:bg-white dark:focus:bg-black rounded-sm border text-sm p-1 focus:outline-none`}
            /> 
            <div class={`${pwlength ? " max-h-12" : "max-h-0"} transition-all text-red-500 items-center text-xs overflow-hidden`} >
                <p>Password must be at least 6 characters.</p>
            </div>
        </div>

        <div>
            <div class="flex items-center">
                <label for="email">Confirm Password</label>
                <span class="flex-1"/>
                {#if pwmatch}
                    <MinusCircleIcon class="text-red-500" size="16" />
                {:else if !pwmatch && interaction[3]}
                    <CheckCircleIcon class="text-green-500" size="16" />
                {/if}
            </div>
            <input required maxlength="24" bind:value={confirmpassword} type="password" name="confirmpassword" autocomplete="false" spellcheck="false" on:input={()=>{interaction[3] = true}}
            class={`${pwmatch ? "border-red-500" : "focus:border-black dark:focus:border-white border-white dark:border-primary-dark"} w-full text-black dark:text-white bg-primary-light dark:bg-primary-dark focus:bg-white dark:focus:bg-black rounded-sm border text-sm p-1 focus:outline-none`}
            /> 
            <div class={`${pwmatch ? " max-h-12" : "max-h-0"} transition-all text-red-500 items-center text-xs overflow-hidden`} >
                <p>Password does not match.</p>
            </div>
        </div>

        <p class="text-xs text-zinc-800 dark:text-zinc-300 text-center">You do not have to confirm your email, after signing up you will automatically be logged in.</p>
        <button type="submit" disabled={!check}
        class={`${check ? "bg-highlight text-black" : " bg-primary-light dark:bg-primary-dark cursor-not-allowed"} rounded-sm leading-7 py-px`}>
        Sign Up</button>
    </form>
    
</div>