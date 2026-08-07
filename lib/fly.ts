export function getElementCenter(
  element: HTMLElement
) {
  const rect =
    element.getBoundingClientRect();

  return {
    x:
      rect.left +
      rect.width / 2,

    y:
      rect.top +
      rect.height / 2,
  };
}

export function getImageStartPosition(
  element: HTMLElement
) {
  const rect =
    element.getBoundingClientRect();

  return {
    x:
      rect.left +
      rect.width / 2,

    y:
      rect.top +
      rect.height / 2,
  };
}

export function getCartPosition() {

  const mobileBottom =
    document.getElementById(
      "bottom-cart"
    );

  if (
    mobileBottom &&
    window.innerWidth < 1024
  ) {
    return getElementCenter(
      mobileBottom
    );
  }

  const mobileHeader =
    document.getElementById(
      "header-cart-mobile"
    );

  if (
    mobileHeader &&
    window.innerWidth < 1024
  ) {
    return getElementCenter(
      mobileHeader
    );
  }

  const desktop =
    document.getElementById(
      "header-cart"
    );

  if (desktop) {
    return getElementCenter(
      desktop
    );
  }

  return {

    x:
      window.innerWidth - 50,

    y:
      window.innerWidth < 1024
        ? window.innerHeight - 42
        : 52,

  };

}