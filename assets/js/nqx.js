  (function () {
    $(".header ul li").off("mouseover")
    $(".header ul li").on("mouseover", function () {
      $(this).find('.ent').addClass('hoon')
      $(this).children(".link-group").stop().slideDown(100);
    })
    $(".header ul li").off("mouseout")
    $(".header ul li").on("mouseout", function () {
      $(this).find('.ent').removeClass('hoon')
      $(this).children(".link-group").stop().slideUp(100);
    })
  })()

function openImg(imgSrc) {
  var windowW = $(window).width()
  var windowH = $(window).height()
  var imgObj = new Image()
  imgObj.src = imgSrc
  imgObj.onload = function() {
    var ratio = imgObj.height / imgObj.width
    var imgH = imgObj.height>0?imgObj.height:850
    var imgW = imgObj.width
    if(imgH>windowH) {
      imgH = windowH - 100
      imgW = imgH / ratio
    }
    if(imgH>imgW) {
      imgW = imgH / ratio
    } else {
      imgW = imgH * ratio
    }
    var mt = (windowH - imgH)/2
    $(".img-bg").css({"margin-top": mt, "width": imgW}).append("<img src='"+imgSrc+"' style='width:"+ imgW + "px; height:"+ imgH + "px;'/>")
    $(".img-mask-fake").show()
    $(".img-mask").show().css({"margin-left": - imgW/2})
  }  
}

function closeImg() {
  $(".img-mask-fake").on("click", function(){
    $(".img-mask-fake").hide()
    $(".img-mask").hide()
    $(".img-bg").empty()
  })
}

// 播放视频
function playVideo(id, videoSrc) {
  // 添加元素，播放视频
  var windowW = $(window).width()
  var windowH = $(window).height()
  var video2 = document.getElementById(id)
  $("#"+id).attr("src", videoSrc)
  video2.load()
  video2.play()
  var mt = (windowH - 387)/2
  $(".video-bg").css({"margin-top": mt})
  $(".video-mask-fake").show()
  $(".video-mask").show()
}
// 关闭视频
function closeVideo(id) {
  var video2 = document.getElementById(id)
  video2.pause()
  $("#" + id).removeAttr("src")
  $(".video-mask").hide()
  $(".video-mask-fake").hide()
}