// Debounce function
export function debounce(func, delay) {
  let timer;

  return function (...args) {
    // Clear the timer if the function is called again within the delay period
    clearTimeout(timer);

    // Set a new timer for the provided delay
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
