import React, { useEffect, useState, useRef } from 'react'
import ChatUi from './ChatUi';

const ChatLogic = ({ room, socket, username }) => {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [replyTo, setReplyTo] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [highlightedMessage, setHighlightedMessage] = useState(null);
    
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const isAtBottom = () => {
        const container = chatContainerRef.current;
        return container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToMessage = (time) => {
        const element = document.querySelector(`[data-message-time="${time}"]`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedMessage(time);
            setTimeout(() => setHighlightedMessage(null), 2000);
        }
    };

    const handleReplyClick = (replyTo) => {
        if (replyTo) {
            scrollToMessage(replyTo.time);
        }
    };

    const handleSendMessage = () => {
        if (message !== "") {
            const now = new Date();
            const messageData = {
                room,
                message,
                time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
                id: socket.id,
                username,
                replyTo: replyTo
            };
            socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setMessage("");
            setReplyTo(null);
            scrollToBottom();
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(!isAtBottom());
        };

        const container = chatContainerRef.current;
        container?.addEventListener('scroll', handleScroll);
        return () => container?.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const isCurrentUserLastMessage = messageList[messageList.length - 1]?.id === socket.id;
        if (isCurrentUserLastMessage || isAtBottom()) {
            scrollToBottom();
        }
    }, [messageList]);

    useEffect(() => {
        const messageHandler = (data) => {
            setMessageList((list) => [...list, data]);
        };

        socket.on("receive_message", messageHandler);
        return () => socket.off("receive_message", messageHandler);
    }, [socket]);

    return (
        <div>
            <ChatUi 
                room={room}
                socket={socket}
                message={message}
                setMessage={setMessage}
                messageList={messageList}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
                handleSendMessage={handleSendMessage}
                showScrollButton={showScrollButton}
                scrollToBottom={scrollToBottom}
                chatContainerRef={chatContainerRef}
                messagesEndRef={messagesEndRef}
                handleReplyClick={handleReplyClick}
                highlightedMessage={highlightedMessage}
            />
        </div>
    );
};

export default ChatLogic;