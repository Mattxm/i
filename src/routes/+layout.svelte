<script lang="ts">
    import "../app.css";
    import { user } from '$lib/sessionStore'
    import { supabase } from '$lib/supabaseClient'

    import { Switch, Popover, PopoverButton, PopoverPanel } from "@rgossiaux/svelte-headlessui";
    import { MoonIcon, SunIcon, ChevronDownIcon, BellIcon, Minimize2Icon, TargetIcon, SettingsIcon, XIcon, SlidersIcon, UserIcon, DollarSignIcon, LogOutIcon, PlusSquareIcon, FolderPlusIcon, ZapIcon } from 'svelte-feather-icons'
    import { onMount } from "svelte";


    // User
    
    let user = supabase.auth.user()
    console.log(user);
    enum Theme { System = 1, Light, Dark}
    let darktheme = false
    let userTheme = Theme.System
    function handleThemeChange(){
        if (!document || !window) return;
        userTheme++
        if (userTheme > 3)
            userTheme = 1
        switch (userTheme){
            case Theme.System: localStorage.removeItem("theme")
                if (window.matchMedia("(prefers-color-scheme: dark)").matches){
                    document.documentElement.classList.add("dark")
                    darktheme = true
                }
                else{
                    document.documentElement.classList.remove("dark")
                    darktheme = false
                }
                break
            case Theme.Dark: darktheme = true
                document.documentElement.classList.add("dark")
                localStorage.theme = "dark"
                break
            case Theme.Light: darktheme = false
                document.documentElement.classList.remove("dark")
                localStorage.theme = "light"                
                break
        }
    }
    onMount(()=>{
        if (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches){
            userTheme = Theme.System
            darktheme = true
        }
        else{
            userTheme = Theme.System
            darktheme = false
        }
        if (localStorage.theme === "dark") {
            userTheme = Theme.Dark
            darktheme = true
        } 
        if (localStorage.theme === "light") {
            userTheme = Theme.Light
            darktheme = false
        }
    })

    // Notifications
    let nlist = [
        {text: "New Message from X"},
    ]
    $: notifications = nlist.length

    // Search bar 
    let search = "";
    let si = -1;
    let cslist = [
        {text: "Search All"},
        {text: "Search X"},
        {text: "Search Y"},
    ]
    let pslist = [
        {text: "Option 1"},
        {text: "Option 2"},
        {text: "Option 3"},
    ]
    $: slist = [...cslist, ...pslist]
    function sbkb(e: any){   
        switch (e.keyCode){
            case 38: si--; e.preventDefault(); break;
            case 40: si++; e.preventDefault(); break;
        }
        si = Math.min(Math.max(si, 0), slist.length - 1)
    }
    function sbci(e: any){
        if (search.replace(/\s/g, "") !== "")
            si = 0
        else
            si = -1
    }
</script>
  
