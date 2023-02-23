<script lang="ts">
    import {
        ArrowDownIcon,
        ArrowUpIcon,
        ChevronDownIcon,
        ChevronRightIcon,
        ChevronLeftIcon,
        ChevronsLeftIcon,
        ChevronsRightIcon,
        CheckIcon,
        FilterIcon,
        SlidersIcon,
        ChevronUpIcon,
        ThumbsUpIcon,
        ThumbsDownIcon,
        MaximizeIcon,
        Maximize2Icon,
        Minimize2Icon,
    } from 'svelte-feather-icons'
    import timeBetween from '$lib/timeBetween'
    export let post: any = {}
    $: tags = post.tags.split(',')
    $: commentcount = post.comments[0].count
    let expanded = false
</script>

<li
    class={`flex rounded-sm border-t border-thirdary bg-neutral-100 py-2 px-4 last:border-b dark:bg-neutral-800`}
>
    <div class="mr-4 flex w-8 flex-col items-center space-y-1 text-center">
        <ArrowUpIcon class="text-neutral-300 hover:text-green-400" />
        <div class="text-sm text-neutral-300">0</div>
        <ArrowDownIcon class="text-neutral-300 hover:text-red-400" />
    </div>
    <div class="flex w-full flex-col">
        <span class="flex w-full">
            <a
                href={`/post/${post.post_id}`}
                class="visited:text-neutral-800 hover:underline dark:visited:text-neutral-200"
                >{post.title}</a
            >
        </span>
        <span class="flex items-center space-x-1 text-sm text-neutral-300">
            <a
                href={`/user/${post.profiles.username}`}
                class="text-blue-400 hover:underline"
                >{post.profiles.username}</a
            >
            <div class="relative">
                <span class="peer">{timeBetween(post.created_at)}</span>
                <div class="tooltip">
                    <div class="whitespace-nowrap">
                        {new Date(post.created_at)}
                    </div>
                </div>
            </div>
        </span>
        <span class="text-sm text-neutral-300">
            <a href={`/post/${post.post_id}`} class=" hover:underline"
                >{commentcount == 1
                    ? `${commentcount} comment`
                    : `${commentcount} comments`}</a
            >
        </span>

        <ul class="flex flex-1 space-x-2">
            {#each tags as tag}
                <li
                    class="rounded-sm border border-green-300 px-1 text-center text-sm text-neutral-200"
                >
                    {tag}
                </li>
            {/each}
        </ul>

        <!-- <span class="flex">
            <ul class="mt-2 flex flex-1 space-x-2">
                {#each tags as tag}
                    <li
                        class="rounded-lg bg-green-500 px-2 text-center text-sm"
                    >
                        {tag}
                    </li>
                {/each}
            </ul>
            <div class="flex items-center align-middle">
                <button on:click={() => (expanded = !expanded)} class="text-neutral-300 text-sm">
                    {#if expanded}
                        <ChevronUpIcon/>
                    {:else}
                        <ChevronDownIcon/>
                    {/if}
                </button>
            </div>
        </span> -->
        <!-- 
        <div hidden={!expanded}>
            <div class="my-4 h-px bg-thirdary" />
            <p>
                {post.content}
            </p>
        </div> -->
    </div>

    <!-- <p class="hidden">{post.content}</p> -->
</li>
