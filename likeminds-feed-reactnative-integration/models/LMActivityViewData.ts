import { ActivityEntityType, ActivityActionType } from '@likeminds.community/feed-rn';
import {LMActivityEntityViewData} from './LMActivityEntityViewData';
import {LMUserViewData} from './LMUserViewData';

export interface LMActivityViewData {
  id: string;
  isRead: boolean;
  actionOn: string;
  actionBy: Array<string>;
  entityType: ActivityEntityType;
  entityId: string;
  entityOwnerId: string;
  action: ActivityActionType;
  cta: string;
  activityText: string;
  activityEntityData?: LMActivityEntityViewData;
  activityByUser: LMUserViewData;
  createdAt: number;
  updatedAt: number;
  uuid: string;
}
