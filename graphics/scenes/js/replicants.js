/** INDEX **/
var $cover = $("#cover");
var $scene = $("#scene");
var currScene = "";
var currentBG = "";

/** START **/


obsReplicant = nodecg.Replicant("obs-scene")
	.on("change", function (oldVal, newVal) {
		var nextScene = newVal["scene"];
		if (nextScene != currScene) {
			$cover.fadeIn(200, function() {
				$scene.attr("src", "scenes/" + nextScene + ".html");
				// Don't use any of the following code, it's horrible and hacky...
				var handlers = nodecg._messageHandlers;
				for (var i = handlers.length - 1; i >= 0; i--) {
					if (currScene == "champ-select") {
						if (["champ-picked", "champ-picked-clear"].indexOf(handlers[i]["messageName"]) >= 0 &&
							handlers[i]["bundleName"] == "vespyr") {
							handlers.splice(i, 1)
						}
					} else if (currScene == "analysis") {
						if (["analysis-play", "analysis-pause", "analysis-video"].indexOf(handlers[i]["messageName"]) >= 0 &&
							handlers[i]["bundleName"] == "vespyr") {
							handlers.splice(i, 1)
						}
					}

				}
				nodecg._messageHandlers = handlers;
				setTimeout(function() { $cover.fadeOut(200); currScene = nextScene; }, 300);
			});
		}
	});

castersReplicant = nodecg.Replicant("casters")
	.on("change", function(oldVal, newVal) {
		if (obsReplicant.value["scene"] == "champ-select") {
			var string = "SHOUTCASTERS: " + newVal[0];
			if (newVal[1] != "") {
				string += (" & " + newVal[1])
			}
			$("#casters").text(string);
		}
	});

currentGameReplicant = nodecg.Replicant("current-game")
	.on("change", function(oldVal, newVal) {
		if (obsReplicant.value["scene"] == "champ-select") {
			$.each(newVal, function (team, value) { // For each team...
				$.each(value["info"], function (key, value) { // For each of the team info...
					if (["tag", "position"].indexOf(key) !== -1) { // If value isn't used in this scene...
						return
					}
					if (value != $teamInfo[team][key].text()) { // If value has changed...
						var changeTeamInfo = new TimelineLite(); // Animate the changing of the value.
						changeTeamInfo
							.to($teamInfo[team][key], 0.5, { // Fade out.
								opacity: 0.0
							})
							.call(function () { // Update text.
								$teamInfo[team][key].text(value);
							})
							.to($teamInfo[team][key], 0.5, { // Fade in.
								opacity: 1.0
							});
					}
				});
				$.each(value["roster"], function (position, value) { // For each player name...
					if (value != $teamRoster[team][position].text()) { // If value has changed...
						var changeTeamRoster = new TimelineLite(); // Animate the changing of the value.
						changeTeamRoster
							.to($teamRoster[team][position], 0.5, { // Fade in.
								opacity: 0.0
							})
							.call(function () { // Update text.
								$teamRoster[team][position].text(value);
							})
							.to($teamRoster[team][position], 0.5, { // Fade in.
								opacity: 1.0
							});
					}
				});
			});
		} else if (obsReplicant.value["scene"] == "loading") {
			$.each(newVal, function (team, value) {
				$("#" + team + "-team").text(value["info"]["tag"])
			});
		} else if (obsReplicant.value["scene"] == "in-game") {
			var blueScore = newVal["blue"]["info"]["score"] + " - " + newVal["blue"]["info"]["tag"];
			var redScore = newVal["red"]["info"]["tag"] + " - " + newVal["red"]["info"]["score"];
			var updateScore = function (team, newScore) {
				var scoreTimeline = new TimelineLite();
				scoreTimeline
					.to($score[team][0], 0.5, {
						top: "-110%"
					})
					.call(function () {
						$score[team][1].text(newScore)
					})
					.to($score[team][0], 0.5, {
						top: "0%"
					});
			};
			if ($score["blue"][1].text() != blueScore) {
				updateScore("blue", blueScore)
			}
			if ($score["red"][1].text() != redScore) {
				updateScore("red", redScore)
			}
		}
	});

comingUpReplicant = nodecg.Replicant("coming-up")
	.on("change", function(oldVal, newVal) {
		if (obsReplicant.value["scene"] == "start") {
			var colour = (newVal["colour"] == "inhouse") ? "black" : newVal["colour"];
			if (currentBG != colour) {
				$("#start-background-img").css("background-image", "url(" + preload.getResult(colour + "-bg").src + ")");
				currentBG = newVal["colour"];
			}
		} else if (obsReplicant.value["scene"] == "coming-up") {
			if (currentBG != newVal["colour"]) {
				if (newVal["colour"] == "inhouse") { // If we're doing inhouses.
					$foregroundImg.css("background-image",  "url(" + preload.getResult("inhouse-bg").src + ")").css("z-index", "100");
				} else {
					$backgroundImg.css("background-image", "url(" + preload.getResult(newVal["colour"] + "-bg").src + ")");
					$foregroundImg.css("background-image",  'url("../images/coming-up/foreground.png")').css("z-index", "0");
				}
				currentBG = newVal["colour"];
			}
			if (!$comingUpPanels[newVal["next_game"]].is(":visible")) { // If the next game has changed...
				$(".info:visible").slideUp(); // Slide the currently visible game up.
				$comingUpPanels[newVal["next_game"]].slideDown(); // Slide the new game down.
			}

			if (currentTimer != newVal["timer"]) {
				var time = new Date();
				var timeString = newVal["timer"].split(":");
				time.setHours(timeString[0], timeString[1] - time.getTimezoneOffset() - 60, timeString[2]);
				function pad (str, max) {
					str = str.toString();
					return str.length < max ? pad("0" + str, max) : str;
				}
				var countdown = (time.getFullYear() + "/" + pad(time.getMonth() + 1, 2) + "/" + pad(time.getDate(), 2) +
				" " + pad(time.getHours(), 2) + ":" + pad(time.getMinutes(), 2) + ":" + pad(time.getSeconds(), 2));

				$("#timer").countdown(countdown, function(e) {
					$(this).text(e.strftime("%H:%M:%S"))
				});
				currentTimer = newVal["timer"];
			}
		} else if (obsReplicant.value["scene"] == "champ-select") {
			if (currentBG != newVal["colour"]) {
				var colour = (newVal["colour"] == "inhouse") ? "black" : newVal["colour"];
				$middleBG.css("background-image", "url(" + preload.getResult(colour + "-bg").src + ")");
				$middleFG.css("background-image", "url(" + preload.getResult(colour + "-champ-select-fg").src + ")");
				currentBG = newVal["colour"];
			}
		}
	});

