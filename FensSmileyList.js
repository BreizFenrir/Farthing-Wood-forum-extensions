/*
Fen's Smiley List (FSL)
*/
// Categories and smileys to show
var FSL_SMILEYS={
	'Classic smilies': ['mellow', 'happy', 'ohmy', 'wink', 'tongue', 'biggrin', 'laugh', 'cool', 'rolleyes', 'dry', 'smile', 'wub', 'angry', 'sad', 'blink', 'ninja', 'bouncy', 'hrm', 'hehe', 'notworthy', 'hug', 'proud', 'whistle', 'wtf', 'yes', 'angel', 'boff', 'doh', 'nasty', 'party', 'shrug', 'spork', 'hyper', 'dead', 'ummm', 'furious', 'howudoin', 'cloud9', 'creative', 'faint', 'hug3', 'icon_confused', 'icon_cry', 'icon_frown', 'rules', 'fish', 'emote_highfive', 'thumbup', 'grouphug2', 'headscratch', 'frustrated', 'surrender', 'satisfied', 'computer', 'doh', 'grouphug', 'sadangel', 'banghead', 'icon_evil', 'waveflag', 'streamer', 'pumpkin', 'newyear', 'flowers', 'pupeyes', 'icon_redface', 'icon_twisted', 'jawdrop', 'crackup', 'rudolph', 'rotflol', 'showoff', 'smooch', 'cry1', 'clever', 'doctor', 'icon_drool', 'harhar', 'coffee1', 'closed', 'bounce1', 'banana', 'giggle', 'pirate', 'unsure', 'yikes', 'teeth', 'witch', 'santa', 'angry1', 'silly', 'icon_razz', 'irked', 'icon_mrgreen', 'hug2', 'dontknow', 'snack', 'paint', 'devil', 'mecry', 'sweat', 'excl', 'cry2', 'magic', 'clown', 'upset', 'crazy', 'alien', 'kitty', 'order', 'stomp', 'wacko', 'birthday', 'yawn', 'sorry', 'wave', 'cold', 'yucky', 'sigh', 'lock', 'idea', 'grrr', 'rofl', 'bash', 'suck', 'sick', 'duck', 'thud', 'moon', 'geek', 'grin', 'huh', 'yummy', 'sly', 'boxing', 'bye', 'balloon', 'sleep'],
	'Farthing Wood smilies': ['Bold', 'Charmer', 'Fox', 'Vixen', 'Whisper', 'LadyBlue', 'Ranger', 'Scarface', 'Badger', 'Weasel', 'Adder', 'Mole', 'Toad', 'Owl'],
	'Foxies': ['foxconfused', 'foxthoughtful', 'foxindescribable', 'foxscared', 'foxawake', 'foxnerdy', 'foxangry', 'foxhappy', 'foxenergetic', 'foxdetermined', 'foxworking', 'foxsad', 'foxenthralled']
}

// Given an URL, retrieves the file name (without the extension)
function FSL_getSmileyName(url) {
	// We use a naive implementation, with the file extension being always present AND 4-character long (dot included)
	var FSL_splittedUrl = url.split('/')
	var FSL_fileName = FSL_splittedUrl[FSL_splittedUrl.length - 1]
	return FSL_fileName.substring(0, FSL_fileName.length - 4)
}

// Read the shown smileys list and memorize them
function FSL_updateList() {
	var FSL_memory = {}
	var FSL_oldTable = $$('table.tablefill')[0]
	var FSL_oldTableRows = FSL_oldTable.getElements('tr')
	var FSL_tableFooter = FSL_oldTableRows[FSL_oldTableRows.length - 1]
	var i = 1
	while (i < FSL_oldTableRows.length - 1) {
		var FSL_smileyLinks = FSL_oldTableRows[i].getElements('a')
		var j = 0
		while (j < FSL_smileyLinks.length) {
			var FSL_smileyLink = FSL_smileyLinks[j]
			var FSL_smileyName = FSL_getSmileyName(FSL_smileyLink.getChildren()[0].getAttribute('src'))
			FSL_memory[FSL_smileyName] = FSL_smileyLink
			j = j + 1
		}
	i = i + 1
	}

	// Read FSL_SMILEYS and build the new table
	var FSL_newTable = new Element('table', {
			'id' : 'smileyTable',
			'className' : 'tablefill',
			'cellpadding' : 4,
			'align' : 'center'
		})
	for (FSL_group in FSL_SMILEYS) {
		var FSL_oneAtLeast = false

		// Group
		var FSL_header = new Element('tr')
		var FSL_cell = new Element('th', {
				'text' : FSL_group
			})
		FSL_header.grab(FSL_cell)

		// Smileys
		var FSL_row = new Element('tr')
		FSL_cell = new Element('td')
		i = 0
		while (i < FSL_SMILEYS[FSL_group].length) {
			var FSL_smileyName = FSL_SMILEYS[FSL_group][i]
			if (FSL_memory[FSL_smileyName]) {
				FSL_cell.grab(FSL_memory[FSL_smileyName])
				FSL_oneAtLeast = true
			}
			i = i + 1
		}
		FSL_row.grab(FSL_cell)

		if (FSL_oneAtLeast) {
			FSL_newTable.grab(FSL_header)
			FSL_newTable.grab(FSL_row)
		}
	}
	FSL_newTable.grab(FSL_tableFooter)
	FSL_newTable.replaces(FSL_oldTable)
	FSL_tableFooter.getChildren()[0].removeAttribute('colspan')
}

window.addEvent('domready', function() {
		if ($$('table.tablefill').length != 0 && document.compatMode == 'CSS1Compat') {
			FSL_updateList()
		}
	});
