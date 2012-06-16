// Building or reusing namespace
if (typeof info == 'undefined') {
	info = new Object();
}
if (typeof info.fen-code == 'undefined') {
	info.fen-code = new Object();
}

/** BBCode manager class */
info.fen-code.BBCodeManager = function() {
	/** List of known BBCodes and associated replacement functions */
	this.bbcodes = new Object();

	/** Adds a BBCode to the known list */
	this.addBBCode = function(name, replaceFct) {
		this.bbcodes[name] = replaceFct;
	};
	/** Applies the BBCode filters to a set of DOM trees */
	this.applyTo = function(domTrees) {
		domTrees.each(function(domTree) {
			var domTreeStr = domTree.get('html');
			var elems = domTreeStr.match(/\[[^\]]+\][^\[]*\[\/[^\]]+\]/g);
			if (elems) {
				elems.each(function(elem) {
					var bbcode = info.fen-code.BBCodeManager.parseBBCode(elem);
					if (typeof bbcode != 'undefined'
							&& typeof this.bbcodes[bbcode.name] != 'undefined') {
						var bbcodeRep = this.bbcodes[bbcode.name](bbcode);
						domTreeStr.split(elem).join(bbcodeRep);
					}
				};
			}
		});
	};
};

/** Provided with a string describing a BBCode element, returns a structure describing that element */
info.fen-code.BBCodeManager.parseBBCode = function(bbcodeStr) {
	var tmp = bbcodeStr.match(/^\[([^=]+)(=[^\]]+)?\](.*)\[\/([^\]]+)\]$/i);
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
};

info.fen-code.BBCodeManager.INSTANCE = new info.fen-code.BBCodeManager();

// TODO check 'var' keyword usage
// TODO check 'typeof obj == 'undefined'' vs. 'obj'