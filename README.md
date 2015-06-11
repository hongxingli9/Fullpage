# Fullpage
pure js fullpage plugin

纯js全屏滚动插件
使用：
<pre>
&lt;div class="main"&gt;
    &lt;section class="page"&gt;
        &lt;h1&gt;Page 1&lt;/h1&gt;
    &lt;/section&gt;
    &lt;section class="page"&gt;
        &lt;h1&gt;Page 2&lt;/h1&gt;
    &lt;/section&gt;
    &lt;section class="page"&gt;
        &lt;h1&gt;Page3&lt;/h1&gt;
    &lt;/section&gt;
    &lt;section class="page"&gt;
        &lt;h1&gt;Page 4&lt;/h1&gt;
    &lt;/section&gt;
&lt;/div&gt;

&lt;script type="text/javascript"&gt;
	var container = document.querySelector(".main");
	fullpage(container，{type:2});	
&lt;/script&gt;
</pre>
参数：
<pre>
options = {
	sectionContainer		: "section",
	start					: 0,    //开始页面
	type                    : 1,    //页面过渡类型，目前支持1-2
	threshold               : 0.15, //页面切换阀值
	drag					: true, //是否允许在首尾页拖拽
	pagination				: true  //是否分页标注
}
</pre>

参考：
https://github.com/lvming6816077/H5FullscreenPage(https://github.com/lvming6816077/H5FullscreenPage)
https://github.com/peachananr/purejs-onepage-scroll(https://github.com/peachananr/purejs-onepage-scroll)