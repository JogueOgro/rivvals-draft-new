import { IGroup } from '@/domain/group.domain'

import { createEvent } from 'effector'

export const groupsEvent = createEvent<IGroup>('groupsEvent')
