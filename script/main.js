
$(document).ready(function() 
{
	/**************************************************************************/
	/* Slider for news														  */
	/**************************************************************************/

	$('.news-list').bxSlider(
	{
		auto:true,
		pause:5000,
		nextText:null,
		prevText:null,
		mode:'vertical',
		displaySlideQty:2
	});

	/**************************************************************************/
	/* Slider for testimonails												  */
	/**************************************************************************/

	$('.testimonials-list').bxSlider(
	{
		auto:false,
		pause:10000,
		nextText:null,
		prevText:null,
		mode:'vertical',
		displaySlideQty:2
	}); 
});