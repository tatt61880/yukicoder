(function() {
  'use strict';

  window.onload = async function() {
    const res = analyzeUrl();
    const base = res.base;
    const no = res.no;

    const contents = document.getElementById('contents');
    if (contents === null) {
      console.error('Error! #contents === null');
      return;
    }

    if (no !== null) {
      // ページタイトル
      {
        let title = await getTitle(base, no);
        if (title !== null) {
          title = `${title} - yukicoder`;
        } else {
          title = '404 問題タイトル not found!';
        }
        document.title = title;

        const h1 = document.createElement('h1');
        h1.innerText = title;
        contents.appendChild(h1);
        contents.appendChild(document.createElement('hr'));
      }

      // 問題URL
      {
        const problem_url = getProblemUrl(no);
        if (problem_url !== null) {
          const span = document.createElement('span');
          span.innerText = '問題URL: ';
          contents.appendChild(span);

          const a = document.createElement('a');
          a.href = problem_url;
          a.innerText = problem_url;
          span.appendChild(a);

          contents.appendChild(document.createElement('hr'));
        }
      }

      // 解説
      {
        let editorial = await getEditorial(base, no);
        if (editorial !== null) {
          const h2 = document.createElement('h2');
          h2.innerText = '解説';
          contents.appendChild(h2);

          editorial = editorial.replaceAll('\\(', '\\\\(');
          editorial = editorial.replaceAll('\\)', '\\\\)');
          const md = window.markdownit();
          const result = md.render(editorial);
          const div = document.createElement('div');
          div.innerHTML = result;
          contents.appendChild(div);

          // 数式の記述を処理
          MathJax.typeset();

          contents.appendChild(document.createElement('hr'));
        }
      }

      // 提出したソースコード
      {
        const src = await getSrc(base, no);
        if (src !== null) {
          const h2 = document.createElement('h2');
          h2.innerText = '提出したソースコード (言語: Kuin)';
          contents.appendChild(h2);

          const id = 'code';
          const pre = document.createElement('pre');
          pre.setAttribute('id', id);
          pre.style.margin = '0 -10px';
          contents.appendChild(pre);

          const editor = initEditor(id);
          editor.setValue(src);
          editor.navigateTo(0, 0);
        }
      }

      // 提出URL
      {
        const submission_url = await getSubmissionUrl(base, no);
        if (submission_url !== null) {
          const span = document.createElement('span');
          span.innerText = '提出URL: ';
          contents.appendChild(span);

          const a = document.createElement('a');
          a.href = submission_url;
          a.innerText = submission_url;
          span.appendChild(a);
        }
      }
    }
  };

  function analyzeUrl() {
    const res = {
      base: '',
      no: null,
    };
    res.base = location.href.split('?')[0];
    const queryStrs = location.href.split('?')[1];
    if (queryStrs == null) return res;
    for (const queryStr of queryStrs.split('&')) {
      const paramArray = queryStr.split('=');
      const paramName = paramArray[0];
      const paramVal = paramArray[1];
      switch (paramName) {
      case 'no':
        res.no = paramVal;
        break;
      }
    }
    return res;
  }

  function initEditor(id) {
    const editor = ace.edit(id);
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

  async function getTitle(base, no) {
    return await fetchText(`${base}submissions/${no}/title.txt`);
  }

  function getProblemUrl(no) {
    if (no === null) return null;
    return `https://yukicoder.me/problems/no/${no}`;
  }

  async function getSubmissionUrl(base, no) {
    const res = await fetchText(`${base}submissions/${no}/submission.url`);
    if (res !== null) {
      return res.split('=')[1];
    }
    return null;
  }

  async function getEditorial(base, no) {
    return await fetchText(`${base}md/${no}.md`);
  }

  async function getSrc(base, no) {
    return await fetchText(`${base}submissions/${no}/main.kn`);
  }

  async function fetchText(url) {
    const response = await fetch(url, {cache: 'no-store'});
    if (response.ok) return response.text();
    return null;
  }
})();
