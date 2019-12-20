
players = [[],[],[],[]]
dora = []
hous = [[],[],[],[]]

players_index = 0


init = (event) ->
	initStack()
	initDora()
	initPlayers()
	draw()
	return

initStack = ->
	window.stack.sort -> Math.random() - 0.5
	return

initDora = ->
	for _ in [0..13]
		dora.push window.stack.pop()
	return

initPlayers = ->
	for _ in [0..2]
		for player in players
			for __ in [0..3]
				player.push window.stack.pop()
	for player in players
		player.push window.stack.pop()
	players[0].push window.stack.pop()
	for player in players
		player.sort()
	processDiscard()
	players_index++
	return

next = ->
	processDraw()
	processDiscard()
	players_index++
	players_index = 0 if players_index > 3
	draw()
	return

draw = ->
	output_text = []
	output_text.push "Players"
	for player, index in players
		player_text = (for split in splitPlayer player then toImages split).join "　"
		output_text.push "Player #{index + 1}: #{player_text}"
	output_text.push "Hou"
	for hou, index in hous
		output_text.push "Player #{index + 1}: #{toImages hou}"
	output_text = output_text.join "<br>"
	output = document.querySelector "#output"
	output.innerHTML = output_text

processDraw = ->
	console.log players_index
	player = players[players_index]
	player.push window.stack.pop()
	player.sort()
	return

processDiscard = ->
	player = players[players_index]
	split = splitPlayer player
	indexes = for _, index in split when split[index].length is 1
		current = parseHai split[index][0]
		if current.type is "tu"
			player.indexOf current.name
		else
			before = split[index - 1]
			after = split[index + 1]
			isbefore = false
			isafter = false
			if before?
				before = parseHai before[before.length - 1]
				isbefore = current.type is before.type and current.number - before.number is 2
			if after?
				after = parseHai after[0]
				isafter = current.type is after.type and after.number - current.number is 2
			if (switch current.number
				when 1
					not isafter
				when 9
					not isbefore
				else
					not (isafter or isbefore))
				player.indexOf current.name
			else
				continue
	hous[players_index].push player.splice indexes[0], 1

splitPlayer = (player) ->
	result = []
	chunk = []
	shuntu = 1
	koutu = 1
	for _, index in player
		chunk.push player[index]
		if player[index + 1]?
			hai1_obj = parseHai player[index]
			hai2_obj = parseHai player[index + 1]
			if hai1_obj.name is hai2_obj.name
				koutu++
				continue if shuntu is 1
				shuntu = 1
			else if hai1_obj.type is hai2_obj.type and hai1_obj.number is hai2_obj.number - 1
				shuntu++
				continue if koutu is 1
				koutu = 1
			else
				koutu = 1
				shuntu = 1
		result.push chunk.slice 0
#		console.log "#{player.slice 0, index+1}"
#		console.log "   -> shuntu: #{shuntu}, koutu: #{koutu}, chunk: #{chunk.length}"
#		console.log "   -> #{result.join " | "}"
		chunk.length = 0
#		shuntu = 1
#		koutu = 1
	result

parseHai = (hai) ->
	switch hai.charAt 0
		when "m", "p", "s"
			{
				type: hai.charAt 0
				number: parseInt hai.charAt 1
				name: hai
			}
		when "_"
			{
				type: "tu"
				number: -1
				name: hai
			}

toImages = (player) ->
	(images = for hai in player
		"<img src=\"images/#{hai}.png\" alt=\"#{hai}\">").join ""


window.addEventListener "load", init, false
window.players = players
window.players_index = players_index
window.dora = dora
window.splitPlayer = splitPlayer
window.next = next
window.processDraw = processDraw
window.processDiscard = processDiscard
