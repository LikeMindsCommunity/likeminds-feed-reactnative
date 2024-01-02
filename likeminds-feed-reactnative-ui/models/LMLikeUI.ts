import {LMUserUI} from './LMUserUI';

// data model for menu items of post
export interface LMLikeUI {
  id: string;
  createdAt: number;
  updatedAt: number;
  userId: string;
  uuid: string;
  user: LMUserUI;
}
