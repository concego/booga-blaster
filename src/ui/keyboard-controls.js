const ignoredTags = new Set(["INPUT", "TEXTAREA", "SELECT"]);

const keyMap = Object.freeze({
  ArrowUp: ["direction", "north"],
  ArrowDown: ["direction", "south"],
  ArrowLeft: ["direction", "west"],
  ArrowRight: ["direction", "east"],
  "1": ["element", "fire"],
  "2": ["element", "water"],
  "3": ["element", "earth"],
  "4": ["element", "air"]
});

export const bindKeyboardControls = ({ onDirection, onElement, onLaunch, onScan, onLives }) => {
  document.addEventListener("keydown", (event) => {
    if (ignoredTags.has(event.target.tagName)) return;

    if (event.key.toLowerCase() === "c") {
      event.preventDefault();
      onLaunch();
      return;
    }
    if (event.key.toLowerCase() === "s") {
      event.preventDefault();
      onScan();
      return;
    }
    if (event.key.toLowerCase() === "l") {
      event.preventDefault();
      onLives();
      return;
    }

    const [action, value] = keyMap[event.key] || [];
    if (!action) return;
    event.preventDefault();
    if (action === "direction") onDirection(value);
    if (action === "element") onElement(value);
  });
};
