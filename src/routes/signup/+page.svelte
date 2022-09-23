<script>
    import { supabase } from "$lib/supabaseClient"
  import { onMount } from "svelte";
    const user = supabase.auth.user()

    async function signInWithGoogle(){
        const { user, session, error } = await supabase.auth.signIn({
            provider: "google",
        }) 
    }
    onMount(()=>{
        if (user)
            window.location.replace("/")
    })
    
</script>

<div class="generic h-screen w-full flex flex-col items-center align-middle">
    <button on:click|preventDefault={signInWithGoogle} class="bg-green-500 p-2 rounded-md">Continue with Google</button>
    <form on:submit|preventDefault class="flex flex-col">
        <span>Sign Up</span>
        
        <label for="email">Email</label>
        <input type="email" name="email" autocomplete="false" spellcheck="false"/>

        <label for="username">Username</label>
        <input type="text" name="username" autocomplete="false" spellcheck="false"/>

        <label for="password">Password</label>
        <input type="password" name="password">

        <button>Create Account</button>

    </form>
    
</div>