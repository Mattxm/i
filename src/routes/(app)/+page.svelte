<script lang="ts">
    import { Listbox, ListboxButton, ListboxOptions, ListboxOption, } from "@rgossiaux/svelte-headlessui"
    import { onMount } from "svelte";
    import { signedIn } from '$lib/userStore'
    import { supabase } from '$lib/supabaseClient'
    import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, ChevronsLeftIcon, ChevronsRightIcon, CheckIcon, FilterIcon, SlidersIcon } from "svelte-feather-icons";


    let sortNew = true
    export let data
    const { posts } = data
    function timeBetween(date){
        let sec = Math.floor((new Date() - new Date(date)) / 1000)
        let interval = Math.floor(sec / 31536000)
        if (interval >= 1) {
            return `${interval} year${interval !== 1 ? "s" : ""} ago`
        }
        interval = Math.floor(sec / 2592000)
        if (interval >= 1) {
            return `${interval} month${interval !== 1 ? "s" : ""} ago`
        }
        interval = Math.floor(sec / 86400)
        if (interval >= 1) {
            return `${interval} day${interval !== 1 ? "s" : ""} ago`
        }
        interval = Math.floor(sec / 3600)
        if (interval >= 1) {
            return `${interval} hour${interval !== 1 ? "s" : ""} ago`
        }
        interval = Math.floor(sec / 60)
        if (interval >= 1) {
            return `${interval} minute${interval !== 1 ? "s" : ""} ago`
        }
        return `just now`
    }

</script>

<svelte:head>
    <title>Main</title>
	<meta name="main page" content="main page content" />
	<html lang="en" />
</svelte:head>

<div id="main" class="min-h-screen w-full bg-primary-light dark:bg-primary-dark text-black dark:text-white flex">
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
                <li class="flex flex-col bg-zinc-100 dark:bg-zinc-800 py-2 px-4 border-thirdary border-b" >
                    <span class="flex w-full">
                        <div class="flex-1">
                            <span>{post.title}</span>
                            <span class="flex items-center space-x-2">
                                <div class="h-4 w-4 bg-white rounded-full p-px">
                                    <img class=" object-fill" alt="user avatar" src={post.profiles.avatar_url ? post.profiles.avatar_url : "favicon.png"} />
                                </div>
                                <span class="text-zinc-300" >{post.profiles.username}</span>
                                <span class="text-zinc-300" >{timeBetween(post.created_at)}</span>
                            </span>
                            <span>
                                <ul class="flex space-x-2 mt-1">
                                    {#each post.tags as tag}
                                        <li class="bg-green-500 text-center px-2 rounded-lg text-sm" >
                                            {tag}
                                        </li>
                                    {/each}
                                </ul>
                            </span>   
                        </div>
                        <div class="flex items-center align-middle" >
                            <span class="bg-zinc-600 rounded-full hover:scale-110 transition-transform " ><ChevronRightIcon/></span>
                        </div>
                    </span>
                    <p class="hidden" >{post.content}</p>
                </li>
            {/each}    
        {/if}
    </ul>
</div>
