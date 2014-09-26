//***********************************
//定义全局变量
//***********************************
var $doc,	//缓存 jQuery document
	$win,	//缓存 jQuery window
	$html,	//缓存 jQuery html
	$body;	//缓存 jQuery body
var $sys_head; //缓存 jQuery ".sys_head"
var $slideUp_contain; //缓存 jQuery "#$slideUp_contain"
if (window.jQuery) {
	$doc = (function() {return $(document);})(document);
	$win = (function() {return $(window);})(window);
	$html = (function() {return $("html");})();
	$body = (function() {return $("body");})();
}
//***********************************
//定义自定义样式
//***********************************
winMinheight = function(win, scalcNum,autoBody) {
	var minheightNum;
	var styles;
	var ghostElem;
	var isatbd = "";
	var atbd = autoBody || false;
	var snum = scalcNum || [0];
	minheightNum = win.height();
	if ( atbd === true ) {
		isatbd = "height:auto";
	}
	/* Example(定义高度例子):***************

	var scalcNum = [
		["wraps",100],
		["hello",40]
	];
	
	**************************************/	
	var snuml = snum.length;
	var snums = "";
	for (var i = 0; i < snuml; i++) {
		var _a = Number(minheightNum-snum[i][1]);
		snums = snums +"\n" + '.height_'+ snum[i][0] + '{height:'+_a+'px}'+"\n" + 
		'.height_min_'+ snum[i][0] + '{min-height:'+_a+'px}'+"\n" +
		'.height_max_'+ snum[i][0] + '{max-height:'+_a+'px; _height:'+_a+'px;}';
	}
	ghostElem = $("<div>").attr("id", "jay-layout-css").css('display', 'none');
	styles = 
		'<style type="text/css">\n' + 
			'.winminheight {\n' + 
			'min-height:' + minheightNum + 'px;\n' + 
			'_height:' + minheightNum + 'px;\n' + 
		'}\n' + 
			'.winheight {\n' + 
			'height:' + minheightNum + 'px;\n' + 
		'}\n' + 
		snums +"\n" +
		'html,body {\n'+
			isatbd +'\n' +
		'}\n'+
		'</style>';
	ghostElem.html(styles);
	var ghostTemp = document.getElementById("jay-layout-css");
	if (ghostTemp) {
		$(ghostTemp).html(styles);
	} else {
		$('body').prepend(ghostElem);
	}
};
//************************************
// 定义tab的方法
//***********************************
(function($) {
	//tabs fn
	$.fn.Tabs=function(options){
		// 处理参数
		options = $.extend({
			event : 'click',		//事件类型  
			timeout : 0,			//设置事件延迟
			auto : 0,				//多少秒自动切换一次  
			tabBoxLayout:"div",		//tabBox的子集
			findInSelf:false,		//用于元素都是处于同个HTML tag里面的时候调用方法
			callback : null			//回调函数
		}, options);
		return this.each(function() {
			if (options.findInSelf===true) {
				var self = $(this);
				var baseClass = self.attr("class").split(" ")[0];
				var tabClass = baseClass + "_tab";
				var conClass = baseClass + "_tabbox";
				//--
				var tabBox = self.find("."+conClass).children( options.tabBoxLayout );
				var menu = self.find("."+tabClass);
				var items = menu.find( '.iTab' );
				var timer;
			} else {
				var self = $(this),
					selfboxID = $(this).attr("class").split(" ")[0] + '_tabbox',
					tabBox = $( '#' + selfboxID ).children( options.tabBoxLayout ),
					menu = self,
					items = menu.find( '.iTab' ),
					timer;
			}
			
			tabBox.eq(items.filter(".cur").index()).removeClass("hide");

			var tabHandle = function( elem ){
					elem.siblings( '.iTab' )
						.removeClass( 'cur' )
						.end()
						.addClass( 'cur' );

					tabBox.siblings( options.tabBoxLayout )
						.addClass( 'hide' )
						.end()
						.eq( elem.index() )
						.removeClass( 'hide' );
				},

				delay = function( elem, time ){
					time ? setTimeout(function(){ tabHandle( elem ); }, time) : tabHandle( elem );
				},

				start = function(){
					if( !options.auto ) return;
					timer = setInterval( autoRun, options.auto );
				},

				autoRun = function(){
					var current = menu.find( '.cur' ),
						firstItem = items.eq(0),
						len = items.length,
						index = current.index() + 1,
						item = index === len ? firstItem : current.next( '.iTab' ),
						i = index === len ? 0 : index;

					current.removeClass( 'cur' );
					item.addClass( 'cur' );

					tabBox.siblings( options.tabBoxLayout )
						.addClass( 'hide' )
						.end()
						.eq(i)
						.removeClass( 'hide' );
				};

			items.bind( options.event, function(){
				delay( $(this), options.timeout );
				var _this = $(this);
				if( options.callback ){
					options.callback( self,_this );
				}
			});

			if( options.auto ){
				start();
				self.hover(function(){
					clearInterval( timer );
					timer = undefined;
				},function(){
					start();
				});
			}
		});
	};
})(jQuery);


//加载后Ajxa的Javascript文件
var getMyScript = function() {
	//$.getScript("js/jquery.mousewheel.min.js");
};


//构造生成页面自定高度的方法
var setHeightCss = (function() {
	var timeout = null;
	var scalcMin_height = (function() {
		return $(".sys_head").outerHeight() + $("#slideUp_contain").outerHeight();
	})();
	var mainContain_height = (function() {
		return $("#slideUp_contain").outerHeight();
	})();
	var scalcNum = [
		["dataBox",scalcMin_height],
		["mainContain",mainContain_height],
		["fixheight", (function() {
			return $(".sh_nav").height() + $(".sys_head").height() + parseInt($("#slideUp_contain").attr("miniSizeHeight"));
		})()],
		["fixheightLeft", (function() {
			return $(".sh_nav").height() + $(".sys_head").height();
		})()]
	];
	$win.on("resize.customcss", function() {
		if (timeout) {clearTimeout(timeout);}
		setTimeout(function() {return winMinheight($win,scalcNum,"");},150);
	});
	return winMinheight($win,scalcNum,"");
})($win);

