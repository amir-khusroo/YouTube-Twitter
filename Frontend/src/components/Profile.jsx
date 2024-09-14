import React, { useState,useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Profile = ({ authToken }) => {
    const [activeTab, setActiveTab] = useState('posts');
    const navigate = useNavigate();
    useEffect(() => {
        if (!authToken) {
          navigate('/login'); // Redirect to the login page if not authenticated
        }
      }, [authToken, navigate]);
    return (
        <>
            {authToken ? (
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
                {/* Cover Photo */}
                <div className="relative">
                    <img
                        src="https://via.placeholder.com/800x200"
                        alt="Cover"
                        className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {/* Profile Picture */}
                    <img
                        src={jwtDecode(authToken).avatar}
                        alt="Profile"
                        className="absolute bottom-[-40px] left-6 w-28 h-28 rounded-full border-4 border-white object-cover"
                    />
                </div>

                {/* Profile Information */}
                <div className="mt-12 flex justify-between items-center px-6">
                    <div>
                        <h1 className="text-3xl font-semibold">{jwtDecode(authToken).fullname}</h1>
                        <p className="text-gray-500">{jwtDecode(authToken).email}</p>
                    </div>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                        Edit Profile
                    </button>
                </div>

                {/* Sliding Tabs */}
                <div className="mt-6">
                    <div className="flex justify-between border-b border-gray-300">
                        <button
                            className={`pb-2 px-4 ${activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Posts
                        </button>
                        <button
                            className={`pb-2 px-4 ${activeTab === 'videos' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('videos')}
                        >
                            Videos
                        </button>
                        <button
                            className={`pb-2 px-4 ${activeTab === 'tweets' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('tweets')}
                        >
                            Tweets
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-4">
                        {activeTab === 'posts' && (
                            <div>
                                <p>No posts available.</p>
                            </div>
                        )}
                        {activeTab === 'videos' && (
                            <div>
                                <p>No videos available.</p>
                            </div>
                        )}
                        {activeTab === 'tweets' && (
                            <div>
                                <p>No tweets available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            ):(
                <div>Redirecting to login...</div>
            )}
        </>
    );
};

export default Profile;
