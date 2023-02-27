<script lang="ts">
    import PostResult from '$lib/PostResult.svelte'
    import { page } from '$app/stores'
    import UserResult from '$lib/UserResult.svelte'
    $: success = $page.data.success
    $: type = $page.data.type
    $: results = $page.data.data
</script>

<svelte:head>
    <title>Invoke</title>
    <meta name="main page" content="main page content" />
    <html lang="en" />
</svelte:head>

<div
    id="main"
    class="flex min-h-screen bg-primary-light text-black dark:bg-neutral-800 dark:text-white"
>
    {#if success}
        {#if type == 0}
            {#if results.length > 0}
                <ul class="w-full">
                    {#each results as post}
                        <PostResult {post} />
                    {/each}
                </ul>
            {:else}
                <div class="mt-2 w-full text-center">No Results</div>
            {/if}
        {:else}
            <ul class="w-full">
                {#each results as user}
                    <UserResult {user} />
                {/each}
            </ul>
        {/if}
    {:else}
        Error
    {/if}
</div>