//加载用户参数
if (typeof userConfing != "undefined") {
	var load_user_confing = (function() {
		var uName,
			uImgURL,
			$uName,
			$uPortrait;
		uName = userConfing.username;
		uImgURL = userConfing.userportrait;
		$uName =$("#ua_name");
		$uPortrait = $("#ua_port");
		
		var newimg = $('<img>');
		newimg.attr({ src: uImgURL, id:"upi" }).load(function() {
			$uPortrait.append(newimg);
			newimg.css({"opacity":"0"});
			setTimeout(function() {$("#upi").imageScale({fadeInDuration:150});},0);
		}).error(function() {
			alert("加载用户头像失败!");
		});
		$uName.html(uName);
		load_user_confing = null;
	})(userConfing);	
} else {
	var load_user_confing = (function() {
		return alert("加载用户数据失败");
	})();
}

//构造装饰用的Banner图片加载
var loadingLiteBannerImg = (function() {
	var $target = $("#sh_bgwrap");
	var bannerImgURL = "images/bannerimg.jpg";
	var cacheIMG = $("<img>");
	cacheIMG.attr({src:bannerImgURL, id:"bannerLiteImg"}).load(function() {
		cacheIMG.css({
			"opacity":"0",
			"position": "absolute",
			zIndex :"-1"
		});
		$target.prepend(cacheIMG);
		setTimeout(function() {
			$("#bannerLiteImg").imageScale({fadeInDuration:300});
		},0);
	});
})();

//构造 底部上下伸缩动作
var slideBotLayout = (function() {
	function disableDOMScroll() {
		var $doms = $("html,body");
		$doms.animate({
			"scrollTop":"0px"
		},200,function() {
			$doms.addClass("hideScrollBar");
			$win.trigger("resize");
		});
	}
	function enableDOMScroll() {
		var $doms = $("html,body");
		$doms.removeClass("hideScrollBar");
	}
	//绑定ESC
	function QuickySlideDown() {
		$doc.on("keyup.QuickySlideDown",function(e){
			if (e.keyCode == 27) {
				$(".slideBtn", "#slideUp_contain").trigger("click");
			}
		});
	}
	$doc.on("click.sbl",".slideBtn", function() {
		var $target = $("#slideUp_contain");
        var $tbox = $target.find(".slideUp_contain_box");
        var $this = $(this);
		$slideUp_contain = $target;
		if (!$target.data("states") || $target.data("states") == "hide") { 
			var $target1   = $(".sys_head");
			var $target2   = $(".sh_nav");
			var gotoHeight = (function() {
				return $target1.height() + $target2.height();
			})();
			//$(document.documentElement).scrollTop("0");
			$(".popup_mask").addClass("mod-mask-showed2");
            $this.html("&#xe615;");
			$target
				.css({height:"auto", top:$target.offset().top})
				.data({"states":"show"})
				.stop().animate({"top":gotoHeight},160,"easeOutCirc",function() {
                    $tbox.height($target.height() - 39);
                    $target
                        .addClass("sideUp")
                        .trigger("show");
					//disableDOMScroll();
				 	QuickySlideDown();
				});
		} else if ( $target.data("states") == "show") {
			$target.css({
				height: $target.height(),
				top:"auto"
			}).stop().animate({
				height:$("#slideUp_contain").attr("miniSizeHeight")
			},160,"easeOutCirc",function() {
				$target
					.removeAttr("style")
					.data("states","hide").trigger("hide");
				//enableDOMScroll();
                $this.html("&#xe611;");
                $target.removeClass("sideUp");
				$(".popup_mask").removeClass("mod-mask-showed2");
				$doc.off(".QuickySlideDown");
			});
		}
	});
})($doc,$win,$sys_head);
//构造 底部li标签跑马灯
/*function AutoScroll(obj){
	$(obj).find("ul:first").animate({
		marginTop: (function() {
			return "-33px"
		})()
	},500,function(){
		$(this).css({marginTop:"0px"}).find("li:first").appendTo(this);
	});
}*/
var sidemarquee = function(obj) {
    var $element = $(obj);
    if ($element.length) {
        $.getScript("js/jay.plugin.marquee.js").always(function() {
            $element.kxbdMarquee({
                isEqual:false,//所有滚动的元素长宽是否相等,true,false
                loop: 0,//循环滚动次数，0时无限
                direction: 'left',//滚动方向，'left','right','up','down'
                scrollAmount:1,//步长
                scrollDelay:20//时长
            });
        });
    }
}; 

