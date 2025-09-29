export const logger = (store) => (next) => (action) => {
//   console.log("Current state:", store.getState());
//   console.log("Dispatching action:", action);
  return next(action); 
};