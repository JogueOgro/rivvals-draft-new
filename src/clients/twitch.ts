/* eslint-disable new-cap */
import { draftEvent } from '@/store/draft/draft-events'
import draftStore from '@/store/draft/draft-store'

import tmi from 'tmi.js'
import { uuid } from 'uuidv4'

const tmiClient = new tmi.client({
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  identity: {
    username: 'rivvalsdraft',
    password: 't7io0t5uuy15rhxoa48289hg0eo6iu',
  },
  channels: ['rivvalsgg'],
})

tmiClient.on('connected', function () {
  tmiClient.action('rivvalsgg', 'Rivvals Draft ONLINE!')
  draftEvent({ chat: [] })
})

tmiClient.on('chat', function (channel, user, message, self) {
  if (self) return

  const userName = user?.username?.toLowerCase() || ''
  const [action, value] = message.split(' ')

  if (action === '!escolher' && !!value) {
    tmiClient.action(
      'rivvalsgg',
      '@' + userName + ' -- Comando escolher utilizado!, Carta: ' + value,
    )
  }

  if (action === '!anular' && !!value) {
    tmiClient.action(
      'rivvalsgg',
      '@' + userName + ' -- Comando anular utilizado!, Carta: ' + value,
    )
  }

  const { chat } = draftStore.getState()
  const newChatList = [...chat]?.filter(
    (x) => x.message?.trim() !== message.trim() && user?.id !== x.user?.id,
  )

  const validCommands = /^!(escolher|anular)\b/i

  newChatList.push({
    id: uuid(),
    user,
    message,
    isAction: validCommands.test(action),
    isExecuted: false,
    created: new Date(),
  })
  draftEvent({
    chat: newChatList.sort((a, b) => b.created.getTime() - a.created.getTime()),
  })
})

export default tmiClient
