type LMMetaType = any;
type MetaDataType = any;

export interface Widget {
  id: string;
  LmMeta?: Record<string, LMMetaType>;
  createdAt: number;
  metadata: Record<string, MetaDataType>;
  parentEntityId: string;
  parentEntityType: string;
  updatedAt: number;
}
