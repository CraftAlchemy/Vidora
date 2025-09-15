import React, { useState } from 'react';
import { User } from '../../types';
import { SearchIcon, MoreVerticalIcon, ChevronLeftIcon, ChevronRightIcon, BanUserIcon, PauseCircleIcon, CheckCircleIcon, VerifyBadgeIcon, TrashIcon, CloseIcon } from '../icons/Icons';
import AddUserModal from './AddUserModal';

interface UserActionModalProps {
    user: User;
    onClose: () => void;
    onUpdateStatus: (userId: string, newStatus: User['status']) => void;
    onStartVerification: (user: User) => void;
    onUpdateVerification: (userId: string, isVerified: boolean) => void;
    onDeleteUser: (userId: string) => void;
}

const UserActionModal: React.FC<UserActionModalProps> = ({ user, onClose, onUpdateStatus, onStartVerification, onUpdateVerification, onDeleteUser }) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleDelete = () => {
        onDeleteUser(user.id);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 flex justify-center items-end sm:items-center z-50 p-4" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl w-full max-w-xs text-gray-800 dark:text-white animate-slide-in-up sm:animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
            >
                {isConfirmingDelete ? (
                    <div className="p-6 text-center">
                        <h3 className="font-bold text-lg mb-2">Move to Corbeil?</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            User @{user.username} will be moved to the corbeil and will be permanently deleted after 30 days.
                        </p>
                        <div className="flex justify-center gap-3">
                            <button onClick={() => setIsConfirmingDelete(false)} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors font-semibold text-sm">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-semibold text-white text-sm">
                                Confirm
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-4 border-b border-gray-200 dark:border-zinc-700 text-center">
                            <h3 className="font-bold">Actions for @{user.username}</h3>
                        </div>
                        <div className="flex flex-col">
                            {user.isVerified ? (
                                <button onClick={() => onUpdateVerification(user.id, false)} className="flex items-center gap-3 p-4 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors">
                                    <VerifyBadgeIcon className="w-5 h-5 text-gray-500" /> Un-verify User
                                </button>
                            ) : (
                                <button onClick={() => onStartVerification(user)} className="flex items-center gap-3 p-4 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors">
                                    <VerifyBadgeIcon className="w-5 h-5 text-blue-500" /> Verify User
                                </button>
                            )}
                            {user.status === 'active' && (
                                <>
                                    <button onClick={() => onUpdateStatus(user.id, 'suspended')} className="flex items-center gap-3 p-4 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors">
                                        <PauseCircleIcon className="w-5 h-5 text-yellow-500" /> Suspend User
                                    </button>
                                    <button onClick={() => onUpdateStatus(user.id, 'banned')} className="flex items-center gap-3 p-4 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors">
                                        <BanUserIcon className="w-5 h-5" /> Ban User
                                    </button>
                                </>
                            )}
                            {user.status === 'suspended' && (
                                <>
                                    <button onClick={() => onUpdateStatus(user.id, 'active')} className="flex items-center gap-3 p-4 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors">
                                        <CheckCircleIcon className="w-5 h-5 text-green-500"/> Activate User
                                    </button>
                                    <button onClick={() => onUpdateStatus(user.id, 'banned')} className="flex items-center gap-3 p-4 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors">
                                        <BanUserIcon className="w-5 h-5" /> Ban User
                                    </button>
                                </>
                            )}
                            {user.status === 'banned' && (
                                <button onClick={() => onUpdateStatus(user.id, 'active')} className="flex items-center gap-3 p-4 text-left hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors">
                                    <CheckCircleIcon className="w-5 h-5 text-green-500"/> Un-ban User
                                </button>
                            )}
                            <div className="border-t border-gray-200 dark:border-zinc-700 my-1"></div>
                            <button onClick={() => setIsConfirmingDelete(true)} className="flex items-center gap-3 p-4 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors">
                                <TrashIcon className="w-5 h-5" /> Delete User
                            </button>
                            <button onClick={onClose} className="p-3 text-center border-t border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-zinc-700 w-full transition-colors rounded-b-lg">
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
    const statusMap = {
        active: `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ${baseClasses}`,
        suspended: `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ${baseClasses}`,
        banned: `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 ${baseClasses}`,
        deleted: `bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 ${baseClasses}`,
    };
    return <span className={statusMap[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const BulkActionBar: React.FC<{
    selectedCount: number;
    onClearSelection: () => void;
    onUpdateStatus: (status: User['status']) => void;
    onDelete: () => void;
}> = ({ selectedCount, onClearSelection, onUpdateStatus, onDelete }) => {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

    const handleDelete = () => {
        onDelete();
        setIsConfirmingDelete(false);
    }

    if (isConfirmingDelete) {
        return (
            <div className="flex justify-between items-center mb-4 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg animate-fade-in-up">
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Move {selectedCount} user(s) to the corbeil?
                </p>
                <div className="flex gap-2">
                    <button onClick={() => setIsConfirmingDelete(false)} className="px-3 py-1 rounded-md bg-gray-300 dark:bg-zinc-700 hover:bg-gray-400 dark:hover:bg-zinc-600 transition-colors font-semibold text-sm">Cancel</button>
                    <button onClick={handleDelete} className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-semibold text-white text-sm">Confirm</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex justify-between items-center mb-4 bg-gray-100 dark:bg-zinc-800 p-3 rounded-lg animate-fade-in-up">
            <div className="flex items-center gap-4">
                <button onClick={onClearSelection} className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-zinc-700" aria-label="Clear selection">
                    <CloseIcon />
                </button>
                <span className="font-semibold text-sm">{selectedCount} selected</span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onUpdateStatus('active')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50 rounded-md hover:bg-green-200 dark:hover:bg-green-900" title="Activate Selected"><CheckCircleIcon className="w-4 h-4" />Activate</button>
                <button onClick={() => onUpdateStatus('suspended')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-900" title="Suspend Selected"><PauseCircleIcon className="w-4 h-4" />Suspend</button>
                <button onClick={() => onUpdateStatus('banned')} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 rounded-md hover:bg-red-200 dark:hover:bg-red-900" title="Ban Selected"><BanUserIcon className="w-4 h-4" />Ban</button>
                <button onClick={() => setIsConfirmingDelete(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50 rounded-md hover:bg-red-200 dark:hover:bg-red-900" title="Delete Selected"><TrashIcon className="w-4 h-4" />Delete</button>
            </div>
        </div>
    );
};


interface UserManagementViewProps {
    users: User[];
    onUpdateUser: (user: User) => void;
    onAddUser: (newUser: User) => void;
    onStartVerification: (user: User) => void;
    onUpdateUserVerification: (userId: string, isVerified: boolean) => void;
    onDeleteUser: (userId: string) => void;
    selectedUserIds: string[];
    onSetSelectedUserIds: (ids: string[]) => void;
    onBulkUpdateStatus: (ids: string[], status: User['status']) => void;
    onBulkDelete: (ids: string[]) => void;
}


const UserManagementView: React.FC<UserManagementViewProps> = ({ 
    users, onUpdateUser, onAddUser, onStartVerification, onUpdateUserVerification, onDeleteUser,
    selectedUserIds, onSetSelectedUserIds, onBulkUpdateStatus, onBulkDelete
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [actionMenuForUser, setActionMenuForUser] = useState<string | null>(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const usersPerPage = 7;

    const handleUpdateUserStatus = (userId: string, newStatus: User['status']) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            onUpdateUser({ ...user, status: newStatus });
        }
        setActionMenuForUser(null);
    };

    const handleAddUserAndClose = (newUser: User) => {
        onAddUser(newUser);
        setIsAddUserModalOpen(false);
    };

    const handleStartVerificationAndClose = (user: User) => {
        onStartVerification(user);
        setActionMenuForUser(null);
    };

    const handleUpdateVerificationAndClose = (userId: string, isVerified: boolean) => {
        onUpdateUserVerification(userId, isVerified);
        setActionMenuForUser(null);
    };

    const handleDeleteUserAndClose = (userId: string) => {
        onDeleteUser(userId);
        setActionMenuForUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const userForModal = users.find(u => u.id === actionMenuForUser);
    
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const pageUserIds = currentUsers.map(u => u.id);
            onSetSelectedUserIds(Array.from(new Set([...selectedUserIds, ...pageUserIds])));
        } else {
            const pageUserIds = currentUsers.map(u => u.id);
            onSetSelectedUserIds(selectedUserIds.filter(id => !pageUserIds.includes(id)));
        }
    };

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, userId: string) => {
        if (e.target.checked) {
            onSetSelectedUserIds([...selectedUserIds, userId]);
        } else {
            onSetSelectedUserIds(selectedUserIds.filter(id => id !== userId));
        }
    };

    const numSelectedOnPage = currentUsers.filter(u => selectedUserIds.includes(u.id)).length;
    const isAllOnPageSelected = currentUsers.length > 0 && numSelectedOnPage === currentUsers.length;

    return (
        <>
            <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800">
                {selectedUserIds.length > 0 ? (
                    <BulkActionBar
                        selectedCount={selectedUserIds.length}
                        onClearSelection={() => onSetSelectedUserIds([])}
                        onUpdateStatus={(status) => onBulkUpdateStatus(selectedUserIds, status)}
                        onDelete={() => onBulkDelete(selectedUserIds)}
                    />
                ) : (
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                        <div className="relative w-full md:w-auto">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                        </div>
                        <button onClick={() => setIsAddUserModalOpen(true)} className="w-full md:w-auto bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-pink-700 transition-colors shrink-0">
                            Add User
                        </button>
                    </div>
                )}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4 w-4">
                                     <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 dark:border-zinc-600 text-pink-600 focus:ring-pink-500 bg-gray-100 dark:bg-zinc-900"
                                        onChange={handleSelectAll}
                                        checked={isAllOnPageSelected}
                                        aria-label="Select all users on this page"
                                    />
                                </th>
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
                                <tr key={user.id} className={`border-b dark:border-zinc-800 transition-colors ${selectedUserIds.includes(user.id) ? 'bg-pink-500/10' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'}`}>
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 dark:border-zinc-600 text-pink-600 focus:ring-pink-500 bg-gray-100 dark:bg-zinc-900"
                                            onChange={(e) => handleSelectOne(e, user.id)}
                                            checked={selectedUserIds.includes(user.id)}
                                            aria-label={`Select user ${user.username}`}
                                        />
                                    </td>
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
                                        <button onClick={() => setActionMenuForUser(user.id)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700" aria-label={`Actions for ${user.username}`}>
                                            <MoreVerticalIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm gap-4">
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

            {userForModal && (
                <UserActionModal
                    user={userForModal}
                    onClose={() => setActionMenuForUser(null)}
                    onUpdateStatus={handleUpdateUserStatus}
                    onStartVerification={handleStartVerificationAndClose}
                    onUpdateVerification={handleUpdateVerificationAndClose}
                    onDeleteUser={handleDeleteUserAndClose}
                />
            )}

            {isAddUserModalOpen && (
                <AddUserModal
                    onClose={() => setIsAddUserModalOpen(false)}
                    onAddUser={handleAddUserAndClose}
                />
            )}
        </>
    );
};

export default UserManagementView;