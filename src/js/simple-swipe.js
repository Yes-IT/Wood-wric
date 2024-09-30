(function() {
    var touchstartX = 0;
    var touchstartY = 0;
    var touchendY = 0;
    var touchendX = 0;
    var delta = 48;

    window.simpleSwipe = function(el, leftCallback, rightCallback, delta) {
        delta = delta || 48;
        el.addEventListener(
            "touchstart",
            function(event) {
                touchstartX = event.changedTouches[0].screenX;
                touchstartY = event.changedTouches[0].screenY;
            },
            false
        );

        el.addEventListener(
            "touchend",
            function(event) {
                touchendX = event.changedTouches[0].screenX;
                touchendY = event.changedTouches[0].screenY;
                handleSwipe();
            },
            false
        );
        function handleSwipe() {
            // console.log(touchstartY, touchendY, Math.abs(touchstartY - touchendY), delta);
            // console.log(touchendX , touchstartX);
            // alert([touchendX, touchstartX, Math.abs(touchstartY - touchendY), delta].join(','));
            if(Math.abs(touchstartX - touchendX) < 30){
                return
            }
            if (Math.abs(touchstartY - touchendY) < delta) {
                
                if (touchendX < touchstartX) {
                    // alert('right');
                    rightCallback();
                }
                if (touchendX > touchstartX) {
                    leftCallback();
                    // alert('left');
                }
            }else{
                // console.log('too far vertically');
            }
        }
    };
})();
