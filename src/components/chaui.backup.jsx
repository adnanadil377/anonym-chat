import React, { useEffect, useState } from 'react'

const ChatUi = ({ room, socket }) => {
    const [message, setMessage] = useState('');
    const [recmessage, setRecmessage] = useState('');

    const sendMessage = () => {
        if (message !== "") {
            socket.emit("send_message", { room, message });
            setMessage("");
        }
    }

    useEffect(()=>{
        socket.on("receive_message",(data)=>{
            setRecmessage(data.message);
        })
    },[socket])

    return (
        <div>
            <h2>Room: {room}</h2>
            <input 
                placeholder='chat' 
                value={message}
                onChange={(e)=>{setMessage(e.target.value)}}
            />
            <button onClick={sendMessage}>send message</button>
            <div>{recmessage}</div>
        </div>
    )
}

export default ChatUi