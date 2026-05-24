(function () {
  'use strict';

  const pageTitle = 'tatt61880によるyukicoderでのACコード';

  document.addEventListener('DOMContentLoaded', onloadApp);
  return;
  // ==========================================================================

  async function onloadApp() {
    const urlQueryParams = analyzeUrl();
    const baseUrl = urlQueryParams.baseUrl;
    const problemId = urlQueryParams.problemId;

    const contentsElem = document.getElementById('contents-data');
    if (contentsElem === null) {
      console.error('Error! #contents-data === null');
      return;
    }

    if (problemId === null) {
      await appendAcList(contentsElem, baseUrl);
    } else {
      await appendSubmissionInfo(contentsElem, baseUrl, problemId);
    }
  }

  // ACコード一覧
  async function appendAcList(contentsElem, baseUrl) {
    const submissionsList = await getSubmissionsList(baseUrl);

    if (submissionsList === null) {
      const p = document.createElement('p');
      p.textContent = '提出データの読み込みに失敗しました。';
      contentsElem.replaceChildren(p);
      return;
    }

    contentsElem.replaceChildren();

    const tablePager = window.TablePager.create(contentsElem, {
      storageKey: 'problemPageSize',
      itemName: '問',
      pageSizeOptions: [
        { value: '10', text: '10問' },
        { value: '20', text: '20問' },
        { value: '50', text: '50問' },
        { value: 'all', text: '全件' },
      ],
    });

    // 件数
    {
      const p = document.createElement('p');
      contentsElem.appendChild(p);

      p.textContent = `計${submissionsList.length}問`;
      p.setAttribute('id', 'total-num');
    }

    let sortKey = 'problemId';
    let sortDirection = 1;

    const table = document.createElement('table');
    table.className = 'main-table';
    contentsElem.appendChild(table);

    const thead = document.createElement('thead');
    table.appendChild(thead);

    const tr = thead.insertRow();
    tr.appendChild(createSortableTh('提出ID', 'submitId'));
    tr.appendChild(createSortableTh('言語', 'language'));
    tr.appendChild(createSortableTh('問題タイトル', 'problemId'));

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    tablePager.setOnChange(renderSubmissionTable);
    updateSortHeaderButtons();
    renderSubmissionTable();

    function renderSubmissionTable() {
      tbody.replaceChildren();

      const sortedSubmissionsList = getSortedSubmissionsList(submissionsList);

      tablePager.update(sortedSubmissionsList.length);

      const beginIndex = tablePager.getBeginIndex();
      const endIndex = tablePager.getEndIndex(sortedSubmissionsList.length);

      for (const submission of sortedSubmissionsList.slice(
        beginIndex,
        endIndex
      )) {
        const problemId = submission[0];
        const submitId = submission[1];
        const language = submission[2];
        const title = submission[5];

        const tr = tbody.insertRow();

        // 提出ID
        {
          const url = `https://yukicoder.me/submissions/${submitId}`;
          const td = tr.insertCell();
          appendExternalLink(td, null, url, String(submitId));
        }

        // 言語
        {
          const td = tr.insertCell();
          td.textContent = language;
        }

        // 問題タイトル
        {
          const url = `?no=${encodeURIComponent(problemId)}`;
          const text = decodeHtmlEntities(title);
          const td = tr.insertCell();
          td.appendChild(createInternalLink(url, text));
        }
      }
    }

    function createSortableTh(text, key) {
      const th = document.createElement('th');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sort-header-button';
      button.dataset.sortKey = key;
      th.appendChild(button);

      const labelSpan = document.createElement('span');
      labelSpan.className = 'sort-header-label';
      labelSpan.textContent = text;
      button.appendChild(labelSpan);

      const iconSpan = document.createElement('span');
      iconSpan.className = 'sort-icon';
      button.appendChild(iconSpan);

      const upSpan = document.createElement('span');
      upSpan.className = 'sort-icon-asc';
      iconSpan.appendChild(upSpan);

      const downSpan = document.createElement('span');
      downSpan.className = 'sort-icon-desc';
      iconSpan.appendChild(downSpan);

      button.addEventListener('click', () => {
        if (sortKey === key) {
          sortDirection *= -1;
        } else {
          sortKey = key;
          sortDirection = 1;
        }

        updateSortHeaderButtons();
        renderSubmissionTable();
      });

      updateSortHeaderButton(button);

      return th;
    }

    function updateSortHeaderButtons() {
      for (const button of document.querySelectorAll('.sort-header-button')) {
        updateSortHeaderButton(button);
      }
    }

    function updateSortHeaderButton(button) {
      const key = button.dataset.sortKey;
      const upSpan = button.querySelector('.sort-icon-asc');
      const downSpan = button.querySelector('.sort-icon-desc');

      upSpan.classList.toggle(
        'sort-icon-active',
        sortKey === key && sortDirection === 1
      );
      downSpan.classList.toggle(
        'sort-icon-active',
        sortKey === key && sortDirection === -1
      );
    }

    function getSortedSubmissionsList(list) {
      return Array.from(list).sort(compareSubmissions);
    }

    function compareSubmissions(a, b) {
      let result = 0;

      if (sortKey === 'submitId') {
        result = compareNumber(a[1], b[1]);
      } else if (sortKey === 'language') {
        result = String(a[2]).localeCompare(String(b[2]), 'ja');
      } else if (sortKey === 'problemId') {
        result = compareNumber(a[0], b[0]);
      }

      if (result === 0 && sortKey !== 'problemId') {
        result = compareNumber(a[0], b[0]);
      }

      if (result === 0 && sortKey !== 'submitId') {
        result = compareNumber(a[1], b[1]);
      }

      return result * sortDirection;
    }

    function compareNumber(a, b) {
      return Number(a) - Number(b);
    }
  }

  function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  // 提出内容
  async function appendSubmissionInfo(contentsElem, baseUrl, problemId) {
    // ページタイトル
    {
      let title = await getTitle(baseUrl, problemId);
      if (title !== null) {
        title = `${decodeHtmlEntities(title)} - ${pageTitle}`;
      } else {
        title = `No.${problemId} - ${pageTitle}`;
      }

      document.title = title;

      const h2 = document.createElement('h2');
      h2.textContent = title;

      contentsElem.replaceChildren(h2);
    }

    // 問題URL
    {
      const problemUrl = getProblemUrl(problemId);
      appendExternalLink(contentsElem, '問題リンク: ', problemUrl);
    }

    // 解説
    {
      let editorial = await getEditorial(baseUrl, problemId);
      if (editorial !== null) {
        const h3 = document.createElement('h3');
        h3.innerText = '解説';
        contentsElem.appendChild(h3);

        editorial = editorial.replaceAll('\\(', '\\\\(');
        editorial = editorial.replaceAll('\\)', '\\\\)');

        const md = window.markdownit();
        const result = md.render(editorial);

        const div = document.createElement('div');
        div.innerHTML = result;
        contentsElem.appendChild(div);

        window.renderMathInElement(div);

        contentsElem.appendChild(document.createElement('hr'));
      }
    }

    // 提出URL
    {
      const submissionUrl = await getSubmissionUrl(baseUrl, problemId);
      appendExternalLink(contentsElem, '提出リンク: ', submissionUrl);
    }

    // 提出したソースコード
    {
      const src = await getSrc(baseUrl, problemId);
      if (src !== null) {
        const h3 = document.createElement('h3');
        h3.textContent = '提出したソースコード (言語: Kuin)';
        contentsElem.appendChild(h3);

        const codeContainer = document.createElement('div');
        codeContainer.classList.add('code-container');
        contentsElem.appendChild(codeContainer);

        const copyButton = document.createElement('button');
        copyButton.type = 'button';
        copyButton.classList.add('code-copy-button');
        copyButton.textContent = 'Copy';
        codeContainer.appendChild(copyButton);

        copyButton.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(src);
            copyButton.textContent = 'Copied!';

            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 1000);
          } catch (error) {
            console.error(error);
            copyButton.textContent = 'Failed';

            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 1000);
          }
        });

        const pre = document.createElement('pre');
        pre.classList.add('code');
        codeContainer.appendChild(pre);

        const editor = tryElemToKuinEditor(pre);
        if (editor !== null) {
          editor.setValue(src);
          editor.navigateTo(0, 0);
        } else {
          pre.textContent = src;
        }
      } else {
        const p = document.createElement('p');
        p.className = 'link-load-error';
        p.textContent = 'ソースコードの読み込みに失敗しました。';
        contentsElem.appendChild(p);
      }
    }
  }

  function appendExternalLink(
    parentElem,
    labelText,
    url,
    urlText = String(url)
  ) {
    let elem = parentElem;

    if (labelText !== null) {
      const p = document.createElement('p');
      p.classList.add('external-url');
      parentElem.append(p);

      const span = document.createElement('span');
      span.classList.add('url-label');
      span.textContent = labelText;
      p.append(span);
      elem = p;
    }

    if (url === null) {
      const span = document.createElement('span');
      span.textContent = 'URLの読み込みに失敗しました。';
      span.className = 'link-load-error';

      elem.appendChild(span);
    } else {
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      appendUrlTextWithBreaks(a, urlText);
      elem.appendChild(a);
    }
  }

  function appendUrlTextWithBreaks(parentElem, urlText) {
    const parts = String(urlText).split('/');

    parentElem.textContent = '';

    parts.forEach((part, i) => {
      if (i !== 0) {
        parentElem.append('/');
        parentElem.append(document.createElement('wbr'));
      }
      parentElem.append(part);
    });
  }

  function analyzeUrl() {
    const params = new URLSearchParams(location.search);

    return {
      baseUrl: new URL('./', location.href),
      problemId: params.get('no'),
    };
  }

  function tryElemToKuinEditor(elem) {
    if (window.ace === undefined) {
      return null;
    }

    const editor = window.ace.edit(elem);
    editor.setTheme('ace/theme/kuin');
    editor.session.setMode('ace/mode/kuin');
    editor.setReadOnly(true);
    editor.setOptions({
      maxLines: 10000,
      autoScrollEditorIntoView: true,
      fontSize: '16px',
    });
    editor.resize();
    return editor;
  }

  function createInternalLink(url, text = url) {
    const a = document.createElement('a');

    a.href = url;
    a.textContent = text;

    return a;
  }

  // 問題URLを取得
  function getProblemUrl(problemId) {
    if (problemId === null) return null;

    return new URL(
      `problems/no/${encodeURIComponent(problemId)}`,
      'https://yukicoder.me/'
    );
  }

  function parseUrlFile(text) {
    const match = text.match(/^URL=(.+)$/m);
    if (match === null) return null;

    return match[1].trim();
  }

  async function getSubmissionUrl(baseUrl, problemId) {
    const res = await fetchText(
      new URL(
        `submissions/${encodeURIComponent(problemId)}/submission.url`,
        baseUrl
      )
    );

    if (res !== null) {
      return parseUrlFile(res);
    }

    return null;
  }

  async function getSubmissionsList(baseUrl) {
    return await fetchJson(
      new URL('submissions/newestSubmissions.json', baseUrl)
    );
  }

  async function getTitle(baseUrl, problemId) {
    return await fetchText(
      new URL(`submissions/${encodeURIComponent(problemId)}/title.txt`, baseUrl)
    );
  }

  async function getEditorial(baseUrl, problemId) {
    return await fetchText(
      new URL(`md/${encodeURIComponent(problemId)}.md`, baseUrl)
    );
  }

  async function getSrc(baseUrl, problemId) {
    return await fetchText(
      new URL(`submissions/${encodeURIComponent(problemId)}/main.kn`, baseUrl)
    );
  }

  async function fetchResponse(url) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return response;
    } catch (error) {
      console.error(error);
    }

    return null;
  }

  async function fetchText(url) {
    const response = await fetchResponse(url);
    if (response === null) return null;

    return await response.text();
  }

  async function fetchJson(url) {
    const response = await fetchResponse(url);
    if (response === null) return null;

    try {
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
})();
