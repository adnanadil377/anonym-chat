// src/chat_component/ChatFooter.jsx
import React from 'react';
import Picker, { EmojiStyle, Theme } from 'emoji-picker-react';

const ChatFooter = ({
    message,
    setMessage,
    handleSendMessage,
    replyTo,
    setReplyTo,
    showEmojiPicker,
    handleEmojiPickerToggle,
    onEmojiSelected,
    inputRef,
    emojiPickerContainerRef,
    emojiToggleButtonRef,
}) => {
    return (
        <footer className="bg-gray-900 p-2 sm:p-3 sticky bottom-0 shrink-0 border-t border-gray-700/50 z-10">
            {replyTo && (
                <div className="bg-gray-700 p-2 rounded-t-lg mx-1 mb-[-3px] flex justify-between items-center text-sm shadow-sm">
                    <div className="text-gray-300 overflow-hidden">
                        Replying to <span className="font-semibold text-purple-300">@{replyTo.username}</span>:
                        <p className="text-gray-400 italic truncate">{replyTo.message}</p>
                    </div>
                    <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-white p-1 -mr-1" title="Cancel reply">
                        <span className="material-icons text-xl">close</span>
                    </button>
                </div>
            )}
            <div className={`relative flex items-center bg-gray-700 p-1.5 sm:p-2 ${replyTo ? 'rounded-b-xl' : 'rounded-xl'} shadow-sm`}>
                <button
                    ref={emojiToggleButtonRef}
                    onClick={handleEmojiPickerToggle}
                    className="text-gray-300 hover:text-yellow-400 p-2 rounded-full transition-colors"
                    title="Open emoji picker"
                >
                    <span className="material-icons text-2xl">mood</span>
                </button>
                <input
                    ref={inputRef}
                    className="flex-1 bg-transparent text-white placeholder-gray-400/80 focus:outline-none px-3 py-2 text-sm sm:text-base"
                    placeholder="Type your message..."
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-blue-600 text-white p-2.5 sm:p-3 rounded-full hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Send message"
                >
                    <span className="material-icons text-2xl">send</span>
                </button>

                {showEmojiPicker && (
                    <div
                        ref={emojiPickerContainerRef}
                        className="absolute bottom-full left-0 mb-2 z-30" // Positioned above and to the left
                        onClick={(e) => e.stopPropagation()} // Prevent click from closing picker immediately
                    >
                        <Picker
                            onEmojiClick={onEmojiSelected}
                            autoFocusSearch={false}
                            emojiStyle={EmojiStyle.NATIVE}
                            theme={Theme.DARK}
                            height={350}
                            width={300}
                            lazyLoadEmojis={true}
                            previewConfig={{ showPreview: false }}
                        />
                    </div>
                )}
            </div>
        </footer>
    );
};

export default ChatFooter;