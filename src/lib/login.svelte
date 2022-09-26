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
    }

</script>

<div class="max-w-xs">
    <form autocomplete="off" class="flex flex-col bg-secondary-light dark:bg-secondary-dark p-4 rounded-md" on:submit|preventDefault={handleLogin}>
        <label for="email">Email</label>
        <input class="text-black dark:text-white bg-primary-light dark:bg-primary-dark rounded-sm border text-sm p-1 focus:border-highlight dark:focus:border-highlight border-white dark:border-primary-dark focus:outline-none autofill:border-none" 
            name="email" type="email" bind:value={email}/>
        <label for="password">Password</label>
        <input class="text-black dark:text-white bg-primary-light dark:bg-primary-dark rounded-sm border text-sm p-1 focus:border-highlight dark:focus:border-highlight border-white dark:border-primary-dark focus:outline-none autofill:border-none" 
            name="password" type="password" bind:value={password}/>
        
        <button type="submit" class={`${check ? "bg-highlight text-black" : " bg-primary-light dark:bg-primary-dark"} rounded-sm mt-2`}>Log In</button>
    </form>
</div>