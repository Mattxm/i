<script>
    import Signup from "$lib/signup.svelte";
    import { signedIn } from "$lib/userStore";
    import { onMount } from "svelte";

    $: if ($signedIn) {
        window.location.replace("/")
    }

</script>

<div class="generic h-screen w-full flex flex-col items-center align-middle">
    <div class="flex flex-col pt-2 rounded-md mt-4 overflow-hidden bg-secondary-light dark:bg-secondary-dark">
        <span class="text-lg text-center" >Sign Up</span>
        <Signup on:connection={()=> window.location.replace("/")} />
        <a href="/login" class="text-center text-sm underline pb-4">Already have an account? Sign in here.</a>
    </div>
    <a href="/" class="text-center text-sm underline pb-4 mt-2">Return to main site.</a>
</div>