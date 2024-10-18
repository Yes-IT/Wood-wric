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

let isToastVisible = false;  // Flag to track if the error message has been shown

function validateForm() {
    let requiredFields = document.querySelectorAll('[required]');
    let hasError = false;

    requiredFields.forEach(field => {
        if (!field.value) {
            hasError = true;
            // Add a visual indicator (like red borders) to highlight the field
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });

    // If there is an error and the toast hasn't been shown yet
    if (hasError && !isToastVisible) {
        showSingleErrorMessage("Oops, you've missed a required field. Please complete before saving.");
        isToastVisible = true;  // Set the flag to true to prevent multiple messages

        // Reset the flag after 5 seconds (optional)
        setTimeout(() => {
            isToastVisible = false;
        }, 5000);  // Adjust the time as needed

        return false;  // Prevent form submission
    }

    return true;  // Allow form submission
}

function showSingleErrorMessage(message) {
    let errorElement = document.getElementById('single-error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'single-error-message';
        errorElement.classList.add('error-message');
        document.body.appendChild(errorElement);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';

    // Hide the error after some time if needed
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

// Attach validation to the form's publish button or submit event
document.querySelector('#publish-button').addEventListener('click', function (event) {
    if (!validateForm()) {
        event.preventDefault();  // Prevent form submission if validation fails
    }
});
