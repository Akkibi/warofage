// import { eventEmitter } from './eventEmitter';

// interface TouchPosition {
//   x: number;
//   y: number;
// }

// class TouchHandler {
//   private static instance: TouchHandler;
//   private startPos: TouchPosition | null = null;
//   private lastPos: TouchPosition | null = null;
//   private isDragging: boolean = false;
//   private dragThreshold: number = 5; // minimum pixels to trigger drag

//   private constructor() {
//     // Private constructor for singleton
//   }

//   public static getInstance(): TouchHandler {
//     if (!TouchHandler.instance) {
//       TouchHandler.instance = new TouchHandler();
//     }
//     return TouchHandler.instance;
//   }

//   public initialize(): void {
//     this.attachListeners();
//   }

//   private attachListeners(): void {
//     document.addEventListener('touchstart', this.handleTouchStart.bind(this), {
//       passive: false,
//     });
//     document.addEventListener('touchmove', this.handleTouchMove.bind(this), {
//       passive: false,
//     });
//     document.addEventListener('touchend', this.handleTouchEnd.bind(this), {
//       passive: false,
//     });
//     document.addEventListener('touchcancel', this.handleTouchEnd.bind(this), {
//       passive: false,
//     });
//   }

//   private handleTouchStart(e: TouchEvent): void {
//     const touch = e.touches[0];
//     this.startPos = { x: touch.clientX, y: touch.clientY };
//     this.lastPos = { ...this.startPos };
//     this.isDragging = false;
//   }

//   private handleTouchMove(e: TouchEvent): void {
//     if (!this.startPos || !this.lastPos) return;

//     const touch = e.touches[0];
//     const currentPos = { x: touch.clientX, y: touch.clientY };

//     const deltaX = currentPos.x - this.lastPos.x;
//     const deltaY = currentPos.y - this.lastPos.y;

//     // Check if drag threshold is exceeded
//     if (!this.isDragging) {
//       const totalDelta =
//         Math.abs(currentPos.x - this.startPos.x) +
//         Math.abs(currentPos.y - this.startPos.y);
//       if (totalDelta > this.dragThreshold) {
//         this.isDragging = true;
//       }
//     }

//     if (this.isDragging) {
//       // Emit drag events
//       if (Math.abs(deltaX) > 0) {
//         eventEmitter.trigger('touch-drag-x', {
//           delta: deltaX,
//           position: currentPos.x,
//           startPosition: this.startPos.x,
//         });
//       }

//       if (Math.abs(deltaY) > 0) {
//         eventEmitter.trigger('touch-drag-y', {
//           delta: deltaY,
//           position: currentPos.y,
//           startPosition: this.startPos.y,
//         });
//       }
//     }

//     this.lastPos = currentPos;
//   }

//   private handleTouchEnd(e: TouchEvent): void {
//     if (!eventEmitter || !this.startPos) return;

//     // If it wasn't a drag, emit a touch event
//     if (!this.isDragging) {
//       eventEmitter.trigger('touch', {
//         x: this.startPos.x,
//         y: this.startPos.y,
//       });
//     }

//     // Reset state
//     this.startPos = null;
//     this.lastPos = null;
//     this.isDragging = false;
//   }

//   public setDragThreshold(threshold: number): void {
//     this.dragThreshold = threshold;
//   }

//   public destroy(): void {
//     document.removeEventListener(
//       'touchstart',
//       this.handleTouchStart.bind(this)
//     );
//     document.removeEventListener('touchmove', this.handleTouchMove.bind(this));
//     document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
//     document.removeEventListener('touchcancel', this.handleTouchEnd.bind(this));
//     eventEmitter = null;
//   }
// }

// export default TouchHandler;

// // Usage example:
// // const touchHandler = TouchHandler.getInstance();
// // touchHandler.initialize(myEventEmitter);
// //
// // myEventEmitter.on('touch', (data) => {
// //   console.log('Touch at:', data.x, data.y);
// // });
// //
// // myEventEmitter.on('touch-drag-x', (data) => {
// //   console.log('Drag X:', data.delta);
// // });
// //
// // myEventEmitter.on('touch-drag-y', (data) => {
// //   console.log('Drag Y:', data.delta);
// // });