//构造侧栏伸缩方法，这里不采用JQ构建插件的方式，直接写了。
var sideBarFn = function(options) {
	var opt = $.extend({
		target:".side_list_wrap",
		eachBlock:".side_block_act_box",
		eb_title:".side_block_act_title",
		eb_box:".side_block_act_el"
	},options);
	$target = $(opt.eachBlock ,opt.target);
	var show_fn = function(paret,title,box) {
		title.removeClass("side_block_act_title_hide");
		box.removeClass("side_block_act_el_hide");
		paret.removeClass("side_block_act_box_hide").data("states","show");
	};
	var hide_fn = function(paret,title,box) {
		title.addClass("side_block_act_title_hide");
		box.addClass("side_block_act_el_hide");
		paret.addClass("side_block_act_box_hide").data("states","hide");
	};
	$target.each(function(i,el) {
		var $self = $(el);
		var $title = $(el).children(opt.eb_title);
		var $box = $(el).children(opt.eb_box);
		if ($self.hasClass("side_block_act_box_hide")) {
			$self.data("states","hide");
		} else {
			$self.data("states","show");
		}
		$self.on("click.eb_title",opt.eb_title,function(e) {
			e.stopPropagation();
			if ($self.data("states") == "hide") {
				show_fn($self,$title,$box);
			} else {
				hide_fn($self,$title,$box);
			}
		}).on("click.eb_box",opt.eb_box,function(e) {
			e.stopPropagation();
		});
	});
	//if (Modernizr.csstransforms3d){} else {}
};
//构造modal弹框
;(function($){
	var ModalboxDefaults = {
		mask:".mod-mask",
		modalWrap:".mod-wrap",
		modalBox:".mod-box",
		modalBoxWrap:".mod-box-wrap",		
		modalBoxTitle:".mod-box-title",
		maskShowClassName:"mod-mask-showed",
		modalShowClassName:"mod-showed",
		modalHideClassName:"mod-hided"
	};
	$.fn.ModalboxShow = function(options) {
		var opt = $.extend({
			title:"Modal Title", //标题
			clsBtn:"mod-close-btn", //关闭按钮的选择器
			newhtml:"", //直接写HTML内容
			selector:"", //以选择器为目标的内容
			width:"",// !功能未完成
			height:"",// !功能未完成
			fixMaxheight:true,//是否开启max-heigh 属性，默认开启，当弹出框超出屏幕的时候，限定在屏幕内。
			callback:"" //回调函数，function(a,b,c,d){}
		},ModalboxDefaults,options);
		/*
		var $mask,
			$modalWrap,
			$modalboxTitle,
			$modalBox;
		*/
		//初始化
		$(opt.clsBtn).trigger("click");
		var Modalbox = {
			$mask:$(opt.mask),//遮罩
			$modalWrap:$(opt.modalWrap),//弹框外层包裹
			$modalBox:$(opt.modalBox, opt.modalWrap),//弹框本体内容区域
			$modalboxWrap:$(opt.modalBoxWrap, opt.modalWrap),//弹框本体
			$modalboxTitle:$(opt.modalBoxTitle, opt.modalWrap),//标题
			$modalboxTitleWrap:$(opt.modalBoxTitle, opt.modalWrap).parent()//标题包裹
		};
		var boxMaxHeight = function() {
			var $modbox = Modalbox.$modalBox;
			return $modbox.css("max-height",$win.height() - Modalbox.$modalboxTitleWrap.height() - parseInt($modbox.css("padding-top")) - parseInt($modbox.css("padding-bottom")) - 20 );
		};
		//show
		Modalbox.$mask.addClass(opt.maskShowClassName);
		Modalbox.$modalWrap.addClass(opt.modalShowClassName);
		
		
		
		
		
		//构造一些调用方法
		Modalboxfn = {
			hide:function() {
				Modalbox.$mask.removeClass(opt.maskShowClassName);
				Modalbox.$modalWrap.removeClass(opt.modalShowClassName);
				$doc.off(".clsmodalbox");
				$doc.off(".modalmask");
				$win.off(".modalresize");
				Modalbox.$modalBox.off(".contentwheel");
				Modalbox.$modalboxWrap.removeData("modal");
			},
			newopen:function() {
				var $content = $(opt.selector);
				$doc.off(".clsmodal");
				$content
					.appendTo("#mod-temp-wrap")
					.unwrap();
			}
		};
		
		
		
		
		if (opt.width) {Modalbox.$modalboxWrap.css("width", opt.width);} else {Modalbox.$modalboxWrap.removeAttr("style");}
		//if (opt.height) {Modalbox.$modalboxWrap.css("height", opt.height)} else {Modalbox.$modalboxWrap.removeAttr("style")}
		if (opt.fixMaxheight) {
			boxMaxHeight();
			$win.on("resize.modalresize", function() {
				boxMaxHeight();
			});
			Modalbox.$modalBox.on("mousewheel.contentwheel", function(e){
				e.stopPropagation();
				/*var self = this;
				var sTop = self.scrollTop;
				var cHi = self.clientHeight;
				var sHi = self.scrollHeight;
				if ( !(sTop === 0 && e.deltaY > 0 || sTop+cHi===sHi && e.deltaY < 0 || cHi == sHi) ) {
					e.stopPropagation();
				}*/
			});	
		}
		
		
		var modalDate =  Modalbox.$modalboxWrap.data("modal");
		modalDate?Modalboxfn.newopen():'';
		
		
		
		switch(true){
		case (opt.newhtml!==""):
			!modalDate? Modalbox.$modalboxWrap.data("modal"):'';
			Modalbox.$modalboxTitle.text(opt.title);
			Modalbox.$modalBox.html($.parseHTML(opt.newhtml));
			break;
		case (opt.selector!==""):
			!modalDate? Modalbox.$modalboxWrap.data("modal"):'';
			$slor = $(opt.selector);
			$slor.wrap("<div id='mod-temp-wrap'></div>");
			$doc.on("click.clsmodal", opt.clsBtn, function() {
				$slor.appendTo("#mod-temp-wrap");
				$slor.unwrap();
				$doc.off(".clsmodal");
			});
			Modalbox.$modalboxTitle.text(opt.title);
			Modalbox.$modalBox.html("");
			Modalbox.$modalBox.append($slor);
			break;
		default:
			!modalDate? Modalbox.$modalboxWrap.data("modal"):'';
			Modalbox.$modalBox.html("<font style='font-size:36px; line-height:72px;'>:-(<\/font>"+"<br\/>"+"<font style='font-size:24px; line-height:30px;'>出现了一个错误，可能是因为没有内容!</font>");
		}
		$doc.on("mousewheel.modalmask touchmove.modalmask",function(e){
			return false;
		});
		//hide
		
		$doc.on("click.clsmodalbox",opt.clsBtn,function(){
			Modalboxfn.hide();
		});
		if (opt.callback) {
			opt.callback(
				Modalbox.$mask,
				Modalbox.$modalWrap,
				Modalbox.$modalBox,
				Modalbox.$modalboxTitle
			);
		}
		//DEBUG
		/*console.log(Modalbox.$mask)
		console.log(Modalbox.$modalWrap)
		console.log(Modalbox.$modalBox)
		console.log(Modalbox.$modalboxTitle)
		
		console.log(opt.newhtml)
		console.log(opt.maskShowClassName)
		console.log(opt.modalShowClassName)*/
	};
	
	
})(window.jQuery);

