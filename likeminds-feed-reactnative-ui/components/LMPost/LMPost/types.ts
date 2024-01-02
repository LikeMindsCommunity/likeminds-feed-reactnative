import {LMPostUI} from '../../../models';
import {LMPostContentProps} from '../LMPostContent/types';
import {LMPostMediaProps} from '../LMPostMedia/types';
import {LMPostFooterProps} from '../LMPostFooter/types';
import {LMPostHeaderProps} from '../LMPostHeader/types';
export interface LMPostProps {
  post: LMPostUI;
  headerProps?: LMPostHeaderProps;
  footerProps?: LMPostFooterProps;
  contentProps?: LMPostContentProps;
  mediaProps?: LMPostMediaProps;
}
