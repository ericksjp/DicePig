export function redirect(game_id) {
  localStorage.setItem("queue", false);
  localStorage.setItem("game_id", game_id);
  window.location.href = "game.html";
}

export function constrainValue(value, defaultValue, minValue, maxValue) {
  let numValue = Number(value);
  if (isNaN(numValue)) numValue = defaultValue;
  return Math.min(Math.max(numValue, minValue), maxValue);
}
