<script>


</script>


<div class="max-w-4xl flex justify-center mx-auto mt-2 text-black dark:text-white">
    <div class="flex flex-col flex-1 dark:bg-neutral-800 bg-neutral-100 rounded-sm p-4">
        <span class="text-lg text-center flex-1">New Post</span>
        <div class="bg-thirdary h-px my-2" /> 
        <form action="" class="flex flex-col">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" 
            class={`w-full text-black dark:text-white bg-neutral-100 dark:bg-primary-dark focus:bg-white dark:focus:bg-secondary-dark rounded-sm border border-thirdary text-sm p-1 focus:outline-none`}
            />

            <label for="content">Content</label>
            <textarea name="content" id="content" rows="6" 
            class={`w-full text-black dark:text-white bg-neutral-100 dark:bg-primary-dark focus:bg-white dark:focus:bg-secondary-dark rounded-sm border border-thirdary text-sm p-1 focus:outline-none`}
            />

            <label for="tags">Tags</label>
            <input type="text" name="tags" id="tags"
            class={`w-full text-black dark:text-white bg-neutral-100 dark:bg-primary-dark focus:bg-white dark:focus:bg-secondary-dark rounded-sm border border-thirdary text-sm p-1 focus:outline-none`}
            /> 

            <span class="text-right mt-4 text-sm">
                <button class="border border-thirdary px-2 py-1 rounded-sm">Submit Post</button>
            </span>
            
        </form>
    </div>
</div>