# Fullpage
pure js fullpage plugin

纯js全屏滚动插件
使用：
<pre>
<div class="main">
    <section class="page">
        <h1>Page 1</h1>
    </section>
    <section class="page">
        <h1>Page 2</h1>
    </section>
    <section class="page">
        <h1>Page 3</h1>
    </section>
    <section class="page">
        <h1>Page 4</h1>
    </section>
</div>

<script type="text/javascript">	
	var container = document.querySelector(".main");
	fullpage(container，{type:2});	
</script>
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