import {LMActivityEntityUI} from './LMActivityEntityUI';
import {LMUserUI} from './LMUserUI';

export interface LMActivityUI {
  id: string;
  isRead: boolean;
  actionOn: string;
  actionBy: Array<string>;
  entityType: number;
  entityId: string;
  entityOwnerId: string;
  action: number;
  cta: string;
  activityText: string;
  activityEntityData?: LMActivityEntityUI;
  activityByUser: LMUserUI;
  createdAt: number;
  updatedAt: number;
  uuid: string;
}
