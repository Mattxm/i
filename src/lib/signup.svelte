<script>
    import { supabase } from "$lib/supabaseClient"
    import { signedIn } from "$lib/userStore";
    import { onMount } from "svelte";
    

    let email = ""
    let password = ""
    let confirmpassword = ""
    let username = ""

    async function signUpWithEmail(){
        const { data, error } = await supabase.auth.signUp({
            email: 'example@email.com',
            password: 'example-password',
        })
    }
    
</script>

<div class="generic h-screen w-full flex flex-col items-center align-middle">
    <form on:submit|preventDefault={signUpWithEmail} class="flex flex-col">
        <span>Sign Up</span>
        
        <label for="email">Email</label>
        <input class="bg-thirdary" required bind:value={email} type="email" name="email" autocomplete="false" spellcheck="false"/>

        <label for="username">Username</label>
        <input required size="24" bind:value={username} type="text" name="username" autocomplete="false" spellcheck="false"/>

        <label for="password">Password</label>
        <input required size="32" bind:value={password} type="password" name="password">

        <label for="confirmpassword">Confirm Password</label>
        <input required size="32" bind:value={confirmpassword} type="password" name="confirmpassword">

        <button type="submit">Create Account</button>
    </form>
    
</div>