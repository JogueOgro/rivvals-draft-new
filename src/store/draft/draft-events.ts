import { IDraftPage } from '@/domain/draft.domain'

import { createEvent } from 'effector'

export const draftEvent = createEvent<Partial<IDraftPage>>('draftEvent')
