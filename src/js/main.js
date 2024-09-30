//Copyright (c) 2018, 8-nines Consulting, LLC. All rights reserved. 8-nines.com

(function(global) {
    'use strict'
    function _main() {
        this.lastScroll = 0
        this.navElem = document.querySelector('#nav')
        this.heroElem = document.querySelector('section.hero')

        this.scrollPeek()
        this.removeExpiredElements(document)
    }

    _main.prototype.closeMenu = function() {
        var e = document.querySelector('#menu input')
        if(e && e.checked) { e.checked = false }
    }

    _main.prototype.removeExpiredElements = function(e) {
        
        var expiringElements = e.querySelectorAll('[data-after-value]')
        
        for(var i = 0; i < expiringElements.length; i++) {
            this.simpleUTCDateTimeParse(expiringElements[i].getAttribute('data-after-value')) < Date.now() && expiringElements[i].remove()
        }
        
    }

    _main.prototype.scrollPeek = function() {
        var scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
        if(scrollTop > 500) {
            if(scrollTop > this.lastScroll) {
                this.navElem && this.navElem.classList.add('nav-hide')
            } else {
                this.navElem && this.navElem.classList.remove('nav-hide')
            }
        } else {
            this.navElem && this.navElem.classList.remove('nav-hide')
        }
        if(scrollTop > 100) {
            this.heroElem && this.heroElem.classList.add('nav-hide')
        } else {
            this.heroElem && this.heroElem.classList.remove('nav-hide')
        }
        this.lastScroll = scrollTop
    }

    _main.prototype.simpleUTCDateTimeParse = function(dateString){
        var  date = new Date(dateString)
        if(date instanceof Date && !isNaN(date)) { return date }
        //safari needs YYYY/MM/DD HH:MM:SS format
        return new Date(dateString.replace(/-/g, '/'))
    }
    global.main = new _main()

    document.addEventListener('scroll', function() {main.scrollPeek()})
})(typeof self !== 'undefined' && self || typeof window !== 'undefined' && window || this)