//构造专题舆情 弹出框
var opModal = (function() {
	$doc.on("click.addpo", "#addpo", function(e) {
		$("#pomodal input").val("");
		$("#pomodal textarea").text("");
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",
			
			fixMaxheight:true,
			title:"专题",
			modalBoxWrap:".inner",
			//width:1000,
			//newhtml:"Hello world",
			selector:"#pomodal",
			callback:function() {
			}
		});
	});
	//编辑专题
	$doc.on("click.editpo", ".editpo", function(e) {
		//获取专题信息
		var poTitle = $(this).closest('.po_item').find('span');
		var type = poTitle.data("type");
		var _ptext = poTitle.text();
		var allInclude = "浦东。浦东";
		var leastInclude = "徐汇徐汇";
		var notInclude = "云南云南";
		if(_ptext.indexOf("[竞争]")==0){
			_ptext = _ptext.replace('[竞争]',"");
		}
		$("#poTitle").val(_ptext);
		$("#poAllInclude").text(allInclude);
		$("#poLeastInclude").text(leastInclude);
		$("#poNotInclude").text(notInclude);
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",
			
			fixMaxheight:true,
			title:"专题",
			modalBoxWrap:".inner",
			//width:1000,
			//newhtml:"Hello world",
			selector:"#pomodal",
			callback:function() {

			}
		});
	});
	//
	$doc.on("click.delpo", ".delpo", function(e) {
		$("#conf_logout span").text("确认删除吗？");
		var poItem = $(this).closest('.po_item')
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:507,
			title:"注意",
			selector:"#conf_logout",
			callback:function(a,b,c,d) {
				c.on("click.delgo",".custom_bt", function(e) {
					poItem.remove();
					$(".pop-0 .close").trigger("click");
					c.off(".delgo");
				});
			}
		});
		return false;
	});
})();

//构造相似度 弹出框
var opModal2 = (function() {
	$("#t_relevance").on("click", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBoxWrap:".inner",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",
			
			fixMaxheight:true,
			//width:1000,
			title:"相关度设置",
			selector:"#kkk",
			callback:function() {
			}
		});
		return false;
	});
})();

//构造特定来源设置 弹出框
var opModal3 = (function() {
	$("#t_source").on("click", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0-1",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",
			
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:780,
			title:"特定来源设置",
			selector:"#origin",
			callback:function() {
			}
		});
		return false;
	});
})();

//构造相似度 弹出框
var opModal4 = (function() {
	$doc.on("click.addpo", ".analysis", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",
			fixMaxheight:true,
			width:700,
			modalBoxWrap:".inner",
			title:"趋势分析",
			selector:"#analysis",
			callback:function() {
				if(Modernizr.rgba){
					getChartData();
				}
			}
		});
		return false;
	});
})();

//登录 弹出框
var opModal5 = (function() {
	$doc.on("click", ".login_Click", function(e) {
		$("#conf_logout span").text("确认注销并且退出？");
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:507,
			title:"注意",
			selector:"#conf_logout",
			callback:function(a,b,c,d) {
				c.on("click.changtoLogin",".custom_bt", function(e) {
					window.location='login.html';
					c.off(".changtoLogin");
				});
			}
		});
		return false;
	});
})();

//找回密码 弹出框
var opModal6 = (function() {
	$doc.on("click.addpo", ".retrieveClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"找回密码",
			selector:"#retrieve",
			callback:function(a,b,c,d) {
				$(".pop-1").removeClass("mod-showed");
				console.log(a,b,c,d);
				$(".pop-0").one("click.ss",".close",function() {
					setTimeout(function() {
						$(".pop-1").addClass("mod-showed");
					},0);
				});
			}
		});
		return false;
	});
})();

//提示 弹出框
var opModal7 = (function() {
	$(".popup").on("click",".promptClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",			
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"提示",
			selector:"#prompt",
			callback:function() {
			}
		});
		
		return false;
	});
})();


//修改密码 弹出框
var opModal8 = (function() {
	$doc.on("click.addpo", ".accountClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:580,
			title:"设置",
			selector:"#account",
			callback:function() {
			}
		});
		return false;
	});
})();


//来源设置 弹出框
var opModal9 = (function() {
	$doc.on("click.addpo", ".originClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"来源设置",
			selector:"#source",
			callback:function() {
			}
		});
		return false;
	});
})();

//提醒 弹出框
var opModa20 = (function() {
	$doc.on("click", ".warnClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"提醒",
			selector:"#warn",
			callback:function() {
			}
		});
		return false;
	});
})();

//推送设置 弹出框
var opModa21 = (function() {
	$doc.on("click.addpo", ".pushClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"推送设置",
			selector:"#push",
			callback:function() {
			}
		});
		return false;
	});
})();

//添加副账号 弹出框
var opModa22 = (function() {
	$doc.on("click.addpo", ".deputyClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"添加副账号",
			selector:"#deputy",
			callback:function() {
			}
		});
		return false;
	});
})();