strawpollReplicant = nodecg.Replicant("strawpoll")
	.on("change", function(oldVal, newVal) {
		if (obsReplicant.value["scene"] == "champ-select") {
			if (newVal["show"]) {
				if ($poll.css("opacity") != 1.0) {
					nodecg.sendMessage("champ-picked-clear");
					$poll.animate({opacity: 1.0}, 500);
				}
				$("#poll-url").text("strawpoll.me/" + newVal["id"]);
				var total = newVal["result"][0] + newVal["result"][1];
				if (currTotal == total) {
					return
				} // Dont do math if it's the same.
				currTotal = total;
				if (total == 0) {
					total = 1
				} // Set total to 1 if it's 0 so we don't get divide by zero errors.
				var percentage = [Math.round((newVal["result"][0] / total) * 100),
					Math.round((newVal["result"][1] / total) * 100)];
				$pollBar["blue"].animate({width: percentage[0] + "%"});
				$pollBar["red"].animate({width: percentage[1] + "%"});
				$pollValues["blue"].text(percentage[0] + "%");
				$pollValues["red"].text(percentage[1] + "%");
			} else if ($poll.css("opacity") != 0.0) {
				$poll.animate({opacity: 0.0}, 500)
			}
		}
	});

champSelectReplicant = nodecg.Replicant("champ-select")
	.on("change", function(oldVal, newVal) {
		if (obsReplicant.value["scene"] == "champ-select") {
			$.each(newVal, function (team, value) {
				$.each(value["bans"], function (ban, value) {
					if (value["name"] != $teamBans[team][ban].text()) {
						var changeBan = new TimelineLite();
						changeBan
							.to($teamBans[team][ban], 0.5, { // Fade out.
								opacity: 0.0
							})
							.call(function () { // Update text.
								$teamBans[team][ban].text(value["name"]);
							})
							.to($teamBans[team][ban], 0.5, { // Fade in.
								opacity: 1.0
							});
					}
					if (value["file"] != $teamBansBg[team][ban][1]) { // If value has changed...
						$teamBansBg[team][ban][1] = value["file"]; // Update the stored ban.
						var changeBanImg = new TimelineLite(); // Animate the changing of the value.
						changeBanImg
							.to($teamBansBg[team][ban][0], 0.5, {
								bottom: "-110%",
								ease: Back.easeInOut.config(0.5)
							})
							.call(function () {
								$teamBansBg[team][ban][0].css("background-image", "url(../images/champ-select/ban/" + value["file"] + ".jpg)");
							})
							.to($teamBansBg[team][ban][0], 0.5, {
								bottom: "0px",
								ease: Back.easeInOut.config(0.5)
							});
					}
				});
				$.each(value["picks"], function (pick, value) { // For each pick...
					if (value["champ"] != $teamPicks[team][pick][1]) { // If value has changed...
						$teamPicks[team][pick][1] = value["champ"]; // Update the stored champ.
						var changePickImg = new TimelineLite();  // Animate the changing of the value.
						if (team == "blue") { // If blue team...
							changePickImg
								.to($teamPicks[team][pick][0], 0.5, {
									left: "-110%",
									ease: Back.easeInOut.config(0.5)
								}) // Slide out to the left.
								.call(function () { // Update image.
									$teamPicks[team][pick][0].css("background-image", "url(../images/champ-select/pick/" + value["champ"] + ".jpg)");
								})
								.to($teamPicks[team][pick][0], 0.5, {
									left: "0px",
									ease: Back.easeInOut.config(0.5)
								});
						} else if (team == "red") { // If red team...
							changePickImg
								.to($teamPicks[team][pick][0], 0.5, {
									right: "-110%",
									ease: Back.easeInOut.config(0.5)
								}) // Slide out to the right.
								.call(function () { // Update image.
									$teamPicks[team][pick][0].css("background-image", "url(../images/champ-select/pick/" + value["champ"] + ".jpg)");
								})
								.to($teamPicks[team][pick][0], 0.5, {
									right: "0px",
									ease: Back.easeInOut.config(0.5)
								});
						}
					}
					$teamPicks[team][pick][0].css("webkitFilter", "grayscale(" + ((value["locked"]) ? "0" : "100%") + ")"); // Update grayscale to reflect locked status.
				});
			});
		}
	});
