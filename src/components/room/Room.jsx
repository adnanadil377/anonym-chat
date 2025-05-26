// src/Room.jsx
import React, { useState, useEffect } from 'react';
import ChatLogic from '../chat_component/ChatLogic'; // Adjust path if needed
import io from 'socket.io-client';
import RoomCard from './RoomCard';

const socket = io.connect(process.env.NODE_ENV === 'production' ? 'YOUR_PRODUCTION_SOCKET_URL' : "http://localhost:3001");

const PREDEFINED_ROOMS = [
    {
        id: 'tech_talk',
        name: 'Tech Talk Central',
        avatarUrl: 'https://images.unsplash.com/photo-1562670905-91409f3b7727?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=60',
        creatorHandle: '@blaze', // Matched from image
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        bgColorClass: 'bg-lime-300',
        textColorClass: 'text-black',
        rotationClass: 'transform -rotate-6',
    },
    {
        id: 'gaming_zone',
        name: 'Gaming Zone',
        avatarUrl: 'https://images.unsplash.com/photo-1500995617113-cf789362a3e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=60', // Example: Batman like avatar
        creatorHandle: '@geng', // Matched from image
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        bgColorClass: 'bg-white',
        textColorClass: 'text-black',
        rotationClass: 'transform rotate-3',
    },
    {
        id: 'book_club',
        name: 'Anonymous Readers',
        avatarUrl: 'https://images.unsplash.com/photo-1583526241256-cb18e8635e5b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=60', // Example: Dark figure avatar
        creatorHandle: '@reindeer', // Matched from image
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        bgColorClass: 'bg-lime-300', // Matched from image
        textColorClass: 'text-black',
        rotationClass: 'transform -rotate-2',
    },
];
// Card width is w-60 (240px). Adjust positioning if card width changes.
const cardWidth = 240;


const Room = () => {
    const [room, setRoom] = useState('');
    const [username, setUsername] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    const handleRoomSelect = (roomId) => {
        setRoom(roomId);
        setSelectedRoomId(roomId);
    };

    const joinRoom = () => {
        if (room !== '' && username.trim() !== '') {
            if (socket.connected) {
                socket.emit("join_room", { room, username: username.trim() });
                setShowChat(true);
            } else {
                socket.connect();
                socket.once('connect', () => {
                    socket.emit("join_room", { room, username: username.trim() });
                    setShowChat(true);
                });
                socket.once('connect_error', () => alert("Could not connect to chat. Please try again."));
            }
        } else {
            if (room === '') alert("Please select a room.");
            if (username.trim() === '') alert("Please enter your name.");
        }
    };

    const handleLeaveRoom = () => {
        if (socket.connected && room) {
            socket.emit("leave_room", { room, username });
        }
        setShowChat(false);
        setSelectedRoomId(null);
    };

    useEffect(() => {
        if (!socket.connected) socket.connect();
        const onConnect = () => console.log('Socket connected:', socket.id);
        const onDisconnect = () => console.log('Socket disconnected');
        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    return (
        <div>
            {!showChat ? (
                <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900/80 to-indigo-900/70 overflow-x-hidden">
                    <div className="flex flex-col items-center justify-start sm:justify-center min-h-screen pt-12 pb-20 px-4">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-10 sm:mb-12 text-center drop-shadow-lg">
                            Welcome to<br className="sm:hidden" /> Anonymous Chat
                        </h1>

                        {/* Room Cards Container */}
                        <div className="relative w-full max-w-xs min-h-[560px]  /* Height for mobile absolute positioning */
                                        sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl
                                        sm:min-h-0 sm:h-auto sm:flex sm:flex-row sm:justify-center sm:items-start sm:pb-10 md:pb-12
                                        mb-10">
                            {PREDEFINED_ROOMS.map((r, index) => {
                                let positionClasses = '';
                                let desktopFlexItemClasses = '';

                                // Mobile absolute positioning (to match image)
                                if (index === 0) { // Top-left card (lime)
                                    positionClasses = `absolute top-0 left-[5%] z-30`;
                                } else if (index === 1) { // Middle-right card (white)
                                    // (ParentWidth - CardWidth - DesiredRightOffset)
                                    // For max-w-xs (320px parent), card width 240px. right-[5%] means 0.05 * 320 = 16px from right.
                                    // So left = 320 - 240 - 16 = 64px.  left-[64px] or right-[5%]
                                    positionClasses = `absolute top-[140px] right-[5%] z-20`;
                                } else if (index === 2) { // Bottom-left card (lime)
                                    positionClasses = `absolute top-[280px] left-[10%] z-10`;
                                }

                                // Desktop fanned layout classes (overrides mobile absolute positioning via sm:static)
                                if (PREDEFINED_ROOMS.length === 3) {
                                    if (index === 0) { // Left card
                                        desktopFlexItemClasses = 'sm:static sm:z-20 sm:mt-8 md:mt-10 sm:-mr-[70px] md:-mr-[80px] lg:-mr-[90px]';
                                    } else if (index === 1) { // Center card
                                        desktopFlexItemClasses = 'sm:static sm:z-30';
                                    } else if (index === 2) { // Right card
                                        desktopFlexItemClasses = 'sm:static sm:z-20 sm:mt-8 md:mt-10 sm:-ml-[70px] md:-ml-[80px] lg:-ml-[90px]';
                                    }
                                } else { // Fallback for different number of cards
                                    desktopFlexItemClasses = 'sm:static sm:z-10 sm:mx-1';
                                }

                                return (
                                    <div
                                        key={r.id}
                                        className={`transition-all duration-500 ease-out ${positionClasses} ${desktopFlexItemClasses}`}
                                    >
                                        <RoomCard
                                            avatarUrl={r.avatarUrl}
                                            roomNameDisplay={r.name}
                                            creatorHandle={r.creatorHandle}
                                            description={r.description}
                                            bgColorClass={r.bgColorClass}
                                            textColorClass={r.textColorClass}
                                            rotationClass={r.rotationClass} // Pass rotation to RoomCard
                                            isSelected={selectedRoomId === r.id}
                                            onClick={() => handleRoomSelect(r.id)}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Username Input and Join Button */}
                        <div className="w-full max-w-sm mt-0 sm:mt-10 md:mt-12 flex flex-col items-center gap-4 p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-2xl">
                            <input
                                className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                placeholder="Enter your anonymous name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <button
                                onClick={joinRoom}
                                disabled={!selectedRoomId || !username.trim()}
                                className="w-full bg-sky-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-800"
                            >
                                Join Selected Room
                            </button>
                            {selectedRoomId && <p className="text-xs text-gray-300 mt-1">Selected Room: {PREDEFINED_ROOMS.find(r => r.id === selectedRoomId)?.name}</p>}
                        </div>
                    </div>
                </div>
            ) : (
                <ChatLogic room={room} socket={socket} username={username} onLeaveRoom={handleLeaveRoom} />
            )}
        </div>
    );
};

export default Room;