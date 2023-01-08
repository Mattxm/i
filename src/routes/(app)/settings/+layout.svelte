<script>
    import { BellIcon, EyeIcon, UserIcon } from 'svelte-feather-icons'
    import { page } from '$app/stores'
</script>

<div class="mx-auto mb-4 mt-2 flex max-w-4xl px-4">
    <div
        class="mr-4 h-12 w-12 flex-none rounded-full bg-thirdary  dark:bg-white"
    >
        <img
            class="rounded-full p-0.5"
            src={`${$page.data.currentUser.avatar_url}`}
            alt="avatar"
        />
    </div>
    <div class="flex flex-col">
        <span class="c-text text-xl"
            ><a href={`/user/${$page.data.currentUser.username}`}
                >{$page.data.currentUser.username}</a
            ></span
        >
        <span class="text-sm text-neutral-200">Settings </span>
    </div>
</div>
<div class="mx-auto flex max-w-4xl px-4">
    <div class="mr-4 min-h-screen w-48">
        <ul class="dark:text-neutral-200">
            <li>
                <div
                    class={`${
                        $page.url.pathname == '/settings/profile' &&
                        'bg-neutral-400 dark:bg-neutral-700'
                    } h-8 overflow-hidden rounded-sm pr-1 hover:bg-neutral-300 dark:hover:bg-neutral-600`}
                >
                    <a
                        class="flex h-full items-center space-x-2"
                        href="/settings/profile"
                    >
                        <span
                            class={`${
                                $page.url.pathname == '/settings/profile'
                                    ? 'visible'
                                    : 'invisible'
                            } h-full w-0.5 bg-red-400`}
                        />
                        <UserIcon size="16" />
                        <span>Profile</span>
                    </a>
                </div>
            </li>
            <li>
                <div
                    class={`${
                        $page.url.pathname == '/settings/appearance' &&
                        'bg-neutral-400 dark:bg-neutral-700'
                    } h-8 overflow-hidden rounded-sm pr-1 hover:bg-neutral-300 dark:hover:bg-neutral-600`}
                >
                    <a
                        class="flex h-full items-center space-x-2"
                        href="/settings/appearance"
                    >
                        <span
                            class={`${
                                $page.url.pathname == '/settings/appearance'
                                    ? 'visible'
                                    : 'invisible'
                            } h-full w-0.5 bg-red-400`}
                        />
                        <EyeIcon size="16" />
                        <span>Appearance</span>
                    </a>
                </div>
            </li>
            <li>
                <div
                    class={`${
                        $page.url.pathname == '/settings/notifications' &&
                        'bg-neutral-400 dark:bg-neutral-700'
                    } h-8 overflow-hidden rounded-sm pr-1 hover:bg-neutral-300 dark:hover:bg-neutral-600`}
                >
                    <a
                        class="flex h-full items-center space-x-2"
                        href="/settings/notifications"
                    >
                        <span
                            class={`${
                                $page.url.pathname == '/settings/notifications'
                                    ? 'visible'
                                    : 'invisible'
                            } h-full w-0.5 bg-red-400`}
                        />
                        <BellIcon size="16" />
                        <span>Notifications</span>
                    </a>
                </div>
            </li>
        </ul>
    </div>
    <slot />
</div>
