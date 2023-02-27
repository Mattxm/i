<script lang="ts">
    export let user: any = {
        username: '',
        description: '',
        avatar_url: '',
    }
</script>

<div class="flex max-w-full border-t border-thirdary py-2 px-4 last:border-b">
    <div class="mx-auto flex max-w-xl flex-1">
        <img
            class="mr-4 h-12 w-12 rounded-full"
            src={user.avatar_url ? user.avatar_url : '../user.jpg'}
            alt={user.username}
        />
        <div class=" flex-1 flex-col">
            <a href="/user/${user.username}" class="font-medium hover:underline"
                >{user.username}</a
            >
            <p class="text-gray-600">
                {user.description ? user.description : ''}
            </p>
        </div>
        <div class="">
            <a
                href="/user/{user.username}"
                class=" rounded-sm bg-secondary-dark px-2 py-1">Profile</a
            >
        </div>
    </div>
</div>
