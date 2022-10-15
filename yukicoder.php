<?php
require_once __DIR__.'/vendor/autoload.php';

$REQUEST_URI = $_SERVER["REQUEST_URI"];

$problem_id = preg_replace('/.*\/(\d+)[^\/]*/', '\1', $REQUEST_URI);
$problem_url = "https://yukicoder.me/problems/no/$problem_id";

$editorial_flag = false;
$markdown_filepath = "./md/$problem_id.md";
if (file_exists($markdown_filepath)) {
	$editorial_flag = true;
	#$markdown =  htmlspecialchars(file_get_contents($markdown_filepath));
	$markdown =  file_get_contents($markdown_filepath);
	$markdown = str_replace('\\(', '\\\\(', $markdown);
	$markdown = str_replace('\\)', '\\\\)', $markdown);
}

$title_filepath = "./submissions/$problem_id/title.txt";
if (!file_exists($title_filepath)) ShowErrorMessageAndExit("404 問題タイトル not found!");
$problem_title =  htmlspecialchars(file_get_contents($title_filepath));

$page_title = "【yukicoder ${problem_title}】";
if ($editorial_flag) {
	$page_title = "解説" . $page_title;
}

$url_filepath = "./submissions/$problem_id/submission.url";
if (!file_exists($url_filepath)) ShowErrorMessageAndExit("404 提出コードURL not found!"); 
$submissions_url =  htmlspecialchars(file_get_contents($url_filepath));
$submissions_url = preg_replace('/[\d\D]*=/', '', $submissions_url);

$kuin_filepath = "./submissions/$problem_id/main.kn";
if (!file_exists($kuin_filepath)) ShowErrorMessageAndExit("404 main.kn not found!");
$kuin_src =  htmlspecialchars(file_get_contents($kuin_filepath));

#------------------------------------------------------------------------------
  print <<< EOD
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>$page_title</title>
  <link rel="stylesheet" href="./style.css?20200725">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML" defer="defer"></script>
  <script src="https://tatt61880.github.io/kuin-web/src-noconflict/ace.js?2020-07-17"></script>
  <script src="https://tatt61880.github.io/kuin-web/src-noconflict/ext-language_tools.js?2020-07-17"></script>
  <script>
window.onload = function() {
  let editor = ace.edit('code');
  editor.setTheme('ace/theme/kuin');
  editor.session.setMode('ace/mode/kuin');
  editor.setReadOnly(true);
  editor.setOptions({
    maxLines: 10000,
    autoScrollEditorIntoView: true,
    fontSize: '16px',
  });
  editor.resize();
}
  </script>
</head>
<body>
  <div id="container">
  <h1>$problem_title - yukicoder</h1>
  <hr>
問題URL: <a href="$problem_url">$problem_url</a>

<hr>

EOD;

if ($editorial_flag) {
  print <<< EOD
<h2>解説</h2>
<!-- ====================================================================== -->

EOD;

  $parser = new \cebe\markdown\GithubMarkdown();
  $parser->enableNewlines = true;
  echo $parser->parse($markdown);
}

  $additionalInfo = additionalInfo();
  print <<< EOD
<!-- ====================================================================== -->
<hr>
<h2>提出したソースコード (言語: Kuin)</h2>
<div>
  提出URL: <a href="$submissions_url">$submissions_url</a>
  <pre id="code" style="margin: 0 -10px;">$kuin_src</pre>
</div>
<hr>
$additionalInfo
</div>
</body>
</html>
EOD;

function additionalInfo()
{
return <<< EOD
<h2>このページの作成者</h2>
<table style="border:none;">
  <tr style="border:none;">
    <td style="border:none;">
    <img src="./images/tatt61880.png" alt="(Tattアイコン)">
    </td>
    <td style="border:none;">
    たっと(Tatt)<br>
    Twitter: <a target="_blank" href="https://twitter.com/tatt61880">@tatt61880</a><br>
    yukicoder: <a target="_blank" href="https://yukicoder.me/users/5112">tatt61880</a> (<a target="_blank" href="https://yukicoder.me/users/5112/editorial">解説一覧</a>)<br>
    AtCoder: <a target="_blank" href="https://atcoder.jp/users/tatt61880">tatt61880</a>
    </td>
  </tr>
</table>
EOD;
}

function ShowErrorMessageAndExit($message)
{
  $additionalInfo = additionalInfo();
  print <<< EOD
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>Error</title>
  <link rel="stylesheet" href="http://tatt.ch/style.css">
</head>
<body>
<div id="container">
  <h1>$message</h1>
  $additionalInfo
</div>
</body>
</html>

EOD;

  exit("");
}
