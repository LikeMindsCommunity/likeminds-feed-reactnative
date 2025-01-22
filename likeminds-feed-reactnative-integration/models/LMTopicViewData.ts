export interface LMTopicViewData {
  id: string;
  isEnabled: boolean;
  name: string;
  priority?: number;
  parentId?: string;
  parentName?: string;
  level?: number;
  isSearchable?: boolean;
  widgetId?: string;
}
