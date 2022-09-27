<script lang="ts">
    import { onMount } from "svelte";
    import { signedIn } from '$lib/userStore'
    import { supabase } from '$lib/supabaseClient'

</script>

<svelte:head>
    <title>Main</title>
	<meta name="main page" content="main page content" />
	<html lang="en" />
</svelte:head>

<div id="main" class="h-screen w-full bg-primary-dark text-white ">
    {$signedIn}
</div>
