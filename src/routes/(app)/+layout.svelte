<script lang="ts">
    import "$lib/app.css";
    import { signedIn } from '$lib/userStore'
    import { supabase } from '$lib/supabaseClient'
    import Signup from "$lib/signup.svelte";
    import Login from "$lib/login.svelte";

    import { Listbox, ListboxButton, ListboxOptions, ListboxOption, Popover, PopoverButton, PopoverPanel, Dialog, DialogOverlay, DialogDescription, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";
    import {  CheckIcon, MoonIcon, SunIcon, ChevronDownIcon, BellIcon, Minimize2Icon, TargetIcon, SettingsIcon, XIcon, SlidersIcon, UserIcon, DollarSignIcon, LogOutIcon, PlusSquareIcon, FolderPlusIcon, ZapIcon, LogInIcon, SearchIcon, PlusCircleIcon, InfoIcon, PlusIcon, ArrowLeftIcon } from 'svelte-feather-icons'
    import { onMount } from "svelte";


    // Search Options
    let OptionsVisible = false

    const DateOptions = [
        "All",
        "Today",
        "This Week",
        "This Month"
    ]
    let SelectedDateOption = DateOptions[0]

    const SortOptions = [
        "Post Date",
        "Comments",
        "Rating",
    ]
    let SelectedSortOption = SortOptions[0]

    let AdditionalTags = ["Example Tag"]
    let NewTag = ""

    // Auth
    
    let AuthOpen = false
    let AuthIndex = 0
    let CurAuthIndex = AuthIndex
        
    async function checkSession() {
        const { data, error } = await supabase.auth.getSession()
        if (data.session == null){
            signedIn.set(false)
        }
        else{
            signedIn.set(true) 
        }
                     
    }
    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        else
            signedIn.set(false)
    }


    // User    
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
        checkSession()
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
    let ShowSearch = false
    let search = "";
    let si = -1;
    let cslist = [
        {text: "Search Posts"},
        {text: "Search Users"},
    ]
    let pslist = [
        {text: "Option 1"},
        {text: "Option 2"},
        {text: "Option 3"},
    ]
    $: slist = [...cslist]
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

