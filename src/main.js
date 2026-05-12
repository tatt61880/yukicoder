(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', onloadApp);
  return;
  // ==========================================================================

  async function onloadApp() {
    const urlQueryParams = analyzeUrl();
    const baseUrl = urlQueryParams.baseUrl;
    const no = urlQueryParams.no;

    const contents = document.getElementById('data');
    if (contents === null) {
      console.error('Error! #contents === null');
      return;
    }

    if (no === null) {
      await appendAcList(contents, baseUrl);
    } else {
      await appendEditorial(contents, baseUrl, no);
    }
  }

  // ACコード一覧
  async function appendAcList(contents, baseUrl) {
    const h1 = document.createElement('h1');
    h1.innerText = 'tatt61880によるyukicoderの最新ACコード一覧';
    contents.appendChild(h1);
    contents.appendChild(document.createElement('hr'));

    const p = document.createElement('p');
    contents.appendChild(p);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    contents.appendChild(table);
    table.appendChild(thead);
    const tr = thead.insertRow();

    {
      const td = document.createElement('th');
      td.innerText = '提出ID';
      tr.appendChild(td);
    }
    {
      const td = document.createElement('th');
      td.innerText = '言語';
      tr.appendChild(td);
    }

    {
      const td = document.createElement('th');
      td.innerText = '問題タイトル';
      tr.appendChild(td);
    }

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const submissionsList = await getSubmissionsList(baseUrl);

    if (submissionsList === null) {
      p.innerText = '提出一覧の取得に失敗しました。';
      return;
    }

    p.innerText = `${submissionsList.length}件`;
    p.setAttribute('id', 'total-num');

    for (const submission of submissionsList) {
      // const problemId = submission[0];
      const submitId = submission[1];
      const language = submission[2];
      const title = submission[5];
      const tr = tbody.insertRow();

      {
        const td = tr.insertCell();
        const a = document.createElement('a');
        a.href = `https://yukicoder.me/submissions/${submitId}/`;
        a.innerText = submitId;
        td.appendChild(a);
      }

      {
        const td = tr.insertCell();
        td.innerText = language;
      }

      {
        const td = tr.insertCell();
        td.innerText = title;
      }
    }
  }

  // 解説
  async function appendEditorial(contents, baseUrl, no) {
    // ページタイトル
    {
      let title = await getTitle(baseUrl, no);
      if (title !== null) {
        title = `${title} - yukicoder`;
      } else {
        title = `No.${no} - yukicoder`;
      }

      document.title = title;

      const h1 = document.createElement('h1');
      h1.innerText = title;
      contents.appendChild(h1);
      contents.appendChild(document.createElement('hr'));
    }

    // 問題URL
    {
      const problemUrl = getProblemUrl(no);
      const p = document.createElement('p');
      p.classList.add('narrow');
      p.innerText = '問題URL: ';
      contents.appendChild(p);

      if (problemUrl !== null) {
        const a = document.createElement('a');
        a.href = problemUrl;
        a.innerText = problemUrl;
        p.appendChild(a);
      }

      contents.appendChild(document.createElement('hr'));
    }

    // 解説
    {
      let editorial = await getEditorial(baseUrl, no);
      const h2 = document.createElement('h2');
      h2.innerText = '解説';
      contents.appendChild(h2);

      if (editorial !== null) {
        editorial = editorial.replaceAll('\\(', '\\\\(');
        editorial = editorial.replaceAll('\\)', '\\\\)');

        const md = window.markdownit();
        const result = md.render(editorial);

        const div = document.createElement('div');
        div.innerHTML = result;
        contents.appendChild(div);

        window.renderMathInElement(div);
      } else {
        const p = document.createElement('p');
        p.innerText = '解説の読み込みに失敗しました。';
        contents.appendChild(p);
      }

      contents.appendChild(document.createElement('hr'));
    }

    // 提出したソースコード
    {
      const h2 = document.createElement('h2');
      h2.innerText = '提出したソースコード (言語: Kuin)';
      contents.appendChild(h2);

      const src = await getSrc(baseUrl, no);
      if (src !== null) {
        const id = 'code';
        const pre = document.createElement('pre');
        pre.setAttribute('id', id);
        contents.appendChild(pre);

        const editor = elemToKuinEditor(pre);
        editor.setValue(src);
        editor.navigateTo(0, 0);
      } else {
        const p = document.createElement('p');
        p.innerText = 'ソースコードの読み込みに失敗しました。';
        contents.appendChild(p);
      }
    }

    // 提出URL
    {
      const submissionUrl = await getSubmissionUrl(baseUrl, no);
      const p = document.createElement('p');
      p.classList.add('narrow');
      p.innerText = '提出URL: ';

      if (submissionUrl !== null) {
        const a = document.createElement('a');
        a.href = submissionUrl;
        a.innerText = submissionUrl;
        a.target = '_blank';
        a.rel = 'noopener';
        p.appendChild(a);
      } else {
        p.appendChild(document.createTextNode('読み込みに失敗しました。'));
      }

      contents.appendChild(p);
    }
  }

  function analyzeUrl() {
    const url = new URL(location.href);

    return {
      baseUrl: new URL('./', url),
      no: url.searchParams.get('no'),
    };
  }

  function elemToKuinEditor(elem) {
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

  function getProblemUrl(no) {
    if (no === null) return null;
    return `https://yukicoder.me/problems/no/${no}`;
  }

  async function getSubmissionUrl(baseUrl, no) {
    const res = await fetchText(`${baseUrl}submissions/${no}/submission.url`);
    if (res !== null) {
      return res.split('=')[1];
    }
    return null;
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
