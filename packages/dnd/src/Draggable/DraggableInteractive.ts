import type { DraggedStyle, Coordinates } from "@dflex/draggable";

import { AxesCoordinates } from "@dflex/utils";
import type { AxesCoordinatesInterface } from "@dflex/utils";

import type { CoreInstanceInterface } from "@dflex/core-instance";

import store from "../DnDStore";

import type { DraggableInteractiveInterface } from "./types";

import type { ScrollOptWithThreshold, FinalDndOpts } from "../types";

import DraggableAxes from "./DraggableAxes";

class DraggableInteractive
  extends DraggableAxes
  implements DraggableInteractiveInterface
{
  operationID: string;

  siblingsContainer: CoreInstanceInterface | null;

  setOfTransformedIds?: Set<string>;

  scroll: ScrollOptWithThreshold;

  occupiedOffset: AxesCoordinatesInterface;

  occupiedTranslate: AxesCoordinatesInterface;

  numberOfElementsTransformed: number;

  isDraggedPositionFixed: boolean;

  private changeToFixedStyleProps: DraggedStyle;

  constructor(id: string, initCoordinates: Coordinates, opts: FinalDndOpts) {
    const { parent } = store.getElmTreeById(id);

    super(id, initCoordinates, opts);

    // This tiny bug caused an override  options despite it's actually freezed!
    this.scroll = { ...opts.scroll };

    const { SK } = store.registry[id].keys;

    const { hasOverflowX, hasOverflowY } = store.siblingsScrollElement[SK];

    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    this.isDraggedPositionFixed = false;

    this.changeToFixedStyleProps = [
      {
        prop: "top",
        dragValue: `${this.draggedElm.currentPosition.y}px`,
        afterDragValue: "",
      },
      {
        prop: "left",
        dragValue: `${this.draggedElm.currentPosition.x}px`,
        afterDragValue: "",
      },
      {
        prop: "position",
        dragValue: "fixed",
        afterDragValue: "",
      },
    ];

    if (siblings === null || (!hasOverflowY && !hasOverflowX)) {
      // Override the default options. (FYI, this is the only privilege I have.)
      this.scroll.enable = false;
    }

    if (this.scroll.enable) {
      this.isViewportRestricted = false;

      store.siblingsScrollElement[SK].setThresholdMatrix(this.scroll.threshold);

      if (!store.siblingsScrollElement[SK].hasDocumentAsContainer) {
        /**
         * When the scroll is the document it's good. The restriction is to the
         * document which guarantees the free movement. Otherwise, let's do it.
         * Change the position and transform siblings.
         */
        // this.isDraggedPositionFixed = true;
      }
    }

    const { currentPosition, translate } = this.draggedElm;

    this.siblingsContainer = null;

    if (parent) {
      /**
       * Indicator to parents that have changed. This facilitates looping in
       * affected parents only.
       */
      this.setOfTransformedIds = new Set([]);
      this.assignActiveParent(parent);
    }

    this.operationID = store.tracker.newTravel();

    this.occupiedOffset = new AxesCoordinates(
      currentPosition.x,
      currentPosition.y
    );

    this.occupiedTranslate = new AxesCoordinates(translate.x, translate.y);

    /**
     * It counts number of element that dragged has passed. This counter is
     * crucial to calculate drag's translate and index
     */
    this.numberOfElementsTransformed = 0;
  }

  /**
   * Assigns new container parent to the dragged.
   *
   * @param element -
   */
  private assignActiveParent(element: CoreInstanceInterface) {
    /**
     * Assign a new instance which represents droppable. Then
     * assign owner parent so we have from/to.
     */
    this.siblingsContainer = element;
  }

  setDraggedTempIndex(i: number) {
    this.indexPlaceholder = i;
    this.draggedElm.setDataset("index", i);
  }

  updateNumOfElementsTransformed(effectedElemDirection: number) {
    this.numberOfElementsTransformed += -1 * effectedElemDirection;
  }

  setDraggedTransformPosition(isFallback: boolean) {
    const siblings = store.getElmSiblingsListById(this.draggedElm.id);

    /**
     * In this case, the use clicked without making any move.
     */
    if (
      isFallback ||
      siblings === null ||
      this.numberOfElementsTransformed === 0
    ) {
      /**
       * If not isDraggedOutPosition, it means dragged is out its position, inside
       * list but didn't reach another element to replace.
       *
       * List's elements is in their position, just undo dragged.
       *
       * Restore dragged position (translateX, translateY) directly. Why? Because,
       * dragged depends on extra instance to float in layout that is not related to element
       * instance.
       */
      if (!this.draggedElm.translate.isEqual(this.translatePlaceholder)) {
        this.draggedElm.transformElm();
        this.draggedElm.setDataset("index", this.draggedElm.order.self);

        /**
         * There's a rare case where dragged leaves and returns to the same
         * position. In this case, undo won't be triggered so that we have to do
         * it manually here. Otherwise, undoing will handle repositioning. I
         * don't like it but it is what it is.
         */
        if (
          siblings &&
          siblings[this.draggedElm.order.self] !== this.draggedElm.id
        ) {
          this.draggedElm.assignNewPosition(
            siblings,
            this.draggedElm.order.self
          );
        }
      }

      return;
    }

    this.draggedElm.currentPosition.clone(this.occupiedOffset);
    this.draggedElm.translate.clone(this.occupiedTranslate);

    this.draggedElm.transformElm();

    if (siblings) {
      this.draggedElm.assignNewPosition(siblings, this.indexPlaceholder);
    }

    this.draggedElm.order.self = this.indexPlaceholder;
  }

  endDragging(isFallback: boolean) {
    this.setDragged(false);
    this.setDraggedTransformPosition(isFallback);

    if (this.isDraggedPositionFixed) {
      this.changeStyle(this.changeToFixedStyleProps, false);
    }
  }
}

export default DraggableInteractive;