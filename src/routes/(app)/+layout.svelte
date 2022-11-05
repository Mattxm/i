<script lang="ts">
    import '$lib/app.css'
    import { page } from '$app/stores'
    import { signedIn, currentUser } from '$lib/userStore'
    import { supabase, signOut } from '$lib/supabaseClient'
    import Signup from '$lib/signup.svelte'
    import Login from '$lib/login.svelte'
    import { enhance } from '$app/forms'

    import {
        Listbox,
        ListboxButton,
        ListboxOptions,
        ListboxOption,
        Popover,
        PopoverButton,
        PopoverPanel,
        Dialog,
        DialogOverlay,
        DialogDescription,
        DialogTitle,
        Tab,
        TabGroup,
        TabList,
        TabPanel,
        TabPanels,
    } from '@rgossiaux/svelte-headlessui'
    import {
        CheckIcon,
        MoonIcon,
        SunIcon,
        ChevronDownIcon,
        BellIcon,
        Minimize2Icon,
        TargetIcon,
        SettingsIcon,
        XIcon,
        SlidersIcon,
        UserIcon,
        DollarSignIcon,
        LogOutIcon,
        PlusSquareIcon,
        FolderPlusIcon,
        ZapIcon,
        LogInIcon,
        SearchIcon,
        PlusCircleIcon,
        InfoIcon,
        PlusIcon,
        ArrowLeftIcon,
        ChevronUpIcon,
    } from 'svelte-feather-icons'
    import { onMount, tick } from 'svelte'
    import { goto, invalidateAll } from '$app/navigation'

    onMount(() => {
        currentUser.reset()
        signedIn.reset()
        if (
            !('theme' in localStorage) &&
            window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
            userTheme = Theme.System
            darktheme = true
        } else {
            userTheme = Theme.System
            darktheme = false
        }
        if (localStorage.theme === 'dark') {
            userTheme = Theme.Dark
            darktheme = true
        }
        if (localStorage.theme === 'light') {
            userTheme = Theme.Light
            darktheme = false
        }
    })

    // Auth

    let AuthOpen = false
    let AuthIndex = 0
    let CurAuthIndex = AuthIndex

    // Theme
    enum Theme {
        System = 1,
        Light,
        Dark,
    }
    let darktheme = false
    let userTheme = Theme.System
    function handleThemeChange() {
        if (!document || !window) return
        userTheme++
        if (userTheme > 3) userTheme = 1
        switch (userTheme) {
            case Theme.System:
                localStorage.removeItem('theme')
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.documentElement.classList.add('dark')
                    darktheme = true
                } else {
                    document.documentElement.classList.remove('dark')
                    darktheme = false
                }
                break
            case Theme.Dark:
                darktheme = true
                document.documentElement.classList.add('dark')
                localStorage.theme = 'dark'
                break
            case Theme.Light:
                darktheme = false
                document.documentElement.classList.remove('dark')
                localStorage.theme = 'light'
                break
        }
    }

    // Notifications
    let nlist = [{ text: 'New Message from X' }]
    $: notifications = nlist.length

    // Search bar

    let ShowSearch = false
    let MobileSearch: HTMLElement
    let search = ''
    let si = 0
    let cslist = [{ text: 'Search Posts' }, { text: 'Search Users' }]
    let pslist = [
        { text: 'Option 1' },
        { text: 'Option 2' },
        { text: 'Option 3' },
    ]
    $: slist = [...cslist]
    function sbkb(e: any) {
        switch (e.keyCode) {
            case 38:
                si--
                e.preventDefault()
                break
            case 40:
                si++
                e.preventDefault()
                break
            case 13:
                e.preventDefault()
                break
        }
        si = Math.min(Math.max(si, 0), slist.length - 1)
    }
    function sbci(e: any) {
        search.replace(/\s/g, '')
    }

    function startSearch() {
        var params = new URLSearchParams()
        params.set('search', search)
        //params.set("date", SelectedDateOption)
        //params.set("sort", SelectedSortOption)
        params.set('post', si == 0 ? 'true' : 'false')
        var searchPath = '/' + '?' + params.toString()
        goto(searchPath, {})
    }

    async function ShowMobileSearch() {
        ShowSearch = !ShowSearch
        console.log(MobileSearch)
        await tick()
        MobileSearch.focus()
    }
    // Search Options
    let OptionsVisible = false

    const DateOptions = ['All', 'Today', 'This Week', 'This Month']
    let SelectedDateOption = DateOptions[0]

    const SortOptions = ['Post Date', 'Comments', 'Rating']
    let SelectedSortOption = SortOptions[0]

    let AdditionalTags: string[] = []
    let NewTag = ''
</script>

<Dialog
    open={AuthOpen}
    on:close={() => (AuthOpen = false)}
    as="div"
    class="fixed inset-0"
