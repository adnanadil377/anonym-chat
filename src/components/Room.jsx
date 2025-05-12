import React, { useEffect, useState } from 'react'
import ChatUi from './chat_component/ChatLogic';
import io from 'socket.io-client';
import ChatLogic from './chat_component/ChatLogic';

const socket = io.connect("http://localhost:3001");

const Room = () => {
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if(room !== '' && username !== '') {
            socket.emit("join_room", { room, username });
            setShowChat(true);
        }
    }

    return (
        <div className="h-full md:py-4">
            {!showChat ? (
                <div className="flex flex-col items-center gap-4 p-8 md:rounded-lg md:shadow-lg md:bg-white">
                    <h1 className="text-2xl font-bold mb-4">Join a Room</h1>
                    <input 
                        className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your name"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        className="w-full max-w-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter room code"
                        onChange={(e) => setRoom(e.target.value)}
                    />
                    <button 
                        onClick={joinRoom}
                        disabled={!room || !username}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        Enter
                    </button>
                </div>
            ) : (
                <ChatLogic room={room} socket={socket} username={username} />
            )}
        </div>
    )
}

export default Room