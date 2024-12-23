'use client'

import { Mail, MailOpen } from 'lucide-react'
import { useEffect, useState } from 'react'

import api from '@/clients/api'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { INotification } from '@/domain/notification.domain'
import authStore from '@/store/auth/auth-store'

export default function NotificationSection() {
  const loggedUser = authStore.getState()
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [hasNew, setHasNew] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response1 = await api.get('/player/email/' + loggedUser.email)
      const response = await api.get(
        '/notifications/' + response1.data.idplayer,
      )
      setNotifications(response.data)

      for (const note of notifications) {
        console.log(note)
        if (note.isRead === 0) setHasNew(true)
      }
    } catch (error) {
      console.error('Erro ao buscar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (idnotification) => {
    for (const note of notifications) {
      if (note.idnotification === idnotification) note.isRead = 1
    }
    setNotifications(notifications)

    try {
      await api.put(`/api/notifications/${idnotification}/read`)
    } catch (error) {
      console.error('Error updating notification:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()

    const interval = setInterval(() => {
      fetchNotifications()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger>
        <p className="icon-notifications">🔔</p>
        {hasNew && (
          <div
            style={{
              position: 'absolute',
              top: '22%',
              right: '14%',
              width: '12px',
              height: '12px',
              backgroundColor: 'red',
              borderRadius: '60%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            !
          </div>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="!min-w-[20rem]">
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.idnotification}
            className="flex flex-col items-start space-y-2 p-2"
            onMouseEnter={() =>
              !notification.isRead && markAsRead(notification.idnotification)
            }
          >
            <p className="text-xs font-medium text-gray-500">
              {new Date(notification.created).toLocaleString()}{' '}
            </p>
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 mr-2">
                {notification.isRead ? (
                  <span className="text-sm">
                    <MailOpen />
                  </span>
                ) : (
                  <span className="text-sm">
                    <Mail />
                  </span>
                )}
              </div>
              <div className="flex-1 text-xs text-gray-700 break-words max-w-[25rem]">
                {notification.text}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
