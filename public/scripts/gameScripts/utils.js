export function fillAnimateElement(
  element,
  direction,
  animationDuration,
  fillColor,
  unfilledColor,
) {
  const gradientDirection = direction === "ltc" || direction === "ctr" ? "right" : "left";
  element.style.background = `linear-gradient(to ${gradientDirection}, ${fillColor} 50%, ${unfilledColor} 50%)`;
  element.style.backgroundSize = "200%";
  element.style.animation = `${direction} ${animationDuration}s forwards`;
}

export function removeFillAnimationProps(element) {
  element.style.background = "";
  element.style.backgroundSize = "";
  element.style.animation = "";
}
