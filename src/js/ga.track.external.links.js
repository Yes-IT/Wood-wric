document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('a');
    links.forEach(function (link) {
        var a = new RegExp('/' + window.location.host + '/');
        if (!a.test(link.href)) {
            link.setAttribute('target', '_blank');
            link.addEventListener('click', function (e) {
                if (dataLayer) {
                    dataLayer.push({'event': 'gaEvent', 'category': 'Outbound', 'action': 'Click', 'label': link.href});
                }
            });
        }
    });
})
