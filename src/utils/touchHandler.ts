import { eventEmitter } from './eventEmitter';

interface PointerHandlerConfig {
  swipeThreshold?: number;
  tapMaxDuration?: number;
  tapMaxMovement?: number;
}

export interface SwipeDataType {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  duration: number;
  originalEvent: MouseEvent | TouchEvent;
}

interface PointerStartData {
  x: number;
  y: number;
  time: number;
}

export class PointerHandler {
  private config: Required<PointerHandlerConfig>;
  private pointerStart: PointerStartData | null = null;
  private element: HTMLElement;

  constructor(element: HTMLElement, config: PointerHandlerConfig = {}) {
    this.element = element;

    // Default configuration
    this.config = {
      swipeThreshold: config.swipeThreshold ?? 50,
      tapMaxDuration: config.tapMaxDuration ?? 300,
      tapMaxMovement: config.tapMaxMovement ?? 10,
    };

    this.init();
  }

  private init(): void {
    // Mouse events
    this.element.addEventListener('mousedown', this.handleStart);
    this.element.addEventListener('mouseup', this.handleEnd);
    this.element.addEventListener('mouseleave', this.handleCancel);

    // Touch events
    this.element.addEventListener('touchstart', this.handleStart);
    this.element.addEventListener('touchend', this.handleEnd);
    this.element.addEventListener('touchcancel', this.handleCancel);
  }

  private handleStart = (e: MouseEvent | TouchEvent): void => {
    const point = this.getPoint(e);
    if (!point) return;

    this.pointerStart = {
      x: point.x,
      y: point.y,
      time: Date.now(),
    };
  };

  private handleEnd = (e: MouseEvent | TouchEvent): void => {
    if (!this.pointerStart) return;

    const point = this.getPoint(e);
    if (!point) {
      this.pointerStart = null;
      return;
    }

    const deltaX = point.x - this.pointerStart.x;
    const deltaY = point.y - this.pointerStart.y;
    const duration = Date.now() - this.pointerStart.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Check for tap
    if (
      duration < this.config.tapMaxDuration &&
      distance < this.config.tapMaxMovement
    ) {
      eventEmitter.trigger('tap', [e]);
      this.pointerStart = null;
      return;
    }

    // Check for swipe
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (
      absX > this.config.swipeThreshold ||
      absY > this.config.swipeThreshold
    ) {
      // Determine primary swipe direction
      if (absX > absY) {
        // Horizontal swipe
        const swipeData: SwipeDataType = {
          direction: deltaX > 0 ? 'right' : 'left',
          distance: absX,
          duration,
          originalEvent: e,
        };
        eventEmitter.trigger('swipeX', [swipeData]);
      } else {
        // Vertical swipe
        eventEmitter.trigger('swipeY', [
          {
            direction: deltaY > 0 ? 'down' : 'up',
            distance: absY,
            duration,
            originalEvent: e,
          },
        ]);
      }
    }

    this.pointerStart = null;
  };

  private handleCancel = (): void => {
    this.pointerStart = null;
  };

  private getPoint(
    e: MouseEvent | TouchEvent
  ): { x: number; y: number } | null {
    if (e instanceof MouseEvent) {
      return { x: e.clientX, y: e.clientY };
    } else if (e instanceof TouchEvent) {
      const touch = e.changedTouches[0];
      if (touch) {
        return { x: touch.clientX, y: touch.clientY };
      }
    }
    return null;
  }

  public destroy(): void {
    this.element.removeEventListener('mousedown', this.handleStart);
    this.element.removeEventListener('mouseup', this.handleEnd);
    this.element.removeEventListener('mouseleave', this.handleCancel);
    this.element.removeEventListener('touchstart', this.handleStart);
    this.element.removeEventListener('touchend', this.handleEnd);
    this.element.removeEventListener('touchcancel', this.handleCancel);
    this.pointerStart = null;
  }
}

// Usage example:
// const handler = new PointerHandler(document.body, eventEmitter, {
//   swipeThreshold: 50,
//   tapMaxDuration: 300,
//   tapMaxMovement: 10
// });
//
// eventEmitter.on('tap', (e) => console.log('Tap detected!', e));
// eventEmitter.on('swipeX', (data) => console.log('Horizontal swipe:', data.direction));
// eventEmitter.on('swipeY', (data) => console.log('Vertical swipe:', data.direction));
