(function(global, factory) {
	typeof exports === "Object" && typeof module !== "undefined" ? module.exports = factory() :
	typeof defined === "function" && define.amd ? define(factory) :
	global.fullpage = factory();
}(this, function() {
	var _options = {
			sectionContainer		: "section",
			start					: 0,
			type                    : 2,
			threshold               : 0.15,
			drag					: true,
			pagination				: true
	    },

	    Utils = {            
		    hasClass : function(elem, className) {
                if(elem.className) {
            	    return elem.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
                }
		    },

		    addClass : function(elem, className) {
			    if(elem && !this.hasClass(elem, className)) {
				    //elem.className += " " + className;
                    elem.classList.add(className);
			    }
		    },

		    removeClass : function(elem, className) {
			    if(elem && this.hasClass(elem, className)) {
				    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
				    elem.className = elem.className.replace(reg, " ");
			    }
		    },

		    whichTransitionEvent : function() {
		    	var elem,
		    	    key,
		    	    transition = {
		    	    	"transition" : "transitionend",
		    	    	"WebkitTransition" : "webkitTransitionEnd"
		    	    };
		    	elem = document.createElement("fakeElem");
		    	for(key in transition) {
                    if(elem.style[key] !== undefined) {
                    	return transition[key];
                    }
		    	}
		    },

		    transform : function(elem, translateY) {		    	
		    	elem.style.cssText = "transform : translate3d(0, " + translateY * 100+ "%, 0);" + "-webkit-transform : translate3d(0, " + translateY * 100+ "%, 0);";		    	
		    },

            transformScale : function(elem, scale) {
                elem.style.cssText = "transform : scale(" + scale + ");" + "-webkit-transform: scale(" + scale + ");";
            },

            prevSlide : function(elem) {            	
            	action[_options.type].prevSlide(elem);
            },

            nextSlide : function(elem) {            	
                action[_options.type].nextSlide(elem);
                
            },

            showSlide : function(elem) {
                action[_options.type].showSlide(elem);
            },

		    initEvents : function() {
                var startY,
                    currentElem = null,    //当前页面元素
                    prevElem = null,       //前一页面元素
                    nextElem = null,       //后一页面元素
                    activePagination = null,    //当前页码标注
                    percentage = 0,        //竖直触摸移动占屏幕高度比例
                    transition,            //当前所支持的transiiton事件
                    _self = this;          

                var transition = this.whichTransitionEvent();

			    document.addEventListener("touchstart", touchStart, false);
			    document.addEventListener("touchmove", touchMove, false);
			    document.addEventListener("touchend", touchEnd, false);			    
                
                function touchStart(event) {
                	percentage = 0;                    
        	        var touches = event.touches;                    
        	        currentElem = document.querySelector(".current");
        	        nextElem = currentElem.nextElementSibling;
                    prevElem = currentElem.previousElementSibling;
        	        if(touches && touches.length) {                    
                        startY = touches[0].clientY;
                        Utils.addClass(currentElem, "no-transition");    //"no-transition"类使拖动页面没延迟
                        Utils.addClass(prevElem, "no-transition");
                        Utils.addClass(nextElem, "no-transition");
        	        }
                }

                function touchMove(event) {
                    event.preventDefault();                           	
            	    var touches = event.touches,            		
            		    deltaY = 0,            		    
            		    clientHeight = document.body.getBoundingClientRect().height;         	                		
            	    if(touches && touches.length) {
            		    deltaY = touches[0].clientY - startY;
            		    percentage = -deltaY / clientHeight; 
            		    switch(true) {
            		    	case (deltaY < 0):    //上拉
            		    	    action[_options.type].upDrag(currentElem, percentage);    //上拉时处理动作
            		    	    break;            		    	
            		    	case (deltaY > 0):    //下拉
            		    		action[_options.type].downDrag(currentElem, percentage);    //下拉时处理动作
            		    		break;
            		    	default:
            		    	    break;
            		    }           		    
            	    }
                }

                function touchEnd(event) {                	
                    Utils.removeClass(currentElem, "no-transition");    //触摸结束后去掉"no-transition"类，使接下来的transform有过渡效果
                    Utils.removeClass(prevElem, "no-transition");
                    Utils.removeClass(nextElem, "no-transition");
                    if(percentage > _options.threshold) {    //上拉的距离大于阀值
                    	_self.nextSlide(currentElem);
                        nextElem ? nextElem.addEventListener(transition, transitionEnd, false) : currentElem.addEventListener(transition, transitionEnd, false);
                    } else if(Math.abs(percentage) > _options.threshold) {    //下拉的距离大于阀值
                    	_self.prevSlide(currentElem);
                        prevElem ? prevElem.addEventListener(transition, transitionEnd, false) : currentElem.addEventListener(transition, transitionEnd, false);
                    } else if(Math.abs(percentage) < _options.threshold){   //滑动距离小于阀值
                    	_self.showSlide(currentElem);
                        currentElem.addEventListener(transition, transitionEnd, false);
                    }
                    
                    if(percentage != 0) {    //在过渡的时候去掉掉触摸监听
                        document.removeEventListener("touchstart", touchStart);
                        document.removeEventListener("touchmove", touchMove);
                        document.removeEventListener("touchend", touchEnd); 
                    }                    
                }

                function transitionEnd(event) {
                    var target = event.target;                                                   
                    if(_options.pagination) {    //设置分页
                    	activePagination = document.querySelector(".active");
                        if(percentage > 0 && Math.abs(percentage) > _options.threshold) {    //上拉
                            var nextElem = activePagination.nextElementSibling;
                            if(nextElem) {
                        	    Utils.removeClass(activePagination, "active");
                        	    Utils.addClass(nextElem, "active");
                            }
                        } else if(percentage < 0 && Math.abs(percentage) > _options.threshold) {    //下拉
                            var prevElem = activePagination.previousElementSibling;
                            if(prevElem) {
                        	    Utils.removeClass(activePagination, "active");
                        	    Utils.addClass(prevElem, "active");
                            }
                        }
                    }                    
                    percentage = 0;
                    target.removeEventListener(transition, transitionEnd);
                    document.addEventListener("touchstart", touchStart, false);
                    document.addEventListener("touchmove", touchMove, false);
                    document.addEventListener("touchend", touchEnd, false);
                }
		    }
	    };

	var action = {    //页面效果类型
        "1" : {
            "downDrag" : function(elem, percentage) {    //上拉动作处理
                var prevElem = elem.previousElementSibling,
                    translateY = -0.7 * percentage;
                if(prevElem) {
                    Utils.transform(elem, translateY);
                    Utils.transform(prevElem, translateY - 1);
                } else if(!prevElem && _options.drag) {
                    Utils.transform(elem, translateY);
                }
            },
            "upDrag" : function(elem, percentage) {    //下拉动作处理
                var nextElem = elem.nextElementSibling,
                    translateY = 1 - 0.7 * percentage;
                if(nextElem) {
                    Utils.transform(nextElem, translateY);
                } else if(!nextElem && _options.drag) {
                    translateY = -0.7 * percentage;
                    Utils.transform(elem, translateY);
                }                    
            },
            "nextSlide" : function(elem) {    //切换下一页
                var nextElem = elem.nextElementSibling;
                if(nextElem) {
                    Utils.transform(elem, -1);
                    Utils.transform(nextElem, 0);
                    Utils.removeClass(elem, "current");
                    Utils.addClass(nextElem, "current");                        
                } else if(!nextElem && _options.drag) {
                    Utils.transform(elem, 0);
                }                    
            },
            "prevSlide" : function(elem) {    //切换上一页
                    var prevElem = elem.previousElementSibling;
                    if(prevElem) {
                        Utils.transform(prevElem, 0);
                        Utils.transform(elem, 1);
                        Utils.removeClass(elem, "current");
                        Utils.addClass(prevElem, "current");                        
                    } else if(!prevElem && _options.drag) {
                        Utils.transform(elem, 0);
                    }
            },
            "showSlide" : function(elem) {    //显示当前页面
                    var nextElem = elem.nextElementSibling,
                        prevElem = elem.previousElementSibling;
                    if(nextElem) {                      
                        Utils.transform(nextElem, 1);
                    } if(prevElem) {
                        Utils.transform(elem, 0);
                        Utils.transform(prevElem, -1);
                    } else if(!nextElem && _options.drag || !prevElem && _options.drag) {
                        Utils.transform(elem, 0);
                    }                    
            }
        },
        "2" : {
            "downDrag" : function(elem, percentage) {
                var prevElem = elem.previousElementSibling,
                    translateY = -0.7 * percentage,
                    scale = 0.8 - 0.2 * percentage;
                if(prevElem) {
                    Utils.transform(elem, translateY);
                    Utils.transformScale(prevElem, scale);
                } else if(!prevElem && _options.drag) {
                    Utils.transform(elem, translateY);
                }

            },
            "upDrag" : function(elem, percentage) {
                var nextElem = elem.nextElementSibling,
                    translateY = 1 - 0.7 * percentage,
                    scale = 1 - 0.2 * percentage;
                if(nextElem) {
                    Utils.transformScale(elem, scale);
                    Utils.transform(nextElem, translateY);
                } else if(!nextElem && _options.drag) {
                    Utils.transformScale(elem, scale);
                }
            },
            "nextSlide" : function(elem) {
                var nextElem = elem.nextElementSibling;
                if(nextElem) {
                    Utils.transformScale(elem, 0.8);
                    Utils.transform(nextElem, 0);
                    Utils.removeClass(elem, "current");
                    Utils.addClass(nextElem, "current");
                } else if(!nextElem && _options.drag) {
                    Utils.transformScale(elem, 1);
                }
            },
            "prevSlide" : function(elem) {
                var prevElem = elem.previousElementSibling,
                    nextElem = elem.nextElementSibling;
                if(prevElem) {
                    Utils.transformScale(prevElem, 1);
                    Utils.transform(elem, 1);
                    Utils.removeClass(elem, "current");
                    Utils.addClass(prevElem, "current");
                    if(nextElem) {    //fix bug:current页有前后页时，上拉提起后页一段距离后又下拉使前页过渡出现，会出现后页不完全隐藏
                        Utils.transform(nextElem, 1);
                    }
                } else if(!prevElem && _options.drag) {
                    Utils.transform(elem, 0);
                }
            },
            "showSlide" : function(elem) {
                var prevElem = elem.previousElementSibling,
                    nextElem = elem.nextElementSibling;
                if(nextElem) {
                    Utils.transformScale(elem, 1);
                    Utils.transform(nextElem, 1);
                } if(prevElem) {
                    Utils.transform(elem, 0);
                    Utils.transformScale(prevElem, 0.8);
                } else if(!prevElem && _options.drag) {
                    Utils.transform(elem, 0);
                } else if(!nextElem && _options.drag) {
                    Utils.transformScale(elem, 1)
                }   
            }
        }
    };    
  
	var fullpage = function(container, options) {
		var elements = [],
			scrolling = false,
			_container = container,
			pagination = null,
			marginTop = 0,
			paginationList = "",
			list = null;             
        Utils.addClass(_container, "fullpage");
		if(options) {
			for(key in options) {
				if(options.hasOwnProperty(key)) {
					_options[key] = options[key];
				}
			}
		}		
		elements = _container.querySelectorAll(_options.sectionContainer);
		for(var i = 0, len = elements.length; i < len; i++) {
			var className = "page" + (i + 1),
			    index = i,
			    elem = elements[i];
			Utils.addClass(elem, className);
            Utils.addClass(elem, "no-transition");
			switch(true) {
				case index == _options.start:
				    Utils.transform(elem, 0);
				    Utils.addClass(elem, "current");
				    break;
				case index < _options.start:
				    Utils.transform(elem, -1);
				    break;
				default :
				    Utils.transform(elem, 1);
			}
			if(_options.pagination) {
				if(index == _options.start) {
					paginationList += "<li class='active' data-index='" + (index + 1) + "'></li>";
				} else {
					paginationList += "<li data-index='" + (index + 1) + "'></li>";
				}
                
			}
		}             
		if(_options.pagination) {
			pagination = document.createElement("ul"),
			marginTop = 0;
			Utils.addClass(pagination, "pagination");
			pagination.innerHTML = paginationList;
			document.body.appendChild(pagination);
            //竖直居中
			marginTop = pagination.getBoundingClientRect().height / (-2);
			pagination.style.marginTop = marginTop + "px";
			list = pagination.querySelectorAll("li");
		} 
        Utils.initEvents();      		
	};    

	return fullpage;
}));