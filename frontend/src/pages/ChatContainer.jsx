import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'

import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import MessageSkeleton from './MessageSkeleton'
const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore()
  useEffect(() => {
    getMessages(selectedUser._id)

  }, [selectedUser._id, getMessages])
  if (true) return (
    <div className='flex-1 flex flex-col overflow-auto'>

      <ChatHeader />
      <MessageSkeleton/>
      <MessageInput />
    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <MessageInput />
    </div>
  )
}

export default ChatContainer
