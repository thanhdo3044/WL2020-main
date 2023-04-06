var startValue = '0.00000001', // Thay đổi giá trị cá cược ở đây
    stopPercentage = 0.001,
    maxWait = 777,
    stopped = false,
    loseCounter = 0,
    loseLimit = 5,
    winCounter = 0,
    winLimit = 5,
    winLimited = 10,
    loseLimited = 22,
    stopBefore = 1;
var $loButton = $('#double_your_btc_bet_lo_button'),
    $hiButton = $('#double_your_btc_bet_hi_button');
function multiply() {
    var current = $('#double_your_btc_stake').val();
    var multiply = (current * 2).toFixed(8);
    $('#double_your_btc_stake').val(multiply);
}
function getRandomWait() {
    var wait = Math.floor(Math.random() * maxWait) + 777;
    console.log('Waiting for ' + wait + 'ms before next bet.');
    return wait;
}
function getSpecialWait() {
    var wait = loseCounter*777
    console.log('Waiting SPECIAL for ' + wait + 'ms before next bet.');
    return wait
}
function startGame() {
    console.log('Game started!');
    reset();
    $loButton.trigger('click');
}
function stopGame() {
    console.log('Game will stop soon! Let me finish.');
    stopped = true;
}
function reset() {
    $('#double_your_btc_stake').val(startValue);
}
function deexponentize(number) {
    return number * 10000000;
}
function iHaveEnoughMoni() {
    var balance = deexponentize(parseFloat($('#balance_small').text()));
    var current = deexponentize($('#double_your_btc_stake').val());
    var value = ((balance) * 2 / 100) * (current * 2) > stopPercentage / 100;
    return false
}
function stopBeforeRedirect() {
    var minutes = parseInt($('title').text());
    if (minutes < stopBefore) {
        console.log('Approaching redirect! Stop the game so we don\'t get redirected while loosing.');
        stopGame();
        return true;
    }
    return false;
}
$('#double_your_btc_bet_lose').unbind();
$('#double_your_btc_bet_win').unbind();
$('#double_your_btc_bet_lose').bind("DOMSubtreeModified", function (event) {
    if ($(event.currentTarget).is(':contains("lose")')) {
        loseCounter+=1
        winCounter = 0
        console.log('You LOST! Multiplying your bet and betting again.');
        multiply();
        if (loseCounter>=loseLimited) {
            console.log('===============================')
            console.log('Lose '+loseCounter +'time !')
            stopGame()
        }else {
            if (loseCounter>=loseLimit) {
                console.log('Fail  '+loseCounter+' time')
                setTimeout(function () {
                    $loButton.trigger('click');
                }, getSpecialWait());
            }else {
                setTimeout(function () {
                    $loButton.trigger('click');
                }, getRandomWait());
            }
        }
    }
});
$('#double_your_btc_bet_win').bind("DOMSubtreeModified", function (event) {
    if ($(event.currentTarget).is(':contains("win")')) {
        loseCounter=0
        reset();
        if (winCounter>= winLimited) {
            stopGame()
        }else {
            if (winCounter>=winLimit) {
                setTimeout(function () {
                    $loButton.trigger('click');
                }, getSpecialWait());
            }else {
                setTimeout(function () {
                    $loButton.trigger('click');
                }, getRandomWait());
            }
        }
        if (stopBeforeRedirect()) {
            return;
        }
        if (iHaveEnoughMoni()) {
            console.log('You WON! But don\'t be greedy. Restarting!');
            reset();
            if (stopped) {
                stopped = false;
                return false;
            }
        }
        
    }
}); startGame()