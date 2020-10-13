$(function () {
    var controller = new ScrollMagic.Controller();

    var blockTween = new TweenMax.to('#block', 1.5, {
        backgroundColor: 'red'
    });

    var backgroundChange = new TweenMax.to('body', 1.5, {
        backgroundColor: 'black'
    });

    var backgroundChangeWhite = new TweenMax.to('body', 1.5, {
        backgroundColor: 'white'
    });

    var containerScene = new ScrollMagic.Scene({
        triggerElement: '#container'
    })
        .setTween(blockTween)
        .setTween(backgroundChange)
        .addIndicators()
        .addTo(controller);
    
    var containerScene = new ScrollMagic.Scene({
        triggerElement: '#container2'
    })
        .setTween(blockTween)
        .setTween(backgroundChangeWhite)
        .addIndicators()
        .addTo(controller);
});