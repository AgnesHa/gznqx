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