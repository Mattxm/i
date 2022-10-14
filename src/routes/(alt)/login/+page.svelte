<script>
    import Login from "$lib/login.svelte";
    import { signedIn } from "$lib/userStore"

    $: if ($signedIn) {
        window.location.replace("/")
    }
</script>

<div class="generic h-screen w-full flex flex-col items-center align-middle">
    <div class="flex flex-col pt-2 rounded-md mt-4 overflow-hidden bg-secondary-light dark:bg-secondary-dark">
        <span class="text-lg text-center" >Log In</span>
        <Login on:connection={()=> window.location.replace("/")} />
        <a href="/signup" class="text-center text-sm underline pb-4">Register a new account.</a>
    </div>
    <a href="/" class="text-center text-sm underline pb-4 mt-2">Return to main site.</a>
    
</div>
