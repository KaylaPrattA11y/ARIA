export class Aria {

  // all focusable elements
  focusableElements = 'audio, button, canvas, details, iframe, [href], input, select, summary, textarea, video, progress, [accesskey], [contenteditable], [tabindex]:not([tabindex="-1"])';

  // roles that can have [aria-disabled]
  disabledRoles = ["button", "group", "input", "link", "menuitem", "menuitemradio", "menuitemcheckbox", "tab", "combobox", "listbox", "radio", "radiogroup", "checkbox", "select", "switch", "tablist", "textbox", "toolbar"];

  // tags that can be :disabled
  disabledTags = ["BUTTON", "FIELDSET", "OPTGROUP", "OPTION", "SELECT", "TEXTAREA", "INPUT", "PROGRESS", "A"];

  // roles that can have [aria-selected]
  selectedRoles = ["gridcell", "option", "row", "tab"];

  // tags that can be :selected
  selectedTags = ["OPTION"];

  // roles that can have [aria-checked]
  checkedRoles = ["checkbox", "menuitemcheckbox", "menuitemradio", "option", "radio", "switch"];

  // tags that can be :checked
  checkedTags = ["INPUT"];

  // roles that can have [aria-expanded]
  expandedRoles = ["application", "button", "checkbox", "combobox", "gridcell", "link", "listbox", "menuitem", "row", "rowheader", "tab", "treeitem"];

  // tags that can have [aria-expanded]
  expandedTags = ["BUTTON"];

  href = null;

  /**
   * @desc Whether the Target Element can be disabled
   * @param {Element} t Target Element
   * @returns Boolean
   */
  canDisable = t => 
    [...this.disabledTags].some(tag => tag === t?.tagName) || 
    [...this.disabledRoles].some(role => role === t?.getAttribute("role"));
  
  /**
   * @desc Whether the Target Element can be selected
   * @param {Element} t Target Element
   * @returns Boolean
   */
  canSelect = t => 
    [...this.selectedTags].some(tag => tag === t?.tagName) || 
    [...this.selectedRoles].some(role => role === t?.getAttribute("role"));
  
  /**
   * @desc Whether the Target Element can be checked
   * @param {Element} t Target Element
   * @returns Boolean
   */
  canCheck = t => 
    [...this.checkedTags].some(tag => tag === t?.tagName) || 
    [...this.checkedRoles].some(role => role === t?.getAttribute("role"));

  /**
   * @desc Whether the Target Element can be expanded
   * @param {Element} t Target Element
   * @returns Boolean
   */
  canExpand = t => 
    [...this.expandedTags].some(tag => tag === t?.tagName) || 
    [...this.expandedRoles].some(role => role === t?.getAttribute("role"));

  /**
   * @desc Checks a list of conditions to verify if the Target Element is focusable
   * @param {Element} t Target Element
   * @returns Boolean
   */
  canBeFocused = t => {
    const hasTabIndex = t.tabIndex > -1;
    const isVisible = !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length);
    const isNotHidden = !t.hasAttribute('hidden') && !t.classList.contains("hidden") && !t.classList.contains("d-none");
    const isNotDisabled = !t.hasAttribute('disabled');
    // Check if the element is not a focus bumper
    const isNotABumper = !t.hasAttribute('data-focus-bumper');
    const canBeFocused = hasTabIndex && isVisible && isNotHidden && isNotDisabled && isNotABumper;
  
    return canBeFocused;
  }

  /**
   * @desc Whether the Target Element is single or multi-select
   * @param {Element} t Target Element
   * @returns Boolean
   */
  isMultiselectable = t => t.getAttribute("aria-multiselectable") === "true";

  /**
   * @desc Whether the Target Element is currently expanded
   * @param {Element} t Target Element
   * @returns Boolean
   */
  isExpanded = t => {
    if (!this.canExpand(t)) return false;
    return t.getAttribute("aria-expanded") === "true";
  }

  /**
   * @desc Whether the Target Element is currently checked
   * @param {Element} t Target Element
   * @returns Boolean
   */
  isChecked = t => {
    if (!this.canCheck(t)) return false;
    if (t.getAttribute("aria-checked")) {
      return t.getAttribute("aria-checked") === "true";
    }
    return t.checked;
  }
  
  /**
   * @desc Whether the Target Element is currently mixed (tri-state checkbox)
   * @param {Element} t Target Element
   * @returns Boolean
   */
  isMixed = t => {
    if (!this.canCheck(t)) return false;
    return t.getAttribute("aria-checked") === "mixed";
  }

  /**
   * @desc Whether the Target Element is currently selected
   * @param {Element} t Target Element
   * @returns Boolean
   */
  isSelected = t => {
    if (!this.canSelect(t)) return false;
    if (t.getAttribute("aria-selected")) {
      return t.getAttribute("aria-selected") === "true";
    }
    return t.selected;
  }

  /**
   * @desc Whether the Target Element is currently checked/selected
   * @param {Element} t Target Element
   * @returns Boolean
   */
  isCheckedOrSelected = t => this.isChecked(t) || this.isSelected(t);

  isDisabled = t => {
    if (!this.canDisable(t)) return false;
    if (t.getAttribute("aria-disabled")) {
      return t.getAttribute("aria-disabled") === "true";
    }
    return t.disabled;
  }

  /**
   * @desc Get the ID(s) of the element(s) that the Target Element is labeled by
   * @param {Element} t Target Element
   * @returns Array of Strings
   */
  getLabelledby = t => t.getAttribute("aria-labelledby")?.split(" ");

  /**
   * @desc Get the element(s) that the Target Element is labeled by
   * @param {Element} t Target Element
   * @returns Array of Elements
   */
  getLabelledbyElements = t => this.getLabelledby(t).map(id => document.getElementById(id));

  /**
   * @desc Gets the `<label>` element for the Target Element
   * @param {Element} t Target Element
   * @returns Element
   */
  getLabelElement = t => document.querySelector(`label[for="${t.id}"]`);

  /**
   * @desc Get the ID(s) of the element(s) that the Target Element controls
   * @param {Element} t Target Element
   * @returns Array of Strings
   */
  getControls = t => t.getAttribute("aria-controls")?.split(" ");

  /**
   * @desc Get the element(s) that the Target Element controls
   * @param {Element} t Target Element
   * @returns Array of Elements
   */
  getControlsElements = t => this.getControls(t).map(id => document.getElementById(id));

  /**
   * @desc Get the element(s) that control the Target Element
   * @param {Element} t Target Element
   * @returns Array of Elements
   */
  getControllingElements = t => {
    if (!t.hasAttribute("id")) {
      console.warn(`You cannot find the controller(s) for the element ${t} because it lacks an ID attribute.`);
      return null;
    }
    const allControllers = document.querySelectorAll(`[aria-controls]`);

    return [...allControllers].filter(item => item.getAttribute("aria-controls").includes(t.id));
  }

  /**
   * @desc Get a text string that labels the Target Element
   * @param {Element} t Target Element
   * @returns String
   */
  getLabelText(t) {
    // check aria-labelledby attribute first
    if (this.getLabelledby(t)) {
      const labels = [];

      this.getLabelledbyElements(t).forEach(el => {
        labels.push(el.innerText);
      });
      return labels.join(" ");
    }
    // check aria-label attribute next
    if (t.getAttribute("aria-label")) {
      return t.getAttribute("aria-label");
    }
    // check if a <label> element exists last
    if (this.getLabelElement(t)) {
      return this.getLabelElement(t).innerText;
    }
    console.error(`No label available for element: ${t}`)
    return "NO LABEL AVAILABLE";
  }

  /**
   * @desc Gets the Id of the Target Element's currently active descendant
   * @param {Element} t Target Element
   * @returns String
   */
  getActivedescendant = t => t?.getAttribute("aria-activedescendant");

  /**
   * @desc Gets the Target Element's currently active descendant element
   * @param {Element} t Target Element
   * @returns Element
   */
  getActivedescendantElement = t => document.getElementById(this.getActivedescendant(t));

  /**
   * @desc Gets all focusable elements inside Target Element
   * @param {Element} t Target Element
   * @returns Array of elements
   */
  getFocusableElements(t) {
    const focusableElements = t.querySelectorAll(this.focusableElements);

    return Array.from(focusableElements)
      .filter(item => this.canBeFocused(item));
  }

  /**
   * @desc Gets the last focusable element inside Target Element
   * @param {Element} t Target Element
   * @returns Node
   */
  getLastFocusableNode(t) {
    return this.getFocusableElements(t).reverse().find(element =>
      element.tabIndex > -1
    );
  }

  /**
   * @desc Gets the first focusable element inside Target Element
   * @param {Element} t Target Element
   * @returns Node
   */
  getFirstFocusableNode(t) {
    return this.getFocusableElements(t).find(element =>
      element.tabIndex > -1
    );
  }

  /**
   * @desc Disable/enable an element using the correct attribute which is determined by its HTML `tagName` or `[role]`
   * @param {Element} t Target Element
   * @param {Boolean} doDisable
   */
  disable(t, doDisable = true) {
    if (!this.canDisable(t)) return;
    if ([...this.disabledTags].some(tag => tag === t.tagName)) {
      // eslint-disable-next-line no-param-reassign
      t.disabled = doDisable;
      if (t.tagName === "A" && t.hasAttribute("href")) {
        this.handleDisableHref(t, doDisable);
      }
    }
    if ([...this.disabledRoles].some(role => role === t.getAttribute("role"))) {
      t.setAttribute("aria-disabled", doDisable);
    }
  }

  /**
   * @desc Select/deselect an element using the correct attribute which is determined by its HTML `tagName` or `[role]`
   * @param {Element} t Target Element
   * @param {Boolean} doSelect
   */
  select(t, doSelect = true) {
    if (!this.canSelect(t)) return;
    if ([...this.selectedTags].some(tag => tag === t.tagName)) {
      // eslint-disable-next-line no-param-reassign
      t.selected = doSelect;
    }
    if ([...this.selectedRoles].some(role => role === t.getAttribute("role"))) {
      t.setAttribute("aria-selected", doSelect);
    }
  }

  /**
   * @desc Check/uncheck an element using the correct attribute which is determined by its HTML `tagName` or `[role]`
   * @param {Element} t Target Element
   * @param {Boolean} doCheck
   */
  check(t, doCheck = true) {
    if (!this.canCheck(t)) return;
    if ([...this.checkedTags].some(tag => tag === t.tagName)) {
      if (t.getAttribute("type") !== "radio" && t.getAttribute("type") !== "checkbox") return;
      // eslint-disable-next-line no-param-reassign
      t.checked = doCheck;
    }
    if ([...this.checkedRoles].some(role => role === t.getAttribute("role"))) {
      t.setAttribute("aria-checked", doCheck);
    }
  }

  /**
   * @desc Expand/collapse an element by  updating the `[aria-expanded]` value
   * @param {Element} t Target Element
   * @param {Boolean} doExpand
   */
  expand(t, doExpand = true) {
    if (!this.canExpand(t)) return;
    if (this.getControls(t).length < 1) {
      console.warn(`Element ${t} lacks an [aria-controls] value. That value should contain a space-separated list of ID(s) of the element(s) it controls. https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls`);
    }
    t.setAttribute("aria-expanded", doExpand);
  }

  /**
   * @desc Updates atrributes specifically for the `<a>` element
   * @param {Element} a The `<a>` element
   * @param {Boolean} doDisable 
   */
  handleDisableHref = (a, doDisable) => {
    this.href = a.getAttribute("href");
    if (doDisable) {
      a.removeAttribute("href");
      a.setAttribute("role", "link");
    } else {
      if (this.href != null) {
        a.setAttribute("href", this.href);
      }
      a.removeAttribute("role");
    }
  }

  /**
   * @desc Make children of a container inaccessible by keyboard
   * @param {Element} c The container element
   * @param {Boolean} isUntabbable 
   */
  makeUntabbable = (c, isUntabbable = true) => {
    const tels = c.querySelectorAll(this.focusableElements);
    tels.forEach(el => el.setAttribute("tabindex", isUntabbable ? "-1" : "0"));
  }

}

const ARIA = new Aria();

export default ARIA;
