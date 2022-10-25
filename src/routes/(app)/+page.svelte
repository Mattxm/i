<script lang="ts">
    import { Listbox, ListboxButton, ListboxOptions, ListboxOption, } from "@rgossiaux/svelte-headlessui"
    import { onMount } from "svelte";
    import { signedIn } from '$lib/userStore'
    import { supabase } from '$lib/supabaseClient'
    import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, ChevronsLeftIcon, ChevronsRightIcon, CheckIcon, FilterIcon, SlidersIcon } from "svelte-feather-icons";
    import timeBetween from "$lib/timeBetween"
    import Postresult from "$lib/postresult.svelte"

    let sortNew = true
    export let data
    const { posts } = data
</script>

<svelte:head>
    <title>Main</title>
	<meta name="main page" content="main page content" />
	<html lang="en" />
</svelte:head>

<div id="main" class="min-h-screen bg-primary-light dark:bg-primary-dark text-black dark:text-white flex">
    <ul class="flex-1">
        <!-- <span class="flex items-center justify-center bg-zinc-800">
            <button class=" hover:bg-zinc-800 rounded-full transition-colors w-6 h-6 p-px flex justify-center items-center">
                <ChevronsLeftIcon size="20"/>
            </button>
            <button class=" hover:bg-zinc-800 rounded-full transition-colors w-6 h-6 p-px flex justify-center items-center">
                <ChevronLeftIcon size="18"/>
            </button>
            <button class=" hover:bg-zinc-800 rounded-full transition-colors w-6 h-6 p-px flex justify-center items-center">
                1</button>
            <button class=" hover:bg-zinc-800 rounded-full transition-colors w-6 h-6 p-px flex justify-center items-center">
                <ChevronRightIcon size="18"/>
            </button>
            <button class=" hover:bg-zinc-800 rounded-full transition-colors w-6 h-6 p-px flex justify-center items-center">
                <ChevronsRightIcon size="20"/>
            </button>
        </span> -->
        {#if posts != null}
            {#each posts as post}
                <Postresult post={post} />
            {/each}    
        {/if}
    </ul>
</div>
