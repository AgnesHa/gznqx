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
	jQuery(".slideBox").slide({
		mainCell: ".bd ul",
		effect: "fold",
		trigger: "click",
		autoPlay: false,
		mouseOverStop: true,
		startFun:function(i,c){
			
		}
  });
  
  // mask
  var backdrop5 = new Backdrop($('.demo7 >.container'), {
    transition: {
        value: '.4s cubic-bezier(0, 0.55, 0.45, 1)',
        waitForTransition: true,
    },
    autoplay: false,
    offsetDistance: $('.demo7 .cards-list')[0].offsetWidth + 20,
    navigation: {
      nextEl: $('.serial .btn-next'),
      prevEl: $('.serial .btn-prev')
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
  // news
  var backdrop5 = new Backdrop($('.demo5 >.container'), {
    transition: {
        value: '.4s cubic-bezier(0, 0.55, 0.45, 1)',
        waitForTransition: true,
    },
    autoplay: false,
    offsetDistance: $('.demo5 .cards-list')[0].offsetWidth + 20,
    navigation: {
        nextEl: $('.demo5 .btn-right'),
        prevEl: $('.demo5 .btn-left')
    }
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
    playVideo('video2', "assets/videos/nqx-administration-center.mp4")
  })

  $(".video-mask-fake").on("click", function(){
    closeVideo('video2')
  })
})(jQuery)