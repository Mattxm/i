<script>
</script>

<div
    class="mx-auto mt-2 flex max-w-4xl justify-center text-black dark:text-white"
>
    <div
        class="flex flex-1 flex-col rounded-sm bg-neutral-100 p-4 dark:bg-neutral-800"
    >
        <span class="flex-1 text-center text-lg">New Post</span>
        <div class="my-2 h-px bg-thirdary" />
        <form action="" class="flex flex-col">
            <label for="title">Title</label>
            <input
                type="text"
                name="title"
                id="title"
                class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-secondary-dark`}
            />

            <label for="content">Content</label>
            <textarea
                name="content"
                id="content"
                rows="6"
                class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-secondary-dark`}
            />

            <label for="tags">Tags</label>
            <input
                type="text"
                name="tags"
                id="tags"
                class={`w-full rounded-sm border border-thirdary bg-neutral-100 p-1 text-sm text-black focus:bg-white focus:outline-none dark:bg-primary-dark dark:text-white dark:focus:bg-secondary-dark`}
            />

            <span class="mt-4 text-right text-sm">
                <button class="rounded-sm border border-thirdary px-2 py-1"
                    >Submit Post</button
                >
            </span>
        </form>
    </div>
</div>
