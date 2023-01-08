<script lang="ts">
    import '$lib/app.css'
    import { page } from '$app/stores'
    import { supabase, signOut } from '$lib/supabaseClient'
    import Signup from '$lib/signup.svelte'
    import Login from '$lib/login.svelte'

    import {
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
        MoonIcon,
        SunIcon,
        BellIcon,
        SettingsIcon,
        XIcon,
        SlidersIcon,
        UserIcon,
        LogOutIcon,
        PlusSquareIcon,
        ZapIcon,
        LogInIcon,
        SearchIcon,
        ArrowLeftIcon,
        MailIcon,
    } from 'svelte-feather-icons'
    import { onMount, tick } from 'svelte'
    import { goto, invalidateAll, invalidate } from '$app/navigation'
    import Notification from '$lib/notification.svelte'

    let innerWidth = window.innerWidth
    $: {
        if (innerWidth >= 600) ShowSearch = false
        else if (innerWidth < 600 && SearchBar == document.activeElement)
            ShowSearch = true
    }

    onMount(() => {
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
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
            invalidate('supabase:auth')
        })
        return () => {
            subscription.unsubscribe()
        }
    })

    // Auth

    let AuthOpen = false
    let AuthIndex = 0
    let CurAuthIndex = AuthIndex

    $: if ($page.data.session) {
        GetNotifications()
    }

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
    let nlist: any = []
    let ncount = 0

    async function GetNotifications() {
        let { data: notifications, error } = await supabase
            .from('notifications')
            .select(
                'created_at, id, ref_post_id, ref_comment_id, announcement, read, context, message, link, profiles:res_user_id(username, avatar_url)'
            )
            .order('created_at', { ascending: false })

        nlist = notifications
        ncount = 0
        nlist.forEach((e) => {
            if (e?.read == false) ncount++
        })
    }
    async function MarkAllRead() {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', $page.data.session?.user.id)
        if (error) console.log(error)
        else GetNotifications()
    }

    // Search bar

    let ShowSearch = false
    let ShowSearchSuggestions = false
    let SearchBar: HTMLElement
    let search = ''
    let si = 0
    let cslist = [{ text: 'Search Posts' }, { text: 'Search Users' }]
    function sbkb(e: any) {
        ShowSearchSuggestions = true
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
                ShowSearchSuggestions = false
                startSearch()
                break
        }
        si = Math.min(Math.max(si, 0), cslist.length - 1)
    }

    async function startSearch() {
        var params = new URLSearchParams()
        params.set('search', search)
        //params.set("date", SelectedDateOption)
        //params.set("sort", SelectedSortOption)
        params.set('post', si == 0 ? 'true' : 'false')
        var searchPath = '/' + '?' + params.toString()
        await goto(searchPath, { invalidateAll: true })
    }

    async function ShowMobileSearch() {
        ShowSearch = !ShowSearch
        await tick()
        SearchBar.focus()
    }
    // Search Options
    // let OptionsVisible = false

    // const DateOptions = ['All', 'Today', 'This Week', 'This Month']
    // let SelectedDateOption = DateOptions[0]

    // const SortOptions = ['Post Date', 'Comments', 'Rating']
    // let SelectedSortOption = SortOptions[0]

    // let AdditionalTags: string[] = []
    // let NewTag = ''
</script>

