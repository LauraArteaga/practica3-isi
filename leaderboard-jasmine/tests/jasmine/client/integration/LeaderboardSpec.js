var selectGraceHopper = function (callback) {
  Session.set("selected_player", Players.findOne({name: "Grace Hopper"})._id);
  if (callback) {
    Deps.afterFlush(callback);
  }
};

var unselectPlayer = function () {
  Session.set("selected_player", null);
};

describe("Selecting Grace Hopper", function () {
  beforeEach(function (done) {
    Meteor.autorun(function (c) {
      var grace = Players.findOne({name: "Grace Hopper"});
      if (grace) {
        c.stop();
        selectGraceHopper(done);
      }
    })
  });

  it("should show Grace above the give points button", function () {
    expect($("div.details > div.name").html()).toEqual("Grace Hopper"); //EL div.name esta por debajo de div.details por el ">", que es lenguaje de jquery
  });


  it("should highlight Grace's name", function () {
    var parentDiv = $("span.name:contains(Grace Hopper)").parent();
    expect(parentDiv.hasClass("selected")).toBe(true);
  });
});

describe("Point Assignment", function () {
  beforeEach(function (done) {
    selectGraceHopper(done);
  });

  it("should give a player 5 points when he is selected and the button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("input:button.inc").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints + 5);
  });
  
  it("should substract a player 5 points when he is selected and the button is pressed", function () {
    var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
    $("input:button.dec").click();
    expect(Players.findOne({name: "Grace Hopper"}).score).toBe(graceInitialPoints - 5);
  });
});

describe("Remove player", function () {
  beforeEach(function (done) {
    selectGraceHopper(done);
  });
  
  it("should remove a player when he is selected and the button is pressed", function () {
    $("input:button.del").click();
    expect(Players.findOne({name: "Grace Hopper"})).toBe(undefined);
  });
});

describe("Add player", function () {
  
  it("should add a player when he is selected and the button is pressed", function () {
	  var numPlayers = Players.find().count();
	  console.log(numPlayers);
    $("#newPlayer").submit();
    var numPlayersNew = Players.find().count();
    console.log(numPlayersNew);
    expect(Players.find().count()).toBe(numPlayers + 1);
  });
});

describe("Player Ordering", function () {
  it("should result in a list where the first player has as many or more points than the second player", function () {
    var players = PlayersService.getPlayerList().fetch();
    expect(players[0].score >= players[1].score).toBe(true);
  });
});
