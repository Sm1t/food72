$(document).ready(function(){

	var S = $(window).scrollTop();

	if (S > $('nav').height()) {
		$('.nav-wrap').css({
			'background-color': 'rgba(155,155,155,1)'
		});
		$('.nav-wrap a').css({
			'color': '#fff'
		});
	}

	$(window).scroll(function(S){

		var S = $(this).scrollTop();

		$('.name').css({
			'transform': 'translate(-50%, calc(-50% + '+ S/2 +'%))',
			'opacity': 1-S*2/$('header').height()
		});

		if (S < $('nav').height()) {
			$('.nav-wrap').css({
				'background-color': 'transparent'
			})
			$('.nav-wrap a').css({
				'color': '#112236'
			});}
			else {
				$('.nav-wrap').css({
				'background-color': 'rgba(155,155,155,1)'
				});
				$('.nav-wrap a').css({
					'color': '#fff'
				});

		} 
	});

	/*-------------Junping arrows animation-------------*/
	$('.jump-arrows').click(function(){
		$('body,html').animate({scrollTop:$('header').height()-$('.nav-wrap').height()+1}, 500);
	});


	/*-------------Description animation-------------*/
	$('[class $= descr]').each(function(index){
		$(this).waypoint(function(){
			$(this.element).addClass('descr-on');
		},{offset: function() {
			return $(window).height() - $('.about-descr').height();
			}});
	});


	/*-------------Portfolio text animation-------------*/
	$('.portfolio__text').waypoint(function(){
			$('.portfolio__text p').addClass('animated fadeInUp');
			$('.portfolio__text h2').addClass('animated fadeInDown');
		},{offset: function() {
			return $(window).height() - $('.about-descr').height();
		}
	});
	

	/*-------------About items animation-------------*/
	$('.about__item').waypoint(function(){
			$(this.element).css({
				'animation-name': 'show-in-left-bottom'
			});
		},{offset: function() {
			return $(window).height() - $('.about-descr').height();
		}
	});

	
	/*-------------Smooth-scroll-------------*/
	$('a').click(function(e){
		e.preventDefault();
	});
	$('.menu').on('click','a', function(){
		$('body,html').animate({scrollTop:$($(this).attr('href')).position().top-$('.nav-wrap').height()+1}, 500);
		//$('.hidden-menu').slideToggle('slow');
	});

		/*-------------Hidden menu------------*/
	$('.menu-burger').click(function(){
		$('.hidden-menu').toggleClass('shadow-mask');
		$('.hidden-menu__list').toggleClass('display-block');
		$('.menu-burger').toggleClass('menu-burger--active');
	})
});