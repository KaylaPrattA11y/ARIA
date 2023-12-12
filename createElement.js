/**
 * @desc Create an element and set all attributes, classes, inner text, etc.
 * @param {String} type - HTML tag to create
 * @param {Object} options - set the attributes, id, text, and class of the new element
 * @returns new element
 * @example const button = createElement("button", { text: "Submit", class: "btn-primary icon-check", dataset: { toggle: "select" }, type: "submit" });
 */
const createElement = (type, options = {}) => {
  const element = document.createElement(type);

  Object.entries(options).forEach(([key, value]) => {
    if (key === "class") {
      const classes = value.split(" ");

      classes.forEach(klass => {
        element.classList.add(klass);
      });
      return;
    }

    if (key === "dataset") {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
      return;
    }

    if (key === "text") {
      element.innerText = value;
      return;
    }

    element.setAttribute(key, value);
  });
  return element;
};

export default createElement;