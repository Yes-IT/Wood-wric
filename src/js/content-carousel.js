(function () {
    document.addEventListener("DOMContentLoaded", function () {
        var carousels = document.querySelectorAll("[data-carousel]");
        carousels.forEach(function (carousel) {
            var items = Array.from(carousel.querySelectorAll(".carousel__item"));
            var dots = Array.from(carousel.querySelectorAll("[data-dot]"));
            var activeIndex = 0;
            var cycleTime = carousel.dataset.cycleTime;
            var interval;
            if(cycleTime){
                interval = setInterval(next, parseInt(cycleTime));
            }

            if (carousel) {
                carousel.classList.add("ready");
                window.simpleSwipe(carousel, previous, next);
            }

            dots.forEach(function (el) {
                el.addEventListener("click", function () {
                    if(cycleTime){
                        clearInterval(interval);
                    }
                    showContent(el.dataset.dot);
                });
            });

            function showContent(index) {
                console.log('show', index);
                removeAll("[data-dot]", "active", carousel);
                removeAll(".carousel__item", "active", carousel);
                items[index].classList.add("active","show", "animated");
                dots[index].classList.add("active");
                activeIndex = index;
            }
            function next() {
                activeIndex++;
                if (activeIndex > items.length - 1) {
                    activeIndex = 0;
                }
                showContent(activeIndex);
            }
            function previous() {
                activeIndex--;
                if (activeIndex < 0) {
                    activeIndex = items.length - 1;
                }
                showContent(activeIndex);
            }
        });
        function removeAll(selector, cssClass, domElement) {
            if (typeof domElement === "undefined") {
                domElement = document;
            }
            var elements = domElement.querySelectorAll(selector);
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove(cssClass, "show", "animated");
            }
        };
    });
})();
