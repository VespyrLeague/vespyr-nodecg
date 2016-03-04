/** OBS REPLICANT **/
var obsScene = nodecg.Replicant("obs-scene")
    .on("change", function(oldVal, newVal) { // On change...
        $("a[href='#scenes-" + newVal["scene"] + "']").tab("show"); // Change the tab.
    });

$("#scenes-tabs").find("a").click(function(e) {
    e.preventDefault();
    $(this).tab();
});

$("#scenes-coming-up-tabs").find("a").click(function(e) {
    e.preventDefault();
    $(this).tab()
});


/**
 #############
 # COMING-UP #
 #############
 **/

/** VARIABLES **/
var $comingUpInfo = {
    "game1": {
        "blue": {
            "info": {
                "name": $("#scenes-coming-up-game1-blue-name"),
                "tag": $("#scenes-coming-up-game1-blue-tag"),
                "score": $("#scenes-coming-up-game1-blue-score"),
                "position": $("#scenes-coming-up-game1-blue-position"),
                "form": $("#scenes-coming-up-game1-blue-form")
            },
            "roster": {
                "top": $("#scenes-coming-up-game1-blue-top"),
                "jungle": $("#scenes-coming-up-game1-blue-jungle"),
                "mid": $("#scenes-coming-up-game1-blue-mid"),
                "adc": $("#scenes-coming-up-game1-blue-adc"),
                "support": $("#scenes-coming-up-game1-blue-support")
            }
        },
        "red": {
            "info": {
                "name": $("#scenes-coming-up-game1-red-name"),
                "tag": $("#scenes-coming-up-game1-red-tag"),
                "score": $("#scenes-coming-up-game1-red-score"),
                "position": $("#scenes-coming-up-game1-red-position"),
                "form": $("#scenes-coming-up-game1-red-form")
            },
            "roster": {
                "top": $("#scenes-coming-up-game1-red-top"),
                "jungle": $("#scenes-coming-up-game1-red-jungle"),
                "mid": $("#scenes-coming-up-game1-red-mid"),
                "adc": $("#scenes-coming-up-game1-red-adc"),
                "support": $("#scenes-coming-up-game1-red-support")
            }
        }
    },
    "game2": {
        "blue": {
            "info": {
                "name": $("#scenes-coming-up-game2-blue-name"),
                "tag": $("#scenes-coming-up-game2-blue-tag"),
                "score": $("#scenes-coming-up-game2-blue-score"),
                "position": $("#scenes-coming-up-game2-blue-position"),
                "form": $("#scenes-coming-up-game2-blue-form")
            },
            "roster": {
                "top": $("#scenes-coming-up-game2-blue-top"),
                "jungle": $("#scenes-coming-up-game2-blue-jungle"),
                "mid": $("#scenes-coming-up-game2-blue-mid"),
                "adc": $("#scenes-coming-up-game2-blue-adc"),
                "support": $("#scenes-coming-up-game2-blue-support")
            }
        },
        "red": {
            "info": {
                "name": $("#scenes-coming-up-game2-red-name"),
                "tag": $("#scenes-coming-up-game2-red-tag"),
                "score": $("#scenes-coming-up-game2-red-score"),
                "position": $("#scenes-coming-up-game2-red-position"),
                "form": $("#scenes-coming-up-game2-red-form")
            },
            "roster": {
                "top": $("#scenes-coming-up-game2-red-top"),
                "jungle": $("#scenes-coming-up-game2-red-jungle"),
                "mid": $("#scenes-coming-up-game2-red-mid"),
                "adc": $("#scenes-coming-up-game2-red-adc"),
                "support": $("#scenes-coming-up-game2-red-support")
            }
        }
    },
    "game3": {
        "blue": {
            "info": {
                "name": $("#scenes-coming-up-game3-blue-name"),
                "tag": $("#scenes-coming-up-game3-blue-tag"),
                "score": $("#scenes-coming-up-game3-blue-score"),
                "position": $("#scenes-coming-up-game3-blue-position"),
                "form": $("#scenes-coming-up-game3-blue-form")
            },
            "roster": {
                "top": $("#scenes-coming-up-game3-blue-top"),
                "jungle": $("#scenes-coming-up-game3-blue-jungle"),
                "mid": $("#scenes-coming-up-game3-blue-mid"),
                "adc": $("#scenes-coming-up-game3-blue-adc"),
                "support": $("#scenes-coming-up-game3-blue-support")
            }
        },
        "red": {
            "info": {
                "name": $("#scenes-coming-up-game3-red-name"),
                "tag": $("#scenes-coming-up-game3-red-tag"),
                "score": $("#scenes-coming-up-game3-red-score"),
                "position": $("#scenes-coming-up-game3-red-position"),
                "form": $("#scenes-coming-up-game3-red-form")
            },
            "roster": {
                "top": $("#scenes-coming-up-game3-red-top"),
                "jungle": $("#scenes-coming-up-game3-red-jungle"),
                "mid": $("#scenes-coming-up-game3-red-mid"),
                "adc": $("#scenes-coming-up-game3-red-adc"),
                "support": $("#scenes-coming-up-game3-red-support")
            }
        }
    }
};
var $comingUpUpdateBtn = $("#scenes-coming-up-update");
var $comingUpResetBtn = $("#scenes-coming-up-reset");

/** REPLICANTS **/
var comingUpReplicant = nodecg.Replicant("coming-up")
    .on("change", function(oldVal, newVal) {
        $("#scenes-coming-up-bg-colour").val(newVal["colour"]);
        $("#scenes-coming-up-next-game").val(newVal["next_game"]);
        $("#scenes-coming-up-timer").val(newVal["timer"]);
    });

var sceneTeamReplicant = nodecg.Replicant("team-data")
    .on("change", function(oldVal, newVal) { // On change...
        $.each(newVal, function(game, value) { // For each game...
            $.each(value, function(team, value) { // For each team...
                $.each(value["info"], function(key, value) { // For each of the team info...
                    $comingUpInfo[game][team]["info"][key].val(value);
                });
                $.each(value["roster"], function(position, value) { // For each player in the roster...
                    $comingUpInfo[game][team]["roster"][position].val(value);
                });
            });
        });
    });

var currentGame = nodecg.Replicant("current-game");

/** TYPEAHEAD **/
$(document).ready(function() {
    $.ajaxSetup({
        async: false
    });
    var typePremier;
    $.getJSON("http://app.vespyrleague.com/api/tournaments/48", function(response) {
        typePremier = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("team_name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: response
        });
    });
    var typeMinorA;
    $.getJSON("http://app.vespyrleague.com/api/tournaments/49", function(response) {
        typeMinorA = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("team_name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: response
        });
    });
    var typeMinorB;
    $.getJSON("http://app.vespyrleague.com/api/tournaments/50", function(response) {
        typeMinorB = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("team_name"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: response
        });
    });
    $.ajaxSetup({
        async: true
    });
    $.each($comingUpInfo, function(game, value) { // For each game...
        $.each(value, function(team, value) { // For each team...
            value["info"]["name"].typeahead({
                highlight: true
            }, {
                name: "premier",
                display: "team_name",
                source: typePremier,
                templates: {
                    header: '<h4 class="list-group-item-heading league">Premier</h4>'
                }
            }, {
                name: "minor-a",
                display: "team_name",
                source: typeMinorA,
                templates: {
                    header: '<h4 class="list-group-item-heading league">Minor A</h4>'
                }
            }, {
                name: "minor-b",
                display: "team_name",
                source: typeMinorB,
                templates: {
                    header: '<h4 class="list-group-item-heading league">Minor B</h4>'
                }
            }).bind("typeahead:select", function (ev, suggestion) {
                $comingUpInfo[game][team]["info"]["tag"].val(suggestion["team_tag"]);
                updateNames(game, team, suggestion);
            }).bind("typeahead:autocomplete", function (ev, suggestion) {
                $comingUpInfo[game][team]["info"]["tag"].val(suggestion["team_tag"]);
                updateNames(game, team, suggestion);
            });
        });
    });
    var updateNames = function(game, team, suggestion) {
        var participantId = suggestion["participant_id"];
        $.getJSON("http://app.vespyrleague.com/api/rosters/" + participantId, function(response) { // Get team roster.
            $.each(response, function(i, value) { // For each player in roster...
                if (value["role"] == "Toplane") { // If the player is the top laner...
                    $comingUpInfo[game][team]["roster"]["top"].val(value["summoner_name"]); // Update the top name.
                } else if (value["role"] == "Jungle") { // Repeat for each lane...
                    $comingUpInfo[game][team]["roster"]["jungle"].val(value["summoner_name"]);
                } else if (value["role"] == "Midlane") {
                    $comingUpInfo[game][team]["roster"]["mid"].val(value["summoner_name"]);
                } else if (value["role"] == "Adc") {
                    $comingUpInfo[game][team]["roster"]["adc"].val(value["summoner_name"]);
                } else if (value["role"] == "Support") {
                    $comingUpInfo[game][team]["roster"]["support"].val(value["summoner_name"]);
                }
            });
        });
    };
});


/** UPDATING **/
var sceneTeamUpdate = function(game) {
    if (game !== undefined) { // If we're updating a specific game.
        var replicant = sceneTeamReplicant.value;
        replicant[game] = {
            "blue": {
                "info": {
                    "name": $comingUpInfo[game]["blue"]["info"]["name"].val(),
                    "tag": $comingUpInfo[game]["blue"]["info"]["tag"].val(),
                    "score": $comingUpInfo[game]["blue"]["info"]["score"].val(),
                    "position": $comingUpInfo[game]["blue"]["info"]["position"].val(),
                    "form": $comingUpInfo[game]["blue"]["info"]["form"].val()
                },
                "roster": {
                    "top": $comingUpInfo[game]["blue"]["roster"]["top"].val(),
                    "jungle": $comingUpInfo[game]["blue"]["roster"]["jungle"].val(),
                    "mid": $comingUpInfo[game]["blue"]["roster"]["mid"].val(),
                    "adc": $comingUpInfo[game]["blue"]["roster"]["adc"].val(),
                    "support": $comingUpInfo[game]["blue"]["roster"]["support"].val()
                }
            },
            "red": {
                "info": {
                    "name": $comingUpInfo[game]["red"]["info"]["name"].val(),
                    "tag": $comingUpInfo[game]["red"]["info"]["tag"].val(),
                    "score": $comingUpInfo[game]["red"]["info"]["score"].val(),
                    "position": $comingUpInfo[game]["red"]["info"]["position"].val(),
                    "form": $comingUpInfo[game]["red"]["info"]["form"].val()
                },
                "roster": {
                    "top": $comingUpInfo[game]["red"]["roster"]["top"].val(),
                    "jungle": $comingUpInfo[game]["red"]["roster"]["jungle"].val(),
                    "mid": $comingUpInfo[game]["red"]["roster"]["mid"].val(),
                    "adc": $comingUpInfo[game]["red"]["roster"]["adc"].val(),
                    "support": $comingUpInfo[game]["red"]["roster"]["support"].val()
                }
            }
        };
    } else {
        sceneTeamReplicant.value = {
            "game1": {
                "blue": {
                    "info": {
                        "name": $comingUpInfo["game1"]["blue"]["info"]["name"].val(),
                        "tag": $comingUpInfo["game1"]["blue"]["info"]["tag"].val(),
                        "score": $comingUpInfo["game1"]["blue"]["info"]["score"].val(),
                        "position": $comingUpInfo["game1"]["blue"]["info"]["position"].val(),
                        "form": $comingUpInfo["game1"]["blue"]["info"]["form"].val()
                    },
                    "roster": {
                        "top": $comingUpInfo["game1"]["blue"]["roster"]["top"].val(),
                        "jungle": $comingUpInfo["game1"]["blue"]["roster"]["jungle"].val(),
                        "mid": $comingUpInfo["game1"]["blue"]["roster"]["mid"].val(),
                        "adc": $comingUpInfo["game1"]["blue"]["roster"]["adc"].val(),
                        "support": $comingUpInfo["game1"]["blue"]["roster"]["support"].val()
                    }
                },
                "red": {
                    "info": {
                        "name": $comingUpInfo["game1"]["red"]["info"]["name"].val(),
                        "tag": $comingUpInfo["game1"]["red"]["info"]["tag"].val(),
                        "score": $comingUpInfo["game1"]["red"]["info"]["score"].val(),
                        "position": $comingUpInfo["game1"]["red"]["info"]["position"].val(),
                        "form": $comingUpInfo["game1"]["red"]["info"]["form"].val()
                    },
                    "roster": {
                        "top": $comingUpInfo["game1"]["red"]["roster"]["top"].val(),
                        "jungle": $comingUpInfo["game1"]["red"]["roster"]["jungle"].val(),
                        "mid": $comingUpInfo["game1"]["red"]["roster"]["mid"].val(),
                        "adc": $comingUpInfo["game1"]["red"]["roster"]["adc"].val(),
                        "support": $comingUpInfo["game1"]["red"]["roster"]["support"].val()
                    }
                }
            },
            "game2": {
                "blue": {
                    "info": {
                        "name": $comingUpInfo["game2"]["blue"]["info"]["name"].val(),
                        "tag": $comingUpInfo["game2"]["blue"]["info"]["tag"].val(),
                        "score": $comingUpInfo["game2"]["blue"]["info"]["score"].val(),
                        "position": $comingUpInfo["game2"]["blue"]["info"]["position"].val(),
                        "form": $comingUpInfo["game2"]["blue"]["info"]["form"].val()
                    },
                    "roster": {
                        "top": $comingUpInfo["game2"]["blue"]["roster"]["top"].val(),
                        "jungle": $comingUpInfo["game2"]["blue"]["roster"]["jungle"].val(),
                        "mid": $comingUpInfo["game2"]["blue"]["roster"]["mid"].val(),
                        "adc": $comingUpInfo["game2"]["blue"]["roster"]["adc"].val(),
                        "support": $comingUpInfo["game2"]["blue"]["roster"]["support"].val()
                    }
                },
                "red": {
                    "info": {
                        "name": $comingUpInfo["game2"]["red"]["info"]["name"].val(),
                        "tag": $comingUpInfo["game2"]["red"]["info"]["tag"].val(),
                        "score": $comingUpInfo["game2"]["red"]["info"]["score"].val(),
                        "position": $comingUpInfo["game2"]["red"]["info"]["position"].val(),
                        "form": $comingUpInfo["game2"]["red"]["info"]["form"].val()
                    },
                    "roster": {
                        "top": $comingUpInfo["game2"]["red"]["roster"]["top"].val(),
                        "jungle": $comingUpInfo["game2"]["red"]["roster"]["jungle"].val(),
                        "mid": $comingUpInfo["game2"]["red"]["roster"]["mid"].val(),
                        "adc": $comingUpInfo["game2"]["red"]["roster"]["adc"].val(),
                        "support": $comingUpInfo["game2"]["red"]["roster"]["support"].val()
                    }
                }
            },
            "game3": {
                "blue": {
                    "info": {
                        "name": $comingUpInfo["game3"]["blue"]["info"]["name"].val(),
                        "tag": $comingUpInfo["game3"]["blue"]["info"]["tag"].val(),
                        "score": $comingUpInfo["game3"]["blue"]["info"]["score"].val(),
                        "position": $comingUpInfo["game3"]["blue"]["info"]["position"].val(),
                        "form": $comingUpInfo["game3"]["blue"]["info"]["form"].val()
                    },
                    "roster": {
                        "top": $comingUpInfo["game3"]["blue"]["roster"]["top"].val(),
                        "jungle": $comingUpInfo["game3"]["blue"]["roster"]["jungle"].val(),
                        "mid": $comingUpInfo["game3"]["blue"]["roster"]["mid"].val(),
                        "adc": $comingUpInfo["game3"]["blue"]["roster"]["adc"].val(),
                        "support": $comingUpInfo["game3"]["blue"]["roster"]["support"].val()
                    }
                },
                "red": {
                    "info": {
                        "name": $comingUpInfo["game3"]["red"]["info"]["name"].val(),
                        "tag": $comingUpInfo["game3"]["red"]["info"]["tag"].val(),
                        "score": $comingUpInfo["game3"]["red"]["info"]["score"].val(),
                        "position": $comingUpInfo["game3"]["red"]["info"]["position"].val(),
                        "form": $comingUpInfo["game3"]["red"]["info"]["form"].val()
                    },
                    "roster": {
                        "top": $comingUpInfo["game3"]["red"]["roster"]["top"].val(),
                        "jungle": $comingUpInfo["game3"]["red"]["roster"]["jungle"].val(),
                        "mid": $comingUpInfo["game3"]["red"]["roster"]["mid"].val(),
                        "adc": $comingUpInfo["game3"]["red"]["roster"]["adc"].val(),
                        "support": $comingUpInfo["game3"]["red"]["roster"]["support"].val()
                    }
                }
            }
        };
        comingUpReplicant.value = {
            "colour": $("#scenes-coming-up-bg-colour").val(),
            "next_game": $("#scenes-coming-up-next-game").val(),
            "timer": $("#scenes-coming-up-timer").val()
        };
		currentGame.value = sceneTeamReplicant.value[comingUpReplicant.value["next_game"]];
    }
    $(".scenes-coming-up-on-change").parent().removeClass("has-warning"); // Remove the warning on the input.
};

$(".scenes-coming-up-on-change").bind("change paste keyup", function(e) { // If any of the champion names are changed...
    if(e.keyCode == 13) {
        sceneTeamUpdate(); // Update if enter key.
    } else { // Else somethings changed.
        $comingUpUpdateBtn.prop("disabled", false).addClass("btn-primary"); // Enable the update button.
        $(this).parent().addClass("has-warning"); // Colour the input to show it hasn't been updated.
    }
});

$comingUpUpdateBtn.click(function() {
    sceneTeamUpdate();
});

$comingUpResetBtn.click(function() {
	if (window.confirm("Are you sure?")) {
		$.each($comingUpInfo, function (game, value) { // For each game...
			$.each(value, function (team, value) { // For each team...
				$.each(value["info"], function (key, value) { // For each of the team info...
					value.val("");
				});
				$.each(value["roster"], function (position, value) { // For each player in the roster...
					value.val("");
				});
			});
		});
		$("#scenes-coming-up-bg-colour").val("blue");
		$("#scenes-coming-up-next-game").val("game1");
		$("#scenes-coming-up-timer").val("19:00:00");
		sceneTeamUpdate();
	}
});

$(".scenes-coming-up-game-update").click(function() {
    var game = $(this).data("game");
    sceneTeamUpdate(game)
});

$(".scenes-coming-up-game-reset").click(function() {
	if (window.confirm("Are you sure?")) {
		var game = $(this).data("game");
		$.each($comingUpInfo[game], function (team, value) { // For each team...
			$.each(value["info"], function (key, value) { // For each of the team info...
				value.val("");
			});
			$.each(value["roster"], function (position, value) { // For each player in the roster...
				value.val("");
			});
		});
		sceneTeamUpdate()
	}
});

/** SWITCH SIDES **/
$(".scenes-coming-up-switch").click(function() { // When a side switch button is pressed...
    var game = $(this).data("game"); // Get the game associated with the button.
    var current = sceneTeamReplicant.value; // Get the current value.
    current[game] = {"blue": current[game]["red"], "red": current[game]["blue"]}; // Switch the teams.
    sceneTeamReplicant.value = current; // Update the replicant.
});


/**
 ################
 # CHAMP SELECT #
 ################
 **/

/** VARS **/
var champions = [{'name': 'Jax', 'file': 'Jax', 'id': '24'}, {'name': 'Ahri', 'file': 'Ahri', 'id': '103'}, {'name': 'Pantheon', 'file': 'Pantheon', 'id': '80'}, {'name': 'Jayce', 'file': 'Jayce', 'id': '126'}, {'name': 'Zed', 'file': 'Zed', 'id': '238'}, {'name': 'Master Yi', 'file': 'MasterYi', 'id': '11'}, {'name': 'Garen', 'file': 'Garen', 'id': '86'}, {'name': 'Brand', 'file': 'Brand', 'id': '63'}, {'name': 'Jinx', 'file': 'Jinx', 'id': '222'}, {'name': 'Morgana', 'file': 'Morgana', 'id': '25'}, {'name': 'Akali', 'file': 'Akali', 'id': '84'}, {'name': 'Karthus', 'file': 'Karthus', 'id': '30'}, {'name': 'Xin Zhao', 'file': 'XinZhao', 'id': '5'}, {'name': 'Lucian', 'file': 'Lucian', 'id': '236'}, {'name': 'Udyr', 'file': 'Udyr', 'id': '77'}, {'name': 'Trundle', 'file': 'Trundle', 'id': '48'}, {'name': 'Malphite', 'file': 'Malphite', 'id': '54'}, {'name': 'Urgot', 'file': 'Urgot', 'id': '6'}, {'name': 'Lissandra', 'file': 'Lissandra', 'id': '127'}, {'name': 'Shen', 'file': 'Shen', 'id': '98'}, {'name': 'Thresh', 'file': 'Thresh', 'id': '412'}, {'name': 'Ashe', 'file': 'Ashe', 'id': '22'}, {'name': 'Evelynn', 'file': 'Evelynn', 'id': '28'}, {'name': 'Tryndamere', 'file': 'Tryndamere', 'id': '23'}, {'name': 'Wukong', 'file': 'MonkeyKing', 'id': '62'}, {'name': 'Fiddlesticks', 'file': 'FiddleSticks', 'id': '9'}, {'name': 'LeBlanc', 'file': 'Leblanc', 'id': '7'}, {'name': 'Xerath', 'file': 'Xerath', 'id': '101'}, {'name': 'Illaoi', 'file': 'Illaoi', 'id': '420'}, {'name': 'Gnar', 'file': 'Gnar', 'id': '150'}, {'name': 'Shyvana', 'file': 'Shyvana', 'id': '102'}, {'name': 'Caitlyn', 'file': 'Caitlyn', 'id': '51'}, {'name': 'Leona', 'file': 'Leona', 'id': '89'}, {'name': 'Olaf', 'file': 'Olaf', 'id': '2'}, {'name': 'Rammus', 'file': 'Rammus', 'id': '33'}, {'name': 'Renekton', 'file': 'Renekton', 'id': '58'}, {'name': 'Lulu', 'file': 'Lulu', 'id': '117'}, {'name': 'Yasuo', 'file': 'Yasuo', 'id': '157'}, {'name': 'Maokai', 'file': 'Maokai', 'id': '57'}, {'name': 'Anivia', 'file': 'Anivia', 'id': '34'}, {'name': 'Aatrox', 'file': 'Aatrox', 'id': '266'}, {'name': 'Blitzcrank', 'file': 'Blitzcrank', 'id': '53'}, {'name': 'Poppy', 'file': 'Poppy', 'id': '78'}, {'name': 'Draven', 'file': 'Draven', 'id': '119'}, {'name': 'Lux', 'file': 'Lux', 'id': '99'}, {'name': 'Mordekaiser', 'file': 'Mordekaiser', 'id': '82'}, {'name': 'Sion', 'file': 'Sion', 'id': '14'}, {'name': 'Rengar', 'file': 'Rengar', 'id': '107'}, {'name': 'Gangplank', 'file': 'Gangplank', 'id': '41'}, {'name': 'Syndra', 'file': 'Syndra', 'id': '134'}, {'name': 'Hecarim', 'file': 'Hecarim', 'id': '120'}, {'name': 'Sejuani', 'file': 'Sejuani', 'id': '113'}, {'name': 'Bard', 'file': 'Bard', 'id': '432'}, {'name': 'Corki', 'file': 'Corki', 'id': '42'}, {'name': 'Vladimir', 'file': 'Vladimir', 'id': '8'}, {'name': 'Taric', 'file': 'Taric', 'id': '44'}, {'name': "Rek'Sai", 'file': 'RekSai', 'id': '421'}, {'name': 'Amumu', 'file': 'Amumu', 'id': '32'}, {'name': 'Zilean', 'file': 'Zilean', 'id': '26'}, {'name': 'Zac', 'file': 'Zac', 'id': '154'}, {'name': 'Swain', 'file': 'Swain', 'id': '50'}, {'name': 'Malzahar', 'file': 'Malzahar', 'id': '90'}, {'name': 'Ezreal', 'file': 'Ezreal', 'id': '81'}, {'name': 'Dr. Mundo', 'file': 'DrMundo', 'id': '36'}, {'name': 'Singed', 'file': 'Singed', 'id': '27'}, {'name': 'Nautilus', 'file': 'Nautilus', 'id': '111'}, {'name': 'Twitch', 'file': 'Twitch', 'id': '29'}, {'name': 'Ryze', 'file': 'Ryze', 'id': '13'}, {'name': 'Warwick', 'file': 'Warwick', 'id': '19'}, {'name': 'Galio', 'file': 'Galio', 'id': '3'}, {'name': 'Azir', 'file': 'Azir', 'id': '268'}, {'name': 'Annie', 'file': 'Annie', 'id': '1'}, {'name': 'Fizz', 'file': 'Fizz', 'id': '105'}, {'name': 'Kalista', 'file': 'Kalista', 'id': '429'}, {'name': 'Varus', 'file': 'Varus', 'id': '110'}, {'name': 'Kennen', 'file': 'Kennen', 'id': '85'}, {'name': 'Nasus', 'file': 'Nasus', 'id': '75'}, {'name': 'Veigar', 'file': 'Veigar', 'id': '45'}, {'name': 'Cassiopeia', 'file': 'Cassiopeia', 'id': '69'}, {'name': 'Nami', 'file': 'Nami', 'id': '267'}, {'name': 'Braum', 'file': 'Braum', 'id': '201'}, {'name': 'Darius', 'file': 'Darius', 'id': '122'}, {'name': "Cho'Gath", 'file': 'Chogath', 'id': '31'}, {'name': 'Nunu', 'file': 'Nunu', 'id': '20'}, {'name': 'Shaco', 'file': 'Shaco', 'id': '35'}, {'name': 'Gragas', 'file': 'Gragas', 'id': '79'}, {'name': 'Volibear', 'file': 'Volibear', 'id': '106'}, {'name': "Kha'Zix", 'file': 'Khazix', 'id': '121'}, {'name': 'Elise', 'file': 'Elise', 'id': '60'}, {'name': "Kog'Maw", 'file': 'KogMaw', 'id': '96'}, {'name': 'Skarner', 'file': 'Skarner', 'id': '72'}, {'name': 'Janna', 'file': 'Janna', 'id': '40'}, {'name': 'Ziggs', 'file': 'Ziggs', 'id': '115'}, {'name': 'Sivir', 'file': 'Sivir', 'id': '15'}, {'name': 'Soraka', 'file': 'Soraka', 'id': '16'}, {'name': 'Riven', 'file': 'Riven', 'id': '92'}, {'name': 'Alistar', 'file': 'Alistar', 'id': '12'}, {'name': 'Karma', 'file': 'Karma', 'id': '43'}, {'name': 'Yorick', 'file': 'Yorick', 'id': '83'}, {'name': 'Viktor', 'file': 'Viktor', 'id': '112'}, {'name': 'Zyra', 'file': 'Zyra', 'id': '143'}, {'name': 'Twisted Fate', 'file': 'TwistedFate', 'id': '4'}, {'name': 'Orianna', 'file': 'Orianna', 'id': '61'}, {'name': 'Kindred', 'file': 'Kindred', 'id': '203'}, {'name': 'Jhin', 'file': 'Jhin', 'id': '202'}, {'name': 'Nocturne', 'file': 'Nocturne', 'id': '56'}, {'name': 'Heimerdinger', 'file': 'Heimerdinger', 'id': '74'}, {'name': 'Kayle', 'file': 'Kayle', 'id': '10'}, {'name': 'Tahm Kench', 'file': 'TahmKench', 'id': '223'}, {'name': 'Teemo', 'file': 'Teemo', 'id': '17'}, {'name': 'Jarvan IV', 'file': 'JarvanIV', 'id': '59'}, {'name': 'Graves', 'file': 'Graves', 'id': '104'}, {'name': 'Quinn', 'file': 'Quinn', 'id': '133'}, {'name': 'Diana', 'file': 'Diana', 'id': '131'}, {'name': 'Kassadin', 'file': 'Kassadin', 'id': '38'}, {'name': 'Vi', 'file': 'Vi', 'id': '254'}, {'name': 'Tristana', 'file': 'Tristana', 'id': '18'}, {'name': 'Rumble', 'file': 'Rumble', 'id': '68'}, {'name': 'Lee Sin', 'file': 'LeeSin', 'id': '64'}, {'name': 'Irelia', 'file': 'Irelia', 'id': '39'}, {'name': 'Vayne', 'file': 'Vayne', 'id': '67'}, {'name': 'Katarina', 'file': 'Katarina', 'id': '55'}, {'name': 'Sona', 'file': 'Sona', 'id': '37'}, {'name': 'Ekko', 'file': 'Ekko', 'id': '245'}, {'name': 'Talon', 'file': 'Talon', 'id': '91'}, {'name': 'Miss Fortune', 'file': 'MissFortune', 'id': '21'}, {'name': "Vel'Koz", 'file': 'VelKoz', 'id': '161'}, {'name': 'Fiora', 'file': 'Fiora', 'id': '114'}, {'name': 'Nidalee', 'file': 'Nidalee', 'id': '76'}, {'name': '', 'file': '', 'id': '0'}];


/** INPUTS/BUTTONS **/
var $inputBans = {
    "blue": {"ban1": $("#champ-blue-ban1"), "ban2": $("#champ-blue-ban2"), "ban3": $("#champ-blue-ban3")},
    "red": {"ban1": $("#champ-red-ban1"), "ban2": $("#champ-red-ban2"), "ban3": $("#champ-red-ban3")}
};
var $inputChamps = {
    "blue": {"top": $("#champ-blue-top"), "jungle": $("#champ-blue-jungle"), "mid": $("#champ-blue-mid"), "adc": $("#champ-blue-adc"), "support": $("#champ-blue-support")},
    "red": {"top": $("#champ-red-top"), "jungle": $("#champ-red-jungle"), "mid": $("#champ-red-mid"), "adc": $("#champ-red-adc"), "support": $("#champ-red-support")}
};
var $inputSwitches = {
    "blue": {"top": $("#champ-blue-top-status"), "jungle": $("#champ-blue-jungle-status"), "mid": $("#champ-blue-mid-status"), "adc": $("#champ-blue-adc-status"), "support": $("#champ-blue-support-status")},
    "red": {"top": $("#champ-red-top-status"), "jungle": $("#champ-red-jungle-status"), "mid": $("#champ-red-mid-status"), "adc": $("#champ-red-adc-status"), "support": $("#champ-red-support-status")}
};
var $champUpdateBtn = $("#champ-update");


/** REPLICANTS **/
var champReplicant = nodecg.Replicant("champ-select", {defaultValue: {"blue": {"picks":{"top":{"locked":false,"champ":""},"jungle":{"locked":false,"champ":""},"mid":{"locked":false,"champ":""},"adc":{"locked":false,"champ":""},"support":{"locked":false,"champ":""}},"bans":{"ban1":"","ban2":"","ban3":""}},"red":{"picks":{"top":{"locked":false,"champ":""},"jungle":{"locked":false,"champ":""},"mid":{"locked":false,"champ":""},"adc":{"locked":false,"champ":""},"support":{"locked":false,"champ":""}},"bans":{"ban1":"","ban2":"","ban3":""}}}})
    .on("change", function(oldVal, newVal) { // On change...
        $.each(newVal, function(team, value) { // For each team...
            $.each(value["bans"], function(ban, value) { // For each ban...
                $inputBans[team][ban].val(value["name"]).parent().removeClass("has-warning"); // Update value and remove 'edited' class.
            });
            $.each(value["picks"], function(lane, value) { // For each pick...
                $inputChamps[team][lane].val($.grep(champions, function(e) { return e.file == value["champ"]; })[0]["name"]); // Update value (convert filename to name).
                $inputChamps[team][lane].parent().removeClass("has-warning"); // Remove 'edited' class.
                $inputSwitches[team][lane].bootstrapSwitch("state", value["locked"], true); // Update 'locked-in' status.
            });
        });
        $champUpdateBtn.prop("disabled", true).removeClass("btn-primary"); // Disable update button.
    });


/** TYPEAHEAD **/
$(document).ready(function() {
    var champHound = new Bloodhound({ // Define champion names.
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        local: champions
    });

    $(".typeahead-champs").typeahead({highlight: true}, {
        name: "champions",
        display: "name",
        source: champHound
    });
});


/*** UPDATING ***/
var champUpdate = function() { // Update replicant when update button is clicked.
    champReplicant.value = {
        "blue": {
            "picks": {
                "top": {
                    "locked": $inputSwitches["blue"]["top"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["blue"]["top"].val();})[0]["file"]
                },
                "jungle": {
                    "locked": $inputSwitches["blue"]["jungle"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["blue"]["jungle"].val();})[0]["file"]
                },
                "mid": {
                    "locked": $inputSwitches["blue"]["mid"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["blue"]["mid"].val();})[0]["file"]
                },
                "adc": {
                    "locked": $inputSwitches["blue"]["adc"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["blue"]["adc"].val();})[0]["file"]
                },
                "support": {
                    "locked": $inputSwitches["blue"]["support"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["blue"]["support"].val();})[0]["file"]
                }
            },
            "bans": {
                "ban1": {"name": $inputBans["blue"]["ban1"].val(), "file": $.grep(champions, function (e) {return e.name == $inputBans["blue"]["ban1"].val();})[0]["file"]},
                "ban2": {"name": $inputBans["blue"]["ban2"].val(), "file": $.grep(champions, function (e) {return e.name == $inputBans["blue"]["ban2"].val();})[0]["file"]},
                "ban3": {"name": $inputBans["blue"]["ban3"].val(), "file": $.grep(champions, function (e) {return e.name == $inputBans["blue"]["ban3"].val();})[0]["file"]}
            }
        },
        "red": {
            "picks": {
                "top": {
                    "locked": $inputSwitches["red"]["top"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["red"]["top"].val();})[0]["file"]
                },
                "jungle": {
                    "locked": $inputSwitches["red"]["jungle"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["red"]["jungle"].val();})[0]["file"]
                },
                "mid": {
                    "locked": $inputSwitches["red"]["mid"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["red"]["mid"].val();})[0]["file"]
                },
                "adc": {
                    "locked": $inputSwitches["red"]["adc"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["red"]["adc"].val();})[0]["file"]
                },
                "support": {
                    "locked": $inputSwitches["red"]["support"].bootstrapSwitch("state"),
                    "champ": $.grep(champions, function (e) {return e.name == $inputChamps["red"]["support"].val();})[0]["file"]
                }
            },
            "bans": {
                "ban1": {"name": $inputBans["red"]["ban1"].val(), "file": $.grep(champions, function (e) {return e.name == $inputBans["red"]["ban1"].val();})[0]["file"]},
                "ban2": {"name": $inputBans["red"]["ban2"].val(), "file": $.grep(champions, function (e) {return e.name == $inputBans["red"]["ban2"].val();})[0]["file"]},
                "ban3": {"name": $inputBans["red"]["ban3"].val(), "file": $.grep(champions, function (e) {return e.name == $inputBans["red"]["ban3"].val();})[0]["file"]}
            }
        }
    };
};

$(".update-on-change").bind("change paste keyup", function(e) { // If any of the champion names are changed...
    if (e.keyCode == 13) {
        champUpdate(); // Update if enter key.
    } else { // Else somethings changed.
        $champUpdateBtn.prop("disabled", false).addClass("btn-primary"); // Enable the update button.
        $(this).parent().addClass("has-warning"); // Colour the text-box to show it hasn't been updated.
    }
});

$champUpdateBtn.click(function() { // Update replicant when update button is clicked.
    champUpdate();
});

$(".bootswitch").on("switchChange.bootstrapSwitch", function(event, state) {
    champUpdate();
    var champ = $(this).parents(".form-group").find(".form-control.tt-input").val();
    if (state && champ != "") {
        var file = $.grep(champions, function (e) {return e.name == champ;})[0]["file"];
        var champ_id = $.grep(champions, function (e) {return e.name == champ;})[0]["id"];
        $.getJSON("http://app.vespyrleague.com/api/organisations/31/match_stats", function(response) {
            var stats = response;
            var total_games = Number(response["match_count"]) + 1;

            var result = $.grep(stats["rates"], function(e) { return e["champion_id"] == champ_id});
            var pickrate = (Math.round(1 / total_games)) + "% (1/" + total_games + ")"; // Defaults.
            var banrate = "0% (0/" + total_games + ")";
            var winrate = "0% (0/0)";
            if (result.length == 1) { // If there is past data for the champion, change the defaults...
                result = result[0];
                var picks = Number(result["picks"]) + 1;
                var bans = Number(result["bans"]);
                var wins = Number(result["wins"]);

                pickrate = (Math.round((picks / total_games) * 100)) + "% (" + picks + "/" + total_games + ")";
                banrate = (Math.round((bans / total_games) * 100)) + "% (" + bans + "/" + total_games + ")";
                if (result["picks"] != 0) { // If it's not a first pick, update winrate (stops divide by zero errors).
                    winrate = (Math.round((wins / (picks - 1)) * 100)) + "% (" + wins + "/" + (picks - 1) + ")";
                }
            }

            nodecg.sendMessage("champ-picked", {
                "name": champ,
                "file": file,
                "info": {"pickrate": pickrate, "banrate": banrate, "winrate": winrate}
            });
        });
    }
});


/** MISC **/
// Reset fields.
$("#champ-reset").click(function() {
	if (window.confirm("Are you sure?")) {
		$.each(["blue", "red"], function(key, team) {
			$.each($.extend($inputChamps[team], $inputBans[team]), function(key, value) {
				value.val("");
			});
			$.each($inputSwitches[team], function(key, value) {
				value.bootstrapSwitch("state", false, true)
			});
		});
		champUpdate();
		nodecg.sendMessage("champ-picked-clear")
	}
});

// Init the toggle switches for deciding if a champ is locked in or not.
$(".bootswitch").bootstrapSwitch({
    "onText": '<i class="fa fa-lock"></i>',
    "offText": '<i class="fa fa-unlock"></i>',
    "onColor": "success"
});


/**
 ###########
 # IN-GAME #
 ###########
 */

/** INPUTS **/
var $inGameTexts = {"left": {"top": $("#in-game-left-top-text"), "bottom": $("#in-game-left-bottom-text")}, "right": $("#in-game-right-text")};
var $inGameUpdateBtn = $("#in-game-update");
var $inGameResetBtn = $("#in-game-reset");

/** REPLICANTS **/
var inGameReplicant = nodecg.Replicant("in-game", {defaultValue: {"left":{"top": "", "bottom": ""}, "right": ""}})
    .on("change", function(oldVal, newVal) { // On change...
        $inGameTexts["left"]["top"].val(newVal["left"]["top"]).parent().removeClass("has-warning");
        $inGameTexts["left"]["bottom"].val(newVal["left"]["bottom"]).parent().removeClass("has-warning"); // Remove 'edited' class.;
        $inGameTexts["right"].val(newVal["right"]).parent().removeClass("has-warning"); // Remove 'edited' class.;
    });

/** UPDATING **/
var inGameUpdate = function() {
    inGameReplicant.value = {
        "left": {"top": $inGameTexts["left"]["top"].val(), "bottom": $inGameTexts["left"]["bottom"].val()},
        "right": $inGameTexts["right"].val()
    };
};

$(".in-game-on-change").bind("change paste keyup", function(e) { // If any of the champion names are changed...
    if (e.keyCode == 13) {
        inGameUpdate(); // Update if enter key.
    } else { // Else somethings changed.
        $inGameUpdateBtn.prop("disabled", false).addClass("btn-primary"); // Enable the update button.
        $(this).parent().addClass("has-warning"); // Colour the text-box to show it hasn't been updated.
    }
});

$inGameUpdateBtn.click(function() {
    inGameUpdate();
});

/** RESET **/
$inGameResetBtn.click(function() {
	if (window.confirm("Are you sure?")) {
		$inGameTexts["left"]["top"].val("");
		$inGameTexts["left"]["bottom"].val("");
		$inGameTexts["right"].val("");
		inGameUpdate();
	}
});


/**
 ############
 # ANALYSIS #
 ############
 */

var player;
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player("player", {
        height: "452",
        width: "804",
        playerVars: {
            autoplay: 1,
            modestbranding: 1,
            related: 0
        },
        events: {
            onStateChange: onPlayerStateChange
        }
    });
	window.addEventListener("message", function(event) {
		try {
			event = JSON.parse(event.data);
		} catch(e) {
			// If it doesn't run it's something with the Chrome VM ie. not my problem.
		}
		if (player.getPlayerState() === 2 && event["event"] == "infoDelivery") { // If paused.
			nodecg.sendMessage("analysis-pause", {
				"time": player.getCurrentTime()
			});
		}
	}, false);
};

/** INPUTS **/
var $videoIdInput = $("#analysis-video-id");
var $videoIdBtn = $("#analysis-video-id-btn");

$videoIdBtn.click(function() {
    player.loadVideoById({
        videoId: $videoIdInput.val(),
        suggestedQuality: "hd720"
    });
    player.playVideo();
    player.pauseVideo();
    nodecg.sendMessage("analysis-video", $videoIdInput.val())
});

function onPlayerStateChange(event) {
    if (event.data === 1) {
        nodecg.sendMessage("analysis-play", {
            "speed": player.getPlaybackRate()
        });
    } else if (event.data === 2) {
        nodecg.sendMessage("analysis-pause", {
            "time": player.getCurrentTime()
        });
    } else if (event.data === 3) {
        nodecg.sendMessage("analysis-pause", {
            "time": player.getCurrentTime()
        });
    }
}

var $toast = document.getElementById('toast');
nodecg.listenFor("loaded-all", function() {
    $toast.text = "Successfully loaded all scenes, good luck with the stream!";
    $toast.show();
});

