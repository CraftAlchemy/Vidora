import React, { useState } from 'react';
import { mockVideos } from '../../services/mockApi';
import { Video } from '../../types';
import { SearchIcon, MoreVerticalIcon, ChevronLeftIcon, ChevronRightIcon } from '../icons/Icons';

const StatusBadge: React.FC<{ status: Video['status'] }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full";
    const statusMap = {
        approved: `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 ${baseClasses}`,
        pending: `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 ${baseClasses}`,
        removed: `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 ${baseClasses}`,
    };
    return <span className={statusMap[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};

const ContentManagementView: React.FC = () => {
    const [videos] = useState<Video[]>(mockVideos);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 5;

    const filteredVideos = videos.filter(video =>
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
    
    return (
         <div className="bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full sm:w-auto">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-4">Video</th>
                            <th scope="col" className="p-4">Author</th>
                            <th scope="col" className="p-4">Stats</th>
                            <th scope="col" className="p-4">Status</th>
                            <th scope="col" className="p-4">Upload Date</th>
                            <th scope="col" className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVideos.map(video => (
                            <tr key={video.id} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="p-4 flex items-center">
                                    <img src={video.thumbnailUrl} alt="thumbnail" className="w-16 h-16 object-cover rounded-md mr-4 shrink-0" />
                                    <p className="font-semibold text-gray-800 dark:text-white max-w-xs truncate">{video.description}</p>
                                </td>
                                <td className="p-4">@{video.user.username}</td>
                                <td className="p-4 whitespace-nowrap">
                                    <div>❤️ {video.likes.toLocaleString()}</div>
                                    <div>💬 {video.comments.toLocaleString()}</div>
                                </td>
                                <td className="p-4"><StatusBadge status={video.status} /></td>
                                <td className="p-4 whitespace-nowrap">{video.uploadDate}</td>
                                <td className="p-4">
                                    <button onClick={() => alert(`Actions for ${video.id}`)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700">
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
                     Showing {indexOfFirstVideo + 1}-{Math.min(indexOfLastVideo, filteredVideos.length)} of {filteredVideos.length}
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

export default ContentManagementView;