//推送设置提醒 弹出框
var opModa23 = (function() {
	$(".myPush_tab").Tabs({
		event : 'click',		//事件类型  
		timeout : 0,			//设置事件延迟
		auto : 0,				//多少秒自动切换一次  
		tabBoxLayout:".myPush_cont", //tabBox的子集
		findInSelf:false,		//用于元素都是处于同个HTML tag里面的时候调用方法
		callback : null			//回调函数
	});
	
	
	$doc.on("click.addpo", ".installClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"推送设置",
			selector:"#install",
			callback:function() {
			}
		});
		return false;
	});
})();

//下载 弹出框
var opModal9 = (function() {
	$doc.on("click.addpo", ".downloadClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:780,
			title:"下载",
			selector:"#download",
			callback:function() {
			}
		});
		return false;
	});
})();

//注销副账号1 弹出框
var opModa24 = (function() {
	$doc.on("click.addpo", ".logoutClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"注销副账号",
			selector:"#deputycon",
			callback:function() {
			}
		});
		return false;
	});
})();
//注销副账号2 弹出框
var opModa25 = (function() {
	$doc.on("click.addpo", ".logoutClick", function(e) {
		e.stopPropagation();
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"注销副账号",
			selector:"#deputycon",
			callback:function() {
			}
		});
		return false;
	});
})();



//构造编辑 十大股东 弹出框
function opModaTheTen() {
	$(".grid_box").on("click.theTen",".theTenClick", function(e) {
		e.stopPropagation();
		var $this = $(this);
		var $paret = $this.closest(".grid_box");
		var $allUser = $paret.find(".gb_block").filter(":not(.addpro)");
		var aliveUser = [];
		var eachSplit = 3;
		$.each($allUser,function(i,d) {
			aliveUser[i] = d.getAttribute("userid");
		});
		
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:500,
			title:"十大股东",
			selector:"#theTen",
			callback:function(a,b,c,d) {
				var chkbs = c.find("input").filter(":checkbox");
				var allChecked;
				b.one("click.kk", ".close", function(e) {
					chkbs.off(".checklength");
				});
				chkbs.on("change.checklength",function() {
					allChecked= $(chkbs.filter(":checked"))
					if ( allChecked.length <= 3 ) {
						var rows = 1;
					} else {
						var rows =Math.ceil(allChecked.length/eachSplit);
					}
					
					//buliding temlpe
					var tempWrap = $("<table>");
					var eachRow= 
						'<tr class="gb_row">'+
						'	<td class="gb_block"></td>'+
						'	<td class="gb_block"></td>'+
						'	<td class="gb_block"></td>'+
						'</tr>';
					for (var i=0; i<rows+1; i++ ) {
						var nw = eachRow;
						tempWrap.append(nw);
					}
					allChecked.each(function(i,el) {
						var $el = $(el);
						tempWrap.find(".gb_block").eq(i).attr("userid", el.getAttribute("id") ).html(  $el.next("label").html() );
					});
					var $empty =  tempWrap.find(".gb_block").filter(function() {
						if ($(this).html() == "") {
							return $(this);
						}
					})
					$empty.eq(0).addClass("addpro theTenClick").html("&#xe602;")
					
					tempWrap.find("tr").each(function() {
						if (
							$(this).find(".gb_block").filter(function() {
								if ($(this).html() == "") {
									return $(this);
								}
							}).length == 3
						) {
							$(this).remove();
						}
					});
					$paret.html(tempWrap.html());
					
				})
			}
		});
	});
}



//构造Metro Gird 的样式呈现方式
var metrogird = function(objID) {
	//grid
	if (document.getElementById(objID)) {
		$.getScript("js/jay.plugin.grid.js").always(function(data) {
            var gridtargey = $(document.getElementById(objID));
			gridtargey.jayGrid();
            $("#slideUp_contain").on("show", function(e) {
                gridtargey.jayGrid("update");
                setTimeout(function() {gridtargey.jayGrid("update");},0);
            });
		});
	}	
};
//Metro Grid 点击切换方法
var metro_grid_link_action = function(obj,wrap) {
    var $obj,
        $wrap;
    $obj = $(obj);
    if ($obj.length) {
        var girdHlepClass = "hide";         //定义帮助样式，可自行扩展
        var girdLayout = ".gridBoxLayout";  //定义切换的目标,可自行扩展
        var girdBackbtn = ".girdBackBtn";
        $wrap = $obj.closest(wrap);
        $girdLayout = $obj.find(girdLayout);
        $girdBackbtn = $obj.find(girdBackbtn);
        
        $gridList = $("#gridList");
        $gridWrap = $("#gridWrap");
        $wrap.on("click.gridLinkAction",obj,function(e) {
            //这里只是个切换列表的范例，后台程序员请在这里添加读取列表的方法
            //推荐用JSONP
            $gridList.removeClass("hide");
            $gridWrap.addClass("hide");
        }).on("click.gridLinkActionBack",girdBackbtn,function(e) {
            $gridList.addClass("hide");
            $gridWrap.removeClass("hide");
            $("#grid").jayGrid("update");
            setTimeout(function() {$("#grid").jayGrid("update");},0);
        });
    }
};
var radomChangeGrid = function() {
    var eachEl = $(".radomGrid");
    $(".gridDateRefresh").on("click", function(e) {
        var nums = Math.floor(Math.random()*3);
        eachEl.eq(nums).removeClass("hide").siblings(".radomGrid").addClass("hide");
    });
};

    


