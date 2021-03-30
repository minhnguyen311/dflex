/* eslint-disable no-unused-vars */
import type { CoreInstanceInterface, Offset } from "@dflex/core-instance";
import type { ELmBranch } from "@dflex/dom-gen";
import type { AbstractDraggableInterface } from "@dflex/draggable";

export interface ThresholdPercentages {
  vertical: number;
  horizontal: number;
}

export interface Threshold {
  maxBottom: number;
  maxTop: number;
  maxLeft: number;
  maxRight: number;
}

export interface LayoutThresholds {
  siblings: { [sk: string]: Threshold };
  dragged: Threshold;
}

export interface TempOffset {
  currentLeft: number;
  currentTop: number;
}

export interface Restrictions {
  allowLeavingFromTop: boolean;
  allowLeavingFromBottom: boolean;
  allowLeavingFromLeft: boolean;
  allowLeavingFromRight: boolean;
}

export interface DraggableOpts {
  restrictions: Restrictions;
  thresholds: ThresholdPercentages;
}

export interface DraggableBaseInterface
  extends AbstractDraggableInterface<CoreInstanceInterface> {
  tempIndex: number;
  operationID: string;

  opts: DraggableOpts;

  parentsList: ELmBranch | null;
  siblingsList: ELmBranch | null;
  activeParent: CoreInstanceInterface | null;

  thresholds: LayoutThresholds;

  isOutActiveParent: boolean;
  thresholdsPercentages: ThresholdPercentages;
  setThreshold(
    top: number,
    left: number,
    height?: number,
    siblingsK?: string
  ): void;
}

export interface DraggableDnDInterface extends DraggableBaseInterface {
  innerOffsetX: number;
  innerOffsetY: number;
  tempOffset: TempOffset;
  prevY: number;
  numberOfElementsTransformed: number;
  isMovingDown: boolean;
  isOutHorizontal: boolean;
  dragAt(x: number, y: number): void;
  incNumOfElementsTransformed(effectedElemDirection: number): void;
  setDraggedMovingDown(y: number): void;
  isDraggedOut(id?: string): boolean;
  isDraggedLeavingFromTop(): boolean;
  isDraggedLeavingFromBottom(): boolean;
  isSiblingsTransformed(): boolean;
  getLastElmIndex(): number;
  isDraggedLastELm(): boolean;
  endDragging(topDifference: number): void;
}