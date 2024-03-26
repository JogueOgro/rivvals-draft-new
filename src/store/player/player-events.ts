import { IPlayerPage } from '@/domain/player.domain'

import { createEvent } from 'effector'

export const playerEvent = createEvent<Partial<IPlayerPage>>('playerEvent')
