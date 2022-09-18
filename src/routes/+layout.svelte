<script lang="ts">
    import "../app.css";
    import { Popover, PopoverButton, PopoverPanel } from "@rgossiaux/svelte-headlessui";
    import { AirplayIcon, AtSignIcon, ChevronDownIcon, BellIcon } from 'svelte-feather-icons'

    let search = "";
    let si = 0;

    function sbkb(e: any){
        switch (e.keyCode){
            case 38: console.log("up"); break;
            case 40: console.log("down"); break;
        }
    }
</script>
  
<div class="relative">
    <header class="flex p-4 bg-secondary text-white">
        <div class="h-item">
            <img class="max-w-none" width="32" height="32" src="inv2.svg" alt="logo">
        </div>
       
        <div class="h-item flex-auto">
            <div role="search" class="h-item search-container focus-within:flex-1 transition-all duration-300 ease-linear">
                <form class="w-full" on:submit|preventDefault={()=>{console.log(search);
                }}>
                    <label>
                        <input size="20" class="peer w-full rounded-sm focus:text-white focus:bg-secondary px-2 focus:outline-none bg-primary border border-thirdary transition-transform ease-linear" 
                        placeholder="Search" bind:value={search} type="text"
                        aria-activedescendant="selected" aria-autocomplete="list" aria-owns="searchbox"
                        on:keydown={(e)=>{sbkb(e)}}
                        on:focusout={()=>{console.log("focus out")}} on:focus={()=>{console.log("focus")}} />
                        
                        <ul role="listbox" id="searchbox" class="menu absolute overflow-hidden invisible peer-focus:visible">
                            <li role="option" aria-selected="false">test 1</li>
                            <li role="option">test 2</li>
                            <li role="option">test 3</li>
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
        <Popover class="relative h-item">
            <PopoverButton class="flex items-center bg-green-400 focus:bg-green-500 hover:bg-green-500 focus:text-zinc-200 hover:text-zinc-200 px-2 rounded-sm">
                    new
                    <ChevronDownIcon size="15" class="text-white ml-1"/>

            </PopoverButton>
          
            <PopoverPanel class="absolute right-0 top-8 z-10  w-screen max-w-xs">
              <div class="menu">
                <a class="m-item" href="/">Option 1</a>
                <a class="m-item" href="/">Option 2</a>
                <a class="m-item" href="/">Option 3</a>
                <a class="m-item" href="/">Option 4</a>
              </div>
            </PopoverPanel>
        </Popover>
        <Popover class="relative h-item">
            <PopoverButton class="focus:text-zinc-200 hover:text-zinc-200">
                <BellIcon size="20"/>
            </PopoverButton>
          
            <PopoverPanel class="absolute right-0 top-8 z-10  w-screen max-w-xs">
              <div class="menu px-4">
                No new notifactions
              </div>
            </PopoverPanel>
        </Popover>
        <div class="h-item flex">
            <div class=" rounded-full bg-white h-8 w-8"/>
            <!-- Profile Icon Here -->
        </div>
    </header>
</div>


<slot />

<style>
    .search-container{
        min-width: 15rem;
        max-width: 30rem;
    }
</style>