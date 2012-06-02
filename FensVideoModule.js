/*
Fen's BBCode Utilities (FBU)
Fen's InvisionFree Video Module (FIVM)
Adds the possibility to use a [youtube] BBCode for YouTube videos. Based on Trini_GanGsta's script.
*/

// If provided with a string describing a BBCode element, returns a structure describing that element
function FBU_eval(elemStr) {
	var tmp = elemStr.match(/^\[([^=]+)(=[^\]]+)?\](.*)\[\/([^\]]+)\]$/i);
	if (tmp) {
		// Opening and ending tag must match
		var reg = new RegExp('^' + tmp[1] + '$', 'i');
		if (tmp[4].match(reg)) {
			var param = (tmp[2] ? tmp[2].substr(1) : '');
			return {
				'name': tmp[1].toLowerCase(),
				'param': param,
				'content': tmp[3]
			};
		} else {
			return;
		}
	} else {
		return;
	}
}

function FBU_process(message, sub, elem, replaceFct) {
	var tmp = replaceFct(elem);
	if (tmp) {
		return message.split(sub).join(tmp);
	} else {
		return message;
	}
}

// Takes a BBCode element corresponding to "[youtube]http://www.youtube.com/watch?v=XXXXX[/youtube]" and returns an embed element
function FIVM_youtubeBBCodeToEmbed(elem) {
	var tmp = elem.content.match(/youtube.com\/watch\?([^&]+&amp;)*v=([^&#]+)/i);
	if (tmp) {
		return '<embed src="http://www.youtube.com/v/' + tmp[tmp.length - 1] + '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="355"></embed>';
	} else {
		return;
	}
}

function FIVM_replaceBBCode(domTree) {
	var htmlCopy = domTree.get('html');
	var elems = htmlCopy.match(/\[[^\]]+\][^\[]*\[\/[^\]]+\]/g);
	if (elems) {
		var len = elems.length;
		for (var i = 0 ; i < len ; i++) {
			var elem = FBU_eval(elems[i]);
			if (elem && elem.name == 'youtube') {
				htmlCopy = FBU_process(htmlCopy, elems[i], elem, FIVM_youtubeBBCodeToEmbed);
			}
		}
		domTree.set('html', htmlCopy);
	}
}

function FIVM_newBBCode() {
	var messages = $$('.postcolor');
	messages.each(function(message) {
		FIVM_replaceBBCode(message);
	});
}

var help_youtube = 'Insert Youtube video (alt + y)';
var YOUTUBE_open = 0; // Used for tag open/close management via simpletag()
function FIVM_addBBCodeButtons() {
	var youtubeBtn = new Element('input.codebuttons', {
			'name': 'YOUTUBE',
			'type': 'button',
			'accesskey': 'y',
			'value': ' YOUTUBE ',
			'events': {
				'mouseover': function() {
						hstat('youtube');
					},
				'click': function() {
						simpletag('YOUTUBE');
					}
			}
		});
	var listBtn = $$('input[name=LIST]');
	if (listBtn) {
		youtubeBtn.inject(listBtn[0], 'after');
	}
}

window.addEvent('domready', function() {
	if (NEW_BBCODE) {
		FIVM_newBBCode();
		if (location.href.match('act=Post')) {
			FIVM_addBBCodeButtons();
		}
	}
});
