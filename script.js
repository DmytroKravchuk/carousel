"use strict";

class Carousel {
    constructor(carousel, props) {
        this.carousel = document.querySelector(carousel);
        this.carouselVisiblePart = this.carousel.querySelector('.carousel-list');
        this.carouselTrack = this.carouselVisiblePart.getElementsByClassName('carousel-track')[0];
        this.carouselItems = this.carousel.getElementsByClassName('carousel-item');

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
                handler: this.goTo.bind(this)
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

    goTo(e) {
        if (e.target.classList.contains('arrow-next')) {
            this.carouselTrack.style.transform = `translateX(${this.getCurrentPositionTrack() - this.fullSpaceItem * this.props.step}px)`;
        } else if (e.target.classList.contains('arrow-prev')){
            this.carouselTrack.style.transform = `translateX(${this.getCurrentPositionTrack() + this.fullSpaceItem * this.props.step}px)`;
        }
    }

    getCurrentPositionTrack() {
        let matrix = new WebKitCSSMatrix(window.getComputedStyle(this.carouselTrack).transform);
        return matrix.m41;
    }


    calcPosition() {
        let trackWidth = parseFloat(this.props.width) * this.carouselItems.length;
        let widthCarouselVisiblePart = parseFloat(window.getComputedStyle(this.carouselVisiblePart, null).width);
        let marginItem = ((widthCarouselVisiblePart / this.props.display - parseInt(this.props.width)) / 2);
        this.fullSpaceItem = parseInt(this.props.width) + marginItem * 2;

        return {
            trackWidth: trackWidth,
            marginItem: marginItem
        }
    }

    setStartPosition() {
        let { trackWidth, marginItem } = this.calcPosition();

        this.carouselTrack.style.width = trackWidth + 'px';
        Array.from(this.carouselItems).forEach(item => item.style.margin = `0 ${marginItem}px`);
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
    step: 1,
    display: 4,
    loop: false
});

carousel.init();
//carousel.destroy();