//building ScrollTop fn
var elementScrollTop = function($obj,$btn) {
	//console.log($obj.scrollTop(), $btn.data("showed"));
    $obj.on("scroll", function(e) {
		
        if ($obj.scrollTop() > 100 && !$btn.data("showed")) {
            $btn.fadeIn(250);
            $btn.data("showed");
        } else if ( $obj.scrollTop() < 100) {
            $btn.fadeOut(120);
            $btn.removeData();
        }
    });
    
    $btn.on("click", function(e) {
        $obj.stop().animate({
            scrollTop:0
        },200,"easeOutCubic");
        //},"easeOutCubic",200)
    });
};
//底部Tab的方法
var slideTabFn = function(obj) {
    var $obj = $(obj);
    if ($obj.length) {
        $obj.Tabs({
            event : 'click',		//事件类型  
			timeout : 0,			//设置事件延迟
			auto : 0,				//多少秒自动切换一次  
			tabBoxLayout:"div",		//tabBox的子集
			findInSelf:false,		//用于元素都是处于同个HTML tag里面的时候调用方法
			callback : function(self,_this) {
                if (_this.hasClass("newsest")) {
                     $("#grid").jayGrid("update");
                    setTimeout(function() {$("#grid").jayGrid("update");},0);
                }
            }
        });
    }
};


(function($){
	$.fn.checkbox=function(options){
		$(':checkbox+span',this).each(function(){
			$(this).addClass('checkbox');
            if($(this).prev().is(':disabled')===false){
                if($(this).prev().is(':checked'))
				    $(this).addClass("checked");
            }else{
                $(this).addClass('disabled');
            }
		}).click(function(event){
				if(!$(this).prev().is(':checked')){
				    $(this).addClass("checked");
                    $(this).prev()[0].checked = true;
                }
                else{
                    $(this).removeClass('checked');			
                    $(this).prev()[0].checked = false;
                }
                event.stopPropagation();
			}
		).prev().hide();
	};
})(jQuery);


//***********************************
//DOM READY
//***********************************
$(function() {
	//加载自定义高度
	setHeightCss;
	//加载Ajax Javascript
	getMyScript();
	//加载用户数据
	load_user_confing;
	//加载装饰用BANNER图片
	loadingLiteBannerImg;
	//加载底部上下伸缩层方法
	slideBotLayout;
	//加载跑马灯
    sidemarquee(".quick_news_wrapper");
	//加载侧栏的方法
	sideBarFn();
	//加载专题舆情 弹出框
	opModal;
	//相似度
	opModal2;
    //特定来源弹出
	opModal3;
    //相似度
	opModal4;
    //登录 弹出框
    opModal5;
    //找回密码 弹出框
    opModal6;
    //提示
    opModal7;
    //设置 弹出框
    opModal8;
	//编辑十大股东
	opModaTheTen();
	
	//加载Metro Gird 的样式呈现方式
	metrogird("grid");
    //加载底部SlideTab的方法
    slideTabFn(".sl_tabs");
    //加载 METRO GRID 点击方法
    metro_grid_link_action("#gridLinkDemo",".gridBoxContent");
    //随机变5图表样式
    radomChangeGrid();
	//----
	if (  $(".date_ctrbar").length ) {
		$doc.on("click.dateCtrBar",".dctbtn", function() {
			var $this = $(this);
			$this.closest(".date_ctrbar").next(".date").toggle();
			$this.toggleClass("dctbtnCur");
		});
	}
    //--
    elementScrollTop($(".sc_right"),$(".sc_right_scrollTop_el"));
	elementScrollTop($(".downloadConment"),$(".scrollTop_el02"));
	elementScrollTop($(".downloadConment02"),$(".scrollTop_el03"));
});
$(function(){
	$('.txt').focus(function(){$(this).addClass('cur');})
		.blur(function(){$(this).removeClass('cur');});
	$('.text1').focus(function(){$(".process1 em").hide();$(".process1 i").show();
	})
		.blur(function(){$(".process1 em").show();$(".process1 i").hide();
	});
	$('.text2').focus(function(){$(".process3 em").hide();$(".process3 i").show();
	})
		.blur(function(){$(".process3 em").show();$(".process3 i").hide();
	});
});
(function($) {
	$.fn.plusTab = function (options) {
        var opts = {
            opt_1: 'cur',
            opt_2: '.tabBox',
            opt_3: 'hide'
        };
        var opt = $.extend(opts, options);
        return this.each(function () {
            var _obj = $(this);
            _obj.click(function (e) { //click
                //e.stopPropagation();
                _obj.addClass(opt.opt_1).siblings().removeClass(opt.opt_1);
                var i = _obj.index();
                $(opt.opt_2 + '> div').eq(i).removeClass(opt.opt_3).siblings().addClass(opt.opt_3);
            });
        });
        //return this;
    };
})(jQuery);

