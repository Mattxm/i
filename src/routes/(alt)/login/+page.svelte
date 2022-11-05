<script>
    import Login from '$lib/login.svelte'
    import { signedIn } from '$lib/userStore'

    $: if ($signedIn) {
        window.location.replace('/')
    }
</script>

<div class="generic flex h-screen w-full flex-col items-center align-middle">
    <div
        class="mt-4 flex flex-col overflow-hidden rounded-md bg-secondary-light pt-2 dark:bg-secondary-dark"
    >
        <span class="text-center text-lg">Log In</span>
        <Login on:connection={() => window.location.replace('/')} />
        <a href="/signup" class="pb-4 text-center text-sm underline"
            >Register a new account.</a
        >
    </div>
    <a href="/" class="mt-2 pb-4 text-center text-sm underline"
        >Return to main site.</a
    >
</div>
