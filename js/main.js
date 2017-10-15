var DaveHakkens = window.DaveHakkens || {};

DaveHakkens.Main = function(){

  var $;
  var $mobileMenu;
  var $menuToggle;
  var $postGrid;
  var $slider;
  var $postFilter;
  var $usermenu;
  var $usermenuContent;
  var $projects;
  var $window;
  var $loader;
  var loading;
  var page;
  var initialLoad = 8;
  var skipPosts;
  var userMenuTimeout;
  var firstPostLoad = true;

  var init = function(){

    $ = jQuery.noConflict();
    $mobileMenu = $('#mobile-menu');
    $menuToggle = $('#menu-toggle');
    $postGrid = $('#post-grid');
    $slider = $("#my-slider .sp-slides");
    $postFilter = $('#post-filter');
    $usermenu = $('#user-menu');
    $usermenuContent = $('#user-menu .content');
    $projects = $('.projects-page');
    $loader = $('#post-grid-loader');
    $window = $(window);
    loading = true;
    page = 1;
    skipPosts = '';

    initBreadcrumbs();
    initMobileMenu();
    initIsotopeGrid();
    initFancybox();

    initTabs();

    initProjects();
    initLogin();
    initWidgets();

    lazyLoadYt();
    lazyLoadVimeo();
    lazyLoadVine();

    initAjaxLoader();

    var communityMenu = $('#community-menu')

    function communityMenuPosition() {
      var middle = $window.width() / 2

      communityMenu.css('left', (middle + 100) + 'px')
    }

    communityMenuPosition();
    $window.on('resize', communityMenuPosition)

    var communityTrigger = $('#navbar a.community')

    communityTrigger.on('mouseover', function() {
      communityMenu.addClass('shown')
    })

    communityTrigger.on('mouseout', function() {
      if (communityMenu.is(':hover')) {
        return
      }

      communityMenu.removeClass('shown')
    })

    communityMenu.on('mouseleave', function() {
      communityMenu.removeClass('shown')
    })



    $('.bbpress #content a').each(function(){

      var $this = $(this);
      var href = $this.attr('href');

      if( !href ) {
        return;
      }

      if (href.indexOf('davehakkens') < 0 && href.indexOf('community') < 0 && (href.indexOf('#') < 0 || href.indexOf('#') > 0)){
        $this.attr('target', '_blank');
      }

    });

  };

  var initAjaxLoader = function(){

    $(document).ajaxStop(function(){
      $loader.hide();
    });

  };

  var initLogin = function(){
    $('#loginform').submit(function(){
      if ($('#user_login').val() == '' && $('#user_pass').val() == '') {
        return false;
      }
    });
  };

  var initWidgets = function(){
    $('.widget img.avatar').each(function(){
      var $this = $(this);
      var src = $this.attr('src').replace('s=14', 's=128');
      $this.attr('src', src);
    });
  };

  var initBreadcrumbs = function(){
    $('#breadcrumbs .breadcrumb_last').parent().find('a').addClass('one-but-last');

    if ($('#breadcrumbs a').length == 1){
      $('#breadcrumbs a').addClass('breadcrumb_last').css({ paddingLeft: '20px' });
    }
  };

  var initProjects = function(){

    function setSnap() {

      if ($projects.length < 0) {
        return;
      }

      if ($projects.hasClass('fullpage-wrapper') && !$projects.hasClass('fp-destroyed')) {
        return;
      }

      $projects.fullpage({
        navigation: true
      });

    }

    $(window).resize(setSnap);
    setSnap();

    $('#project-nav').css({ marginTop: ($('#project-nav').height() / 2 * -1) });

    $('#project-nav a').click(function(e){
      e.preventDefault();
      $('#project-nav a.current').removeClass('current');
      $(this).addClass('current');
      var elm_id = $(this).attr('href');
      $('html, body').animate({ scrollTop: $(elm_id).offset().top }, 1000);
    });
  };

  var lazyLoadVine = function(){

    $(document).on('click', '.vine-container a', function(e){

      e.preventDefault();

      var $this = $(this);
      var videocode = $this.attr('href');
      var $container = $this.parent();
      var $content = $("#post-grid");
      var width = $container.width();
      var height = width;

      var video_iframe = '<iframe src="https://vine.co/v/' + videocode + '/embed/simple" width="' + width + '" height="' + height + '" frameborder="0"></iframe><script src="https://platform.vine.co/static/scripts/embed.js"></script>';

      $container.html(video_iframe);
    });
  };

  var lazyLoadVimeo = function(){

    $(document).on('click', '.vimeo-container a', function(e){

      e.preventDefault();

      var $this = $(this);
      var videocode = $this.attr('href');
      var $container = $this.parent();
      var $content = $("#post-grid");

      var video_iframe = '<iframe src="https://player.vimeo.com/video/' + videocode + '?autoplay=1&color=ffffff" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

      $container.html(video_iframe);

    });
  };

  var lazyLoadYt = function(){

     $(document).on('click', '.youtube-container a', function(e){

       e.preventDefault();

       var $this = $(this);
       var videocode = $this.attr('href');
       var $container = $this.parent();
       var $content = $("#post-grid");

       var video_iframe = '<iframe class="yt" width="100%" height="350" src="https://www.youtube.com/embed/' + videocode + '?autoplay=1" frameborder="0" allowfullscreen></iframe>';

       $container.html(video_iframe);

     });
  };

  var initUserMenu = function(){
    $usermenuToggle.click(function(e){
      e.preventDefault();
      if ($usermenuContent.is(':visible')){
        $usermenuContent.hide();
      }else{
        $usermenuContent.show();
      }
    });
    $usermenu.hover(function(){
      clearTimeout(userMenuTimeout);
    }, function(){
      userMenuTimeout = setTimeout(function(){
        $usermenuContent.hide();
      }, 1000);
    });
  };

  var initFancybox = function(){
    $('a.fancybox, a[rel="lightbox"]').fancybox({
      padding: 0,
      margin: 0
    });
  };

  var initTabs = function(){
    $tabs = $('.tabbed .tab');
    $tabs2 = $('.tabbed .tab2');
    if ($tabs.length > 0) {
      $tabs.click(function(){
        var tab_id = $(this).attr('data-tab');
        var parent = $(this).parents('.tabbed');

        parent.find('.tab').removeClass('active');
        parent.find('.tabContent').removeClass('active');

        $(this).addClass('active');
        parent.find("#"+tab_id).addClass('active');
      });
    }
    if ($tabs2.length > 0) {
      $tabs2.click(function(){
        var tab_id = $(this).attr('data-tab');
        var parent = $(this).parents('.tabbed');

        parent.find('.tab2').removeClass('active');
        parent.find('.tab2Content').removeClass('active');

        $(this).addClass('active');
        parent.find("."+tab_id).addClass('active');
      });
    }
  }

  var initIsotopeGrid = function(){
    $postGrid.isotope({
      percentPosition: true,
      layoutMode: 'fitRows',
      animationEngine: 'jquery'
    });

    /*
		old hash tag linking code
	$(document).on('click', '#post-filter a, #post-grid .item .post_meta a', function(){
      var category = '.' + $(this).attr('href').replace('#', '');
      $postFilter.find('.active').removeClass('active');
      $(this).parent().addClass('active');

      if (category == '.'){
        category = '*';
      }
      $postGrid.isotope({ filter: category });

      if($('#post-grid .item' + category).length < 10){
        setTimeout(function(){
          skipPosts = '';
          $('#post-grid .item' + category).each(function(){
            var id = $(this).attr('id').replace('post-', '');
            skipPosts += id + '|';
          });
          skipPosts = skipPosts.substr(0, (skipPosts.length-1));
          page = 1;
          loadPosts(10 - $('#post-grid .item' + category).length);
        }, 500);

      }
    });*/

    if ($postGrid.length > 0) {
      bottonLoad = $('#post-grid-more');
      bottonLoad.on('click', function () {
        if (!loading) {
          loading = true;
          page++;
          loadPosts(9);
        }
      });
      //transform filters href to ajax request
      $('#post-filter').find('a').click(function (event){
        if($(this).hasClass('active'))return false;
        var img, img_src;
        var oldCurrent = $('#post-filter').find('.active')
        if(oldCurrent.length>0){
          oldCurrent.removeClass('active');
          img = oldCurrent.children('img');
          img_src = img.attr('src').replace('/active_', '/normal_');
          img_src = img_src.replace('active', 'normal');
          img.attr('src',img_src);
        }
        $(this).addClass('active');
        img = $(this).children('img');
        img_src = img.attr('src').replace('/hover_', '/active_');;
        img.attr('src',img_src);
        var url= $(this).attr('href');
        event.preventDefault();
        $postGrid.height(0);
        $postGrid.empty();
        history.pushState('data', '', url);
        page = 1;
        firstPostLoad = true;
        loadPosts(initialLoad);
        return false;
      });
      $('#post-filter').find('a').hover(
        function (event){
          var img, img_src;
          img = $(this).children('img');
          img_src = img.attr('src').replace('/normal_', '/hover_');
          img.attr('src',img_src);
        },
        function (event){
          var img, img_src;
          img = $(this).children('img');
          img_src = img.attr('src').replace('/hover_', '/normal_');
          img.attr('src',img_src);
        }
      );
      // load posts when page loads
      loadPosts(initialLoad);
    }
    // Enable slider
    if ($slider.length > 0) {
      $( '#my-slider' ).sliderPro({
        responsive: true,
        touchSwipe: false,
        forceSize: 'fullWidth',
        height: 230,
//          height: '50vh',
        buttons: true,
        slideDistance: 0,
        autoScaleLayers: true,
        smallSize: 450,
        fade: true,
        fullScreen: true,
      });
    }
  };

  var loadPosts = function(numPosts, stickyPosts){
    var pathname = window.location.pathname;
    var format = ''
    if( pathname.indexOf('tag') !== -1 ){   // if pathname contains the word tag
      console.log('tag in URL');
      var tag = pathname.replace('/tag/','');
      tag = tag.replace('/','');
    } else if ( pathname.indexOf('category') !== -1 ) { // if category in URL
      console.log('category in URL');
      var category = pathname.replace('/category/','');
      category = category.replace('/','');
    }
    if(stickyPosts === undefined){
      stickyPosts = 0;
    }
    if(stickyPosts){
      format = 'json';
    }
  // otherwise check to see if there is a category
    $loader.show();
    $.ajax({
      type       : "GET",
      data       : {numPosts : numPosts, pageNumber: page, tag: tag, category: category, skipPosts: skipPosts, stickyPosts: stickyPosts, format: format},
      dataType   : "html",
      url        : templateURL + "/loopHandler.php",
      beforeSend : function(){
      },
      success    : function(data){

        if(stickyPosts){
console.log("Sticky:");
//console.log(data);
          $data = JSON.parse(data);
          for(i = 0; i< $data.length; i++){
            if($data[i].images === undefined)continue;
//            $($data[i]).addClass("sp-slide");
            var $slide = $("<div></div>").addClass("sp-slide");
            var img = $(document.createElement("img")).addClass("sp-image");
            console.log($data[i].images);
            $(img).attr('data-small', $data[i].images.small);
            $(img).attr('data-medium', $data[i].images.medium);
            $(img).attr('data-large', $data[i].images.large);
            $(img).attr('data-src', $data[i].images.full);
            $slide.append(img);
            $slide.append('<div class="shadow"></div><div class="meta"><h1>'+$data[i].title+'</h1><h3>#preciousplastic<h3></div>');
            $slider.append($slide);
/*src="path/to/blank.gif"
*/
          }
        }else{
          $data = $(data);
        }
//console.log(data);
        for(i = 0; i< $data.length; i++){
          if($data[i].nodeType == 3){ //Remove empty text nodes
            $data.splice(i, 1);
            i--;
            continue;
          }

          if(!stickyPosts && firstPostLoad && i<2){
//            console.log($data[i]);
            $($data[i]).addClass("big");
          }
        }
        if(stickyPosts){
          $( '#my-slider' ).sliderPro({
            forceSize: "fullWindow",
/*
            width: "100vw",
            height: "100vh",
*/
            buttons: true,
            slideDistance: 0,
//            autoScaleLayers: false,
            smallSize:300,
            fade: true,
          });
        }else{
          $postGrid.append($data).isotope('appended', $data);
            $postGrid.isotope('layout');

          firstPostLoad = false;
        }
        loading = false;
      },
      error     : function(jqXHR, textStatus, errorThrown) {
       console.log(jqXHR + " :: " + textStatus + " :: " + errorThrown);
      }
    });
  };

  var initMobileMenu = function(){
    $menuToggle.click(function(e){
      e.preventDefault();
      if (parseInt($mobileMenu.css('top')) < 0){
        $mobileMenu.animate({ top: 50 }, 'fast');
      }else{
        $mobileMenu.animate({ top: -400 }, 'fast');
      }
    });
  };

  return {
    init: init,
    initIsotopeGrid: initIsotopeGrid
  };

}();

jQuery(document).ready(function($){



  var $ = jQuery;

  $('.count-box').each(function(){
	if ($(this).text() === '0' ) {
		$(this).hide();

	}
  });

  $('.no-count').each(function(){
	if ($(this).text() === '0' ) {
		$(this).hide();

	}
  });

  DaveHakkens.Main.init();

  $( '.list-replies li' ).each( function( reply ) {

    var replies = $( this ).find( 'ul.bbp-threaded-replies' );

    if( replies.length == 0 ) {
      return;
    }

    var button = $( this ).find( '> .topic-reply [href="#toggle-replies"]' ),
        oldContent = button.html(),
        howMany = replies.find( '> li' ).length;

    button.addClass( 'activated' );
    button.html( oldContent + ' (' + howMany + ')' );

  });

  $( '.list-replies li [href="#toggle-replies"]' ).click( function(event) {
    $( this ).toggleClass( 'on' );
    $( this ).closest( '.topic-reply' ).next( '.bbp-threaded-replies' ).slideToggle();
    event.preventDefault();
  });

});