$(function(){
	//Tab切换
	$('.retrieve_menu li').plusTab({ opt_2: '.retrieveBox' });
	$('.accTab li').plusTab({ opt_2: '.accTabCon' });
	$('.install_menu li').plusTab({ opt_2: '.installCon' });
	//找回密码切换
	$(".step1").click(function(){
		$(".process2").show();
		$(".process1").hide();
	});
	$(".step2").click(function(){
		$(".process4").show();
		$(".process3").hide();
	});
    
	//相似来源点击
	$doc.on("click.sims", "em.wts,.dataCircle .nlli_title", function() {
		$.fn.ModalboxShow({
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",	
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner",
			width:1000,
			title:"相似",
			selector:"#similar_sources"
		});
	});
	
    //来源设置条件判断
    $(".popup").on("click",".search_bt", function(e) {
        if ( $("#addurl").val() == "aaa.bbb.com") {
			console.log($("#addurl").val());
            $("#sr_1").html($("#addurl").val());
            $("#sr_sesson-1").removeClass("hide");
            $("#sr_sesson-2").addClass("hide");
        } else {
			console.log($("#addurl").val());
            $("#sr_2").html($("#addurl").val());
            $("#sr_sesson-2").removeClass("hide");
            $("#sr_sesson-1").addClass("hide");
        }
    }).on("click", "#sr_iknow", function(e) {
		$("#sr_sesson-1").addClass("hide");
		$("#sr_sesson-2").addClass("hide");
	});
    
    //来源设置条件判断2
    $(".popup").on("click","#cut_bt_st", function(e) {
        if ( $("#addurl2").val() == "aaa.bbb.com") {
			console.log($("#addurl2").val());
            $("#sr2_1").html($("#addurl2").val());
            $("#sr_sesson2-1").removeClass("hide");
            $("#sr_sesson2-2").addClass("hide");
        } else {
			console.log($("#addurl2").val());
            $("#sr2_2").html($("#addurl2").val());
            $("#sr_sesson2-2").removeClass("hide");
            $("#sr_sesson2-1").addClass("hide");
        }
    }).on("click", "#sr2_iknow", function(e) {
		$("#sr_sesson2-1").addClass("hide");
		$("#sr_sesson2-2").addClass("hide");
	});	
	
	//注销副账号的方法
	$(document.getElementById("accountinfor02")).on("click", ".del_ico", function(e) {
		var $this = $(this);
		var $delEl =$this.closest("li").find("i");
		var oldID = $delEl.html();
		var defacultOpt = {
			clsBtn:".close",
			mask:".popup_mask",
			modalWrap:".pop-0",
			modalBox:".pop_content",
			modalBoxTitle:".pop_title span",		
			fixMaxheight:true,
			modalBoxWrap:".inner"
		};
		
		$this[0].className = "add_ico";
		$this.html('<img src="images/add_icon.png"> 添加');
		//$delEl.attr("contenteditable","true");
		$("#deputycon").find(".success").html("确定注销副账号【" +oldID+ "】？");
		
		
		$.fn.ModalboxShow($.extend({
			width:507,
			title:"注销副账号",
			selector:"#deputycon",
			callback:function(a,b,c,d) {
				c.on("click.comfr", "input.custom_bt", function(e) {
					$this.closest("li").find("i").html("");
					$.fn.ModalboxShow({
						clsBtn:".close",
						mask:".popup_mask",
						modalWrap:".pop-0",
						modalBox:".pop_content",	
						modalBoxTitle:".pop_title span",		
						fixMaxheight:true,
						modalBoxWrap:".inner",
						width:580,
						title:"设置",
						selector:"#account",
						callback:function() {
						}
					});
					//--
					c.off(".comfr");
				});
				$doc.on("click.zx", ".close", function(e) {
					setTimeout(function(e) {
						$(".accountClick").trigger("click");
					},0);
					$doc.off(".zx");
				});
			}
		},defacultOpt));
		
		//$this.closest("li").find("i").html("")
	}).on("click",".add_ico", function(e) {
		var $this = $(this);
		var $delEl =$this.closest("li").find("i");
		var str = $delEl.html();
		var content="";
		content= str.replace(/\s+/g, "");
		if (content.length === 0) {
			$this[0].className = "del_ico";
			$delEl.attr("id","adding");
			$this.html('<img src="images/reduce_icon.png"> 注销');
			
			$.fn.ModalboxShow({
				clsBtn:".close",
				mask:".popup_mask",
				modalWrap:".pop-0",
				modalBox:".pop_content",	
				modalBoxTitle:".pop_title span",		
				fixMaxheight:true,
				modalBoxWrap:".inner",
				width:580,
				title:"添加副账号",
				selector:"#adding_af_account",
				callback:function() {
					$doc.on("click.addac1", ".custom_bt", function() {
						var $this = $(this);
						var $parent = $this.closest(".deputyCon");
						var $allinput = $parent.find("input");
						var $ipv0 =$allinput.filter("#newafac_name");
						var $ipv1 =$allinput.filter("#newafac_psw");
						var $ipv2 =$allinput.filter("#newafac_psw_cof");
						
						var ipv0 = $ipv0.val();
						var ipv1 = $ipv1.val();
						var ipv2 = $ipv2.val();
						
						if (   ipv1 !== ipv2 ) {
							alert("两次输入的密码不一致，请重新输入");
						} else if (ipv1 === ipv2) {
							var $target = $("#adding");
							$target.html(ipv0);
							alert("用户名："+ipv0 + ",密码"+ ipv1);
							$(".accountClick").trigger("click");
							$target.removeAttr("id");
							$ipv0.val("");
							$ipv1.val("");
							$ipv2.val("");
							$doc.off(".addac1");
						}
					}).on("click.addac2", ".close", function(e) {
						
						$doc.off(".addac1");
						$doc.off(".addac2");
						setTimeout(function(e) {
							$(".accountClick").trigger("click");
						},0);
					});
				}
			});
					
					
		}				  
		
	});
	
	//custom页面， 来源设置弹出框  的 已添加来源 的  编辑按钮 事件
	$doc.on("click", "#wipik", function(e) {
		var $this = $(this);
		var thisDate = $this.data("editing");
		if (!thisDate) {
			$this.html("<font style=\"font-size:12px\; color:#FF9A9A; margin-right:10px \"></font>确认");
			// $("#forEdit").find("input[disabled]").removeAttr("disabled");
			$("#forEdit").addClass("cur");
			$doc.on("click.delCheck", ".delCheck", function(e) {
				$(this).parent().remove();
			});
			$this.data("editing",true);
		} else if (thisDate) {
			$doc.off(".delCheck");
			$("#forEdit").removeClass("cur");
			$this.html("删除");
			$this.removeData();
		}
	});


	//新闻推送收缩
	$doc.on("click.addpo", ".shrink_t", function(e) {
		$(this).toggleClass('shrink_b').parents('.title').next('.shrinkBox').slideToggle();	
	});
	$doc.on("click.addpo", ".installClick", function(e) {
		//callback:function() {
			$('.dropWeekWrap select').sSelect({
				parentWrapper:".pop_content"
			});
		//}
	});	

	//推送设置 NEW!!!
	
	
	
	//推送设置
	//$(".install_menu").on("click.tssz", "i.icon", function(e) {
//		e.stopPropagation();
//		var $this = $(this);
//		if ($this.hasClass("mailSetting")) {
//			var $val = $this.parent().find("span").html();
//			if ($val == "邮箱推送") {
//				var inputEl = $this.parent().find("span");
//				var mainTar = $(".installClick");
//				$.fn.ModalboxShow({
//					clsBtn:".close",
//					mask:".popup_mask",
//					modalWrap:".pop-0",
//					modalBox:".pop_content",
//					modalBoxTitle:".pop_title span",
//					fixMaxheight:true,
//					modalBoxWrap:".inner",
//					width:510,
//					title:"推送设置",
//					selector:"#setMail_step_1",
//					callback:function(a, b, c, d) {
//						b.on("click.dis", ".close", function(e) {
//							b.off(".dis");
//							setTimeout(function() {
//								mainTar.trigger("click");
//							}, 0);
//							e.stopImmediatePropagation();
//						}).on("click.nexts", ".custom_bt", function(e) {
//							b.off(".dis");
//							b.off(".nexts");
//							$.fn.ModalboxShow({
//								clsBtn:".close",
//								mask:".popup_mask",
//								modalWrap:".pop-0",
//								modalBox:".pop_content",
//								modalBoxTitle:".pop_title span",
//								fixMaxheight:true,
//								modalBoxWrap:".inner",
//								width:510,
//								title:"推送设置",
//								selector:"#setMail_step_2",
//								callback:function(a, b, c, d) {
//									b.on("click.dis", ".close", function(e) {
//										b.off(".dis");
//										setTimeout(function() {
//											mainTar.trigger("click");
//										}, 0);
//										e.stopImmediatePropagation();
//									}).on("click.fin", ".custom_bt", function(e) {
//										b.off(".fin");
//										setTimeout(function() {
//											mainTar.trigger("click");
//										}, 0);
//									});
//								}
//							});
//						});
//					}
//				});
//			}
//		} else if ($this.hasClass("snsSetting")) {
//			var $val = $this.parent().find("span").html();
//			if ($val == "短信推送") {
//				var inputEl = $this.parent().find("span");
//				var mainTar = $(".installClick");
//				$.fn.ModalboxShow({
//					clsBtn:".close",
//					mask:".popup_mask",
//					modalWrap:".pop-0",
//					modalBox:".pop_content",
//					modalBoxTitle:".pop_title span",
//					fixMaxheight:true,
//					modalBoxWrap:".inner",
//					width:510,
//					title:"推送设置",
//					selector:"#setSns_step_1",
//					callback:function(a, b, c, d) {
//						b.on("click.dis", ".close", function(e) {
//							b.off(".dis");
//							setTimeout(function() {
//								mainTar.trigger("click");
//							}, 0);
//							e.stopImmediatePropagation();
//						}).on("click.nexts", ".custom_bt", function(e) {
//							b.off(".dis");
//							b.off(".nexts");
//							$.fn.ModalboxShow({
//								clsBtn:".close",
//								mask:".popup_mask",
//								modalWrap:".pop-0",
//								modalBox:".pop_content",
//								modalBoxTitle:".pop_title span",
//								fixMaxheight:true,
//								modalBoxWrap:".inner",
//								width:510,
//								title:"推送设置",
//								selector:"#setSns_step_2",
//								callback:function(a, b, c, d) {
//									b.on("click.dis", ".close", function(e) {
//										b.off(".dis");
//										setTimeout(function() {
//											mainTar.trigger("click");
//										}, 0);
//										e.stopImmediatePropagation();
//									}).on("click.fin", ".custom_bt", function(e) {
//										b.off(".fin");
//										setTimeout(function() {
//											mainTar.trigger("click");
//										}, 0);
//									});
//								}
//							});
//						});
//					}
//				});
//			}
//		}
//	});
	
});






