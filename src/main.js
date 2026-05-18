(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', onloadApp);
  return;
  // ==========================================================================

  async function onloadApp() {
    const urlQueryParams = analyzeUrl();
    const baseUrl = urlQueryParams.baseUrl;
    const no = urlQueryParams.no;

    const contentsElem = document.getElementById('contents-data');
    if (contentsElem === null) {
      console.error('Error! #contents-data === null');
      return;
    }

    if (no === null) {
      await appendAcList(contentsElem, baseUrl);
    } else {
      await appendSubmissionInfo(contentsElem, baseUrl, no);
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

    // 件数
    {
      const p = document.createElement('p');
      contentsElem.appendChild(p);

      p.textContent = `${submissionsList.length}件`;
      p.setAttribute('id', 'total-num');
    }

    const table = document.createElement('table');
    contentsElem.appendChild(table);

    const thead = document.createElement('thead');
    table.appendChild(thead);

    const tr = thead.insertRow();

    {
      const td = document.createElement('th');
      td.textContent = '提出ID';
      tr.appendChild(td);
    }

    {
      const td = document.createElement('th');
      td.textContent = '言語';
      tr.appendChild(td);
    }

    {
      const td = document.createElement('th');
      td.textContent = '問題タイトル';
      tr.appendChild(td);
    }

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    for (const submission of submissionsList) {
      const problemId = submission[0];
      const submitId = submission[1];
      const language = submission[2];
      const title = submission[5];
      const tr = tbody.insertRow();

      // 提出ID
      {
        const url = `https://yukicoder.me/submissions/${submitId}/`;
        const text = submitId;

        const td = tr.insertCell();
        td.appendChild(createExternalLink(url, text));
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

  function decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  // 提出内容
  async function appendSubmissionInfo(contentsElem, baseUrl, no) {
    // ページタイトル
    {
      let title = await getTitle(baseUrl, no);
      if (title !== null) {
        title = `${decodeHtmlEntities(title)} - yukicoder`;
      } else {
        title = `No.${no} - yukicoder`;
      }

      document.title = title;

      const h2 = document.createElement('h2');
      h2.textContent = title;

      contentsElem.replaceChildren(h2);
    }

    // 問題URL
    {
      const problemUrl = getProblemUrl(no);

      const p = document.createElement('p');
      p.classList.add('narrow');
      p.textContent = '問題URL: ';
      p.appendChild(createExternalLink(problemUrl));

      contentsElem.appendChild(p);
    }

    // 解説
    {
      let editorial = await getEditorial(baseUrl, no);
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
      const submissionUrl = await getSubmissionUrl(baseUrl, no);

      const p = document.createElement('p');
      p.classList.add('narrow');
      p.textContent = '提出URL: ';
      p.appendChild(createExternalLink(submissionUrl));

      contentsElem.appendChild(p);
    }

    // 提出したソースコード
    {
      const h3 = document.createElement('h3');
      h3.textContent = '提出したソースコード (言語: Kuin)';
      contentsElem.appendChild(h3);

      const src = await getSrc(baseUrl, no);
      if (src !== null) {
        const pre = document.createElement('pre');
        pre.classList.add('code');
        contentsElem.appendChild(pre);

        const editor = tryElemToKuinEditor(pre);
        if (editor !== null) {
          editor.setValue(src);
          editor.navigateTo(0, 0);
        } else {
          pre.textContent = src;
        }
      } else {
        const p = document.createElement('p');
        p.textContent = 'ソースコードの読み込みに失敗しました。';
        contentsElem.appendChild(p);
      }
    }
  }

  function analyzeUrl() {
    const params = new URLSearchParams(location.search);

    return {
      baseUrl: new URL('./', location.href),
      no: params.get('no'),
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

  function createExternalLink(url, text = url) {
    if (url === null) return createLinkLoadErrorText();

    const a = document.createElement('a');

    a.href = url;
    a.textContent = text;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    return a;

    function createLinkLoadErrorText() {
      const span = document.createElement('span');

      span.textContent = 'URLの読み込みに失敗しました。';
      span.className = 'link-load-error';

      return span;
    }
  }

  function getProblemUrl(no) {
    if (no === null) return null;
    return `https://yukicoder.me/problems/no/${encodeURIComponent(no)}`;
  }

  function parseUrlFile(text) {
    const match = text.match(/^URL=(.+)$/m);
    if (match === null) return null;

    return match[1].trim();
  }

  async function getSubmissionUrl(baseUrl, no) {
    const res = await fetchText(
      new URL(`submissions/${encodeURIComponent(no)}/submission.url`, baseUrl)
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

  async function getTitle(baseUrl, no) {
    return await fetchText(
      new URL(`submissions/${encodeURIComponent(no)}/title.txt`, baseUrl)
    );
  }

  async function getEditorial(baseUrl, no) {
    return await fetchText(new URL(`md/${encodeURIComponent(no)}.md`, baseUrl));
  }

  async function getSrc(baseUrl, no) {
    return await fetchText(
      new URL(`submissions/${encodeURIComponent(no)}/main.kn`, baseUrl)
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
