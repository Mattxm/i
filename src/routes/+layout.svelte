<script lang="ts">
    import "../app.css";
    import { Switch, Popover, PopoverButton, PopoverPanel, Menu, MenuButton, MenuItems, MenuItem, } from "@rgossiaux/svelte-headlessui";
    import { MoonIcon, SunIcon, ChevronDownIcon, BellIcon, Minimize2Icon, TargetIcon, SettingsIcon, XIcon, SlidersIcon, UserIcon, DollarSignIcon, LogOutIcon } from 'svelte-feather-icons'

    // User
    let userelement: HTMLElement
    let darktheme = true

    // Notifications
    let nlist = [
        {text: "New Message from X"},
    ]
    $: notifications = nlist.length

    // New
    const alist = [
        {text: "New X"},
        {text: "New Y"},
        {text: "New Z"},
    ]

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
  
<div class="relative">
    <header class="flex p-4 bg-secondary text-white">
        <div class="h-item">
            <img class="max-w-none" width="32" height="32" src="inv2.svg" alt="logo">
        </div>
        <div class="h-item flex-auto">
            <div role="search" class="h-item relative search-container focus-within:flex-1 transition-all duration-300 ease-linear">
                <form class="w-full" on:submit|preventDefault={()=>{console.log(search);
                }}>
                    <label>
                        <input size="20" class="peer w-full rounded-sm focus:text-white focus:bg-secondary px-2 focus:outline-none bg-primary border border-thirdary transition-transform ease-linear" 
                        placeholder="Search" type="text" spellcheck="false" aria-haspopup="listbox" aria-activedescendant="selected" aria-autocomplete="list" aria-owns="searchbox"
                        bind:value={search}
                        on:keydown={(e)=>{sbkb(e)}}
                        on:focusout={()=>{si = -1}}
                        on:focus={()=>{if (search.replace(/\s/g, "") !== "") si = 0}}
                        on:input={(e)=>{sbci(e)}}
                        />
                        
                        <ul role="listbox" id="searchbox" class="menu left-0 right-0 absolute invisible peer-focus:visible">
                            {#each slist as slitem, i}
                                <li on:mouseenter={()=>{si = i}} role="option" aria-selected={si == i} class="aria-selected:bg-red-400 px-4">{slitem.text}</li>
                            {/each}
                        </ul>    
                    </label>
                </form>
            </div>
            <nav class="h-item space-x-4">
                <a class="focus:text-zinc-200 hover:text-zinc-200" href="/" >Section 1</a>
                <a class="focus:text-zinc-200 hover:text-zinc-200" href="/" >Section 2</a>
                <a class="focus:text-zinc-200 hover:text-zinc-200" href="/" >Section 3</a>
            </nav>
        </div>
        <Menu class="relative h-item">
            <MenuButton class="flex items-center bg-green-400 focus:bg-green-500 hover:bg-green-500 focus:text-zinc-200 hover:text-zinc-200 px-2 rounded-sm">
                new
                <ChevronDownIcon size="15" class="text-white ml-1"/>
            </MenuButton>
            <MenuItems class="absolute right-0 top-8 flex flex-col menu max-w-xxs w-screen">
                {#each alist as alitem}
                    <MenuItem let:active>
                        <div class={`${active ? "bg-red-400" : ""} px-4`}>
                            <a href="/">{alitem.text}</a>
                        </div>
                    </MenuItem>
                {/each}
            </MenuItems>
        </Menu>
        <Popover class="relative h-item">
            <PopoverButton class="focus:text-zinc-200 hover:text-zinc-200">
                <BellIcon size="20"/>
                <span class={`${notifications > 0 ? "visible" : "hidden"} absolute text-xs px-1 top-0 -right-1 bg-red-400 rounded-full`}>{notifications}</span>
            </PopoverButton>
          
            <PopoverPanel class="absolute menu right-0 top-8 w-screen max-w-xs">
                <div class="flex px-4 items-center border-b border-thirdary">
                    <span class="flex-1"><a href="/notifications" class="focus:text-zinc-200 hover:text-zinc-200 leading-8">Notifications</a></span>
                    <a href="/" class="hover:text-zinc-200"><SettingsIcon size="20"/></a>
                </div>
                {#if notifications == 0}
                    <span class="px-4">No new notifactions</span>
                {:else}
                    {#each nlist as nlitem, i}
                        <span class="flex items-center px-4">
                            <span class="flex-1">{nlitem.text}</span>
                            <span on:click={()=>{nlist = [...nlist.slice(0, i),...nlist.slice(i+1)]}} class="hover:bg-red-400 p-0.5 rounded-full"><XIcon size="20"/></span>
                        </span>
                    {/each}
                {/if}
                
                
            </PopoverPanel>
        </Popover>
        <Menu class="relative h-item">
            <MenuButton as="div"  class="">
                <div bind:this={userelement} class=" rounded-full bg-white h-7 w-7"/>
            </MenuButton>
            <MenuItems class="absolute right-0 top-8 flex flex-col menu max-w-xxs w-screen leading-8 text-sm">
                <MenuItem let:active>
                    <div class={`${active ? "bg-red-400" : ""} px-4 flex items-center border-b border-thirdary`}>
                        <UserIcon size="15"/>
                        <a href="/" class="pl-2">Profile</a>
                    </div>
                </MenuItem>
                <MenuItem let:active>
                    <div class={`${active ? "bg-red-400" : ""} px-4 flex items-center`}>
                        <BellIcon size="15"/>
                        <a href="/" class="pl-2">Notifications</a>
                    </div>
                </MenuItem>
                <MenuItem let:active>
                    <div class={`${active ? "bg-red-400" : ""} px-4 flex items-center`}>
                        <DollarSignIcon size="15"/>
                        <a href="/" class="pl-2">Earnings</a>
                    </div>
                </MenuItem>
                <MenuItem let:active>
                    <div class={`${active ? "bg-red-400" : ""} px-4 flex items-center border-t border-thirdary`}>
                        <SettingsIcon size="15"/>
                        <a href="/" class="pl-2">Settings</a>
                    </div>
                </MenuItem>
                <MenuItem let:active on:click={()=>{setTimeout(() => {userelement.click()}, 0);}}>
                    <div class={`${active ? "bg-red-400" : ""} px-4 flex items-center`}>
                        {#if darktheme}
                            <MoonIcon size="15"/>
                        {:else}
                            <SunIcon size="15"/>
                        {/if}
                        
                        <a href="/" class="pl-2 flex-1">Theme</a>
                        <Switch
                        checked={darktheme}
                        on:change={(e)=>{darktheme = e.detail}}
                        class={`${darktheme ? "bg-red-400" : "bg-green-400"} relative inline-flex h-4 w-7 items-center rounded-full`}
                        >
                        <span class={`${darktheme ? "translate-x-3" : "translate-x-1"} bg-white inline-block h-3 w-3 items-center rounded-full transition-transform`} />
                        </Switch>
                    </div>
                </MenuItem>    
                <MenuItem let:active>
                    <div class={`${active ? "bg-red-400" : ""} px-4 flex items-center border-t border-thirdary`}>
                        <LogOutIcon size="15"/>
                        <a href="/" class="pl-2">Log Out</a>
                    </div>
                </MenuItem>                   
            </MenuItems>
        </Menu>
    </header>
</div>

  

<slot />

<style>
    .search-container{
        min-width: 15rem;
        max-width: 30rem;
    }
</style>