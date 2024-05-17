import { useStore } from 'effector-react'
import Image from 'next/image'

import userIconImg from '@/assets/user-icon.png'
import draftStore from '@/store/draft/draft-store'

/* eslint-disable @next/next/no-img-element */
export default function TwitchChat() {
  const { chat: chatList } = useStore(draftStore)

  const commandRegexChoose = /^!(escolher)\b/i

  return (
    <div className="absolute right-[228px] top-[6px] w-[500px]">
      <div className="py-3 px-5 h-[160px] overflow-auto border rounded-md bg-white">
        <h3 className="text-xs font-semibold uppercase text-gray-400 mb-1">
          Chats
        </h3>
        <div className="divide-y divide-gray-200">
          {chatList.length === 0 && (
            <div className="pt-2">Sem histórico no chat</div>
          )}
          {chatList?.map((chat, i) => {
            const message = chat?.message
            const username = chat?.user?.username || ''
            const isCommandChoose = commandRegexChoose.test(message || '')
            const isCommandExecuted = chat.isAction && chat.isExecuted
            const commandClass = isCommandExecuted
              ? `font-bold text-${isCommandChoose ? 'green' : 'red'}-500`
              : 'font-normal text-purple-800'
            return (
              <button key={i} className="w-full text-left py-1 borde">
                <div className="flex items-center">
                  <Image
                    className="rounded-full items-start flex-shrink-0 mr-3"
                    src={userIconImg}
                    width="24"
                    height="24"
                    alt={username}
                  />
                  <div>
                    <h4 className={`text-sm font-medium `}>
                      {`<${username}>: `}
                      <span className={commandClass}>{message}</span>
                    </h4>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
