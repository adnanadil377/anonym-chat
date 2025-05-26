// src/components/RoomCard.jsx
import React from 'react';

const RoomCard = ({
    avatarUrl,
    roomNameDisplay,
    creatorHandle,
    description,
    bgColorClass = 'bg-lime-300',
    textColorClass = 'text-black',
    rotationClass = '', // e.g., 'transform -rotate-6'
    onClick,
    isSelected,
}) => {
    return (
        <div
            className={`relative w-60 sm:w-64 md:w-72 p-5 rounded-3xl shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 ${bgColorClass} ${textColorClass} ${rotationClass} ${isSelected ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-blue-500 scale-105' : ''}`}
            onClick={onClick}
        >
            {/* Avatar */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <img
                    src={avatarUrl}
                    alt={`${roomNameDisplay} avatar`}
                    className="w-16 h-16 rounded-full border-4 border-gray-800 object-cover shadow-md"
                />
            </div>

            {/* Card Content */}
            <div className="mt-10 text-center">
                <h3 className="text-xl font-bold truncate">{roomNameDisplay}</h3>
                <p className={`text-xs opacity-80 mt-0.5 ${textColorClass === 'text-white' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {creatorHandle}
                </p>
                <p className="text-xs mt-2 leading-snug h-16 overflow-hidden text-ellipsis">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default RoomCard;