>
    <DialogOverlay class="fixed inset-0 z-0 bg-black bg-opacity-25" />
    <div
        class="pointer-events-none fixed inset-0 flex items-center justify-center overflow-y-auto"
    >
        <div
            class=" pointer-events-auto overflow-hidden rounded-md bg-secondary-light dark:bg-secondary-dark"
        >
            <DialogTitle class="px-4 py-2 text-center text-lg">
                {#if CurAuthIndex == 0}
                    Log In
                {:else}
                    Sign Up
                {/if}
            </DialogTitle>
            <DialogDescription class="hidden">
                {#if CurAuthIndex == 0}
                    Log in to an existing user.
                {:else}
                    Register a new user.
                {/if}
            </DialogDescription>
            <TabGroup
                defaultIndex={AuthIndex}
                manual
                on:change={(e) => (CurAuthIndex = e.detail)}
            >
                <TabList class="mx-4 space-x-4 text-sm">
                    <Tab
                        class={`${
                            CurAuthIndex == 0
                                ? 'border-b-2 border-thirdary dark:border-white'
                                : ''
                        } `}>Log In</Tab
                    >
                    <Tab
                        class={`${
                            CurAuthIndex == 1
                                ? 'border-b-2 border-thirdary dark:border-white'
                                : ''
                        } `}>Sign Up</Tab
                    >
                </TabList>
                <div class="mx-4 my-2 h-px bg-thirdary" />
                <TabPanels>
                    <TabPanel
                        ><Login
                            on:connection={() => {
                                AuthOpen = false
                            }}
                        /></TabPanel
                    >
                    <TabPanel
                        ><Signup
                            on:connection={() => {
                                AuthOpen = false
                            }}
                        /></TabPanel
                    >
                </TabPanels>
            </TabGroup>
        </div>
    </div>
</Dialog>

<div class="relative box-border">
    <a
        href="#main"
        class="absolute left-5 top-5 -z-50 bg-secondary-light text-black focus:z-50 dark:bg-secondary-dark dark:text-white"
    >
        Skip to main content
    </a>
    <header
        class="relative grid grid-cols-1 bg-secondary-light py-2 px-4 text-black dark:bg-secondary-dark dark:text-white"
    >
        <div class="flex h-7 w-full xs:flex">
            <div class="h-item">
                <!-- <img class="max-w-none" width="32" height="32" src="inv2.svg" alt="logo"> -->
                <a
                    class="flex items-center space-x-2 text-lg font-medium"
                    href="/"
                    data-sveltekit-prefetch
                >
                    <ZapIcon size="28" class="c-text" />
                    <span>INVOKE</span>
                </a>
            </div>
            <div class="h-item flex-1">
                <div class="hidden h-full w-full justify-center xs:flex">
                    <form
                        class="flex h-full w-full max-w-sm"
                        on:submit|preventDefault={startSearch}
                    >
                        <div
                            class="relative flex flex-1 items-center border border-thirdary bg-primary-light px-2 focus-within:bg-secondary-light dark:bg-primary-dark dark:focus-within:bg-secondary-dark"
                        >
                            <label hidden for="searchbar">search bar</label>
                            <input
                                size="16"
                                class="peer h-full flex-1 bg-inherit focus:outline-none"
                                placeholder="Search"
                                name="searchbar"
                                type="text"
                                spellcheck="false"
                                aria-haspopup="listbox"
                                aria-activedescendant="selected"
                                aria-autocomplete="list"
                                aria-owns="searchbox"
                                autocomplete="off"
                                bind:value={search}
                                on:keydown={(e) => {
                                    sbkb(e)
                                }}
                                on:focusout={() => {
                                    si = 0
                                }}
                                on:focus={() => {
                                    if (search.replace(/\s/g, '') !== '') si = 0
                                }}
                                on:input={(e) => {
                                    sbci(e)
                                }}
                            />
                            {#if search}
                                <button
                                    on:click|preventDefault={() => {
                                        search = ''
                                    }}
                                >
                                    <XIcon size="20" />
                                </button>
                            {/if}

                            <button
                                on:click|preventDefault={() =>
                                    (OptionsVisible = !OptionsVisible)}
                                class="ml-2"
                            >
                                <SlidersIcon size="16" />
                            </button>

                            <ul
                                role="listbox"
                                id="searchbox"
                                class="menu invisible absolute -left-px top-full -right-px z-10 peer-focus:visible"
                            >
                                {#each slist as slitem, i}
                                    <li
                                        id={i.toString()}
                                        on:mousedown={() => (si = i)}
                                        on:mousemove={() => {
                                            si = i
                                        }}
                                        on:mouseenter={() => {
                                            si = i
                                        }}
                                        role="option"
                                        aria-selected={si == i}
                                        class="flex items-center rounded-sm aria-selected:bg-red-400"
                                    >
                                        <button class="w-full px-2 text-left"
                                            >{slitem.text}</button
                                        >
                                    </li>
                                {/each}
                            </ul>
                        </div>
                        <button class="bg-thirdary px-2 hover:bg-neutral-700">
                            <SearchIcon size="18" />
                        </button>
                    </form>
                </div>
                <div class="h-item mr-4 xs:hidden">
                    <button
                        on:click={() => {
                            ShowMobileSearch()
                        }}
                    >
                        <SearchIcon class="c-text" size="20" />
                    </button>
                </div>

                <span class="flex-1" />
                <div class="h-item space-x-4">
                    {#if $signedIn == true}
                        <Popover
                            class="relative flex items-center justify-center"
                        >
                            <PopoverButton
                                class="h-7 items-center rounded-md p-0.5 transition-colors hover:bg-green-400"
                            >
                                <PlusSquareIcon />
                            </PopoverButton>
                            <PopoverPanel
                                class="menu absolute right-0 top-8 z-10 flex w-screen max-w-xxs flex-col"
                            >
                                <a href="/create" class="m-item">
                                    <PlusSquareIcon size="15" />
                                    <span class="pl-2">New Post</span>
                                </a>
                                <!-- <a href="/" class="m-item">
                                <FolderPlusIcon size="15"/>
                                <span class="pl-2">New Collection</span>
                            </a> -->
                            </PopoverPanel>
                        </Popover>
                        <Popover
                            class="relative flex items-center justify-center"
                        >
                            <PopoverButton class="h-7">
                                <BellIcon class="c-text" size="20" />
                                <span
                                    class={`${
                                        notifications > 0 ? 'visible' : 'hidden'
                                    } absolute -top-1 -right-1 rounded-full bg-red-400 px-1 text-xs`}
                                    >{notifications}</span
                                >
                            </PopoverButton>

                            <PopoverPanel
                                class="menu absolute right-0 top-8 z-10 w-screen max-w-xs"
                            >
                                <div class="flex items-center px-4">
                                    <span class="c-text flex-1"
                                        ><a href="/notifications"
                                            >Notifications</a
                                        ></span
                                    >
                                    <a href="/" class="c-text"
                                        ><SettingsIcon size="20" /></a
                                    >
                                </div>
                                <div class="my-1 mb-1 h-px bg-thirdary" />
                                {#if notifications == 0}
                                    <span class="px-4">No new notifactions</span
                                    >
                                {:else}
                                    {#each nlist as nlitem, i}
                                        <span class="flex items-center px-4">
                                            <span class="flex-1"
                                                >{nlitem.text}</span
                                            >
                                            <button
                                                on:click={() => {
                                                    nlist = [
                                                        ...nlist.slice(0, i),
                                                        ...nlist.slice(i + 1),
                                                    ]
                                                }}
                                                class="rounded-full hover:bg-red-400"
                                                ><XIcon size="20" /></button
                                            >
                                        </span>
                                    {/each}
                                {/if}
                            </PopoverPanel>
                        </Popover>
                    {:else if $signedIn == false}
                        <button
                            on:click={() => {
                                AuthOpen = true
                                AuthIndex = 0
                                CurAuthIndex = 0
                            }}
                            class="rounded-sm border border-thirdary bg-primary-light px-2 hover:bg-zinc-300 dark:bg-primary-dark dark:hover:bg-zinc-800"
                            >Log In</button
                        >
                        <button
                            on:click={() => {
                                AuthOpen = true
                                AuthIndex = 1
                                CurAuthIndex = 1
                            }}
                            class="rounded-sm border border-thirdary bg-primary-light px-2 hover:bg-zinc-300 dark:bg-primary-dark dark:hover:bg-zinc-800"
                            >Sign Up</button
                        >
                    {/if}
                    <Popover class="relative flex items-center justify-center">
                        <PopoverButton>
                            <div
                                class=" h-7 w-7 rounded-full border border-thirdary bg-white"
                            />
                        </PopoverButton>
                        <PopoverPanel
                            on:mousemove={() => {}}
                            class="menu absolute right-0 top-8 z-10 flex w-screen max-w-xxs flex-col leading-8"
                        >
                            {#if $signedIn == true}
                                <a
                                    href={`/user/${$currentUser?.username}`}
                                    class="m-item"
                                >
                                    <UserIcon size="15" />
                                    <span class="pl-2">Profile</span>
                                </a>

                                <span class="my-1 h-px bg-thirdary" />

                                <a href="/notifications" class="m-item">
                                    <BellIcon size="15" />
                                    <span class="pl-2">Notifications</span>
                                </a>

                                <!-- <a href="/" class="m-item">
                                <DollarSignIcon size="15"/>
                                <span class="pl-2">Earnings</span>
                            </a> -->

                                <span class="my-1 h-px bg-thirdary" />

                                <a href="/settings" class="m-item">
                                    <SettingsIcon size="15" />
                                    <span class="pl-2">Settings</span>
                                </a>
                            {/if}
                            <button
                                on:click={handleThemeChange}
                                class="m-item text-left"
                            >
                                {#if darktheme}
                                    <MoonIcon size="15" />
                                {:else}
                                    <SunIcon size="15" />
                                {/if}
                                <span class="ml-2 flex-1">Theme</span>
                                <span
                                    class="rounded-md border border-thirdary p-1 leading-3"
                                >
                                    {#if userTheme === Theme.System}
                                        Auto
                                    {:else if userTheme === Theme.Light}
                                        Light
                                    {:else}
                                        Dark
                                    {/if}
                                </span>
                            </button>

                            <span class="my-1 h-px bg-thirdary" />

                            {#if $signedIn}
                                <button on:click={signOut} class="m-item">
                                    <LogOutIcon size="15" />
                                    <span class="pl-2">Log Out</span>
                                </button>
                            {:else}
                                <button
                                    on:click={() => {
                                        AuthOpen = true
                                        AuthIndex = 0
                                        CurAuthIndex = 0
                                    }}
                                    class="m-item"
                                >
                                    <LogInIcon size="15" />
                                    <span class="pl-2">Log In</span>
                                </button>
                            {/if}
                        </PopoverPanel>
                    </Popover>
                </div>
            </div>
            <!-- 
        <form class={`${ShowSearch ? "" : "hidden"} bg-secondary-dark xs:hidden flex h-7 w-full`} on:submit|preventDefault={()=>{console.log(search);}}>
            <button on:click={()=>{ShowSearch = false; OptionsVisible = false}} class="pr-2 c-text">
                <ArrowLeftIcon />
            </button>
            
            <div class="flex flex-1 relative items-center focus-within:bg-secondary-light dark:focus-within:bg-secondary-dark px-2 bg-primary-light dark:bg-primary-dark border border-thirdary">

                <label hidden for="searchbar">search bar</label>
                <input bind:this={MobileSearch} size="20" class="peer h-full flex-1 bg-inherit focus:outline-none" 
                placeholder="Search" name="searchbar" type="text" spellcheck="false" aria-haspopup="listbox" aria-activedescendant="selected" aria-autocomplete="list" aria-owns="searchbox" autocomplete="off"
                bind:value={search}
                on:keydown={(e)=>{sbkb(e)}}
                on:focusout={()=>{si = 0}}
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
                    
                <ul role="listbox" id="searchbox" class="menu z-10 -left-px top-full -right-px absolute invisible peer-focus:visible">
                    {#each slist as slitem, i}
                        <li id={i.toString()} on:mousedown={()=>si = i} on:mousemove={()=>{si = i}} on:mouseenter={()=>{si = i}} role="option" aria-selected={si == i} class="aria-selected:bg-red-400 px-2 rounded-sm flex items-center">
                            <a href={getSearchString()}>{slitem.text}</a>
                        </li>
                    {/each}
                </ul>
            </div>
            <a href={getSearchString()} class="px-2 bg-thirdary hover:bg-neutral-700">
                <SearchIcon size="18"/>
            </a>


        </form>
        
        <div class={`${OptionsVisible ? "flex" : "hidden"} relative justify-center border-t border-thirdary pt-2 mt-2`}>
            <div class="flex md:w-auto w-full md:flex-row flex-col md:space-y-0 space-y-6 md:space-x-8">
                <div class="flex flex-col">
                    <span>POST DATE</span>
                    <span class="h-px my-1 bg-thirdary" />
                    <Listbox id="DateOptions" value={SelectedDateOption} on:change={(e)=>{SelectedDateOption = e.detail}} let:open 
                        class="relative">
                        <ListboxButton class="c-text flex text-left md:w-32 w-full">
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
                        <ListboxButton class="c-text flex text-left md:w-32 w-full">
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
                    
                    <div class="flex flex-wrap items-start w-full md:h-6 md:w-48 overflow-y-auto">
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
                        
                    </span>
                    <span class="h-px my-1 bg-thirdary" />
                    <div class="flex bg-primary-dark items-center">
                        <input bind:value={NewTag} id="TagOptions" name="TagOptions" autocomplete="off" type="text" class="bg-inherit px-1 md:w-40 w-full outline-none" >
                        <button type="submit" class="px-1">
                            <PlusIcon class="c-text" size="20"/>
                        </button>
                    </div>
                </form>
                <a href={getSearchString()} class="flex justify-center c-text md:hidden hover:bg-zinc-800 bg-primary-dark rounded-sm py-px border border-thirdary">
                    <span>Search</span>
                </a>
                
            </div>
        </div> 
        -->
        </div>
    </header>
</div>
<slot />