<svelte:window bind:innerWidth />

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
        class="absolute left-0 -top-full z-50 ml-2 mt-2 bg-secondary-light text-black focus:visible focus:top-0 focus:z-50 dark:bg-secondary-dark dark:text-white"
    >
        skip to main content
    </a>
    <header
        class="relative grid grid-cols-1 bg-secondary-light py-2 px-4 text-black dark:bg-secondary-dark dark:text-white"
    >
        <div class={`flex h-7 w-full`}>
            <div class={`${ShowSearch && 'hidden'} h-item`}>
                <!-- <img class="max-w-none" width="32" height="32" src="inv2.svg" alt="logo"> -->
                <a
                    class="flex items-center space-x-2 text-lg font-medium"
                    href="/"
                >
                    <ZapIcon size="28" class="c-text" />
                    <span>INVOKE</span>
                </a>
            </div>

            <div
                class={`${
                    innerWidth < 600 && !ShowSearch && 'hidden'
                } flex h-full w-full justify-center focus:flex xs:mr-2`}
            >
                <button
                    hidden={!ShowSearch}
                    on:click={() => {
                        ShowSearch = false
                    }}
                    class="c-text pr-2"
                >
                    <ArrowLeftIcon />
                </button>
                <form
                    class="flex h-full w-full xs:max-w-sm"
                    on:submit|preventDefault={startSearch}
                >
                    <div
                        class="relative flex flex-1 items-center border border-thirdary bg-primary-light px-2 focus-within:bg-secondary-light dark:bg-primary-dark dark:focus-within:bg-secondary-dark"
                    >
                        <label hidden for="searchbar">search bar</label>
                        <input
                            bind:this={SearchBar}
                            size="16"
                            class="peer h-full flex-1 bg-inherit focus:outline-none"
                            placeholder="Search"
                            name="searchbar"
                            type="text"
                            spellcheck="false"
                            aria-haspopup="listbox"
                            aria-activedescendant="selected"
                            aria-owns="searchbox"
                            autocomplete="off"
                            bind:value={search}
                            on:keydown={(e) => {
                                sbkb(e)
                            }}
                            on:focusout={(e) => {
                                si = 0
                                ShowSearchSuggestions = false
                            }}
                            on:focus={() => {
                                if (search.replace(/\s/g, '') !== '') si = 0
                                if (search) ShowSearchSuggestions = true
                            }}
                        />
                        {#if search}
                            <button
                                on:click|preventDefault={() => {
                                    search = ''
                                    ShowSearchSuggestions = false
                                }}
                            >
                                <XIcon size="20" />
                            </button>
                        {/if}

                        <!-- 
                            <button
                                on:click|preventDefault={() =>
                                    (OptionsVisible = !OptionsVisible)}
                                class="ml-2"
                            >
                                <SlidersIcon size="16" />
                            </button> 
                        -->

                        <ul
                            role="listbox"
                            id="searchbox"
                            class={`${
                                ShowSearchSuggestions ? 'visible' : 'invisible'
                            } menu absolute -left-px top-full -right-px z-10`}
                        >
                            {#each cslist as slitem, i}
                                <li
                                    on:select={(e) => {
                                        console.log(e)
                                    }}
                                    id={i.toString()}
                                    on:mousedown={() => {
                                        si = i
                                        startSearch()
                                    }}
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
                                    <p class="w-full px-2 text-left">
                                        {slitem.text}
                                    </p>
                                </li>
                            {/each}
                        </ul>
                    </div>
                    <button class="bg-thirdary px-2 hover:bg-neutral-700">
                        <SearchIcon size="18" />
                    </button>
                </form>
            </div>
            <span class="flex-1" />
            <div class={`${ShowSearch && 'hidden'} h-item mr-4 xs:hidden`}>
                <button
                    on:click={() => {
                        ShowMobileSearch()
                    }}
                >
                    <SearchIcon class="c-text" size="20" />
                </button>
            </div>

            <div class={`${ShowSearch && 'hidden'} h-item space-x-4`}>
                {#if $page.data.session}
                    <Popover class="relative flex items-center justify-center">
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
                    <Popover class="relative flex items-center justify-center">
                        <PopoverButton class="h-7">
                            <!-- on:click={GetNotifications} -->
                            <BellIcon class="c-text" size="20" />
                            <span
                                class={`${
                                    ncount > 0 ? 'visible' : 'hidden'
                                } absolute -top-1 -right-1 rounded-full bg-red-400 px-1 text-xs`}
                                >{ncount}</span
                            >
                        </PopoverButton>

                        <PopoverPanel
                            class="menu absolute right-0 top-8 z-10 w-screen max-w-xs"
                        >
                            <div class="flex items-center space-x-2 px-2">
                                <span class=" flex-1"
                                    ><a class="c-text" href="/notifications"
                                        >Notifications</a
                                    ></span
                                >
                                <button on:click={MarkAllRead} class="c-text">
                                    <MailIcon size="20" />
                                </button>
                                <a href="/" class="c-text"
                                    ><SettingsIcon size="20" /></a
                                >
                            </div>
                            <div class="my-1 mb-1 h-px bg-thirdary" />
                            {#if nlist.length == 0}
                                <span class="px-2">No new notifactions</span>
                            {:else}
                                <ul>
                                    {#each nlist as nlitem}
                                        <Notification
                                            on:delete={GetNotifications}
                                            notification={nlitem}
                                        />
                                    {/each}
                                </ul>
                            {/if}
                        </PopoverPanel>
                    </Popover>
                {:else}
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
                            class=" h-7 w-7 rounded-full bg-thirdary  dark:bg-white"
                        >
                            <img
                                class="rounded-full p-0.5"
                                alt="user avatar"
                                src={$page.data.currentUser?.avatar_url}
                            />
                        </div>
                    </PopoverButton>
                    <PopoverPanel
                        on:mousemove={() => {}}
                        class="menu absolute right-0 top-8 z-10 flex w-screen max-w-xxs flex-col leading-8"
                    >
                        {#if $page.data.session}
                            <a
                                href={`/user/${
                                    $page.data.currentUser?.username ?? ''
                                }`}
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

                        {#if $page.data.session}
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

            <!-- <div
                class={`${
                    OptionsVisible ? 'flex' : 'hidden'
                } relative mt-2 justify-center border-t border-thirdary pt-2`}
            >
                <div
                    class="flex w-full flex-col space-y-6 md:w-auto md:flex-row md:space-y-0 md:space-x-8"
                >
                    <div class="flex flex-col">
                        <span>POST DATE</span>
                        <span class="my-1 h-px bg-thirdary" />
                        <Listbox
                            id="DateOptions"
                            value={SelectedDateOption}
                            on:change={(e) => {
                                SelectedDateOption = e.detail
                            }}
                            let:open
                            class="relative"
                        >
                            <ListboxButton
                                class="c-text flex w-full text-left md:w-32"
                            >
                                <span class="flex-1">{SelectedDateOption}</span>
                                <ChevronDownIcon />
                            </ListboxButton>
                            {#if open}
                                <div class="absolute right-0 left-0 z-10">
                                    <ListboxOptions static class="menu">
                                        {#each DateOptions as DateOption}
                                            <ListboxOption
                                                value={DateOption}
                                                let:active
                                                let:selected
                                            >
                                                <span
                                                    class={`${
                                                        active
                                                            ? 'bg-red-400'
                                                            : ' '
                                                    } ${
                                                        selected
                                                            ? ' bg-red-500 '
                                                            : ' '
                                                    } flex items-center px-2`}
                                                >
                                                    <span class="flex-1"
                                                        >{DateOption}</span
                                                    >
                                                    {#if selected}
                                                        <CheckIcon size="20" />
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
                        <span class="my-1 h-px bg-thirdary" />
                        <Listbox
                            id="SortOptions"
                            value={SelectedSortOption}
                            on:change={(e) => {
                                SelectedSortOption = e.detail
                            }}
                            let:open
                            class="relative"
                        >
                            <ListboxButton
                                class="c-text flex w-full text-left md:w-32"
                            >
                                <span class="flex-1">{SelectedSortOption}</span>
                                <ChevronDownIcon />
                            </ListboxButton>
                            {#if open}
                                <div class="absolute right-0 left-0 z-10">
                                    <ListboxOptions static class="menu">
                                        {#each SortOptions as SortOption}
                                            <ListboxOption
                                                value={SortOption}
                                                let:active
                                                let:selected
                                            >
                                                <span
                                                    class={`${
                                                        active
                                                            ? 'bg-red-400'
                                                            : ' '
                                                    } ${
                                                        selected
                                                            ? ' bg-red-500 '
                                                            : ' '
                                                    } flex items-center px-2`}
                                                >
                                                    <span class="flex-1"
                                                        >{SortOption}</span
                                                    >
                                                    {#if selected}
                                                        <CheckIcon size="20" />
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
                                <button
                                    on:click={() => {
                                        AdditionalTags = []
                                    }}
                                >
                                    <XIcon class="c-text" size="20" />
                                </button>
                            </span>
                            <span class="my-1 h-px bg-thirdary" />
                        </div>

                        <div
                            class="flex w-full flex-wrap items-start overflow-y-auto md:h-6 md:w-48"
                        >
                            {#each AdditionalTags as Tag}
                                <button
                                    class="c-text mb-1 mr-1 flex items-center space-x-2 overflow-x-clip whitespace-nowrap rounded-md bg-green-400 px-2 text-sm hover:bg-green-600 hover:line-through"
                                    on:click={() =>
                                        (AdditionalTags = AdditionalTags.filter(
                                            (t) => t != Tag
                                        ))}
                                >
                                    <span>{Tag}</span>
                                </button>
                            {/each}
                        </div>
                    </div>
                    <form
                        on:submit|preventDefault={() => {
                            if (NewTag.replace(/^\s+|\s+$/gm, ''))
                                AdditionalTags = [
                                    ...new Set([
                                        ...AdditionalTags,
                                        NewTag.replace(/^\s+|\s+$/gm, ''),
                                    ]),
                                ]
                            NewTag = ''
                        }}
                        class="flex flex-col"
                    >
                        <span class="flex items-center space-x-2">
                            <label size="20" class="flex-1" for="TagOptions"
                                >ADD TAG</label
                            >
                        </span>
                        <span class="my-1 h-px bg-thirdary" />
                        <div class="flex items-center bg-primary-dark">
                            <input
                                bind:value={NewTag}
                                id="TagOptions"
                                name="TagOptions"
                                autocomplete="off"
                                type="text"
                                class="w-full bg-inherit px-1 outline-none md:w-40"
                            />
                            <button type="submit" class="px-1">
                                <PlusIcon class="c-text" size="20" />
                            </button>
                        </div>
                    </form>
                    <button
                        on:click={startSearch}
                        class="c-text flex justify-center rounded-sm border border-thirdary bg-primary-dark py-px hover:bg-zinc-800 md:hidden"
                    >
                        <span>Search</span>
                    </button>
                </div>
            </div> -->
        </div>
    </header>
</div>
<slot />
