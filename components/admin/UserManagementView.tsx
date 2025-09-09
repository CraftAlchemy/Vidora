import React, { useState } from 'react';
import { mockUsers } from '../../services/mockApi';
import { User } from '../../types';
import { SearchIcon, MoreVerticalIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
    const statusMap = {
        active: `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ${baseClasses}`,
        suspended: `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ${baseClasses}`,
        banned: `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 ${baseClasses}`,
    };
    return <span className={statusMap[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const UserManagementView: React.FC = () => {
    const [users] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 7;

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-pink-700 transition-colors">
                    Add User
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">User</th>
                            <th scope="col" className="p-4">Email</th>
                            <th scope="col" className="p-4">Role</th>
                            <th scope="col" className="p-4">Status</th>
                            <th scope="col" className="p-4">Verified</th>
                            <th scope="col" className="p-4">Joined</th>
                            <th scope="col" className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map(user => (
                            <tr key={user.id} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="p-4 flex items-center">
                                    <img src={user.avatarUrl} alt={user.username} className="w-9 h-9 rounded-full mr-3" />
                                    <div>
                                        <div className="font-semibold text-gray-800 dark:text-white">@{user.username}</div>
                                        <div className="text-xs">{user.id}</div>
                                    </div>
                                </td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">{user.role}</td>
                                <td className="p-4"><StatusBadge status={user.status} /></td>
                                <td className="p-4">{user.isVerified ? '✅' : '❌'}</td>
                                <td className="p-4">{user.joinDate}</td>
                                <td className="p-4">
                                    <button onClick={() => alert(`Actions for ${user.username}`)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700">
                                        <MoreVerticalIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                    Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length}
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50">
                        <ChevronLeftIcon className="w-5 h-5"/>
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-50">
                         <ChevronRightIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserManagementView;