<div class="relative box-border">
    <a href="#main" class="absolute left-5 top-5 -z-50 focus:z-50 bg-secondary-light dark:bg-secondary-dark text-black dark:text-white">
        Skip to main content
    </a>
    <header class="flex p-4 bg-secondary-light dark:bg-secondary-dark text-black dark:text-white">
        <div class="h-item">
            <!-- <img class="max-w-none" width="32" height="32" src="inv2.svg" alt="logo"> -->
            <a href="/"><ZapIcon size="28" class="c-text"/></a>
        </div>
        <div class="h-item flex-auto">
            <div role="search" class="h-item relative search-container focus-within:flex-1 transition-all duration-300 ease-linear">
                <form class="w-full" on:submit|preventDefault={()=>{console.log(search);
                }}>
                    <label>
                        <input size="20" class="peer w-full rounded-sm focus:bg-secondary-light dark:focus:bg-secondary-dark px-2 focus:outline-none bg-primary-light dark:bg-primary-dark border border-thirdary transition-transform ease-linear" 
                        placeholder="Search" type="text" spellcheck="false" aria-haspopup="listbox" aria-activedescendant="selected" aria-autocomplete="list" aria-owns="searchbox"
                        bind:value={search}
                        on:keydown={(e)=>{sbkb(e)}}
                        on:focusout={()=>{si = -1}}
                        on:focus={()=>{if (search.replace(/\s/g, "") !== "") si = 0}}
                        on:input={(e)=>{sbci(e)}}
                        />
                        
                        <ul role="listbox" id="searchbox" class="menu left-0 right-0 absolute invisible peer-focus:visible">
                            {#each slist as slitem, i}
                                <li on:mouseenter={()=>{si = i}} role="option" aria-selected={si == i} class="aria-selected:bg-red-400 m-item">{slitem.text}</li>
                            {/each}
                        </ul>    
                    </label>
                </form>
            </div>
            <nav class="h-item space-x-4">
                <a class="c-text" href="/" >Information</a>
                <a class="c-text" href="/" >Listings</a>
                <a class="c-text" href="/" >Services</a>
            </nav>
        </div>

        {#if user != null}
            SIGNED IN
        {:else}
            SIGNED OUT
        {/if}
        <Popover class="relative h-item">
            <PopoverButton class="c-text flex items-center bg-green-400 focus:bg-green-500 hover:bg-green-500 px-2 rounded-sm">
                new
                <ChevronDownIcon size="15" class="ml-1"/>
            </PopoverButton>
            <PopoverPanel class="absolute right-0 top-8 flex flex-col menu max-w-xxs w-screen">
                <a href="/" class="m-item">
                    <PlusSquareIcon size="15"/>
                    <span class="pl-2">New Post</span>
                </a>
                <a href="/" class="m-item">
                    <FolderPlusIcon size="15"/>
                    <span class="pl-2">New Collection</span>
                </a>
                </PopoverPanel>
        </Popover>
        <Popover class="relative h-item">
            <PopoverButton>
                <BellIcon class="c-text" size="20"/>
                <span class={`${notifications > 0 ? "visible" : "hidden"} absolute text-xs px-1 top-0 -right-1 bg-red-400 rounded-full`}>{notifications}</span>
            </PopoverButton>
          
            <PopoverPanel class="menu absolute right-0 top-8 w-screen max-w-xs">
                <div class="flex px-4 items-center">
                    <span class="c-text flex-1"><a href="/notifications">Notifications</a></span>
                    <a href="/" class="c-text"><SettingsIcon size="20"/></a>
                </div>
                <span class="h-px my-1 bg-thirdary" />
                {#if notifications == 0}
                    <span class="px-4">No new notifactions</span>
                    
                {:else}
                    {#each nlist as nlitem, i}
                        <span class="flex items-center px-4">
                            <span class="flex-1">{nlitem.text}</span>
                            <span on:click={()=>{nlist = [...nlist.slice(0, i),...nlist.slice(i+1)]}} class="hover:bg-red-400 rounded-full"><XIcon size="20"/></span>
                        </span>
                    {/each}
                {/if}
                
                
            </PopoverPanel>
        </Popover>
        <Popover class="relative h-item">
            <PopoverButton>
                <div class=" rounded-full bg-white h-7 w-7 border border-thirdary"/>
            </PopoverButton>
            <PopoverPanel on:mousemove={()=>{}} class="absolute right-0 top-8 flex flex-col menu max-w-xxs w-screen leading-8">
                
                <a href="/profile" class="m-item">
                    <UserIcon size="15"/>
                    <span class="pl-2">Profile</span>
                </a>

                <span class="h-px my-1 bg-thirdary" />

                <a href="/notifications" class="m-item">
                    <BellIcon size="15"/>
                    <span class="pl-2">Notifications</span>
                </a>

                <!-- <a href="/" class="m-item">
                    <DollarSignIcon size="15"/>
                    <span class="pl-2">Earnings</span>
                </a> -->

                <span class="h-px my-1 bg-thirdary" />

                <a href="/settings" class="m-item">
                    <SettingsIcon size="15"/>
                    <span class="pl-2">Settings</span>
                </a>

                <button on:click={handleThemeChange} class="m-item text-left">
                    {#if darktheme}
                        <MoonIcon size="15"/>
                    {:else}
                        <SunIcon size="15"/>
                    {/if}
                    <span class="ml-2 flex-1">Theme</span>
                    <span class="leading-3 p-1 rounded-md border border-thirdary">
                        {#if userTheme === Theme.System}
                            System
                        {:else if userTheme === Theme.Light}
                            Light
                        {:else}
                            Dark
                        {/if}
                    </span>
                </button>                   

                <span class="h-px my-1 bg-thirdary" />

                <button on:click={()=>{console.log("sign out")}} class="m-item">
                    <LogOutIcon size="15"/>
                    <span class="pl-2">Log Out</span>
                </button>
            </PopoverPanel>
        </Popover>
    </header>
</div>

  

<slot />

<style>
    .to{
        transform:translateX(1rem);
    }
    .tf{
        transform:translateX(0.2rem);
    }
    .search-container{
        min-width: 15rem;
        max-width: 30rem;
    }
</style>