/**
 * File Name: flowChart.js Summary: 比赛流程图插件，生成比赛流程图。
 * 该插件依赖于:
 * bootstrap.min.css
 * bootstrap-responsive.min.css
 * jquery.js
 * jquery-ui.js
 * bootstrap.min.js
 * 
 * 初始化参数及默认值：
 * 
 * Author: Ximing Wang 
 */

(function($) {

	var methods = {

		/**
		 * 初始化流程图插件。
		 * 
		 * version 1.0
		 * Author: Ximing Wang
		 */
		init : function(options) {
			var self = this;
			var $this = $(this);

			var isInitialized = $this.data("isInitialized");
			if (isInitialized == null) {
				// 保存插件设置至全局。
				self.options = options;
				
				// 初始团队数量
				if (options.count != undefined) {
					self.count = options.count;
				}
				else {
					self.count = 0;
				}
				
				// 比赛阶段
				self.stage = 0;
				
				// 战队名称高度
				self.teamNameHeight = 0;
				
				if (options.teams != undefined) {
					self.teams = options.teams;
				}
				else {
					self.teams = null;
				}
				
				// 战队名称控件数组
				self.teamNames = new Array();
				
				if (!isPowOfTwo(self, self.count)) {
					return ;
				}
				
				// 生成核心html
				render(self);
				
				// 保存底层数据
				$this.data('chartData', self);
				
				if (self.teams != null) {
					methods['updateTeams'].call(this, self.teams);
				}
				
				$this.addClass('flow-chart');
				
				// 初始化缩放事件
				initResizeEvent(self);

				// 设置初始化flag.
				$this.data('isInitialized', true);
			}
		},
		
		updateTeams: function (teams) {
			var self = $(this).data('chartData');
			
			if (teams == undefined || teams == null) {
				return;
			}
			
			self.teams = teams;
			
			// 清空所有的战队名称
			var teamNameElement = null;
			$.each(self.teamNames, function (index, teamName) {
				teamNameElement = $(teamName);
				teamNameElement.html('');
				teamNameElement.attr('title', '');
			});
			
			// 更新战队名称
			$.each(teams, function (index, team) {
				teamNameElement = $(self.teamNames[index]);
				teamNameElement.html(team);
				teamNameElement.attr('title', team);
			});
			
			$(this).data('chartData', self);
		}
	};

	/**
	 * flowChart插件构造函数。
	 * 
	 * version 1.0
	 * Author: Ximing Wang
	 */
	$.fn.flowChart = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method
					+ ' does not exist on jquery.koolearn.whiteboard');
		}
	};
	
	/**
	 * 生成核心html
	 * 
	 * @param {Object} instance 当前插件
	 * 
	 * @author Ximing Wang
	 */
	var render = function (instance) {
		var proLineColWidth = 100 / (3 * instance.stage - 1);
		var colWidth = proLineColWidth * 2;
		instance.teamNameHeight = 100 / (instance.count * 2 - 1);
		var colContainer = null;
		var count = instance.count;
		
		colContainer = $('<div style="width: ' + colWidth + '%; height: 100%; float: left;"></div>');
		createColTeam(instance, colContainer, 1, count);
		$(instance).append(colContainer);
		for (var i = 1; i < instance.stage; i++) {
			count = instance.count / (Math.pow(2, i));
			colContainer = $('<div style="width: ' + proLineColWidth + '%; height: 100%; float: left;"></div>');
			createColProLine(instance, colContainer, 2 * i, count);
			$(instance).append(colContainer);
			colContainer = $('<div style="width: ' + colWidth + '%; height: 100%; float: left;"></div>');
			createColTeam(instance, colContainer, 2 * i + 1, count);
			$(instance).append(colContainer);
		}
	};
	
	/**
	 * 创建一列战队
	 * 
	 * @param {Object} instance 当前插件
	 * @param {Object} colContainer 该列的容器
	 * @param {Number} stage 当前列阶段数
	 * @param {Number} count 当前列战队个数
	 * 
	 * @author Ximing Wang
	 */
	var createColTeam = function (instance, colContainer, stage, count) {
		// (2^((stage+1)/2)-1)*teamNameHeight
		var splitHeight = (Math.pow(2, (stage + 1) / 2) - 1) * instance.teamNameHeight;
		// (2^((stage-1)/2)-1)*teamNameHeight
		var firstSplitHeight = (Math.pow(2, (stage - 1) / 2) - 1) * instance.teamNameHeight;
		
		var splitElement = null;
		var teamNameElement = null;
		
		// 第一个分隔div
		splitElement = $('<div style="height: ' + firstSplitHeight + '%; width: 100%;"></div>');
		teamNameElement = $('<div style="height: ' + instance.teamNameHeight + '%; width: 100%;"><div class="team-name"></div></div>');
		colContainer.append(splitElement);
		colContainer.append(teamNameElement);
		instance.teamNames.push(teamNameElement.find('.team-name'));
		for (var i = 0; i < count - 1; i++) {
			splitElement = $('<div style="height: ' + splitHeight + '%"></div>');
			teamNameElement = $('<div style="height: ' + instance.teamNameHeight + '%; width: 100%;"><div class="team-name"></div></div>');
			colContainer.append(splitElement);
			colContainer.append(teamNameElement);
			instance.teamNames.push(teamNameElement.find('.team-name'));
		}
	};
	
	/**
	 * 创建一列晋级线
	 * 
	 * @param {Object} instance 当前插件
	 * @param {Object} colContainer 该列的容器
	 * @param {Number} stage 当前列阶段数
	 * @param {Number} count 当前列晋级线个数
	 * 
	 * @author Ximing Wang
	 */
	var createColProLine = function (instance, colContainer, stage, count) {
		// (2^((stage-2)/2)-0.5)*teamNameHeight
		var firstSplitHeight = (Math.pow(2, (stage - 2) / 2) - 0.5) * instance.teamNameHeight;
		// (2^(stage/2))*teamNameHeight
		var splitHeight = (Math.pow(2, stage / 2)) * instance.teamNameHeight;
		// 每个晋级线的高度
		var proLineHeight = splitHeight;
		
		var splitElement = null;
		var proLineElement = null;
		
		// 第一个分隔div
		splitElement = $('<div style="height: ' + firstSplitHeight + '%; width: 100%;"></div>');
		proLineElement = $('<div style="height: ' + proLineHeight + '%; width: 100%;"></div>');
		colContainer.append(splitElement);
		colContainer.append(proLineElement);
		createProLine(instance, proLineElement);
		for (var i = 0; i < count - 1; i++) {
			splitElement = $('<div style="height: ' + splitHeight + '%"></div>');
			proLineElement = $('<div style="height: ' + proLineHeight + '%; width: 100%;"></div>');
			colContainer.append(splitElement);
			colContainer.append(proLineElement);
			createProLine(instance, proLineElement);
		}
	};
	
	/**
	 * 生成晋级线
	 * 
	 * @param {Object} instance 当前插件
	 * @param {Object} container 晋级线容器
	 * 
	 * @author Ximing Wang
	 */
	var createProLine = function (instance, container) {
		var html = '<div class="pro-line-1 pro-line"></div>' +
			'<div class="pro-line-2 pro-line"></div>' +
			'<div class="pro-line-3 pro-line"></div>';
		
		container.append($(html));
	};
	
	/**
     * 判断一个整数是否是2的N次幂
     * 
     * @param {Object} instance 当前插件
     * @param {Number} num 要检测的整数
     * 
     * @return {boolean} true:是2的N次幂;false:不是2的N次幂
     * 
     * @author Ximing Wang
     */
	var isPowOfTwo = function (instance, num) {
    	if (num > 0) {
    		var count = -1;
        	var pow = -1;
        	while (pow < num) {
        		count++;
        		pow = 1 << count;
        	}
        	instance.stage = count + 1;
        	return (pow == num);
    	}
    	
    	return false;
    };
    
    /**
     * 根据x求x的y次幂中的y值
     * 
     * @param {Object} instance 当前插件
     * @param {Number} num x的y次幂的值
     * @param {Number} x 底数x
     * 
     * @returns {Number} y 指数y
     * 
     * @author Ximing Wang
     */
    var getYOfX = function (instance, num, x) {
    	if (num > 0 && x > 0) {
    		var count = -1;
        	var pow = -1;
        	while (pow < num) {
        		count++;
        		pow = Math.pow(x, count);
        	}
        	return count;
    	}
    	
    	return -1;
    };
    
    /**
     * 初始化缩放事件
     * 
     * @param {Object} instance 当前插件
     * 
     * @author Ximing Wang
     */
    var initResizeEvent = function (instance) {
    	// 清空所有的战队名称，设置容器属性
		var teamNameElement = null;
		var teamNameElementHeight = 0;
		$.each(instance.teamNames, function (index, teamName) {
			teamNameElement = $(teamName);
			teamNameElement.html('');
			teamNameElement.attr('title', '');
			teamNameElementHeight = teamNameElement.height();
			teamNameElement.css('font-size', teamNameElementHeight * 0.6 + 'px');
			teamNameElement.css('line-height', teamNameElementHeight + 'px');
		});
		
		// 晋级线
		var proLineColWidth = $($(instance).find('.pro-line')[0]).parent().width();
		$(instance).find('.pro-line').css('border-width', proLineColWidth * 0.03 + 'px');
		
		$(window).resize(function () {
			var teamNameElement = null;
			var teamNameElementHeight = 0;
			$.each(instance.teamNames, function (index, teamName) {
				teamNameElement = $(teamName);
				teamNameElementHeight = teamNameElement.height();
				teamNameElement.css('font-size', teamNameElementHeight * 0.6 + 'px');
				teamNameElement.css('line-height', teamNameElementHeight + 'px');
			});
			
			// 晋级线
			var proLineColWidth = $($(instance).find('.pro-line')[0]).parent().width();
			$(instance).find('.pro-line').css('border-width', proLineColWidth * 0.03 + 'px');
		});
    };
})(jQuery);