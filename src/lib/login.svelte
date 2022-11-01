<script lang="ts">
    import { supabase, signInWithEmail } from "$lib/supabaseClient"
    import { signedIn } from "$lib/userStore"
    import { createEventDispatcher } from "svelte"
    import { AlertCircleIcon, CheckCircleIcon, MinusCircleIcon } from "svelte-feather-icons";
    
    const dispatch = createEventDispatcher()

    let email = ""
    let password = ""

    $: check = ((password.length > 0) && (email.length > 0)) 

    let errormsg = ""

    async function handleLogin(){
        let {success, error} = await signInWithEmail(email, password)
        if (success)
            dispatch('connection')
        else
            errormsg = error ? error : ""
    }

</script>

<div class="max-w-xs w-screen">
    {#if (errormsg.length > 0)}
        <div on:click={()=>{errormsg = ""}} class="relative border-red-500 border mx-4 rounded-sm p-2 flex space-x-2 my-1" >
            <AlertCircleIcon class="text-red-500"/>
            <p class="text-sm" >{errormsg}.</p>
        </div>
    {/if}
    <form autocomplete="off" class="flex flex-col bg-secondary-light dark:bg-secondary-dark px-4 pb-4 space-y-2" on:submit|preventDefault={handleLogin}>
        <div>
            <label for="email">Email</label>
            <input class="focus:border-black dark:focus:border-white border-white dark:border-primary-dark w-full text-black dark:text-white bg-primary-light dark:bg-primary-dark focus:bg-white dark:focus:bg-black rounded-sm border text-sm p-1 focus:outline-none" 
                autocomplete="email" name="email" type="text" bind:value={email}/>
        </div>
        
        <div>
            <label for="password">Password</label>
            <input 
            class="focus:border-black dark:focus:border-white border-white dark:border-primary-dark w-full text-black dark:text-white bg-primary-light dark:bg-primary-dark focus:bg-white dark:focus:bg-black rounded-sm border text-sm p-1 focus:outline-none" 
            autocomplete="current-password" name="password" type="password" bind:value={password}/>    
        </div>
        
        <button disabled={!check} type="submit" class={`${check ? "bg-highlight text-black" : " bg-primary-light dark:bg-primary-dark cursor-not-allowed"} rounded-sm leading-7 py-px`}>Log In</button>
    </form>
</div>