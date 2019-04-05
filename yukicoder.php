<?php
require_once __DIR__.'/vendor/autoload.php';

$REQUEST_URI = $_SERVER["REQUEST_URI"];
$problem_id = preg_replace('/.*\/(\d+)[^\/]*/', '\1', $REQUEST_URI);
$title = "yukicoder #$problem_id";

$problem_url = "https://yukicoder.me/problems/no/$problem_id";

$markdown_filepath = "./md/$problem_id.md";
if (!file_exists($markdown_filepath)) exit ("404 解説 not found!");
$markdown =  htmlspecialchars(file_get_contents($markdown_filepath));
$markdown = str_replace('\\', '\\\\', $markdown);

$title_filepath = "./submissions/$problem_id/title.txt";
if (!file_exists($title_filepath)) exit ("404 問題タイトル not found!");
$problem_title =  htmlspecialchars(file_get_contents($title_filepath));

$url_filepath = "./submissions/$problem_id/url.txt";
if (!file_exists($url_filepath)) exit ("404 提出コードURL not found!");
$submissions_url =  htmlspecialchars(file_get_contents($url_filepath));

$kuin_filepath = "./submissions/$problem_id/main.kn";
$kuin_src =  htmlspecialchars(file_get_contents($kuin_filepath));

#------------------------------------------------------------------------------
  print <<< EOD
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>$title</title>
<link rel="stylesheet" href="http://tatt.ch/style.css">
<!--
<script src="./MathJax/MathJax.js?config=TeX-AMS_HTML" type="text/javascript" charset="UTF-8" defer="defer"></script>
-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML" type="text/javascript" charset="UTF-8" defer="defer"></script>
<script>
MathJax.Hub.Config({
    tex2jax: {
      inlineMath: [['$','$'], ["\\\\(","\\\\)"]],
      skipTags: ["script","style","textarea"]
    },
    extensions: ["Safe.js"],
    "HTML-CSS": { scale: 95 }
});
</script>
<link rel="stylesheet" href="http://tatt.ch/kuin/prettify/prettify.css" type="text/css">
<script src="http://tatt.ch/kuin/prettify/prettify.js"></script>
<script src="http://tatt.ch/kuin/prettify/lang-kuin.js"></script>
<script>
    // <![CDATA[
    (function(){
        function init(event){
            prettyPrint();
        }
        if(window.addEventListener)window.addEventListener("load",init,false);
        else if(window.attachEvent)window.attachEvent("onload",init);
    })();
    // ]]>
</script>
</head>
<body>
<div id="container">
<h1>$problem_title - yukicoder</h1>
<hr>
問題URL: <a href="$problem_url">$problem_url</a>

<hr>
<!-- ====================================================================== -->
EOD;


$parser = new \cebe\markdown\GithubMarkdown();
echo $parser->parse($markdown);


  print <<< EOD
<!-- ====================================================================== -->
<div>
  <span style="background-color:#f0f8ff; padding:0 10px 0 10px"><a href="$submissions_url">$submissions_url</a></span>
  <pre class="prettyprint lang-kuin linenums" style="border-radius:0; margin: 0px -10px 0px -10px;">$kuin_src</pre>
</div>
</div>
</body>
</html>
EOD;


function ShowErrorMessage($message)
{
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
$message
</div>
</body>
</html>
EOD;
}
?>
