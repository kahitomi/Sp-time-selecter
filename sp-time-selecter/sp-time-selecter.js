//==================================================//
//===================时间选择器======================//
//==================================================//

function JtimeToString(Jstring){
	var str = '';
	if(Jstring == null)
		return false;
	str = '';
	if(Jstring[0] == -1)
	{
		str += '每月';
	}
	else
	{
		for(x in Jstring[0])
		{
			str += Jstring[0][x] + '月 ';
		}
	}
	str += '的 ';
	if(Jstring[1] == -1 || Jstring[2] == -1)
	{
		if (str == '每月的') 
		{
			str = '每天';
		}
		else
		{
			str += '每天';
		}			
	}
	else if(Jstring[2] == -2)
	{
		str += '星期';
		for(x in Jstring[1])
		{
			switch(Jstring[1][x])
			{
				case 0:
					str += '一 ';
					break;
				case 1:
					str += '二 ';
					break;
				case 2:
					str += '三 ';
					break;
				case 3:
					str += '四 ';
					break;
				case 4:
					str += '五 ';
					break;
				case 5:
					str += '六 ';
					break;
				case 6:
					str += '日 ';
					break;					
			}
		}			
	}
	else if(Jstring[1] == -2)
	{
		for(x in Jstring[2])
		{
			str += Jstring[2][x] + "号 "
		}		
	}
	if(str == "每月的 每天")
	{
		str = "";
	}
	return str
}
var sp_time_selecter = function(callback){
	if(!callback)
	{
		callback = function(){};
	}
	/*=====时间选择器=====*/
	/*填充日期*/
	var fill_point = function(points,rule){
		var nums = $.parseJSON("["+rule.join(",")+"]"),
			sure = false;
		points.each(function(){
			var point = $(this),
				value = point.data("value"),
				x;
			if(point.is(".point-active"))
			{
				point.removeClass("point-active");
			}
			for(x in nums)
			{
				if(nums[x] == value)
				{
					point.addClass("point-active");
					sure = true;
					break;
				}
			}
			if(sure)
			{
				nums.splice(x,1);
				if(nums.length == 0)
				{
					return false;
				}
			}
			sure = false;	
		});
	};
	var fill_sel = function(sel,rule){
		var month = rule[0],
			day = rule[1],
			date = rule[2],
			hour = rule[3],
			minute = rule[4];
		fill_point(sel.find(".month-sel .point"),month);
		fill_point(sel.find(".day-sel .point"),day);
		fill_point(sel.find(".date-sel .point"),date);
		fill_point(sel.find(".hour-sel .point"),hour);
		fill_point(sel.find(".min-sel .point"),minute);
	};
	/*获取时间字符串*/
	var rule_get_hour = function(rule){
		var _hour = rule[3],
			_te = "",
			_minute = rule[4];
		if(_minute<10)
		{
			_te = "0"; 
		}
		return _hour+":"+_te+_minute;
	};
	/*展开*/
	$(".sel-time-block").on({
		mouseenter:function(){
			var el = $(this);
			if(el.data("seleting")!="true")
			{
				el.addClass("sel-time-block-active");
				
			}
		},
		mouseleave:function(){
			var el = $(this);
			el.removeClass("sel-time-block-active");
		},
		click:function(){
			var el = $(this),
				rule = el.parents(".task").data("rule"),
				_day = el.find(".day-sel"),
				_date = el.find(".date-sel");
			el.removeClass("sel-time-block-active").data({
				seleting: "true"
			});
			el.find(".seleter-block").show().find(".seleter-container").animate({
				left: "0px"
			},300);
			el.find(".seleter-ensure").animate({
				height: "30px"
			},300);
			fill_sel(el,rule);
			if(rule[2] == -2)
			{
				_day.show();
				_date.hide();
			}
			else if(rule[1] == -2)
			{
				_day.hide();
				_date.show();
			}
		}
	});
	/*收起*/
	$(".seleter-ensure").on({
		click:function(){
			var el = $(this).parents(".sel-time-block");
			el.data({
				seleting: "false"
			});
			el.find(".seleter-container").animate({
				left: "-530px"
			},300,"linear",function(){
				el.find(".seleter-block").hide();
			});
			el.find(".seleter-ensure").animate({
				height: "0px"
			},300);
			callback(el.parents(".task"));
			return false;
		}
	});
	/*时分 年月切换*/
	$(".when").on({
		click:function(){
			var el = $(this),
				move_1 = el.parents(".switch-block").siblings(".small-time-block"),
				move_2 = el.parents(".switch-block").siblings(".date-time-block");
			if(el.is(".small-time"))
			{
				move_1.removeClass("small-move");
				move_2.removeClass("date-move");
			}
			else
			{
				move_1.addClass("small-move");
				move_2.addClass("date-move");
			}
			el.addClass("when-on").siblings(".when").removeClass("when-on");
		}
	});
	/*日 星期 切换*/
	$(".hpoint-sel").on({
		mouseenter:function(){
			$(this).addClass("hpoint-hover");
		},
		mouseleave:function(){
			$(this).removeClass("hpoint-hover");
		},
		click:function(){
			var el = $(this),
				_day = el.parents(".mul-sel").find(".day-sel"),
				_date = el.parents(".mul-sel").find(".date-sel");
			if(el.data("type") == "day")
			{
				_day.show();
				_date.hide();
			}
			else
			{
				_day.hide();
				_date.show();
			}
		}
	});
	/*点hover click效果*/
	$(".point").on({
		mouseenter:function(){
			$(this).addClass("point-hover");
		},
		mouseleave:function(){
			$(this).removeClass("point-hover");
		},
		click:function(){
			var el = $(this),
				rule = el.parents(".task").data("rule"),
				type = el.data("type"),
				value = el.data("value"),
				place = 0,
				points,mul,x,same,same1 = -100;
			switch(type)
			{
				case "month":
					place = 0;
					points = el.parents(".month-sel");
					mul = true;
					break;
				case "day":
					place = 1;
					points = el.parents(".day-sel");
					el.parents(".seleter-container").find(".date-sel .point-active").removeClass("point-active");
					rule[2][0] = -2;
					rule[2].splice(1);
					mul = true;
					break;
				case "date":
					place = 2;
					points = el.parents(".date-sel");
					el.parents(".seleter-container").find(".day-sel .point-active").removeClass("point-active");
					rule[1][0] = -2;
					rule[1].splice(1);
					mul = true;
					break;
				case "hour":
					place = 3;
					points = el.parents(".hour-sel");
					mul = false;
					break;
				case "minute":
					place = 4;
					points = el.parents(".min-sel");
					mul = false;
					break;
			}
			if(mul)
			{
				if(value == -1)
				{
					points.find(".point-active").removeClass("point-active");
					rule[place][0] = value;
					rule[place].splice(1);
					el.addClass("point-active");
				}
				else
				{
					if(rule[place][0] == -2)
					{
						rule[place].splice(0);
					}
					for(x in rule[place])
					{
						if(rule[place][x] == -1)
						{
							same1 = x;
						}
						if(rule[place][x]==value)
						{
							rule[place].splice(x,1);
							el.removeClass("point-active");
							same = true;
						}
					}
					if(same1 != -100)
					{
						points.find(".point-active").each(function(){
							var el = $(this);
							if(el.data("value") == -1)
							{
								el.removeClass("point-active");
							}
						});
						rule[place].splice(same1,1);
						same1 = -100;
					}
					if(!same)
					{
						rule[place].push(value);
						el.addClass("point-active");
					}
					same = false;
				}				
			}
			else
			{
				points.find(".point-active").removeClass("point-active");
				el.addClass("point-active");
				rule[place][0] = value;
			}
			el.parents(".task").find(".time-show").text(rule_get_hour(rule));
			el.parents(".task").find(".date-show").text(JtimeToString(rule));
			return false;
		}
	});
	$(".seleter-block").on({
		click:function(){
			return false;
		}
	});
	/*分钟加减*/
	$(".point-de").on({
		click:function(){
			var el = $(this).parents(".point"),
				show = el.find(".point-show"),
				num = Number(el.data("value"));
			if(num==0)
			{
				num = 60;
			}
			else
			{
				num--;
			}
			show.text(num);
			el.data({
				"value": num
			}).attr("data-value",num);
		}
	});
	$(".point-pl").on({
		click:function(){
			var el = $(this).parents(".point"),
				show = el.find(".point-show"),
				num = el.data("value");
			if(num==60)
			{
				num = 0;
			}
			else
			{
				num++;
			}
			show.text(num);
			el.data({
				"value": num
			}).attr("data-value",num);
		}
	});
}
var sp_time_init = function(block,rule){
	var show_time = block.find(".time-show"),
		show_date = block.find(".date-show"),
		rule_get_hour = function(rule){
			var _hour = rule[3],
				_te = "",
				_minute = rule[4];
			if(_minute<10)
			{
				_te = "0"; 
			}
			return _hour+":"+_te+_minute;
		};
	$(".task").data("rule", rule);
	show_time.text(rule_get_hour(rule));
	show_date.text(JtimeToString(rule));
}