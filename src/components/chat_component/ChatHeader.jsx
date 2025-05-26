// src/chat_component/ChatHeader.jsx
import React from 'react';

const ChatHeader = ({
    room,
    roomAvatarUrl,
    roomProfileHandle,
    onBackButtonClick,
}) => {
    return (
        <header className="bg-gray-900 p-4 sticky top-0 z-10 shrink-0">
                <div className="flex items-center justify-between">
                    <button className="text-white" onClick={onBackButtonClick}>
                        <span className="material-icons text-3xl">arrow_back_ios_new</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <img
                            alt="Room avatar"
                            className="w-16 h-16 rounded-full border-2 border-yellow-400 object-cover mb-2"
                            src={roomAvatarUrl}
                        />
                        <div className="bg-yellow-400 text-gray-900 font-semibold py-3 px-10 rounded-xl text-lg shadow-md">
                            {room || "Room Name"}
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{roomProfileHandle}</p>
                    </div>
                    <div className="w-8"></div> {/* Spacer */}
                </div>
            </header>
    );
};

export default ChatHeader;