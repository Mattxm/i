<script>
    import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon, ChevronsLeftIcon, ChevronsRightIcon, CheckIcon, FilterIcon, SlidersIcon, ChevronUpIcon } from "svelte-feather-icons";
    import timeBetween from "$lib/timeBetween"
    export let post = {}
    $: commentcount = post.comments[0].count
    let expanded = false;
</script>


<li class="flex flex-col bg-neutral-100 dark:bg-neutral-800 py-2 px-4 rounded-sm border-t border-thirdary" >
    
    <div class="flex flex-col w-full max-w-4xl mx-auto">
        <span class="flex w-full">
            <a href={`/post/${post.post_id}`} class="flex-1 hover:underline visited:text-neutral-900 dark:visited:text-neutral-200">{post.title}</a>
            <span class="flex items-center space-x-2 text-sm text-neutral-400">
                <a href={`/user/${post.profiles.username}`} class="" >{post.profiles.username}</a>
                <span class="" >{timeBetween(post.created_at)}</span>
            </span>
        </span>
        
        <a href={`/post/${post.post_id}`} class="text-sm text-neutral-400 hover:underline">{commentcount == 1 ? `${commentcount} comment` : `${commentcount} comments`}</a>

        <span class="flex">
            <ul class="flex-1 flex space-x-2 mt-1">
                {#each post.tags as tag}
                    <li class="bg-green-500 text-center px-2 rounded-lg text-sm" >
                        {tag}
                    </li>
                {/each}
            </ul>
            <div class="flex items-center align-middle" >
                <button on:click={()=> expanded = !expanded} class="c-text" >
                    {#if expanded}
                        <ChevronUpIcon/>
                    {:else}
                        <ChevronDownIcon/>
                    {/if}
                </button>
            </div>
        </span> 
        
        <div hidden={!expanded}>
            <div class="bg-thirdary h-px my-4" />
            <p>
                {post.content}
            </p>
        </div>  
    </div>
    
    
    <p class="hidden" >{post.content}</p>
</li>