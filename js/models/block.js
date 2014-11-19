define(function () {
    var Block = function(x,y) {
        this.x = x;
        this.y = y;
        this.width = 1;
        this.height = 1;
        this.color = null;
    };

    Block.prototype.collides = function(block) {
        return this.x < block.x + block.width &&
            this.x + this.width > block.x &&
            this.y < block.y + block.height &&
            this.y + this.height > block.y;
    };

    Block.collides = function(blockA, blockB) {
        return blockA.collides(blockB);
    };

    return Block;
});