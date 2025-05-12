import React from 'react'

const ChatUi = ({
    room,
    socket,
    message,
    setMessage,
    messageList,
    replyTo,
    setReplyTo,
    handleSendMessage,
    showScrollButton,
    scrollToBottom,
    chatContainerRef,
    messagesEndRef,
    handleReplyClick,
    highlightedMessage
}) => {
    return (
        <div className="min-h-screen md:flex md:items-center md:justify-center">
            <div className="flex flex-col h-full md:h-auto md:max-w-3xl md:w-full md:shadow-xl md:rounded-lg overflow-hidden">
                <div className="p-4 md:rounded-t-lg md:bg-white md:shadow-lg">
                    <h2 className="text-xl font-bold">Room: {room}</h2>
                </div>
                
                <div className="flex-1 p-4 bg-white md:shadow-lg relative">
                    <div 
                        ref={chatContainerRef}
                        className="h-[calc(100vh-180px)] md:h-[600px] overflow-auto mb-4 scroll-smooth"
                    >
                        {messageList.map((msg, index) => (
                            <div 
                                key={index}
                                data-message-time={msg.time}
                                className={`mb-4 flex ${msg.id === socket.id ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className="group max-w-[70%]">
                                    {msg.replyTo && (
                                        <div 
                                            onClick={() => handleReplyClick(msg.replyTo)}
                                            className={`text-xs text-gray-500 mb-1 ${msg.id === socket.id ? 'text-right' : 'text-left'} cursor-pointer hover:text-blue-500`}
                                        >
                                            <div className="inline-block bg-gray-100 px-2 py-1 rounded-lg">
                                                {msg.replyTo.username}: {messageList.find(m => m.time === msg.replyTo.time)?.message.substring(0, 30)}...
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2">
                                        {msg.id === socket.id && (
                                            <button 
                                                onClick={() => setReplyTo(msg)}
                                                className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 p-1 mt-4"
                                                title="Reply"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                </svg>
                                            </button>
                                        )}
                                        <div>
                                            <div className={`rounded-2xl px-4 py-2 transition-all duration-300
                                                ${msg.id === socket.id 
                                                    ? 'bg-blue-500 text-white' 
                                                    : 'bg-gray-200 text-black'}
                                                ${msg.time === highlightedMessage ? 'bg-blue-100 scale-105 shadow-md' : ''}`}
                                            >
                                                {msg.message}
                                            </div>
                                            <div className={`text-xs text-gray-500 mt-1 ${msg.id === socket.id ? 'text-right' : 'text-left'}`}>
                                                <div>{msg.username}</div>
                                                <div>{msg.time}</div>
                                            </div>
                                        </div>
                                        {msg.id !== socket.id && (
                                            <button 
                                                onClick={() => setReplyTo(msg)}
                                                className="md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:scale-110 p-1 mt-4"
                                                title="Reply"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {showScrollButton && (
                        <button
                            onClick={scrollToBottom}
                            className="absolute bottom-24 md:bottom-20 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
                            title="Scroll to bottom"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 10 12 16 18 10"></polyline>
                            </svg>
                        </button>
                    )}

                    {replyTo && (
                        <div className="mb-2 p-2 bg-gray-100 rounded-lg flex justify-between items-center">
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Replying to: {replyTo.message.substring(0, 30)}...
                            </div>
                            <button 
                                onClick={() => setReplyTo(null)}
                                className="text-gray-500 hover:text-red-500 p-1 hover:bg-gray-200 rounded-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    
                    <div className="flex gap-3 sticky bottom-0 bg-white p-2 md:p-0">
                        <input 
                            className="flex-1 p-3 md:p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type a message..." 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button 
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white px-6 md:px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatUi