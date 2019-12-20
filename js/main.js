(function() {
  var dora, draw, hous, init, initDora, initPlayers, initStack, next, parseHai, players, players_index, processDiscard, processDraw, splitPlayer, toImages;

  players = [[], [], [], []];

  dora = [];

  hous = [[], [], [], []];

  players_index = 0;

  init = function(event) {
    initStack();
    initDora();
    initPlayers();
    document.querySelector("#button-next").addEventListener("click", next);
    draw();
  };

  initStack = function() {
    window.stack.sort(function() {
      return Math.random() - 0.5;
    });
  };

  initDora = function() {
    var _, _i;
    for (_ = _i = 0; _i <= 13; _ = ++_i) {
      dora.push(window.stack.pop());
    }
  };

  initPlayers = function() {
    var player, _, __, _i, _j, _k, _l, _len, _len1, _len2, _m;
    for (_ = _i = 0; _i <= 2; _ = ++_i) {
      for (_j = 0, _len = players.length; _j < _len; _j++) {
        player = players[_j];
        for (__ = _k = 0; _k <= 3; __ = ++_k) {
          player.push(window.stack.pop());
        }
      }
    }
    for (_l = 0, _len1 = players.length; _l < _len1; _l++) {
      player = players[_l];
      player.push(window.stack.pop());
    }
    players[0].push(window.stack.pop());
    for (_m = 0, _len2 = players.length; _m < _len2; _m++) {
      player = players[_m];
      player.sort();
    }
    processDiscard();
    players_index++;
  };

  next = function() {
    processDraw();
    processDiscard();
    players_index++;
    if (players_index > 3) {
      players_index = 0;
    }
    draw();
  };

  draw = function() {
    var hou, index, output, output_text, player, player_text, split, _i, _j, _len, _len1;
    output_text = [];
    output_text.push("Players");
    for (index = _i = 0, _len = players.length; _i < _len; index = ++_i) {
      player = players[index];
      player_text = ((function() {
        var _j, _len1, _ref, _results;
        _ref = splitPlayer(player);
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          split = _ref[_j];
          _results.push(toImages(split));
        }
        return _results;
      })()).join("　");
      output_text.push("Player " + (index + 1) + ": " + player_text);
    }
    output_text.push("Hou");
    for (index = _j = 0, _len1 = hous.length; _j < _len1; index = ++_j) {
      hou = hous[index];
      output_text.push("Player " + (index + 1) + ": " + (toImages(hou)));
    }
    output_text = output_text.join("<br>");
    output = document.querySelector("#output");
    return output.innerHTML = output_text;
  };

  processDraw = function() {
    var player;
    console.log(players_index);
    player = players[players_index];
    player.push(window.stack.pop());
    player.sort();
  };

  processDiscard = function() {
    var after, before, current, index, indexes, isafter, isbefore, player, split, _;
    player = players[players_index];
    split = splitPlayer(player);
    indexes = (function() {
      var _i, _len, _results;
      _results = [];
      for (index = _i = 0, _len = split.length; _i < _len; index = ++_i) {
        _ = split[index];
        if (!(split[index].length === 1)) {
          continue;
        }
        current = parseHai(split[index][0]);
        if (current.type === "tu") {
          _results.push(player.indexOf(current.name));
        } else {
          before = split[index - 1];
          after = split[index + 1];
          isbefore = false;
          isafter = false;
          if (before != null) {
            before = parseHai(before[before.length - 1]);
            isbefore = current.type === before.type && current.number - before.number === 2;
          }
          if (after != null) {
            after = parseHai(after[0]);
            isafter = current.type === after.type && after.number - current.number === 2;
          }
          if (((function() {
            switch (current.number) {
              case 1:
                return !isafter;
              case 9:
                return !isbefore;
              default:
                return !(isafter || isbefore);
            }
          })())) {
            _results.push(player.indexOf(current.name));
          } else {
            continue;
          }
        }
      }
      return _results;
    })();
    return hous[players_index].push(player.splice(indexes[0], 1));
  };

  splitPlayer = function(player) {
    var chunk, hai1_obj, hai2_obj, index, koutu, result, shuntu, _, _i, _len;
    result = [];
    chunk = [];
    shuntu = 1;
    koutu = 1;
    for (index = _i = 0, _len = player.length; _i < _len; index = ++_i) {
      _ = player[index];
      chunk.push(player[index]);
      if (player[index + 1] != null) {
        hai1_obj = parseHai(player[index]);
        hai2_obj = parseHai(player[index + 1]);
        if (hai1_obj.name === hai2_obj.name) {
          koutu++;
          if (shuntu === 1) {
            continue;
          }
          shuntu = 1;
        } else if (hai1_obj.type === hai2_obj.type && hai1_obj.number === hai2_obj.number - 1) {
          shuntu++;
          if (koutu === 1) {
            continue;
          }
          koutu = 1;
        } else {
          koutu = 1;
          shuntu = 1;
        }
      }
      result.push(chunk.slice(0));
      chunk.length = 0;
    }
    return result;
  };

  parseHai = function(hai) {
    switch (hai.charAt(0)) {
      case "m":
      case "p":
      case "s":
        return {
          type: hai.charAt(0),
          number: parseInt(hai.charAt(1)),
          name: hai
        };
      case "_":
        return {
          type: "tu",
          number: -1,
          name: hai
        };
    }
  };

  toImages = function(player) {
    var hai, images;
    return (images = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = player.length; _i < _len; _i++) {
        hai = player[_i];
        _results.push("<img src=\"images/" + hai + ".png\" alt=\"" + hai + "\">");
      }
      return _results;
    })()).join("");
  };

  window.addEventListener("load", init, false);

  window.players = players;

  window.players_index = players_index;

  window.dora = dora;

  window.splitPlayer = splitPlayer;

  window.next = next;

  window.processDraw = processDraw;

  window.processDiscard = processDiscard;

}).call(this);
