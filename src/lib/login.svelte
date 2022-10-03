<script lang="ts">
    import { supabase } from "$lib/supabaseClient"
    import { signedIn } from "$lib/userStore"
    
    let email = ""
    let password = ""

    $: check = ((password.length > 0) && (email.length > 0)) 

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (data.session != null)
            signedIn.set(true)
        else
            alert(error?.message)
    }

</script>

<div class="max-w-xs w-screen">
    <form autocomplete="off" class="flex flex-col bg-secondary-light dark:bg-secondary-dark px-4 pb-4 space-y-2" on:submit|preventDefault={handleLogin}>
        <div>
            <label for="email">Email</label>
            <input class="focus:border-black dark:focus:border-white border-white dark:border-primary-dark w-full text-black dark:text-white bg-primary-light dark:bg-primary-dark focus:bg-white dark:focus:bg-black rounded-sm border text-sm p-1 focus:outline-none" 
                name="email" type="email" bind:value={email}/>
        </div>
        
        <div>
            <label for="password">Password</label>
            <input 
            class="focus:border-black dark:focus:border-white border-white dark:border-primary-dark w-full text-black dark:text-white bg-primary-light dark:bg-primary-dark focus:bg-white dark:focus:bg-black rounded-sm border text-sm p-1 focus:outline-none" 
            name="password" type="password" bind:value={password}/>    
        </div>
        
        <button disabled={!check} type="submit" class={`${check ? "bg-highlight text-black" : " bg-primary-light dark:bg-primary-dark cursor-not-allowed"} rounded-sm leading-7 py-px`}>Log In</button>
    </form>
</div>