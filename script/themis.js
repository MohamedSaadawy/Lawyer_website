
(function($)
{	
	/**************************************************************************/

	var Themis=function(themis,page,options,requestCurrent)
	{
		/**********************************************************************/

		var $this=this;

		$this.defaults=
		{
			openStart					:	'',
			title						:	'',
			meta						:
			{
				keywords				:	'',
				description				:	''
			},
			displayMenuSliderVertical	: true,
			displayMenuSliderHorizontal	: true
		};

		$this.page=page;

		$this.options=$.extend($this.defaults,options);

		$this.themis=$(themis);

		$this.themisWindow=$('#themis-window');
		$this.themisWindowScroll=$('#themis-window-scroll');
		$this.themisWindowContent=$('#themis-window-content');

		$this.themisCloseButton=$('#themis-close-button');

		$this.enable=true;
		$this.scrollbar='';

		$this.requestPrevious='';
		$this.requestCurrent=requestCurrent;
		$this.requestType=$this.requestCurrent=='' ? 1 : 2;

		$this.themisVerticalMenuSlider='';
		$this.themisHorizontalMenuSlider='';

		$this.themisHeight=parseInt($('#themis').css('height'));
		$this.themisVericalMenuElementWidth=parseInt($('#themis-vertical-menu li:first').css('width'));

		$this.themisVericalMenuElementLeft=800;

		$this.themisWindowWidthExpand=parseInt($('div.main').css('width'));
		$this.themisWindowWidthCollapse=321;

		$this.themisHorizontalMenuHeight=451;

		$this.themisVerticalMenuBoxWrapper=parseInt($('.themis-vertical-menu-box-wrapper').first().css('height'));

		$this.scrollToElement='';

		/**********************************************************************/
		/**********************************************************************/

		this.load=function()
		{
			$this.handleRequest();
			$this.createVerticalMenuSlider();
			$this.bindVerticalMenuHoverEvent();
		};

		/**********************************************************************/
		/**********************************************************************/

		this.bindVerticalMenuHoverEvent=function()
		{
			var themisVerticalMenu=$('#themis-vertical-menu');
			var themisVerticalMenuElement=themisVerticalMenu.children('li');

			themisVerticalMenuElement.hover(
				function() 
				{
					$(this).find('.themis-vertical-menu-box-foreground').stop().animate({top:'80px'},250);
					$(this).find('.themis-vertical-menu-box-foreground-hover').stop().animate({top:'80px',opacity:1},250);

					$(this).find('.themis-vertical-menu-box-icon-hover').stop().animate({opacity:1}); 
					$(this).find('.themis-vertical-menu-box-background').stop().animate({top:'0px'},500); 
				},
				function()
				{
					$(this).find('.themis-vertical-menu-box-foreground').stop().animate({top:'0px'},250);
					$(this).find('.themis-vertical-menu-box-foreground-hover').stop().animate({top:'0px',opacity:0},250);

					$(this).find('.themis-vertical-menu-box-icon-hover').stop().animate({opacity:0}); 
					$(this).find('.themis-vertical-menu-box-background').stop().animate({top:'-30px'},500); 
				}
			);				
		};

		/**********************************************************************/

		this.bindHorizontalMenuHoverEvent=function()
		{
			var themisHorizontalMenu=$('#themis-horizontal-menu');
			var themisHorizontalMenuElement=themisHorizontalMenu.children('li');

			themisHorizontalMenuElement.hover(
				function() 
				{
					$(this).find('.themis-horizontal-menu-icon').stop().animate({opacity:0},250);
					$(this).find('.themis-horizontal-menu-icon-hover').stop().animate({opacity:1},250);
				},
				function()
				{
					if(!$(this).hasClass('selected'))
					{
						$(this).find('.themis-horizontal-menu-icon').stop().animate({opacity:1},250);
						$(this).find('.themis-horizontal-menu-icon-hover').stop().animate({opacity:0},250);
					}
				}
			)					
		};			

		/**********************************************************************/

		this.createVerticalMenuSlider=function()
		{
			if(!$this.options.displayMenuSliderVertical) return;
			
			$this.themis.css({'overflow':'visible'});

			var themisVerticalMenu=$('#themis-vertical-menu');
			$this.themisVerticalMenuSlider=themisVerticalMenu.bxSlider(
			{
				auto:false,
				pause:1000,
				nextText:null,
				prevText:null,
				mode:'horizontal',
				displaySlideQty:5,
				infiniteLoop:true,
				hideControlOnEnd:false,
				wrapperClass:'bx-wrapper bx-wrapper-vertical-menu'
			});					
		};

		/**********************************************************************/

		this.createHorizontalMenuSlider=function()
		{
			if(!$this.options.displayMenuSliderHorizontal) return;
			
			var themisHorizontalMenu=$('#themis-horizontal-menu');
			$this.themisHorizontalMenuSlider=themisHorizontalMenu.bxSlider(
			{
				auto:false,
				pause:1000,
				nextText:null,
				prevText:null,
				mode:'vertical',
				displaySlideQty:5,
				infiniteLoop:true,
				hideControlOnEnd:false,
				wrapperClass:'bx-wrapper bx-wrapper-horizontal-menu'
			});					
		};

		/**********************************************************************/
		/**********************************************************************/

		this.handleRequest=function()
		{
			if($this.requestType==2)
			{
				$this.doRequest();
			}
			else
			{
				var start=false;
				if(window.location.hash=='') 
				{
					if($this.options.openStart.length) 
					{
						start=true;
						window.location.href=$this.getURL($this.options.openStart);
					}
				}

				if(!start)
				{
					var requestCurrent=$this.checkRequest();	
					if(requestCurrent!==false)
					{
						$this.requestCurrent=requestCurrent;
						if($this.requestCurrent!=$this.requestPrevious) $this.doRequest();
					}
				}

				$(window).bind('hashchange',function(event) 
				{
					event.preventDefault();

					if($this.isEnable()==false) return;

					var requestCurrent=$this.checkRequest();

					if(requestCurrent===false) return;

					$this.requestCurrent=requestCurrent;
					$this.doRequest();
				}); 
			}
		};

		/**********************************************************************/

		this.doRequest=function()
		{
			if(!$this.enable) return(false);
			$this.enable=false;

			$this.selectHorizontalMenu();

			var open=$this.isOpen();

			if($this.requestCurrent=='main') $this.close(open);
			else $this.open(open);    

			return(true);			
		};

		/**********************************************************************/

		this.checkRequest=function()
		{
			var requestData=window.location.hash.substring(2).split(',');
			
			var request=requestData[0];
	
			$this.scrollToElement=requestData[1];
	
			if(request=='main') return('main');

			for(var id in $this.page)
			{
				if(id==request) return(request);
			};

			window.location=$this.getURL('main');

			return(false);
		};

		/**********************************************************************/

		this.open=function(isOpen)
		{	
			$this.showCloseButton(false);

			if(isOpen)
			{
				$this.closePage({complete:function() 
				{
					$this.openPage({complete:function() { }});
				}});   
			}
			else
			{
				$this.collapseVerticalMenu({complete:function() 
				{
					$this.expandHorizontalMenu({complete:function() 
					{
						$this.openPage({complete:function() { }});
					}});
				}}); 
			};               
		};

		/**********************************************************************/

		this.close=function(open)
		{
			if(!open) 
			{
				$this.enable=true;
				return;
			}

			$this.showCloseButton(false);
			$this.themis.removeClass('open');

			$this.closePage({complete:function()   
			{
				$this.collapseHorizontalMenu({complete:function() 
				{
					$this.expandVerticalMenu({complete:function()
					{
						$this.enable=true;
					}});
				}});
			}});
		};

		/**********************************************************************/

		this.collapseVerticalMenu=function(event)
		{
			var i=0,j=0;

			var themisVerticalMenu=$('#themis-vertical-menu');
			var themisVerticalMenuElement=themisVerticalMenu.find('li');
			var themisVerticalMenuElementCount=themisVerticalMenuElement.length;

			themisVerticalMenuElement.each(function() 
			{
				$(this).children('div.themis-vertical-menu-box-wrapper').animate({height:'0px'},getRandom(500,1000),'easeInOutExpo',function() 
				{						
					if((++i)==themisVerticalMenuElementCount)
					{
						if($this.options.displayMenuSliderVertical)
						{
							$this.themisVerticalMenuSlider.destroyShow();
							$this.themis.css({'overflow':'hidden'});
						}
						else themisVerticalMenu.css({'height':'0'});
						
						themisVerticalMenuElement.css({'position':'absolute'});

						themisVerticalMenuElement.each(function() 
						{
							var index=$(this).parent('ul').children('li').index($(this));
							$(this).css('left',$this.themisVericalMenuElementWidth*index);
						});

						themisVerticalMenuElement.animate({left:$this.themisVericalMenuElementLeft,opacity:0},500,function() 
						{
							if((++j)==themisVerticalMenuElementCount)
							{
								themisVerticalMenuElement.css('display','none');
								$this.doEvent(event);
								return;
							}
						});
					}
				});                  
			});                               
		};

		/**********************************************************************/

		this.expandVerticalMenu=function(event)
		{
			var i=0;

			var themisVericalMenu=$('#themis-vertical-menu');
			var themisVericalMenuElement=themisVericalMenu.children('li');
			var themisVericalMenuElementCount=themisVericalMenuElement.length;

			themisVericalMenu.css('height',$this.themisHeight);

			themisVericalMenuElement.each(function() 
			{
				$(this).css(
				{
					'left'		: $this.themisVericalMenuElementLeft,
					'display'	: 'block',
					'opacity'	: 1,
					'position'	: 'absolute'					
				});

				$(this).children('div.themis-vertical-menu-box-wrapper').animate({height:$this.themisVerticalMenuBoxWrapper},500,'easeInOutExpo',function() 
				{
					var element=$(this).parent('li');
					var index=themisVericalMenuElement.index(element);
					var left=$this.themisVericalMenuElementWidth*index;

					element.animate({left:left},500,function() 
					{
						$(this).css('position','static');

						if((++i)==themisVericalMenuElementCount)
						{
							$this.createVerticalMenuSlider();
							$this.bindVerticalMenuHoverEvent();	
							$this.doEvent(event);
						}
					});
				});                  
			});                               
		};           

		/**********************************************************************/

		this.expandHorizontalMenu=function(event)
		{
			var themisHorizontalMenu=$('#themis-horizontal-menu-wrapper');

			$this.themisWindow.css('display','block');
			themisHorizontalMenu.animate({height:$this.themisHorizontalMenuHeight},500,function() 
			{
				$this.createHorizontalMenuSlider();
				$this.bindHorizontalMenuHoverEvent();
				$this.doEvent(event);
			});
		};

		/**********************************************************************/

		this.collapseHorizontalMenu=function(event)
		{
			var themisHorizontalMenu=$('#themis-horizontal-menu-wrapper');

			themisHorizontalMenu.animate({height:'0px'},500,function() 
			{
				if($this.options.displayMenuSliderHorizontal)
					$this.themisHorizontalMenuSlider.destroyShow();
				$this.themisWindow.css('display','none');
				$this.doEvent(event);
			});
		};            

		/**********************************************************************/

		this.expandWindow=function(event)
		{
			$this.themisWindow.animate({width:$this.themisWindowWidthExpand},500,'easeOutExpo',function() 
			{
				$this.doEvent(event);
			});
		};

		/**********************************************************************/

		this.collapseWindow=function(event)
		{
			$this.themisWindow.animate({width:$this.themisWindowWidthCollapse},100,'easeInOutSine',function() 
			{
				$this.doEvent(event);
			});               
		};

		/**********************************************************************/

		this.closePage=function(event)
		{
			$(':input,a').qtip('destroy');
			$this.collapseWindow({complete:function() 
			{
				$this.themisWindowContent.html(''); 
				$this.themisWindowScroll.css('display','none');

				$this.doEvent(event);
			}});
		};

		/**********************************************************************/

		this.openPage=function()
		{
			if($this.requestType==2)
			{
				$this.openPageComplete(null);
			}
			else
			{
				$.get('page/'+$this.getPageData($this.requestCurrent,'html'),{},function(page) 
				{	
					$this.openPageComplete(page);
				},
				'html');   
			}
		};
		
		/**********************************************************************/
		
		this.openPageComplete=function(page) 
		{
			if($this.requestType==1)	
				$this.themisWindowContent.html(page); 
				
			$this.themisWindowScroll.css('display','block');

			jQuery.getScript('page/script/base.js',function() 
			{
				if($this.getPageData($this.requestCurrent,'js')!='')
					jQuery.getScript('page/script/'+$this.getPageData($this.requestCurrent,'js'));
			});

			$this.createScrollbar();

			$this.expandWindow({complete:function() 
			{
				if($this.requestType==1)
				{
					$this.setMeta();
					$this.setTitle();
				}
				
				$this.enable=true;
				$this.showCloseButton(true);
				$this.requestPrevious=$this.requestCurrent;
				$this.themis.addClass('open');
				
				if(typeof($this.scrollToElement)!='undefined')
				{
					var scrollToElement=$('#'+$this.scrollToElement);
					if(scrollToElement.length==1)
						$this.scrollbar.scrollToElement(scrollToElement,true);
				}
			}});  			
		};

		/**********************************************************************/

		this.createScrollbar=function()
		{
			$this.scrollbar=$('#themis-window-scroll').jScrollPane({maintainPosition:false,autoReinitialise:true}).data('jsp');
		};

		/**********************************************************************/
		/**********************************************************************/

		this.showCloseButton=function(show)
		{
			$this.themisCloseButton.css('display',show ? 'block' : 'none');
		};

		/**********************************************************************/

		this.isOpen=function()
		{
			return($this.themis.hasClass('open'));
		};

		/**********************************************************************/

		this.isEnable=function()
		{
			if(!$this.enable)
			{
				window.location.href=$this.getURL($this.requestCurrent);
				return(false);
			}  

			return(true);
		};

		/**********************************************************************/

		this.getPageData=function(key,property)
		{
			return($this.page[key][property]);
		};

		/**********************************************************************/

		this.getURL=function(page)
		{
			return(($this.requestType==1 ? '#!' : '?_escaped_fragment_=')+page);
		};

		/**********************************************************************/
		/**********************************************************************/

		this.doEvent=function(event)
		{
			if(typeof(event)!='undefined')
			{
				if(typeof(event.complete)!='undefined') event.complete.apply();
			};                  
		};

		/**********************************************************************/

		this.selectHorizontalMenu=function()
		{	
			var themisHorizontalMenu=$('#themis-horizontal-menu');
			var themisHorizontalMenuElement=themisHorizontalMenu.children('li');

			themisHorizontalMenuElement.removeClass('selected');
			themisHorizontalMenuElement.find('span.themis-horizontal-menu-icon').css('opacity',1);
			themisHorizontalMenuElement.find('span.themis-horizontal-menu-icon-hover').css('opacity',0);

			try
			{
				var object=themisHorizontalMenuElement.find('a[href="'+$this.getURL($this.requestCurrent)+'"]').parent('li');
				object.addClass('selected');
				object.find('span.themis-horizontal-menu-icon').css('opacity',0);
				object.find('span.themis-horizontal-menu-icon-hover').css('opacity',1);
			}
			catch(e) {}
		};

		/**********************************************************************/
		/**********************************************************************/

		this.setMeta=function()
		{
			for(var i in $this.defaults.meta)
			{
				var value='';

				try
				{
					value=$this.page[$this.requestCurrent].meta[i];
				}
				catch(e) { }

				if(!value.length) value=$this.options.meta[i];

				$('meta[name="'+i+'"]').attr(value);					
			}
		};

		/**********************************************************************/

		this.setTitle=function()
		{
			var value='';

			try
			{
				value=$this.page[$this.requestCurrent].title;
			}
			catch(e) { }

			if(!value.length) value=$this.options.title;

			document.title=value;
		};

		/**********************************************************************/
		/**********************************************************************/
	};

	/**************************************************************************/

	$.fn.themis=function(page,options,requestCurrent)
	{
		/**********************************************************************/

		var themis=new Themis(this,page,options,requestCurrent);
		themis.load();

		/**********************************************************************/
	};

	/**************************************************************************/

})(jQuery);