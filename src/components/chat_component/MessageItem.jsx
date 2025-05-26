// src/chat_component/MessageItem.jsx
import React, { useState, useEffect } from 'react';

const PREDEFINED_REACTIONS = ['👍', '❤️', '😂', '😮', '🙏']; // Kept from original ChatUi

const MessageItem = ({
    msg,
    currentUserId,
    handleReplyClick, // For clicking on "Replied to..." preview
    setReplyTo,      // For initiating a new reply from this message
    handleReaction,  // For sending a reaction to the server
    highlightedMessage,
}) => {
    const [reactionPickerOpenForThisItem, setReactionPickerOpenForThisItem] = useState(false);
    const isCurrentUser = msg.id === currentUserId;
    const userDisplayName = isCurrentUser ? "You" : (msg.username ? `@${msg.username}` : "@Unknown");
    const usernameColorClass = isCurrentUser ? "" : "text-purple-400";

    const toggleReactionPicker = () => {
        setReactionPickerOpenForThisItem(prev => !prev);
    };

    const onReactionSelect = (emoji) => {
        handleReaction(msg.clientMessageId, emoji);
        setReactionPickerOpenForThisItem(false);
    };
    
    // Close reaction picker if this message is no longer the one to show picker for,
    // or if another action (like opening main emoji picker) happens.
    // This specific useEffect was in the original ChatUi to close reaction picker if main emoji picker opens.
    // A more direct way for MessageItem would be to receive a prop like 'closeAllReactionPickers' if needed,
    // but for now, local toggle is fine.

    return (
        <div
            data-message-id={msg.clientMessageId}
            className={`flex flex-col group ${isCurrentUser ? 'items-end' : 'items-start'} ${highlightedMessage === msg.clientMessageId ? 'bg-gray-700/60 rounded-lg p-1.5 transition-all duration-300' : 'p-0.5'}`}
        >
            <div className={`flex items-end space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Message Bubble */}
                <div
                    className={`p-2.5 sm:p-3 max-w-[75%] sm:max-w-[70%] shadow-md text-sm sm:text-base relative
                        ${isCurrentUser
                            ? 'bg-green-600 text-white rounded-l-2xl rounded-br-2xl'
                            : 'bg-gray-700 text-gray-100 rounded-r-2xl rounded-bl-2xl'}`
                    }
                >
                    {/* Reply Preview */}
                    {msg.replyTo && (
                        <div
                            className={`mb-1.5 p-1.5 rounded-md text-xs cursor-pointer transition-colors
                                ${isCurrentUser ? 'bg-green-700/80 hover:bg-green-700' : 'bg-gray-600/80 hover:bg-gray-600'}`}
                            onClick={() => handleReplyClick(msg.replyTo)} // Pass the replyTo object
                            title={`Reply to @${msg.replyTo.username}`}
                        >
                            <div className="font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                                ↪ Replied to <span className={isCurrentUser ? "text-green-200" : "text-purple-300"}>@{msg.replyTo.username}</span>
                            </div>
                            <p className="opacity-80 truncate">{msg.replyTo.message}</p>
                        </div>
                    )}

                    {/* Sender Name (if not current user) */}
                    {!isCurrentUser && msg.username && (
                        <div className="flex justify-between items-center mb-0.5">
                            <span className={`font-semibold text-xs ${usernameColorClass}`}>
                                {userDisplayName}
                            </span>
                        </div>
                    )}
                    {/* Message Text */}
                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                    {/* Timestamp */}
                    <span className={`text-xs ${isCurrentUser ? 'text-green-200' : 'text-gray-400'} block text-right mt-1 opacity-80`}>
                        {msg.time}
                    </span>
                </div>

                {/* Message Actions: Reply and Add Reaction */}
                <div className={`flex flex-col space-y-1 items-center self-center mb-1
                                 opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                                 transition-opacity duration-200
                                 ${isCurrentUser ? 'mr-1 sm:mr-2' : 'ml-1 sm:ml-2'}`}>
                    {!isCurrentUser && (
                        <button
                            onClick={() => setReplyTo(msg)} // Pass the full msg object to start reply
                            className="text-gray-400 hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-600/70 transition-colors"
                            title="Reply"
                        >
                            <span className="material-icons text-xl">reply</span>
                        </button>
                    )}
                    <button
                        onClick={toggleReactionPicker}
                        className="text-gray-400 hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-600/70 transition-colors relative"
                        title="Add reaction"
                    >
                        <span className="material-icons text-xl">add_reaction</span>
                    </button>
                </div>
            </div>

            {/* Predefined Reaction Picker for THIS message */}
            {reactionPickerOpenForThisItem && (
                <div className={`flex space-x-0.5 mt-1.5 p-1 bg-gray-600 rounded-full shadow-lg z-10
                                ${isCurrentUser ? 'mr-2 sm:mr-10 self-end' : 'ml-2 sm:ml-10 self-start'}`}>
                    {PREDEFINED_REACTIONS.map(emoji => (
                        <button
                            key={emoji}
                            onClick={() => onReactionSelect(emoji)}
                            className="text-xl sm:text-2xl p-1 hover:bg-gray-500/50 rounded-full hover:scale-125 transition-all"
                            title={`React with ${emoji}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}

            {/* Displayed Reactions */}
            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                <div className={`flex flex-wrap gap-1.5 mt-1.5 max-w-[70%]
                                ${isCurrentUser ? 'mr-2 sm:mr-10 justify-end self-end' : 'ml-2 sm:ml-10 justify-start self-start'}`}>
                    {Object.entries(msg.reactions).map(([emoji, reactors]) => {
                        if (!reactors || reactors.length === 0) return null;
                        const currentUserReacted = reactors.some(r => r.userId === currentUserId);
                        return (
                            <span
                                key={emoji}
                                className={`text-white text-xs px-2 py-0.5 rounded-full flex items-center cursor-pointer shadow-sm transition-all
                                    ${currentUserReacted
                                        ? 'bg-blue-600 ring-1 ring-blue-400 hover:bg-blue-500'
                                        : 'bg-gray-600 hover:bg-gray-500'}`}
                                onClick={() => handleReaction(msg.clientMessageId, emoji)} // Allow toggling by clicking existing
                                title={reactors.map(r => r.username || 'User').join(', ')}
                            >
                                {emoji} <span className="ml-1 text-gray-200">{reactors.length}</span>
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MessageItem;