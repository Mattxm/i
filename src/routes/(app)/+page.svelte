<script lang="ts">
    import Postresult from '$lib/postresult.svelte'
    import { page } from '$app/stores'
    $: success = $page.data.success
    $: type = $page.data.type
    $: results = $page.data.data
    $: console.log(results)
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
                        <Postresult {post} />
                    {/each}
                </ul>
            {:else}
                <div class="mt-2 w-full text-center">No Results</div>
            {/if}
        {:else}
            <div>User Search (Not Implemented)</div>
        {/if}
    {:else}
        Error
    {/if}
</div>
