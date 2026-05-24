(function () {
  'use strict';

  function create(options) {
    let sortKey = options.defaultKey ?? null;
    let sortDirection = options.defaultDirection ?? 'asc';

    const headerButtons = new Map();

    function updateSortHeaderButtons() {
      for (const [key, button] of headerButtons) {
        button.classList.toggle('sort-icon-active', key === sortKey);
        button.dataset.sortDirection = key === sortKey ? sortDirection : '';
      }
    }

    function setHeaderButton(th, key, text, onChange) {
      th.classList.add('sort-header');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sort-header-button';

      const label = document.createElement('span');
      label.textContent = text;

      const icon = document.createElement('span');
      icon.className = 'sort-icon';
      icon.setAttribute('aria-hidden', 'true');

      const iconUp = document.createElement('span');
      iconUp.className = 'sort-icon-up';

      const iconDown = document.createElement('span');
      iconDown.className = 'sort-icon-down';

      icon.append(iconUp, iconDown);
      button.append(label, icon);

      button.addEventListener('click', () => {
        if (sortKey === key) {
          sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          sortKey = key;
          sortDirection = 'asc';
        }

        updateSortHeaderButtons();
        onChange();
      });

      headerButtons.set(key, button);
      th.replaceChildren(button);
      updateSortHeaderButtons();
    }

    function sortItems(items) {
      if (sortKey === null) return items;

      const compare = options.compareMap[sortKey];
      if (compare === undefined) return items;

      const sortedItems = [...items];

      sortedItems.sort((a, b) => {
        const result = compare(a, b);
        return sortDirection === 'asc' ? result : -result;
      });

      return sortedItems;
    }

    return {
      setHeaderButton,
      sortItems,
      updateSortHeaderButtons,
    };
  }

  window.TableSort = {
    create,
  };
})();
