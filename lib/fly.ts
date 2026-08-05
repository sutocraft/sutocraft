export function getElementCenter(
  element: HTMLElement
) {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function getImageStartPosition(
  element: HTMLElement
) {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

export function getCartPosition() {
  const cart = document.getElementById("header-cart");

  if (!cart) {
    return {
      x: window.innerWidth - 80,
      y: 60,
    };
  }

  return getElementCenter(cart);
}