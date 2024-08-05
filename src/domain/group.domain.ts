import { BaseDomain } from './base.domain'

export interface IGroup extends BaseDomain {
  groupsQuantity?: string
  teamsPerGroup?: string
}
