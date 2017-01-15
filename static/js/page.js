$(function() {
	$(document).on('click','a',function(event) {
		var a = $(this);
		var url = a.attr('href');
		var reg = /^(http|https)/;
		var scriptReg = /^(javascript:)(.*)/;
		if (scriptReg.test(url)) {
			var script = scriptReg.exec(url)[2];
			void(script);
		} else if (!reg.test(url) && url[0] !== '#') {
			event.preventDefault();
			pjax(url);
		} else if (url[0] === '#') {
			event.preventDefault();
			var top;
			if (url.replace('#') == '') {
				top = 0;
			} else {
				var ele = $(url);
				if (ele.length == 0) {
					top = 0;
				} else {
					top = ele.offset().top - 70;
				}
			}
			window.history.replaceState({
				url:url,
				title:document.title
			},'',url);
			$('html,body').animate({scrollTop: top}, 300);
		} else if (a.attr('target') != "_target") {
			a.attr('target','_blank');
		}
	});
	$(window).on('popstate', function(event) {
		event.preventDefault();
		event = event.originalEvent;
		pjax(event.state.url);
	});
	function pjax(url) {
		var hashReg = /(#(.*))$/;
		if (hashReg.test(url)) {
			var res = hashReg.exec(url);
			var hash = res[0];
		}
		$.ajax({
			url: url,
			type: 'GET',
			dataType: 'html',
			success: function (res) {
				history.pushState({
					url:url,
					title:res.title.html()
				}, '', url);
				$('title').html(res.title.html());
				$('nav').replaceWith(res.ele[0]);
				$('div.jumbotron').replaceWith(res.ele[1]);
				$('#con').replaceWith(res.ele[2]);
				$('html,body').scrollTop(0);
				Prism.fileHighlight();
				if (hash) {
					var top = $(hash).offset().top - 70;
					$('html,body').animate({scrollTop: top}, 300);
				}
			},
			dataFilter: function (res) {
				var html = $.parseHTML(res);
				var ele = [];
				var link = [];
				var title;
				var arr = ['#text','META','SCRIPT'];
				for (var i = 0; i < html.length; i++) {
					var name = html[i].nodeName;
					if (arr.indexOf(name) == -1) {
						if (name == 'TITLE') {
							title = $(html[i]);
						} else if (name == 'LINK') {
							link.push($(html[i]));
						} else {
							ele.push($(html[i]));
						}
					}
				}
				return {
					ele:ele,
					link:link,
					title:title
				};
			},
			error: function (res) {
				console.log('error');
				console.log(res);
			},
			complete: function () {
				
			}
		});
	}
	window.player = new WMPlayer({
		containerSelector: '.wm,.wm-float',
		songList: wmplayer_song,
		defaultImg: 'static/img/wmplayer_error.png',
		autoPlay: false,
		playMode:2,
		playList:0,
		playSong:0,
		lrcTopPos: 34,
		listFormat: '<tr><td>${name}$</td><td>${singer}$</td><td>${time}$</td></tr>',
		volSlideEventName:'change',
		defaultVolume:80
	},function () {
		var $this = this;
		var modeText = ['顺序播放','单曲循环','随机播放','列表循环'];
		$this.on('changeMode', function() {
			var $this = this;
			var mode = modeText[$this.getPlayMode()];
			$this.dom.container.find('.wm-mode').attr('title',mode).addClass('wm-mode-' + $this.getPlayMode());
		});
		$this.dom.volRange.nstSlider({
			"left_grip_selector": ".wm-vol-circle",
			"value_changed_callback": function(cause, value) {
				$this.dom.container.find('.wm-vol-current').width(value + '%');
				$this.dom.volRange.trigger('change',[value]);
			}
		});
		$this.dom.container.find('.wm-mode').click(function () {
			var dom = $(this);
			var mode = $this.getPlayMode();
			dom.removeClass('wm-mode-'+mode);
			mode = mode == 3 ? 0 : mode + 1;
			$this.changePlayMode(mode);
		});
		$this.dom.container.find('.wm-list-toggle').click(function () {
			$this.dom.container.find('.wm-list-box').toggleClass('wm-list-show');
		});
		$this.dom.container.find('.wm-lrc-toggle').click(function () {
			$this.dom.container.eq(1).stop().fadeToggle(300);
		});
		$this.dom.container.find('.wm-toggle').click(function () {
			$this.dom.container.toggleClass('wm-show');
		});
		$this.dom.container.find('.wm-lrc-close').click(function () {
			$this.dom.container.find('.wm-lrc-box').removeClass('wm-lrc-show');
		});
	});
});
window.history.replaceState({
	url:window.location.href,
	title:document.title
},'');