<Dialog open={AuthOpen} on:close={()=> (AuthOpen = false)} as="div" class="fixed inset-0">
    <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25 z-0"/>
    <div class="fixed inset-0 overflow-y-auto flex items-center justify-center pointer-events-none">
        <div class=" bg-secondary-light dark:bg-secondary-dark pointer-events-auto rounded-md overflow-hidden" >
            <DialogTitle class="px-4 py-2 text-center text-lg">
                {#if CurAuthIndex == 0}
                    Log In
                {:else}
                    Sign Up
                {/if}
            </DialogTitle>
            <DialogDescription class="hidden" >
                {#if CurAuthIndex == 0}
                    Log in to an existing user.
                {:else}
                    Register a new user.
                {/if}
            </DialogDescription>
            <TabGroup defaultIndex={AuthIndex} manual on:change={e => CurAuthIndex = e.detail}>
                <TabList class="mx-4 text-sm space-x-4">
                    <Tab class={`${CurAuthIndex == 0 ? "border-b-2 border-thirdary dark:border-white" : ""} `}>Log In</Tab>
                    <Tab class={`${CurAuthIndex == 1 ? "border-b-2 border-thirdary dark:border-white" : ""} `}>Sign Up</Tab>
                </TabList>
                <div class="h-px mx-4 my-2 bg-thirdary" />
                <TabPanels>
                    <TabPanel><Login on:connection={()=>{AuthOpen = false}} /></TabPanel>
                    <TabPanel><Signup on:connection={()=>{AuthOpen = false}} /></TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    </div>
    
</Dialog>

  
<div class="relative box-border">
    <a href="#main" class="absolute left-5 top-5 -z-50 focus:z-50 bg-secondary-light dark:bg-secondary-dark text-black dark:text-white">
        Skip to main content
    </a>
    <header class="relative grid grid-cols-1 py-2 px-4 bg-secondary-light dark:bg-secondary-dark text-black dark:text-white">
        <div class="flex w-full">
            <div class="h-item">
                <!-- <img class="max-w-none" width="32" height="32" src="inv2.svg" alt="logo"> -->
                <a class="flex items-center text-lg font-medium space-x-2" href="/" data-sveltekit-prefetch>
                    <ZapIcon size="28" class="c-text"/>
                    <span>INVOKE</span>
                </a>
            </div>
            <div class="h-item flex-1">
                <div class="hidden xs:flex h-full w-full justify-center">
                    <form class="flex w-full h-full max-w-sm" on:submit|preventDefault={()=>{console.log(search);}}>
                        <div class="flex flex-1 relative items-center focus-within:bg-secondary-light dark:focus-within:bg-secondary-dark px-2 bg-primary-light dark:bg-primary-dark border border-thirdary">
                            <label hidden for="searchbar">search bar</label>
                            <input size="20" class="peer h-full flex-1 bg-inherit focus:outline-none" 
                            placeholder="Search" name="searchbar" type="text" spellcheck="false" aria-haspopup="listbox" aria-activedescendant="selected" aria-autocomplete="list" aria-owns="searchbox" autocomplete="off"
                            bind:value={search}
                            on:keydown={(e)=>{sbkb(e)}}
                            on:focusout={()=>{si = -1}}
                            on:focus={()=>{if (search.replace(/\s/g, "") !== "") si = 0}}
                            on:input={(e)=>{sbci(e)}}
                            />
                            {#if search}
                                <button on:click={()=>{search = ""}}>
                                    <XIcon size="20"/>
                                </button> 
                            {/if}

                            <button on:click={()=> OptionsVisible = !OptionsVisible } class="ml-2">
                                <SlidersIcon size="16" />
                            </button>
                                
                            <ul role="listbox" id="searchbox" class="menu -left-px top-full -right-px absolute invisible peer-focus:visible">
                                {#each slist as slitem, i}
                                    <li on:mouseenter={()=>{si = i}} role="option" aria-selected={si == i} class="aria-selected:bg-red-400 m-item">{slitem.text}</li>
                                {/each}
                            </ul>
                        </div>
                        <button class="px-2 bg-thirdary hover:bg-neutral-700">
                            <SearchIcon size="18"/>
                        </button>

                    </form>
                </div>
                <!-- <nav class="h-item space-x-4">
                    <a class="c-text" href="/" >Information</a>
                    <a class="c-text" href="/" >Listings</a>
                    <a class="c-text" href="/" >Services</a>
                </nav> -->
            </div>
            <div class="h-item space-x-4">
                    <button on:click={()=>{ShowSearch = !ShowSearch}} class="h-7 xs:hidden">
                        <SearchIcon class="c-text" size="20"/>
                    </button>
                {#if $signedIn == true}
                    <Popover class="relative items-center justify-center flex">
                        <PopoverButton class="h-7 items-center hover:bg-green-400 p-0.5 rounded-md transition-colors">
                            <PlusSquareIcon/>
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
                    <Popover class="relative items-center justify-center flex">
                        <PopoverButton class="h-7">
                            <BellIcon class="c-text" size="20"/>
                            <span class={`${notifications > 0 ? "visible" : "hidden"} absolute text-xs px-1 -top-1.5 -right-0.5 bg-red-400 rounded-full`}>{notifications}</span>
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
                {:else if $signedIn == false}
                    <button on:click={()=> {AuthOpen = true; AuthIndex = 0; CurAuthIndex = 0}} class="bg-primary-light dark:bg-primary-dark hover:bg-zinc-300 dark:hover:bg-zinc-800 border border-thirdary px-2 rounded-md" >Log In</button>
                    <button on:click={()=> {AuthOpen = true; AuthIndex = 1; CurAuthIndex = 1}} class="bg-primary-light dark:bg-primary-dark hover:bg-zinc-300 dark:hover:bg-zinc-800 border border-thirdary px-2 rounded-md" >Sign Up</button>
                {/if}
                <Popover class="relative items-center justify-center flex">
                    <PopoverButton>
                        <div class=" rounded-full bg-white h-7 w-7 border border-thirdary"/>
                    </PopoverButton>
                    <PopoverPanel on:mousemove={()=>{}} class="absolute right-0 top-8 flex flex-col menu max-w-xxs w-screen leading-8">
                        {#if $signedIn == true}
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
                        {/if}
                        <button on:click={handleThemeChange} class="m-item text-left">
                            {#if darktheme}
                                <MoonIcon size="15"/>
                            {:else}
                                <SunIcon size="15"/>
                            {/if}
                            <span class="ml-2 flex-1">Theme</span>
                            <span class="leading-3 p-1 rounded-md border border-thirdary">
                                {#if userTheme === Theme.System}
                                    Auto
                                {:else if userTheme === Theme.Light}
                                    Light
                                {:else}
                                    Dark
                                {/if}
                            </span>
                        </button>                   

                        <span class="h-px my-1 bg-thirdary" />

                        {#if $signedIn}
                            <button on:click={signOut} class="m-item">
                                <LogOutIcon size="15"/>
                                <span class="pl-2">Log Out</span>
                            </button>
                        {:else}
                            <button on:click={()=>{AuthOpen = true; AuthIndex = 0; CurAuthIndex = 0}} class="m-item">
                                <LogInIcon size="15"/>
                                <span class="pl-2">Log In</span>
                            </button>
                        {/if}
                    </PopoverPanel>
                </Popover>
            </div>
        </div>
        <form class={`${ShowSearch ? "" : "hidden"} absolute top-0 right-0 py-2 px-4 bg-secondary-dark xs:hidden flex w-full`} on:submit|preventDefault={()=>{console.log(search);}}>
            <button on:click={()=>{ShowSearch = false; OptionsVisible = false}} class="pr-2 c-text">
                <ArrowLeftIcon />
            </button>
            <div class="flex flex-1 relative items-center focus-within:bg-secondary-light dark:focus-within:bg-secondary-dark px-2 bg-primary-light dark:bg-primary-dark border border-thirdary">

                <label hidden for="searchbar">search bar</label>
                <input size="20" class="peer h-8 flex-1 bg-inherit focus:outline-none" 
                placeholder="Search" name="searchbar" type="text" spellcheck="false" aria-haspopup="listbox" aria-activedescendant="selected" aria-autocomplete="list" aria-owns="searchbox" autocomplete="off"
                bind:value={search}
                on:keydown={(e)=>{sbkb(e)}}
                on:focusout={()=>{si = -1}}
                on:focus={()=>{if (search.replace(/\s/g, "") !== "") si = 0}}
                on:input={(e)=>{sbci(e)}}
                />
                {#if search}
                    <button on:click={()=>{search = ""}}>
                        <XIcon size="20"/>
                    </button> 
                {/if}

                <button on:click={()=> OptionsVisible = !OptionsVisible } class="ml-2">
                    <SlidersIcon size="16" />
                </button>
                    
                <ul role="listbox" id="searchbox" class="menu -left-px top-full -right-px absolute invisible peer-focus:visible">
                    {#each slist as slitem, i}
                        <li on:mouseenter={()=>{si = i}} role="option" aria-selected={si == i} class="aria-selected:bg-red-400 m-item">{slitem.text}</li>
                    {/each}
                </ul>
            </div>
            <button class="px-2 bg-thirdary hover:bg-neutral-700">
                <SearchIcon size="18"/>
            </button>

        </form>
        <div class={`${OptionsVisible ? "flex" : "hidden"} justify-center border-t border-thirdary pt-2 mt-2`}>
            <div class="flex xs:w-auto w-full xs:flex-row flex-col xs:space-y-0 space-y-6 xs:space-x-8">
                <div class="flex flex-col">
                    <span>POST DATE</span>
                    <span class="h-px my-1 bg-thirdary" />
                    <Listbox id="DateOptions" value={SelectedDateOption} on:change={(e)=>{SelectedDateOption = e.detail}} let:open 
                        class="relative">
                        <ListboxButton class="c-text flex text-left xs:w-32 w-full">
                            <span class="flex-1">{SelectedDateOption}</span>
                            <ChevronDownIcon />
                        </ListboxButton>
                        {#if open}
                            <div class="absolute right-0 left-0 z-10">
                                <ListboxOptions static class="menu" >
                                    {#each DateOptions as DateOption}
                                        <ListboxOption value={DateOption} let:active let:selected>
                                            <span class={`${active ? "bg-red-400" : " " } ${selected ? " bg-red-500 " : " "} flex items-center px-2`} >
                                                <span class="flex-1">{DateOption}</span>
                                                {#if selected}
                                                    <CheckIcon size="20"/>
                                                {/if}
                                                
                                            </span>
                                        </ListboxOption>
                                    {/each}
                                </ListboxOptions>
                            </div>
                        {/if}
                    </Listbox>
                </div>
                <div class="flex flex-col">
                    <span>SORT BY</span>
                    <span class="h-px my-1 bg-thirdary" />
                    <Listbox id="SortOptions" value={SelectedSortOption} on:change={(e)=>{SelectedSortOption = e.detail}} let:open 
                        class="relative">
                        <ListboxButton class="c-text flex text-left xs:w-32 w-full">
                            <span class="flex-1">{SelectedSortOption}</span>
                            <ChevronDownIcon />
                        </ListboxButton>
                        {#if open}
                            <div class="absolute right-0 left-0 z-10">
                                <ListboxOptions static class="menu" >
                                    {#each SortOptions as SortOption}
                                        <ListboxOption value={SortOption} let:active let:selected>
                                            <span class={`${active ? "bg-red-400" : " " } ${selected ? " bg-red-500 " : " "} flex items-center px-2`} >
                                                <span class="flex-1">{SortOption}</span>
                                                {#if selected}
                                                    <CheckIcon size="20"/>
                                                {/if}
                                                
                                            </span>
                                        </ListboxOption>
                                    {/each}
                                </ListboxOptions>
                            </div>
                        {/if}
                    </Listbox>
                </div>
                
                <div class="flex flex-col">
                    <div class="flex flex-col overflow-hidden">
                        <span class="flex items-center">
                            <span class="flex-1">REQUIRED TAGS</span>
                            <button on:click={()=>{AdditionalTags = []}}>
                                <XIcon class="c-text" size="20" />
                            </button>
                        </span>
                        <span class="h-px my-1 bg-thirdary"/>
                    </div>
                    
                    <div class="flex flex-wrap items-start w-full xs:h-6 xs:w-48 overflow-y-auto">
                        {#each AdditionalTags as Tag}
                            <button class="c-text hover:bg-green-600 hover:line-through flex items-center text-sm px-2 bg-green-400 rounded-md space-x-2 overflow-x-clip whitespace-nowrap mb-1 mr-1" on:click={()=> AdditionalTags = AdditionalTags.filter(t => t != Tag)}>
                                <span>{Tag}</span>
                            </button>
                        {/each}
                    </div>
                </div>
                <form on:submit|preventDefault={() => {if (NewTag.replace(/^\s+|\s+$/gm,'')) AdditionalTags = [...new Set([...AdditionalTags, NewTag.replace(/^\s+|\s+$/gm,'')])]; NewTag = ""}} class="flex flex-col">
                    <span class="flex items-center space-x-2">
                        <label size="20" class="flex-1" for="TagOptions">ADD TAG</label> 
                        <!-- <InfoIcon size="16" /> -->
                    </span>
                    <span class="h-px my-1 bg-thirdary" />
                    <div class="flex bg-primary-dark items-center">
                        <input bind:value={NewTag} id="TagOptions" name="TagOptions" autocomplete="off" type="text" class="bg-inherit px-1 xs:w-40 w-full outline-none" >
                        <button type="submit" class="px-1">
                            <PlusIcon class="c-text" size="20"/>
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    </header>
</div>

  

<slot />
