<script lang="ts">
    import "$lib/app.css";
    import { signedIn } from '$lib/userStore'
    import { supabase } from '$lib/supabaseClient'
    import Signup from "$lib/signup.svelte";
    import Login from "$lib/login.svelte";

    import { Popover, PopoverButton, PopoverPanel, Dialog, DialogOverlay, DialogDescription, DialogTitle, Tab, TabGroup, TabList, TabPanel, TabPanels } from "@rgossiaux/svelte-headlessui";
    import { MoonIcon, SunIcon, ChevronDownIcon, BellIcon, Minimize2Icon, TargetIcon, SettingsIcon, XIcon, SlidersIcon, UserIcon, DollarSignIcon, LogOutIcon, PlusSquareIcon, FolderPlusIcon, ZapIcon, LogInIcon, SearchIcon, PlusCircleIcon } from 'svelte-feather-icons'
    import { onMount } from "svelte";

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
    <header class="flex py-2 px-4 bg-secondary-light dark:bg-secondary-dark text-black dark:text-white">
        <div class="h-item">
            <!-- <img class="max-w-none" width="32" height="32" src="inv2.svg" alt="logo"> -->
            <a class="flex items-center text-lg font-medium space-x-2" href="/" data-sveltekit-prefetch>
                <ZapIcon size="28" class="c-text"/>
                <span>INVOKE</span>
            </a>
        </div>
        <div class="h-item flex-1 justify-center">
            <form class="flex w-full h-full max-w-sm" on:submit|preventDefault={()=>{console.log(search);}}>
                <div class="flex flex-1 relative items-center focus-within:bg-secondary-light dark:focus-within:bg-secondary-dark px-2 bg-primary-light dark:bg-primary-dark border border-thirdary">
                        <label hidden for="searchbar">search bar</label>
                        <input size="20" class="peer h-full flex-1 bg-inherit focus:outline-none" 
                        placeholder="Search" name="searchbar" type="text" spellcheck="false" aria-haspopup="listbox" aria-activedescendant="selected" aria-autocomplete="list" aria-owns="searchbox"
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

            <!-- <nav class="h-item space-x-4">
                <a class="c-text" href="/" >Information</a>
                <a class="c-text" href="/" >Listings</a>
                <a class="c-text" href="/" >Services</a>
            </nav> -->
        </div>

        {#if $signedIn == true}
            <Popover class="relative h-item">
                <PopoverButton class="c-text flex items-center bg-green-400 focus:bg-green-500 hover:bg-green-500 p-0.5 rounded-md">
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
                                Auto
                            {:else if userTheme === Theme.Light}
                                Light
                            {:else}
                                Dark
                            {/if}
                        </span>
                    </button>                   

                    <span class="h-px my-1 bg-thirdary" />

                    <button on:click={signOut} class="m-item">
                        <LogOutIcon size="15"/>
                        <span class="pl-2">Log Out</span>
                    </button>
                </PopoverPanel>
            </Popover>
        {:else if $signedIn == false}
            <button on:click={()=> {AuthOpen = true; AuthIndex = 0; CurAuthIndex = 0}} class="bg-primary-light dark:bg-primary-dark hover:bg-zinc-300 dark:hover:bg-zinc-800 border border-thirdary px-2 rounded-md mr-2" >Log In</button>
            <button on:click={()=> {AuthOpen = true; AuthIndex = 1; CurAuthIndex = 1}} class="bg-primary-light dark:bg-primary-dark hover:bg-zinc-300 dark:hover:bg-zinc-800 border border-thirdary px-2 rounded-md" >Sign Up</button>
            
            <Popover class="relative h-item">
                <PopoverButton class="ml-2">
                    <UserIcon size="24"></UserIcon>
                </PopoverButton>
                <PopoverPanel on:mousemove={()=>{}} class="absolute right-0 top-8 flex flex-col menu max-w-xxs w-screen leading-8">
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

                    <button on:click={()=> {AuthOpen = true; AuthIndex = 0; CurAuthIndex = 0}} class="m-item">
                        <LogInIcon size="15"/>
                        <span class="pl-2">Log In</span>
                    </button>
                </PopoverPanel>
            </Popover>
        {:else}
            <span/>
        {/if}
        
    </header>
</div>

  

<slot />
