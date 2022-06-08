import type { IDFlexBaseNode } from "@dflex/core-instance";
import type { IPointNum } from "@dflex/utils";

export type DraggedStyle = {
  prop: string;
  dragValue: string;
  afterDragValue: string | null;
}[];

export interface IAbstractDraggable<T extends IDFlexBaseNode> {
  draggedElm: T;

  /**
   * When dragging start, element shouldn't jump from its translate. So, we
   * calculate offset that make translate X,Y start from zero:
   *  goToX = x + this.outerOffsetX.
   *  goToY = y + this.outerOffsetY.
   *
   * goToX and goToY both should be zero with first click. Starts with simple
   * equating: initX = X. Taking into considerations translate value.
   *
   */
  outerOffset: IPointNum;
  translatePlaceholder: IPointNum;
  changeStyle(style: DraggedStyle, shouldAddPosition: boolean): void;
}
