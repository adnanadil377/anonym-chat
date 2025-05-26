import React, { useState, useEffect } from 'react'; // Removed useRef, useEffect for click-outside as it's in ChatLogic
import Picker, { EmojiStyle, Theme } from 'emoji-picker-react';

const PREDEFINED_REACTIONS = ['👍', '❤️', '😂', '😮', '🙏'];

const ChatUi = ({
    room,
    // username, // Not directly used for current user display
    currentUserId,
    message,
    setMessage,
    messageList,
    replyTo,
    setReplyTo,
    handleSendMessage,
    handleReaction,
    showScrollButton,
    scrollToBottom,
    chatContainerRef,
    messagesEndRef,
    handleReplyClick,
    highlightedMessage,
    roomAvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBmzoZsl2Y2o0heJs9TdQxzpcN3DBsHnDcxMOCu24j0eACgi5xUg8QFd8XdgTnBNFmFmGG9wqOyNfqe3G5tMNjoJuJGsVG0SjLQa5MUI8mCD3JIaqOmzVrjlAe39P5HfkmlqfOeetoTlrzy6J_Cux1g9ed0qRluf3bwPTk5YJtNVJhBVVHqm62yUut5Ln3_ZogGsoFxbbcunCt95PqHEpOhFo2Im3RNyvwu3u6lKNdkD7rOh-fblaekVlvt6laU2ZJ1uGX1KDawdys",
    roomProfileHandle = "@mystique",
    onBackButtonClick,

    // Props for Emoji Picker (from ChatLogic)
    showEmojiPicker,
    handleEmojiPickerToggle,
    onEmojiSelected,
    inputRef,
    emojiPickerContainerRef,
    emojiToggleButtonRef,
}) => {
    // Reaction picker state remains in ChatUi as it's specific to message interactions within the UI
    const [reactionPickerOpenFor, setReactionPickerOpenFor] = useState(null);

    const toggleReactionPicker = (clientMessageId) => {
        setReactionPickerOpenFor(prev => prev === clientMessageId ? null : clientMessageId);
    };

    const onReactionSelect = (messageClientMessageId, emoji) => {
        handleReaction(messageClientMessageId, emoji);
        setReactionPickerOpenFor(null);
    };

    // Effect to close reaction picker when emoji picker for main input opens (optional UX enhancement)
    useEffect(() => {
        if (showEmojiPicker) {
            setReactionPickerOpenFor(null);
        }
    }, [showEmojiPicker]);

    return (
        <div className="flex flex-col h-screen sm:h-[85vh] w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto bg-gray-800 shadow-xl overflow-hidden sm:mt-[5vh] sm:rounded-2xl">
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

            <main
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin relative"
            >
                {messageList.map((msg) => {
                    const isCurrentUser = msg.id === currentUserId;
                    const userDisplayName = isCurrentUser ? "You" : (msg.username ? `@${msg.username}` : "@Unknown");
                    const usernameColorClass = isCurrentUser ? "" : "text-purple-400";
                    const messageKey = msg.clientMessageId || `${msg.id}_${msg.time}`;

                    return (
                        <div
                            key={messageKey}
                            data-message-id={msg.clientMessageId}
                            className={`flex flex-col group ${isCurrentUser ? 'items-end' : 'items-start'} ${highlightedMessage === msg.clientMessageId ? 'bg-gray-700/50 rounded-lg p-1 transition-all duration-300' : 'p-1'}`}
                        >
                            <div className={`flex items-end space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div
                                    className={`p-3 max-w-xs md:max-w-md shadow text-sm relative
                                        ${isCurrentUser
                                            ? 'bg-green-600 text-white rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
                                            : 'bg-gray-700 text-gray-100 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'}`
                                    }
                                >
                                    {msg.replyTo && (
                                        <div
                                            className={`mb-1.5 p-1.5 rounded-md text-xs cursor-pointer
                                                ${isCurrentUser ? 'bg-green-700 hover:bg-green-800' : 'bg-gray-600 hover:bg-gray-500'}`}
                                            onClick={() => handleReplyClick(msg.replyTo)}
                                            title={`Reply to @${msg.replyTo.username}`}
                                        >
                                            <div className="font-semibold">↪ Replied to @{msg.replyTo.username}</div>
                                            <p className="opacity-80 truncate">{msg.replyTo.message}</p>
                                        </div>
                                    )}

                                    {!isCurrentUser && (
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`font-semibold text-xs ${usernameColorClass}`}>
                                                {userDisplayName}
                                            </span>
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                                    <span className={`text-xs ${isCurrentUser ? 'text-green-200' : 'text-gray-400'} block text-right mt-1`}>
                                        {msg.time}
                                    </span>
                                </div>
                                <div className={`flex flex-col space-y-1 items-center self-center mb-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 ${isCurrentUser ? 'mr-1' : 'ml-1'}`}>
                                    {!isCurrentUser && (
                                        <button
                                            onClick={() => setReplyTo(msg)}
                                            className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-600"
                                            title="Reply"
                                        >
                                            <span className="material-icons text-lg">reply</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => toggleReactionPicker(msg.clientMessageId)}
                                        className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-600 relative"
                                        title="Add reaction"
                                    >
                                        <span className="material-icons text-lg">add_reaction</span>
                                    </button>
                                </div>
                            </div>

                            {reactionPickerOpenFor === msg.clientMessageId && (
                                <div className={`flex space-x-1 mt-1.5 p-1.5 bg-gray-600 rounded-full shadow-md z-10 ${isCurrentUser ? 'mr-2 self-end' : 'ml-2 self-start'}`}>
                                    {PREDEFINED_REACTIONS.map(emoji => (
                                        <button
                                            key={emoji}
                                            onClick={() => onReactionSelect(msg.clientMessageId, emoji)}
                                            className="text-xl p-1 hover:scale-125 transition-transform"
                                            title={`React with ${emoji}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <div className={`flex flex-wrap gap-1 mt-1.5 ${isCurrentUser ? 'mr-2 justify-end' : 'ml-2 justify-start'}`}>
                                    {Object.entries(msg.reactions).map(([emoji, reactors]) => {
                                        if (!reactors || reactors.length === 0) return null;
                                        const currentUserReacted = reactors.some(r => r.userId === currentUserId);
                                        return (
                                            <span
                                                key={emoji}
                                                className={`text-white text-xs px-2 py-1 rounded-full flex items-center cursor-pointer
                                                    ${currentUserReacted ? 'bg-blue-500 ring-2 ring-blue-300' : 'bg-gray-600 hover:bg-gray-500'}`}
                                                onClick={() => onReactionSelect(msg.clientMessageId, emoji)}
                                                title={reactors.map(r => r.username || 'User').join(', ')}
                                            >
                                                {emoji} <span className="ml-1">{reactors.length}</span>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />

                {showScrollButton && (
                    <button
                        onClick={() => scrollToBottom("smooth")}
                        className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center z-20"
                        title="Scroll to bottom"
                    >
                        <span className="material-icons text-xl">keyboard_arrow_down</span>
                    </button>
                )}
            </main>

            <footer className="bg-gray-900 p-3 sticky bottom-0 shrink-0">
                {replyTo && (
                    <div className="bg-gray-700 p-2 rounded-t-lg mx-1 mb-[-3px] flex justify-between items-center text-sm">
                        <div className="text-gray-300 ">
                            Replying to <span className="font-semibold text-purple-400">@{replyTo.username}</span>:
                            <p className="text-gray-400 italic truncate max-w-xs sm:max-w-sm md:max-w-md">"{replyTo.message}"</p>
                        </div>
                        <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-white" title="Cancel reply">
                            <span className="material-icons text-lg">close</span>
                        </button>
                    </div>
                )}
                <div className={`relative flex items-center bg-gray-700 p-2 ${replyTo ? 'rounded-b-xl' : 'rounded-xl'}`}>
                    <button
                        ref={emojiToggleButtonRef} // Pass the ref from ChatLogic
                        onClick={handleEmojiPickerToggle}
                        className="text-yellow-400 p-2 hover:bg-gray-600 rounded-full"
                        title="Open emoji picker"
                    >
                        <span className="material-icons text-2xl">mood</span>
                    </button>
                    <input
                        ref={inputRef} // Pass the ref from ChatLogic
                        className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-3 py-2"
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
                        onFocus={() => {
                            // Optionally, notify ChatLogic if emoji picker should close on input focus
                            // This might require an additional handler prop if complex interaction is needed
                            // For now, the click-outside in ChatLogic should mostly handle this.
                        }}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-200"
                        title="Send message"
                    >
                        <span className="material-icons text-2xl">send</span>
                    </button>

                    {showEmojiPicker && (
                        <div
                            ref={emojiPickerContainerRef} // Pass the ref from ChatLogic
                            className="absolute bottom-full left-0 mb-2 z-30"
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
        </div>
    );
};

export default ChatUi;