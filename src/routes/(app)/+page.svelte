<script lang="ts">
    import Postresult from '$lib/postresult.svelte'
    import { page } from '$app/stores'
    $: results = $page.data
</script>

<svelte:head>
    <title>Main</title>
    <meta name="main page" content="main page content" />
    <html lang="en" />
</svelte:head>

<div
    id="main"
    class="flex min-h-screen bg-primary-light text-black dark:bg-primary-dark dark:text-white"
>
    {#if results.type == 0}
        <ul class="flex-1">
            {#if results.data != null}
                {#each results.data as post}
                    <Postresult {post} />
                {/each}
            {/if}
        </ul>
    {:else}
        <span />
    {/if}
</div>
