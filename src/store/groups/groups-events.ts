import { IGroups } from '@/domain/groups.domain'

import { createEvent } from 'effector'

export const groupsEvent = createEvent<IGroups>('groupsEvent')
