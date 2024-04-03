import { IGroups } from '@/domain/groups.domain'
import { groupsEvent } from '@/store/groups/groups-events'

const execute = (formData: Partial<IGroups>) => {
  groupsEvent({
    groupsQuantity: formData!.groupsQuantity,
    teamsPerGroup: formData!.teamsPerGroup,
  })
}

export const groupsSettingsUseCase = { execute }
