;(function($) {
		//CSSsetup
		var csstemple = function(w,h,oEl,oMargin) {
			var csstp = '<style type="text/css">\n' + 
				oEl + "eWidth {width:"+w+"px; height:"+h+"px}\n"+
				oEl + "eWidth_half_w {width:"+(w-oMargin)/2+"px; height:"+h+"px}\n"+
				oEl + "eWidth_half_h {width:"+w+"px; height:"+(h-oMargin)/2+"px}\n"+
				oEl + "eWidth_half_wh {width:"+(w-oMargin)/2+"px; height:"+(h-oMargin)/2+"px}\n"+
			'</style>';	
			return csstp;
		};
	
		//定义随机抽取数组的方法
		/*var getArrayItems = function(arr, num) {
			var temp_array = [];
			for (var index in arr) {
				temp_array.push(arr[index]);
			}
			var return_array = [];
			for (var i = 0; i < num; i++) {
				if (temp_array.length > 0) {
					var arrIndex = Math.floor(Math.random() * temp_array.length);
					return_array[i] = temp_array[arrIndex];
					temp_array.splice(arrIndex, 1);
				} else {
					break;
				}
			}
			return return_array;
		};
*/
	
		//methods
		var methods = {
		init:function(options) {
			//init fn start
			return this.each(function() {
				var opts = $.extend({
					debug:true,//开发人员选项，非开发人员的时候请设置为false
					JSONdata:"",
					col:3,
					margin:10,
					heightProportion:"", //高度的比例，跟随宽度按照一定比例去计算高度，默认0.618
					element:".items"
				},options);
				var $this= $(this);
				var	data= $this.data('jaygrid');
				var $elem = $this.children(opts.element);
				var $body = $body || $("body");
				var eh = opts.heightProportion || 0.618;
				/*if (!opts.JSONdata&&console&&opts.debug) {
					console.log($this[0]);
					console.log("上面那个元素加载数据参数时出错，请确认'JSONdata'有配置参数或者格式正确！");
				}*/
				//if (!data&&opts.JSONdata) {
				if (!data) {
					$this.data('jaygrid',"true");
					//start my plugin
					var wrapwidth  = $this.width();
					var eachwidth  = Math.floor(((wrapwidth-((opts.col-1)*opts.margin))/opts.col)/2)*2;
					var eachheight = Math.floor(eachwidth*eh/2)*2;
					var tempcssID  = $this.attr("class").split(" ")[0]+"Css";
					var $tempcss   = $("<div>").attr("id",tempcssID).css('display', 'none');
					var styles     = csstemple(eachwidth,eachheight,opts.element,opts.margin);
					$tempcss.html(styles);
					$body.prepend($tempcss);
					if (window.console&&opts.debug===true){
						console.log("newAppendCSS:");
						console.log(opts.element + "eWidth");
						console.log(opts.element + "eWidth_half_w");
						console.log(opts.element + "eWidth_half_h");
						console.log(opts.element + "eWidth_half_wh");
					}
					//排列规则:
					//var rules  = [[2,1,1],[4],[1,1,2],[1,1,1,1],[2,2]];
					//var newRules = getArrayItems(rules, opts.col);
					/*
					var splitRules = function() {
						for (var i=0; i< opts.col; i++) {
							newRules[i] = getArrayItems(rules, opts.col);
						}
					};splitRules();
					*/
					
					//console.log(newRules);
				}
			});
		},
		update:function(options) {
			//update the grid if your add something
			return this.each(function () {
				var $this = $(this),
					data  = $this.data('jaygrid');
                var opts = $.extend({
					debug:true,//开发人员选项，非开发人员的时候请设置为false
					JSONdata:"",
					col:3,
					margin:10,
					heightProportion:"", //高度的比例，跟随宽度按照一定比例去计算高度，默认0.618
					element:".items"
				},options);
				var $this= $(this);
				var	data= $this.data('jaygrid');
				var $elem = $this.children(opts.element);
				var $body = $body || $("body");
				var eh = opts.heightProportion || 0.618;
                
                
				if (data == 'true') {
					//start my update
                    var wrapwidth  = $this.width();
					var eachwidth  = Math.floor(((wrapwidth-((opts.col-1)*opts.margin))/opts.col)/2)*2;
					var eachheight = Math.floor(eachwidth*eh/2)*2;
					var tempcssID  = $this.attr("class").split(" ")[0]+"Css";
					//var $tempcss   = $("<div>").attr("id",tempcssID).css('display', 'none');
					var styles     = csstemple(eachwidth,eachheight,opts.element,opts.margin);
                    $(document.getElementById(tempcssID)).html(styles);
                    //$tempcss.html(styles);
				}
				//console.log(data);
			});
		},
		destroy:function() {
			//destroy
		}
	};
	
	$.fn.jayGrid = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method" + method + "does not exist on this plugin");
		}
	};
})(jQuery);

