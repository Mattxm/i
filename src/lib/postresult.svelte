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

<li class={`flex max-w-full border-t border-thirdary py-2 px-4 last:border-b`}>
    <div class="flex w-8 flex-col items-center space-y-1 pr-4 text-center">
        <ArrowUpIcon class="text-neutral-300 hover:text-green-400" />
        <div class="text-sm text-neutral-300">0</div>
        <ArrowDownIcon class="text-neutral-300 hover:text-red-400" />
    </div>
    <div class="flex flex-col overflow-hidden">
        <p
            class="break-words visited:text-neutral-800 hover:underline dark:visited:text-neutral-200"
        >
            <a href={`/post/${post.post_id}`}>{post.title}</a>
        </p>

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
            <ul class="flex flex-1">
                {#each tags as tag}
                    <li class="rounded-sm text-center text-sm ">
                        in <a
                            class="text-blue-400 hover:underline"
                            href={`?search=${tag}&post=true`}>{tag}</a
                        >
                    </li>
                {/each}
            </ul>
        </span>
        <span class="flex-1" />
        <span class="text-sm text-neutral-300">
            <a href={`/post/${post.post_id}`} class=" hover:underline"
                >{commentcount == 1
                    ? `${commentcount} comment`
                    : `${commentcount} comments`}</a
            >
        </span>

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

<style>
    .test {
        overflow-wrap: break-word;
    }
</style>
