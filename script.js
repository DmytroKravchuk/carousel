"use strict";

class Carousel {
    constructor(carousel, props) {
        this.carousel = document.querySelector(carousel);
        this.carouselItems = this.carousel.getElementsByClassName('carousel-item');
        this.props = props;
    }

    events = {
        'clickNav': [
            {
                target: () => this.carousel,
                event: 'click',
                handler: this.goTo
            }
        ]
    }

    navigationTo(targets) {
        targets.forEach(element => {
            element.forEach(item => {
               item.target().addEventListener(item.event, item.handler)
            })
        });
    }

    goTo() {
        console.log(1111111111)
    }

    init() {
        this.navigationTo([this.events.clickNav])
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

let carousel = new Carousel('.carousel-wrapper', {});
carousel.init();
//carousel.destroy();