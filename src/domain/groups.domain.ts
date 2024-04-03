import { BaseDomain } from './base.domain'

export interface IGroups extends BaseDomain {
  groupsQuantity?: string
  teamsPerGroup?: string
}
