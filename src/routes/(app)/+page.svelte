<script lang="ts">
    import Postresult from '$lib/postresult.svelte'
    import { page } from '$app/stores'
    import { goto, invalidateAll } from '$app/navigation'

    $: results = $page.data
    $: console.log(results)

    //export let data
    //export let form
    //console.log(form)

    // $: results = form
    //     ? { type: form.type, data: form.data }
    //     : { type: data.type, data: data.posts }

    // Search bar

    // $: searchString = getSearchString()
    // let ShowSearch = false
    // let MobileSearch: HTMLElement
    // let search = ''
    // let si = 0
    // let cslist = [{ text: 'Search Posts' }, { text: 'Search Users' }]

    // function sbkb(e: any) {
    //     switch (e.keyCode) {
    //         case 38:
    //             si--
    //             e.preventDefault()
    //             break
    //         case 40:
    //             si++
    //             e.preventDefault()
    //             break
    //     }
    //     si = Math.min(Math.max(si, 0), slist.length - 1)
    // }
    // function sbci(e: any) {
    //     search.replace(/\s/g, '')
    // }

    // function getSearchString() {
    //     var params = new URLSearchParams()
    //     params.set('search', search)
    //     //params.set("date", SelectedDateOption)
    //     //params.set("sort", SelectedSortOption)
    //     params.set('post', si == 0 ? 'true' : 'false')
    //     var searchPath = '/' + '?' + params.toString()
    //     return searchPath
    // }

    // async function ShowMobileSearch() {
    //     ShowSearch = !ShowSearch
    //     console.log(MobileSearch)
    //     await tick()
    //     MobileSearch.focus()
    // }
    // // Search Options
    // let OptionsVisible = false

    // const DateOptions = ['All', 'Today', 'This Week', 'This Month']
    // let SelectedDateOption = DateOptions[0]

    // const SortOptions = ['Post Date', 'Comments', 'Rating']
    // let SelectedSortOption = SortOptions[0]

    // let AdditionalTags: string[] = []
    // let NewTag = ''
</script>

<svelte:head>
    <title>Main</title>
    <meta name="main page" content="main page content" />
    <html lang="en" />
</svelte:head>

<!-- <div class="my-2 h-8 px-4">
    <form
        class="mx-auto flex h-full w-full max-w-4xl"
        method="post"
        action="?/search"
        use:enhance
    >
        <div
            class="group relative flex flex-1 items-center border border-thirdary bg-primary-light px-2 focus-within:bg-secondary-light dark:bg-primary-dark dark:focus-within:bg-secondary-dark"
        >
            <input hidden name="type" value={si} />
            <label hidden for="search">search bar</label>
            <input
                size="16"
                class="peer h-full flex-1 bg-inherit focus:outline-none"
                placeholder="Search"
                name="search"
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
            <div
                id="searchbox"
                class="menu invisible absolute -left-px top-full -right-px z-10 outline-none hover:visible focus:visible peer-focus:visible"
            >
                {#each cslist as slitem, i}
                    <button
                        on:click={() => {
                            si = i
                        }}
                        id={i.toString()}
                        on:mousedown={() => {
                            si = i
                        }}
                        on:mousemove={(e) => {
                            si = i
                        }}
                        on:mouseenter={() => {
                            si = i
                        }}
                        aria-selected={si == i}
                        class="flex w-full items-center rounded-sm aria-selected:bg-red-400 "
                    >
                        <span class="w-full px-2 text-left">{slitem.text}</span>
                    </button>
                {/each}
            </div>

            {#if search}
                <button
                    on:click|preventDefault={() => {
                        search = ''
                    }}
                >
                    <XIcon size="20" />
                </button>
            {/if}

            <button on:click|preventDefault={()=> OptionsVisible = !OptionsVisible } class="ml-2">
                <SlidersIcon size="16" />
            </button>
            
        </div>
        <button class="bg-thirdary px-2 hover:bg-neutral-700">
            <SearchIcon size="18" />
        </button>
    </form>
</div> -->

<button
    on:click={async () => {
        await goto('/?post=false', { invalidateAll: true })
    }}
>
    go
</button>

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
        <span>test</span>
    {/if}
</div>
