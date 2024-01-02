import {LMLikeUI} from './LMLikeUI';
import {LMUserUI} from './LMUserUI';

// data model for menu items of post
export interface LMLikeItemUI {
  likes: LMLikeUI[];
  totalCount: number;
  users: {
    [key: string]: LMUserUI;
  };
}
