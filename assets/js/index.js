(function(){
  var $ = function(el) {
    try {
        var item = document.querySelectorAll(el);
        return item.length <= 1 ? item[0] : item;
    } catch (err) {
        console.log(err)
    }
  }

  // slide-top
  var contentW = jQuery(".index-content .box").width()
  var slideH = contentW / 1.8
  jQuery(".index-content .box .slide-top .slideBox").css({'height': slideH + 'px'})
  jQuery(".index-content .box .slide-top .slideBox .bd").css({'height': slideH + 'px'})
	jQuery(".slideBox").slide({
		mainCell: ".bd ul",
		effect: "fold",
		trigger: "click",
		autoPlay: false,
		mouseOverStop: true,
		startFun:function(i,c){
      jQuery(".index-content .box .slide-top .slideBox .bd ul").css({'height': slideH + 'px'})
    }
  });
  
  // honor
  var backdrop1 = new Backdrop($('.demo1>.container'), {
      transition: {
        value: '360ms',
        waitForTransition: true,
      }, 
      autoplay: {
        enable: true,
        delay: 4000,
      },
      isClickSlide: true,
      opacity: .9,
      scale: .9,
      navigation: {
        nextEl: $('.demo1 .btn-right'),
        prevEl: $('.demo1 .btn-left')
      },
      baseZIndex: 100, // 默认为10
  });
})();

(function($){
  $(".factory .pic-show img").on("click", function() {
    openImg($(this).attr("src"))
  })
  $(".backdrop-slider .cards-list a").on("click", function() {
    openImg($(this).find("img").attr("src"))
  })
  closeImg()

  $(".index-content .btn-play").on("click", function() {
    playVideo('video2', "vendor/nqx/videos/nqx-administration-center.mp4")
  })

  $(".video-mask-fake").on("click", function(){
    closeVideo('video2')
  })
})(jQuery)