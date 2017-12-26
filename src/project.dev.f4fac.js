require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = "function" == typeof require && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f;
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, l, l.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof require && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Background: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "58d2csMnyVPjrxInbuehogn", "Background");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        groundNode: [ cc.Node ],
        groundImg: cc.Sprite,
        move_interval: .05,
        move_speed: -5
      },
      onLoad: function onLoad() {
        this._size = cc.winSize;
        this._width = this.groundImg.spriteFrame.getRect().width;
        this.schedule(this.onGroundMove, this.move_interval);
      },
      onGroundMove: function onGroundMove() {
        this.groundNode[0].x += this.move_speed;
        this.groundNode[1].x += this.move_speed;
        this.groundNode[0].x + this._width / 2 < -this._size.width / 2 && (this.groundNode[0].x = this.groundNode[1].x + this._width - 5);
        this.groundNode[1].x + this._width / 2 < -this._size.width / 2 && (this.groundNode[1].x = this.groundNode[0].x + this._width - 5);
      }
    });
    cc._RF.pop();
  }, {} ],
  Bird: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "98fb9v6PlJOpZz9tu9US4Sd", "Bird");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        gravity: .5,
        birdJump: 6.6
      },
      onLoad: function onLoad() {
        this.velocity = 0;
      },
      onStartDrop: function onStartDrop() {
        this.schedule(this.onDrop, 1 / 60);
      },
      onJump: function onJump() {
        this.velocity = this.birdJump;
      },
      onDrop: function onDrop() {
        this.node.y += this.velocity;
        this.velocity -= this.gravity;
      }
    });
    cc._RF.pop();
  }, {} ],
  Constant: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "214b3Oqgh5KTLLHmLFI5fja", "Constant");
    "use strict";
    var Constant = cc.Enum({
      GROUND_MOVE_INTERVAL: .05,
      GROUND_VX: -5,
      PIPE_UP: 0,
      PIPE_DOWN: 1,
      GAMEOVER_TXT: "GAME OVER",
      HIGHSCORE_TXT: "HighScore: "
    });
    module.exports = Constant;
    cc._RF.pop();
  }, {} ],
  Game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4bbc2MENjlD2LeYvKssCJpG", "Game");
    "use strict";
    var Bird = require("Bird");
    var Background = require("Background");
    var Constant = require("Constant");
    var Storage = require("Storage");
    cc.Class({
      extends: cc.Component,
      properties: {
        pipeMaxOffsetY: 150,
        pipeMinGap: 80,
        pipeMaxGap: 200,
        pipeSpawnInterval: 4.5,
        scoreScaleDuration: .2,
        pipeSpawnOffsetX: 30,
        gameReflashTime: 5,
        pipesNode: {
          default: null,
          type: cc.Node
        },
        pipePrefabs: {
          default: [],
          type: [ cc.Prefab ]
        },
        gameMenu: cc.Node,
        bird: Bird,
        background: {
          default: null,
          type: Background
        },
        jumpAudio: {
          default: null,
          url: cc.AudioClip
        },
        gameOverText: {
          default: null,
          type: cc.Label
        },
        curScoreText: {
          default: null,
          type: cc.Label
        },
        highScoreText: {
          default: null,
          type: cc.Label
        }
      },
      onLoad: function onLoad() {
        this.gameOverText.string = "";
        this.curScoreText.node.active = false;
        this.setInputControl();
        this.size = cc.winSize;
        this.pipes = [];
        this.isGameOver = false;
        this.curScore = 0;
        var groundBox = this.background.groundNode[0].getBoundingBox();
        this.groundTop = groundBox.y + groundBox.height;
        Storage.getHighScore() > 0 && (this.highScoreText.string = Constant.HIGHSCORE_TXT + Storage.getHighScore());
      },
      setInputControl: function setInputControl() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.birdJump.bind(this));
      },
      birdJump: function birdJump() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
        this.bird.onJump();
      },
      onStartGame: function onStartGame() {
        this.curScoreText.node.active = true;
        this.gameMenu.active = false;
        this.bird.onStartDrop();
        this.schedule(this.spawnPipes, this.pipeSpawnInterval);
        this.schedule(this.gameUpdate, .05);
      },
      spawnPipes: function spawnPipes() {
        var pipeUp = cc.instantiate(this.pipePrefabs[0]);
        pipeUp.getComponent("Pipe").init(0);
        var pipeHeight = pipeUp.getComponent("cc.Sprite").spriteFrame.getRect().height;
        pipeUp.x = this.size.width / 2 + this.pipeSpawnOffsetX;
        pipeUp.y = Math.floor(Math.random() * this.pipeMaxOffsetY) + pipeHeight / 2;
        var pipeDown = cc.instantiate(this.pipePrefabs[1]);
        pipeDown.getComponent("Pipe").init(1);
        pipeDown.x = this.size.width / 2 + this.pipeSpawnOffsetX;
        var pipeGap = Math.floor(Math.random() * (this.pipeMaxGap - this.pipeMinGap)) + this.pipeMinGap + 20;
        pipeDown.y = pipeUp.y - pipeGap - pipeHeight;
        this.pipesNode.addChild(pipeUp);
        this.pipesNode.addChild(pipeDown);
        this.pipes.push(pipeUp);
        this.pipes.push(pipeDown);
      },
      gameUpdate: function gameUpdate() {
        var birdBox = this.bird.node.getBoundingBox();
        var birdRect = new cc.Rect(birdBox.x, birdBox.y, birdBox.width, birdBox.height);
        for (var i = 0; i < this.pipes.length; i++) {
          var curPipeNode = this.pipes[i];
          curPipeNode.x += -5;
          var pipeBox = curPipeNode.getBoundingBox();
          var pipeRect = new cc.Rect(pipeBox.x, pipeBox.y, pipeBox.width, pipeBox.height);
          if (pipeRect.intersects(birdRect)) {
            this.onGameOver();
            return;
          }
          var curPipe = curPipeNode.getComponent("Pipe");
          if (curPipeNode.x < this.bird.node.x && false === curPipe.isPassed && 0 === curPipe.type) {
            curPipe.isPassed = true;
            this.addScore();
          }
          if (curPipeNode.x < -(this.size.width / 2 + this.pipeSpawnOffsetX)) {
            this.pipes.splice(i, 1);
            this.pipesNode.removeChild(curPipeNode, true);
          }
        }
        (this.bird.node.y < this.groundTop || this.bird.node.y > this.size.height / 2 - birdBox.height / 2) && this.onGameOver();
      },
      addScore: function addScore() {
        this.curScore++;
        cc.log(this.curScore);
        this.curScoreText.string = "" + this.curScore;
        var action1 = cc.scaleTo(this.scoreScaleDuration, 1.1, .6);
        var action2 = cc.scaleTo(this.scoreScaleDuration, .8, 1.2);
        var action3 = cc.scaleTo(this.scoreScaleDuration, 1, 1);
        this.curScoreText.node.runAction(cc.sequence(action1, action2, action3));
      },
      onGameOver: function onGameOver() {
        this.curScoreText.node.active = false;
        this.isGameOver = true;
        this.gameOverText.string = "a little bird dead hahahaha ";
        this.curScore > Storage.getHighScore() && Storage.setHighScore(this.curScore);
        this.bird.unscheduleAllCallbacks();
        this.background.unscheduleAllCallbacks();
        this.unscheduleAllCallbacks();
        this.schedule(function() {
          cc.director.loadScene("game");
        }, this.gameReflashTime);
      }
    });
    cc._RF.pop();
  }, {
    Background: "Background",
    Bird: "Bird",
    Constant: "Constant",
    Storage: "Storage"
  } ],
  Pipe: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3bd48CqAhdBYo07aBng+uv3", "Pipe");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        isPassed: false
      },
      onLoad: function onLoad() {},
      init: function init(type) {
        this.type = type;
      }
    });
    cc._RF.pop();
  }, {} ],
  Storage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "645d0UmGw5Px7M6eYXiMDo0", "Storage");
    "use strict";
    var Storage = {
      getHighScore: function getHighScore() {
        var score = cc.sys.localStorage.getItem("HighScore") || 0;
        return parseInt(score);
      },
      setHighScore: function setHighScore(score) {
        cc.sys.localStorage.setItem("HighScore", score);
      }
    };
    module.exports = Storage;
    cc._RF.pop();
  }, {} ]
}, {}, [ "Background", "Bird", "Constant", "Game", "Pipe", "Storage" ]);
//# sourceMappingURL=project.dev.js.map