//DEMO Javascript 只是为了页面效果，可以做参考，但请不要直接套用在开发中：
$(function() {
	var jaydemo= {
		//基本跳转参数
		youJumpIjump:function($obj,url) {
			$obj.on("click",function() {
				window.location = url;
			});
		},
		//股东跳转
		gjump:function() {
			jaydemo.youJumpIjump($(".gb_block[userid='gxd']"),"firm.html");
		},
		//跳到最新
		njump:function() {
			jaydemo.youJumpIjump($(".blue_title input").eq(0),"index.html");
		},
		//跳到最热
		pjump:function() {
			jaydemo.youJumpIjump($(".blue_title input").eq(1),"popular.html");
		},
		//跳到自定义
		cjump:function() {
			jaydemo.youJumpIjump($(".blue_title input").eq(2),"custom.html");
		},
		//跳转到数据统计
		datajump:function() {
			jaydemo.youJumpIjump($(".nav_tab_wrap .nav_tab").eq(1),"statistical.html");
		},
		//跳到首页
		indexjump:function() {
			jaydemo.youJumpIjump( $(".sh_nav_logotext"),"index.html");
		},
		indexjump2:function() {
			jaydemo.youJumpIjump( $(".nav_tab_wrap .nav_tab").eq(0),"index.html");
		}
	};
	//--init
	jaydemo.gjump();
	jaydemo.njump();
	jaydemo.pjump();
	jaydemo.cjump();
	jaydemo.indexjump();
	jaydemo.indexjump2();
	jaydemo.datajump();
	//jaydemo
});












