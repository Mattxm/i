<script>
    import timeBetween from "$lib/timeBetween"
    import { LinkIcon, ShareIcon, SquareIcon, ThumbsDownIcon, ThumbsUpIcon } from "svelte-feather-icons";
    import Comment from "$lib/comment.svelte"
    import {marked} from 'marked'

    let source = ``;
    //marked.setOptions({gfm:true})
    $: markdown = marked.parse(source)

    

    export let data
    let post = data.post
    let dateposted = new Date(post.created_at).toLocaleString()
    let ShowPreview = false;
</script>

<div class="flex md:px-4 px-2 max-w-4xl mx-auto min-h-screen">
    <div class="flex flex-1 flex-col mt-4">
        <span class="flex text-sm text-neutral-400">
            <span class="">
                Created by 
                <a href={`/user/${post.profiles.username}`}>
                    {post.profiles.username}
                </a>
                - {timeBetween(post.created_at)}
            </span>
        </span>
        <span class="pb-2 text-lg">{post.title}</span>
        <p class="">{post.content}</p>
        {#each post.tags as Tag}
            <div class="mr-2 text-sm">{Tag}</div>        
        {/each}
        

        <span class="flex space-x-4 items-center mt-4">
            <button class="flex items-center secondary-text">
                <ThumbsUpIcon size="16"/>
            </button>
            <button class="flex items-center secondary-text">
                <ThumbsDownIcon size="16"/>
            </button>
            <button on:click={()=>{navigator.clipboard.writeText(window.location.href)}} class="flex items-center secondary-text">
                <LinkIcon size="16" />
            </button>
            <button on:click={()=>{document.getElementById("comments")?.scrollIntoView(true)}} class="flex items-center secondary-text">
                <SquareIcon size="16" />  <span class="ml-2 text-sm">{post.comments.length} comments</span>
            </button>
        </span>
        
        
        <div class="bg-thirdary h-px my-4" />    

        <div class="flex">
            <form on:submit|preventDefault={()=>{}} class="flex flex-col w-full px-4 break-words">
                <label for="commentbox">Post a comment</label>
                <textarea bind:value={source} name="commentbox" placeholder="" rows="4"
                class="box-border overflow-hidden outline-none px-1 border-thirdary border text-black dark:text-white bg-primary-light dark:bg-primary-dark"/>
                <span class="w-full text-right space-x-2 text-sm mt-2">
                    <button on:click|preventDefault={()=>{ShowPreview = !ShowPreview}} class="">{`${ShowPreview ? "Hide" : "Show"} Preview`}</button>
                    <button class="">Comment</button>
                </span>
            </form>
        </div>
        
        <div hidden={!ShowPreview} class="markdown max-w-full break-all w-full py-4 bg-neutral-800 px-4 mt-4 rounded-sm">
            <span>Comment Preview</span>
            <div class="bg-thirdary h-px mb-4" /> 
            {@html markdown}
        </div>

        <div id="comments" class="space-y-2 mt-4">
            <span>Comments</span>
            
            {#each post.comments as comment}
                <Comment comment={comment}/>
            {/each}
        </div>
    </div>    
</div>

