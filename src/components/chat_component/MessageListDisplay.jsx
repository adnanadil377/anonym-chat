// src/chat_component/MessageListDisplay.jsx
import React from 'react';
import MessageItem from './MessageItem';

const MessageListDisplay = ({
    messageList,
    currentUserId,
    handleReplyClick,
    setReplyTo,
    handleReaction,
    highlightedMessage,
    chatContainerRef,
    messagesEndRef,
    showScrollButton,
    scrollToBottom,
}) => {
    return (
        <main
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 relative"
        >
            {messageList.map((msg) => {
                const messageKey = msg.clientMessageId || `${msg.id}_${msg.time}`; // Ensure unique key
                return (
                    <MessageItem
                        key={messageKey}
                        msg={msg}
                        currentUserId={currentUserId}
                        handleReplyClick={handleReplyClick}
                        setReplyTo={setReplyTo}
                        handleReaction={handleReaction}
                        highlightedMessage={highlightedMessage}
                    />
                );
            })}
            <div ref={messagesEndRef} /> {/* For scrolling to bottom */}

            {/* Scroll to Bottom Button */}
            {showScrollButton && (
                <button
                    onClick={() => scrollToBottom("smooth")}
                    className="absolute bottom-4 right-4 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 flex items-center justify-center z-20"
                    title="Scroll to bottom"
                >
                    <span className="material-icons text-2xl">keyboard_double_arrow_down</span>
                </button>
            )}
        </main>
    );
};

export default MessageListDisplay;