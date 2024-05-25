$(document).ready(function() {
        $('a[href="#overview"]').addClass('active');
		$('a[href^="#"]').bind('click', function(e) {
				e.preventDefault(); 

				var target = $(this).attr("href"); 

				$('html, body').stop().animate({
						scrollTop: $(target).offset().top
				}, 600, function() {
						location.hash = target; 
				});

				return false;
		});
});

$(window).scroll(function() {

		var scrollDistance = $(window).scrollTop();

		$('.page-section').each(function(i) {
				if ($(this).position().top <= scrollDistance) {
						$('.contents a.active').removeClass('active');
						$('.contents a').eq(i).addClass('active');
				}
		});
}).scroll();

