// src/chat_component/ChatLogic.jsx
import React, { useEffect, useState, useRef } from 'react';
// Import the new UI components
import ChatHeader from './ChatHeader';
import MessageListDisplay from './MessageListDisplay';
import ChatFooter from './ChatFooter';
import ChatUi from './ChatUi';

// Default values that were in ChatUi, can be passed from a higher parent or kept as defaults here
const DEFAULT_ROOM_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuBmzoZsl2Y2o0heJs9TdQxzpcN3DBsHnDcxMOCu24j0eACgi5xUg8QFd8XdgTnBNFmFmGG9wqOyNfqe3G5tMNjoJuJGsVG0SjLQa5MUI8mCD3JIaqOmzVrjlAe39P5HfkmlqfOeetoTlrzy6J_Cux1g9ed0qRluf3bwPTk5YJtNVJhBVVHqm62yUut5Ln3_ZogGsoFxbbcunCt95PqHEpOhFo2Im3RNyvwu3u6lKNdkD7rOh-fblaekVlvt6laU2ZJ1uGX1KDawdys";
const DEFAULT_ROOM_HANDLE = "@anonymous_room";

const ChatLogic = ({
    room,
    socket,
    username,
    onLeaveRoom,
    // Optional: pass these if they vary and are not just defaults
    roomAvatarUrl = DEFAULT_ROOM_AVATAR,
    roomProfileHandle = DEFAULT_ROOM_HANDLE,
}) => {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [replyTo, setReplyTo] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [highlightedMessage, setHighlightedMessage] = useState(null);

    // Emoji Picker State and Refs
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const inputRef = useRef(null);
    const emojiPickerContainerRef = useRef(null);
    const emojiToggleButtonRef = useRef(null);

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const isAtBottom = () => {
        if (!chatContainerRef.current) return true;
        const container = chatContainerRef.current;
        return container.scrollHeight - container.scrollTop <= container.clientHeight + 150;
    };

    const scrollToBottom = (behavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    const scrollToMessage = (clientMessageId) => {
        const element = document.querySelector(`[data-message-id="${clientMessageId}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedMessage(clientMessageId);
            setTimeout(() => setHighlightedMessage(null), 2000);
        }
    };

    // This function is called when clicking the "Replied to..." part of a message
    // It expects the 'replyTo' object stored in the message itself.
    const handleReplyClick = (repliedToMessageData) => {
        if (repliedToMessageData && repliedToMessageData.clientMessageId) {
            scrollToMessage(repliedToMessageData.clientMessageId);
        } else {
            console.warn("Attempted to scroll to reply without clientMessageId:", repliedToMessageData);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() !== "") {
            const now = new Date();
            const clientMessageId = socket.id + '_' + Date.now();
            const messageData = {
                room,
                message: message.trim(),
                time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
                id: socket.id,
                username,
                clientMessageId,
                reactions: {},
                replyTo: replyTo ? {
                    clientMessageId: replyTo.clientMessageId,
                    username: replyTo.username,
                    message: replyTo.message.substring(0, 70) + (replyTo.message.length > 70 ? '...' : ''),
                } : null,
            };
            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setMessage("");
            setReplyTo(null);
            setShowEmojiPicker(false); // Close emoji picker on send
            setTimeout(() => scrollToBottom("auto"), 0);
        }
    };

    const handleReaction = (messageClientMessageId, emoji) => {
        socket.emit("send_reaction", {
            room,
            messageClientMessageId,
            emoji,
        });
        // Close main emoji picker if it was open, as a reaction was made
        // setShowEmojiPicker(false); // This line might be too aggressive, consider user flow.
    };

    const handleEmojiPickerToggle = () => {
        setShowEmojiPicker(prev => !prev);
    };

    const onEmojiSelected = (emojiData) => {
        setMessage(prevMessage => prevMessage + emojiData.emoji);
        inputRef.current?.focus();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                emojiPickerContainerRef.current &&
                !emojiPickerContainerRef.current.contains(event.target) &&
                emojiToggleButtonRef.current &&
                !emojiToggleButtonRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };
        if (showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
        else document.removeEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker]);

    useEffect(() => {
        const handleScroll = () => {
            if (chatContainerRef.current) setShowScrollButton(!isAtBottom());
        };
        const container = chatContainerRef.current;
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (messageList.length > 0) {
            const lastMessage = messageList[messageList.length - 1];
            if (lastMessage?.id === socket.id || isAtBottom()) {
                scrollToBottom("smooth");
            }
        }
    }, [messageList, socket.id]); // Added socket.id

    useEffect(() => {
        const messageHandler = (data) => {
            const messageWithId = { ...data, clientMessageId: data.clientMessageId || `server_${Date.now()}_${Math.random()}` };
            setMessageList((list) => [...list, messageWithId]);
        };
        const reactionUpdateHandler = ({ messageClientMessageId, updatedReactions }) => {
            setMessageList((list) =>
                list.map((msg) =>
                    msg.clientMessageId === messageClientMessageId
                        ? { ...msg, reactions: updatedReactions }
                        : msg
                )
            );
        };
        socket.on("receive_message", messageHandler);
        socket.on("reaction_updated", reactionUpdateHandler);
        return () => {
            socket.off("receive_message", messageHandler);
            socket.off("reaction_updated", reactionUpdateHandler);
        };
    }, [socket]);

    return (
        <div className="flex flex-col h-screen sm:h-[90vh] md:h-[85vh] w-full max-w-full sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto bg-gray-800 shadow-xl overflow-hidden sm:my-[5vh] sm:rounded-2xl">
            <ChatHeader
                room={room}
                roomAvatarUrl={roomAvatarUrl}
                roomProfileHandle={roomProfileHandle}
                onBackButtonClick={onLeaveRoom}
            />
            <MessageListDisplay
                messageList={messageList}
                currentUserId={socket.id}
                handleReplyClick={handleReplyClick}
                setReplyTo={setReplyTo}
                handleReaction={handleReaction}
                highlightedMessage={highlightedMessage}
                chatContainerRef={chatContainerRef}
                messagesEndRef={messagesEndRef}
                showScrollButton={showScrollButton}
                scrollToBottom={scrollToBottom}
            />
            <ChatFooter
                message={message}
                setMessage={setMessage}
                handleSendMessage={handleSendMessage}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                showEmojiPicker={showEmojiPicker}
                handleEmojiPickerToggle={handleEmojiPickerToggle}
                onEmojiSelected={onEmojiSelected}
                inputRef={inputRef}
                emojiPickerContainerRef={emojiPickerContainerRef}
                emojiToggleButtonRef={emojiToggleButtonRef}
            />
        </div>
        // <ChatUi
        //     room={room}
        // // socket prop is not directly passed if not used by ChatUi for presentation
        //     username={username}
        //     currentUserId={socket.id}
        //     message={message}
        //     setMessage={setMessage}
        //     messageList={messageList}
        //     replyTo={replyTo}
        //     setReplyTo={setReplyTo}
        //     handleSendMessage={handleSendMessage}
        //     handleReaction={handleReaction}
        //     showScrollButton={showScrollButton}
        //     scrollToBottom={scrollToBottom}
        //     chatContainerRef={chatContainerRef}
        //     messagesEndRef={messagesEndRef}
        //     handleReplyClick={handleReplyClick}
        //     highlightedMessage={highlightedMessage}
        //     onBackButtonClick={onLeaveRoom}
        //     // Props for Emoji Picker
        //     showEmojiPicker={showEmojiPicker}
        //     handleEmojiPickerToggle={handleEmojiPickerToggle}
        //     onEmojiSelected={onEmojiSelected}
        //     inputRef={inputRef}
        //     emojiPickerContainerRef={emojiPickerContainerRef}
        //     emojiToggleButtonRef={emojiToggleButtonRef} 
        // />
    );
};

export default ChatLogic;