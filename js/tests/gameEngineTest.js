define(['juniper/testCase', 'gameEngine'], function(TestCase, GameEngine) {

    var GameEngineTest = function() {};

    GameEngineTest.prototype = new TestCase();

    GameEngineTest.prototype.setup = function() {
        this.fixture = new GameEngine();
    };

    // GameEngineTest.prototype.testFoo = function() {
    // };

    return GameEngineTest;
});