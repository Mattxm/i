<script>
    import timeBetween from "$lib/timeBetween"
    import { MinimizeIcon } from "svelte-feather-icons";

    export let comment = {
        profiles: {username: "", avatar_url: ""},
        content: "",
        created_at: Date(),
    }

    let open = true
    let collapsed = false;
    let replies = [{},{}]

</script>

<div class="flex bg-neutral-800 p-2 rounded-sm">
    <button on:click={()=>open = !open} class="group flex justify-center pr-2 w-4">
        <span class="group-hover:bg-white w-0.5 h-full bg-neutral-400 rounded-full"/>
    </button>
    <div class="flex flex-col w-full">
        <details bind:open={open} class="flex  w-full space-y-2">
            <summary on:click|preventDefault class="flex relative list-none text-sm">
                <a href={`/user/${comment.profiles.username}`} class="text-blue-400">
                    {comment.profiles.username}
                </a> 
                - {timeBetween(comment.created_at)}
                <span class={`flex-1 text-right text-neutral-400 ${open ? "invisible" : "visible"}`}>
                    {`${replies.length} replies`}
                </span>
            </summary>
            <div>{@html comment.content}</div>
            <div class="w-full flex space-x-2 text-sm text-neutral-400">
                <button class="">
                    {`${collapsed ? "Show" : "Hide"} `} Replies
                </button>
                <button class="">
                    Reply
                </button>
            </div>
        </details>
        
        
    </div>
</div>