type LMMetaType = any;
type MetaDataType = any;

export interface LMFeedWidgetViewData {
  id: string;
  lmMeta?: Record<string, LMMetaType>;
  createdAt: number;
  metadata: Record<string, MetaDataType>;
  parentEntityId: string;
  parentEntityType: string;
  updatedAt: number;
}
