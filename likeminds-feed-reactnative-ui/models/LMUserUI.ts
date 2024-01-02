import {LMSDKClientInfoUI} from './LMSDKClientInfoUI';

// data model for user object
export interface LMUserUI {
  id: number;
  name: string;
  imageUrl: string;
  userUniqueId: string;
  sdkClientInfo: LMSDKClientInfoUI;
  uuid: string;
  isGuest: boolean;
  updatedAt: number;
  customTitle: string;
  organisationName: string | null;
}
