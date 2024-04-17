import { LMPostMenuProps } from "../LMPostMenu/types";

export interface LMPostHeaderProps {
  postMenu?: LMPostMenuProps; // this represents the post menu props
  onOverlayMenuClick?: (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => void;
}
