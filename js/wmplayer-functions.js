/**
 * @authors 0936zz (zz5840@qq.com)
 * @date    2016-08-14 18:35
 */

function setEffects (player) {
	// 滑块
	player.dom.volRange.nstSlider({
		"left_grip_selector": ".wm-vol-circle",
		"value_changed_callback": function(cause, value) {
			player.dom.container.find('.wm-vol-current').width(value + '%');
			player.dom.volRange.trigger('change',[value]);
		}
	});
	player.dom.container.find('.wm-mode').click(function () {
		var dom = $(this);
		var mode = player.getPlayMode();
		dom.removeClass('wm-mode-'+mode);
		mode = mode == 3 ? 0 : mode + 1;
		player.changePlayMode(mode);
		dom.addClass('wm-mode-' + mode);
	});
	player.dom.container.find('.wm-list-toggle').click(function () {
		player.dom.container.find('.wm-list-box').toggleClass('wm-list-show');
	});
	player.dom.container.find('.wm-lrc-toggle').click(function () {
		player.dom.container.eq(1).fadeToggle(300);
		// 为了避免隐藏的元素不被修改属性，需要强制修改一下当前歌词
		player.data.data('currentLrc',0);
	});
	player.dom.container.find('.wm-toggle').click(function () {
		player.dom.container.toggleClass('wm-show');
	});
}
