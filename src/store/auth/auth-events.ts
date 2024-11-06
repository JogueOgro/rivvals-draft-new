import { IAuth } from '@/domain/auth.domain'

import { createEvent } from 'effector'

export const authEvent = createEvent<Partial<IAuth>>('authEvent')
