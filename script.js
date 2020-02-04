"use strict";

class Carousel {
    constructor(carousel, props) {
        this.carousel = document.querySelector(carousel);
        this.carouselVisiblePart = this.carousel.querySelector('.carousel-list');
        this.carouselTrack = this.carouselVisiblePart.getElementsByClassName('carousel-track')[0];
        this.carouselItems = this.carousel.querySelectorAll('.carousel-item');


        this.props = {
            step: props.step || 1,
            display: props.display || 3,
            width: props.width || window.getComputedStyle(this.carouselItems[0], null).width,
            loop: props.loop || false,
            ...props
        };
    }

    events = {
        'clickNav': [
            {
                target: () => this.carousel,
                event: 'click',
                handler: this.goTo
            }
        ]
    };

    navigationTo(targets) {
        targets.forEach(element => {
            element.forEach(item => {
               item.target().addEventListener(item.event, item.handler)
            })
        });
    }

    goTo() {

    }

    calcPosition() {
        let trackWidth = parseFloat(this.props.width) * this.carouselItems.length;
        let widthCarouselVisiblePart = parseFloat(window.getComputedStyle(this.carouselVisiblePart, null).width);
        let marginItem = '';
        console.log(widthCarouselVisiblePart);

        return {
            trackWidth: trackWidth
        }
    }

    setStartPosition() {
        let { trackWidth } = this.calcPosition();
        this.carouselTrack.style.width = trackWidth + 'px';
    }

    init() {
        this.setStartPosition();
        this.navigationTo([this.events.clickNav]);
    }

    destroy() {
        let arrEvents = Array.from(Object.values(this.events));
        arrEvents.forEach(currentEvents => {
            currentEvents.forEach(item => {
                 item.target().removeEventListener(item.event, item.handler)
            })
        });
    }
}

let carousel = new Carousel('.carousel-wrapper', {
    step: 2,
    display: 3,
    loop: false
});

carousel.init();
//carousel.destroy();
