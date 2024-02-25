class EventManager {
  private listeners: { [key: string]: Function[] } = {};

  subscribe(event: string, listener: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  publish(event: string, data: any) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => listener(data));
  }
}

// // Usage
// const eventManager = new EventManager();

// // Subscribe to an event
// eventManager.subscribe('levelCompleted', (data) => {
//   console.log('Level completed:', data);
// });

// // Publish an event
// eventManager.publish('levelCompleted', { level: 1 });