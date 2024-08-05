import { IGroup } from '@/domain/group.domain'
import { groupsEvent } from '@/store/groups/groups-events'

const execute = (formData: Partial<IGroup>) => {
  groupsEvent({
    groupsQuantity: formData!.groupsQuantity,
    teamsPerGroup: formData!.teamsPerGroup,
  })
}

export const groupsSettingsUseCase = { execute }
