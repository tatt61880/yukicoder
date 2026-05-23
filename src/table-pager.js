(function () {
  'use strict';

  window.TablePager = {
    create,
  };

  let nextId = 0;

  return;

  // ==========================================================================

  function create(parentElem, option) {
    const storageKey = option.storageKey;
    const itemName = option.itemName;
    const pageSizeOptions = option.pageSizeOptions;

    let currentPage = 1;
    let onChange = null;

    const container = document.createElement('div');
    container.className = 'table-pager';
    parentElem.appendChild(container);

    const sizeElem = document.createElement('span');
    sizeElem.className = 'table-pager-size';
    container.appendChild(sizeElem);

    const label = document.createElement('label');
    label.className = 'table-pager-label';
    label.textContent = '表示件数: ';
    sizeElem.appendChild(label);

    const select = document.createElement('select');
    const selectId = `table-page-size-${nextId}`;
    nextId++;
    select.id = selectId;
    select.name = selectId;
    label.htmlFor = selectId;
    sizeElem.appendChild(select);

    for (const pageSizeOption of pageSizeOptions) {
      const selectOption = document.createElement('option');
      selectOption.value = pageSizeOption.value;
      selectOption.textContent = pageSizeOption.text;
      select.appendChild(selectOption);
    }

    const valueList = pageSizeOptions.map(
      (pageSizeOption) => pageSizeOption.value
    );
    const storedValue = localStorage.getItem(storageKey);
    select.value = valueList.includes(storedValue)
      ? storedValue
      : pageSizeOptions[0].value;

    const nav = document.createElement('span');
    nav.className = 'table-pager-nav';
    container.appendChild(nav);

    const prevButton = document.createElement('button');
    prevButton.type = 'button';
    prevButton.textContent = '前へ';
    nav.appendChild(prevButton);

    const nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.textContent = '次へ';
    nav.appendChild(nextButton);

    const status = document.createElement('span');
    status.className = 'table-pager-status';
    status.setAttribute('aria-live', 'polite');
    nav.appendChild(status);

    const pageButtons = document.createElement('span');
    pageButtons.className = 'table-pager-pages';
    nav.appendChild(pageButtons);

    select.addEventListener('change', () => {
      localStorage.setItem(storageKey, select.value);
      currentPage = 1;
      callOnChange();
    });

    prevButton.addEventListener('click', () => {
      currentPage--;
      callOnChange();
    });

    nextButton.addEventListener('click', () => {
      currentPage++;
      callOnChange();
    });

    return {
      setOnChange(func) {
        onChange = func;
      },

      getBeginIndex() {
        const pageSize = getPageSize();
        if (pageSize === Infinity) return 0;

        return (currentPage - 1) * pageSize;
      },

      getEndIndex(itemCount) {
        const pageSize = getPageSize();
        if (pageSize === Infinity) return itemCount;

        return Math.min(this.getBeginIndex() + pageSize, itemCount);
      },

      update(itemCount) {
        const pageSize = getPageSize();
        const pageCount = getPageCount(itemCount, pageSize);

        currentPage = Math.min(Math.max(currentPage, 1), pageCount);

        const beginIndex = this.getBeginIndex();
        const endIndex = this.getEndIndex(itemCount);

        if (itemCount === 0) {
          status.textContent = `0${itemName}`;
        } else if (pageSize === Infinity) {
          status.textContent = `全${itemCount}${itemName}`;
        } else {
          status.textContent = `${
            beginIndex + 1
          }〜${endIndex} / ${itemCount}${itemName}`;
        }

        pageButtons.textContent = '';

        if (pageSize !== Infinity) {
          for (const pageNumber of getPageNumbers(currentPage, pageCount)) {
            const pageButton = document.createElement('button');
            pageButton.type = 'button';
            pageButton.textContent = pageNumber;
            pageButton.disabled = pageNumber === currentPage;
            pageButton.setAttribute('aria-label', `${pageNumber}ページ目へ`);

            if (pageNumber === currentPage) {
              pageButton.setAttribute('aria-current', 'page');
            }

            pageButton.addEventListener('click', () => {
              currentPage = pageNumber;
              callOnChange();
            });

            pageButtons.appendChild(pageButton);
          }
        }

        prevButton.disabled = currentPage <= 1 || pageSize === Infinity;
        nextButton.disabled = currentPage >= pageCount || pageSize === Infinity;
      },
    };

    function getPageSize() {
      if (select.value === 'all') return Infinity;

      return Number(select.value);
    }

    function getPageCount(itemCount, pageSize) {
      if (pageSize === Infinity) return 1;

      return Math.max(1, Math.ceil(itemCount / pageSize));
    }

    function getPageNumbers(currentPage, pageCount) {
      if (pageCount <= 10) return range(1, pageCount);

      const pageNumbers = [currentPage];

      let tmpExp = 1;
      while (true) {
        tmpExp *= 2;

        const pageNumber = currentPage - tmpExp + 1;
        if (pageNumber < 1) break;

        pageNumbers.unshift(pageNumber);
      }

      if (pageNumbers[0] !== 1) {
        pageNumbers.unshift(1);
      }

      tmpExp = 1;
      while (true) {
        tmpExp *= 2;

        const pageNumber = currentPage + tmpExp - 1;
        if (pageNumber > pageCount) break;

        pageNumbers.push(pageNumber);
      }

      if (pageNumbers[pageNumbers.length - 1] !== pageCount) {
        pageNumbers.push(pageCount);
      }

      return pageNumbers;
    }

    function range(begin, end) {
      return Array.from({ length: end - begin + 1 }, (_, i) => begin + i);
    }

    function callOnChange() {
      if (onChange !== null) onChange();
    }
  }
})();
