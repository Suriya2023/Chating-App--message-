import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    const {
        getUsers,
        users,
        selectedUser,
        isUsersLoading,
    } = useChatStore();
    const { setSelectedUser } = useChatStore();

    const { onlineUser } = useAuthStore();

    useEffect(() => {
        getUsers();

    }, []);

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-20 lg:w-72 border-r flex flex-col transition-all duration-200">

            <div className="border-b  w-full p-5">
                <div className="flex items-center gap-2">
                    <Users className="size-6 text-primary" />
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
            </div>


            <div className="overflow-y-auto flex-1 py-2 pr-1">
                {users.map((user) => {
                    const isOnline = Array.isArray(onlineUser) && onlineUser.includes(user._id);

                    const isActive = selectedUser?._id === user._id;

                    return (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full p-3 flex items-center gap-3 rounded-xl transition-colors duration-200 ${isActive
                                    ? 'bg-base-500 ring-1 ring-base-300'
                                    : 'hover:bg-base-100 bg-transparent'
                                }`}
                            aria-label={`Chat with ${user.fullName}`}
                        >


                            <div className="relative mx-auto lg:mx-0">
                                <img
                                    src={user.profilePic || '/avatar.png'}
                                    alt={user.fullName}
                                    onError={(e) => (e.target.src = '/avatar.png')}
                                    className="size-12 object-cover rounded-full border border-base-200"
                                />
                                {isOnline && (
                                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-green-500 border-2 border-white" />
                                )}
                            </div>


                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">{user.fullName}</div>
                                <div className="text-sm text-zinc-400">
                                    {isOnline ? 'Online' : 'Offline'}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;
