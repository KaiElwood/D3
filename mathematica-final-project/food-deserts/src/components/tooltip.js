import tippy from 'sveltejs-tippy';

export const tooltip = (node, params = {}) => {
  // Determine the title to show. We want to prefer
  //    the custom content passed in first, then the
  // HTML title attribute then the aria-label
  // in that order.
  const custom = params.content;
  const content = custom;

  // Support any of the Tippy props by forwarding all "params":
  // https://atomiks.github.io/tippyjs/v6/all-props/
  const tip = tippy(node, { content, ...params });
  return {
    // If the props change, let's update the Tippy instance:
    update: (newParams) => tip.setProps({ content, ...params }),
    // Clean up the Tippy instance on unmount:
    destroy: () => tip.destroy(),
  };
};
