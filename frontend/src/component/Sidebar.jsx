import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './SidebarSkeleton';
import { Search, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Sidebar = () => {
    const {
        getUsers,
        users,
        selectedUser,
        isUsersLoading,
        setSelectedUser,
    } = useChatStore();

    const { onlineUser } = useAuthStore();

    useEffect(() => {
        getUsers();
    }, []);

    if (isUsersLoading) return <SidebarSkeleton />;

    return (
        <aside className="h-full w-full sm:w-60 lg:w-auto border-r flex flex-col transition-all duration-200 bg-base-100">


            {/* Header */}
            <div className="border-b w-full p-4">
                <div className="flex items-center justify-between">
                    {/* Left: Contacts title */}
                    <div className="flex items-center gap-2">
                        <Users className="size-6 text-primary" />
                        <span className="font-medium text-base lg:text-lg">Contacts</span>
                    </div>

                    {/* Right: Add Contact button */}
                    <button
                        className="btn btn-xs btn-primary px-2 py-1"
                        onClick={() => alert("Add Contact Clicked")} // Replace with modal or navigation
                    >
                        +
                    </button>
                </div>
            </div>


            {/* Search */}
            <div className="relative px-4">
                <input
                    type="text"
                    placeholder="Search contacts..."
                    className="input input-sm input-bordered w-full pr-10"
                />
                <Search className="w-4 h-4 absolute right-6 top-1/2 -translate-y-1/2 text-base-content/60" />
            </div>


            {/* Contact List */}
            {/* Contact List */}
            <div className="overflow-y-auto flex-1 py-2 pr-1">
                {users.map((user) => {
                    const isOnline = Array.isArray(onlineUser) && onlineUser.includes(user._id);
                    const isActive = selectedUser?._id === user._id;

                    return (
                        <button
                            key={user._id}
                            onClick={() => setSelectedUser(user)}
                            className={`w-full px-4 py-3 flex items-center justify-between gap-3 transition-colors duration-200 
    ${isActive ? 'bg-base-300' : 'hover:bg-base-100'}`}
                        >
                            {/* Left section: Avatar + Name */}
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Avatar */}
                                <div className="relative">
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

                                {/* Name + status */}
                                <div className="text-left min-w-0">
                                    <div className="font-medium truncate text-sm lg:text-base">{user.fullName}</div>
                                    <div className="text-xs text-zinc-500">{isOnline ? 'Online' : 'Offline'}</div>
                                </div>
                            </div>

                            {/* Timestamp */}
                            <div className="text-xs text-right text-zinc-400 whitespace-nowrap">
                                {/* You can use your user.lastActive or createdAt time here */}
                                {/* For now, use static value */}
                                Yesterday
                            </div>
                        </button>

                    );
                })}
            </div>
        </aside>



    );
};

export default Sidebar;
