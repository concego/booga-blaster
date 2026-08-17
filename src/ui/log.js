export const createLogView = (listElement) => {
  const render = (messages) => {
    listElement.replaceChildren();
    messages.slice(0, 4).forEach((message) => {
      const item = document.createElement("li");
      item.textContent = message;
      listElement.append(item);
    });
  };

  return { render };
};
