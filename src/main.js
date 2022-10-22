(function() {
  'use strict';

  window.onload = async function() {
    const editor = initEditor();

    const res = analyzeUrl();
    const base = res.base;
    const no = res.no;

    const title = await getTitle(base, no);
    if (title !== null) {
      const titleStr = `${title} - yukicoder`;
      document.title = titleStr;
      document.getElementById('title').innerText = titleStr;
    }

    const problem_url = getProblemUrl(no);
    if (problem_url !== null) {
      const elem = document.getElementById('problem-url');
      elem.href = problem_url;
      elem.innerText = problem_url;
    }

    const submission_url = await getSubmissionUrl(base, no);
    if (submission_url !== null) {
      const elem = document.getElementById('submission-url');
      elem.href = submission_url;
      elem.innerText = submission_url;
    }

    let editorial = await getEditorial(base, no);
    if (editorial !== null) {
      editorial = editorial.replaceAll('\\', '\\\\');
      const md = window.markdownit();
      const result = md.render(editorial);
      const elem = document.getElementById('editorial');
      elem.innerHTML = result;
    }

    const src = await getSrc(base, no);
    if (src !== null) {
      editor.setValue(src);
      editor.navigateTo(0, 0);
    }
  }

  function analyzeUrl() {
    const res = {
      base: '',
      no: 1,
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

  function initEditor() {
    const editor = ace.edit('code');
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
    const response = await fetch(url);
    if (response.ok) return response.text();
    return null;
  }
})();
