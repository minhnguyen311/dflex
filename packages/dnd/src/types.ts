import type { Restrictions } from "./Draggable";

import type { ThresholdInterface } from "./Plugins/Threshold";

export type DnDEventTypes =
  | "onDragOver"
  | "onDragLeave"
  | "onDragOutContainer"
  | "onDragOutThreshold"
  | "onLiftUpSiblings"
  | "onMoveDownSiblings"
  | "onStateChange";

export type LayoutState =
  | "pending"
  | "ready"
  | "dragging"
  | "dragEnd"
  | "dragCancel";

interface DnDEvent {
  /** Returns the element that is being dragged */
  type: DnDEventTypes;

  /** Returns the time at which the event was created  */
  timeStamp: number;
}

export interface DraggedEvent extends DnDEvent {
  /** Returns element id in the registry  */
  id: string;

  /** Returns dragged temp index */
  index: number;
}

export interface InteractivityEvent extends DnDEvent {
  /** Returns element id in the registry  */
  id: string;

  /** Returns element current index */
  index: number;

  /** Returns the element that triggered the event  */
  target: HTMLElement;
}

export interface SiblingsEvent extends DnDEvent {
  /** Returns the index where the dragged left  */
  from: number;

  /** Returns the last index effected of the dragged leaving/entering  */
  to: number;

  /** Returns an array of sibling ids in order  */
  siblings: Array<string>;
}

export interface LayoutStateEvent extends DnDEvent {
  layoutState: LayoutState;
}

export interface Events {
  /** Drag events  */
  onDragOutContainer: (event: DraggedEvent) => unknown;
  onDragOutThreshold: (event: DraggedEvent) => unknown;

  /** Interactivity events  */
  onDragOver: (event: InteractivityEvent) => unknown;
  onDragLeave: (event: InteractivityEvent) => unknown;

  /** Sibling events  */
  onLiftUpSiblings: (event: SiblingsEvent) => unknown;
  onMoveDownSiblings: (event: SiblingsEvent) => unknown;

  /** Layout events  */
  onStateChange: (layoutState: LayoutStateEvent) => unknown;
}

export interface ScrollOptWithoutThreshold {
  enable: boolean;
  initialSpeed: number;
}

export interface ScrollOptWithPartialThreshold
  extends ScrollOptWithoutThreshold {
  threshold: Partial<ThresholdInterface["thresholdPercentages"]>;
}

export interface ScrollOptWithThreshold extends ScrollOptWithoutThreshold {
  threshold: ThresholdInterface["thresholdPercentages"];
}

export interface RestrictionsStatus {
  isContainerRestricted: boolean;
  isSelfRestricted: boolean;
}

export interface FinalDndOpts {
  threshold: ThresholdInterface["thresholdPercentages"];
  restrictions: Restrictions;
  restrictionsStatus: RestrictionsStatus;
  scroll: ScrollOptWithThreshold;
  events: Events;
}

export interface DndOpts {
  threshold?: Partial<ThresholdInterface["thresholdPercentages"]>;
  restrictions?: {
    self?: Partial<Restrictions["self"]>;
    container?: Partial<Restrictions["container"]>;
  };
  scroll?: Partial<ScrollOptWithPartialThreshold>;
  events?: Partial<Events>;
}
