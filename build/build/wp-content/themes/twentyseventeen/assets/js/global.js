!function(e){function t(){c=y.height(),l=y.outerHeight(),u=2*parseFloat(C.css("padding-top")),f=2*T.outerHeight(),h=c<=(m=u+f)}function n(){"none"===k.css("display")&&(h?(g=A&&(w.hasClass("has-header-image")||w.hasClass("has-header-video"))?p.innerHeight()-l:p.innerHeight(),e(window).scrollTop()>=g?y.addClass(S):y.removeClass(S)):y.removeClass(S))}function o(){"none"===k.css("display")?A?v.css("margin-bottom",l):p.css("margin-bottom",l):(p.css("margin-bottom","0"),v.css("margin-bottom","0"))}function a(){e(twentyseventeenScreenReaderText.quote).prependTo(H)}function s(t){var n,o;!w.hasClass("has-sidebar")||w.hasClass("search")||w.hasClass("single-attachment")||w.hasClass("error404")||w.hasClass("twentyseventeen-front-page")||(n=q.offset(),o=n.top+(q.height()+28),E.find(t).each(function(){var t=e(this);t.offset().top>o?t.addClass("below-entry-meta"):t.removeClass("below-entry-meta")}))}function i(){var e=document.createElement("div");return e.innerHTML="<svg/>","http://www.w3.org/2000/svg"===("undefined"!=typeof SVGRect&&e.firstChild&&e.firstChild.namespaceURI)}function d(){return/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream}function r(){var e=document.createElement("div");try{return"backgroundAttachment"in e.style&&!d()&&(e.style.backgroundAttachment="fixed","fixed"===e.style.backgroundAttachment)}catch(e){return!1}}var c,l,u,f,m,h,g,b,w=e("body"),p=w.find(".custom-header"),v=p.find(".site-branding"),y=w.find(".navigation-top"),C=y.find(".wrap"),T=y.find(".menu-item"),k=y.find(".menu-toggle"),x=w.find(".menu-scroll-down"),q=w.find("#secondary"),E=w.find(".entry-content"),H=w.find(".format-quote blockquote"),A=w.hasClass("twentyseventeen-front-page")||w.hasClass("home blog"),S="site-navigation-fixed",N=0;e("a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]",".site-content-contain").filter(":visible").focus(function(){if(y.hasClass("site-navigation-fixed")){var t=e(window).scrollTop(),n=y.height(),o=e(this).offset().top,a=o-t;e("#wpadminbar").length&&(a-=e("#wpadminbar").height()),a<n&&e(window).scrollTo(o-(n+50),0)}}),e(document).ready(function(){y.length&&(t(),n()),x.length&&(e("body").hasClass("admin-bar")&&(N-=32),e("body").hasClass("blog")&&(N-=30),y.length||(l=0),x.click(function(t){t.preventDefault(),e(window).scrollTo("#primary",{duration:600,offset:{top:N-l}})})),o(),a(),!0===i()&&(document.documentElement.className=document.documentElement.className.replace(/(\s*)no-svg(\s*)/,"$1svg$2")),!0===r()&&(document.documentElement.className+=" background-fixed")}),y.length&&(e(window).on("scroll",function(){n(),o()}),e(window).resize(function(){t(),setTimeout(n,500)})),e(window).resize(function(){clearTimeout(b),b=setTimeout(function(){s("blockquote.alignleft, blockquote.alignright")},300),setTimeout(o,1e3)}),e(document).on("wp-custom-header-video-loaded",function(){w.addClass("has-header-video")})}(jQuery);