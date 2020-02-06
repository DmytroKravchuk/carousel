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
        let { step } = this.props;
        if (e.target.classList.contains('arrow-next')) {
            this.carouselTrack.style.transform = `translateX(${this.getCurrentPositionTrack() - this.fullSpaceItem * this.calcMovingStep(step, 'next')}px)`;
        } else if (e.target.classList.contains('arrow-prev')){
            this.carouselTrack.style.transform = `translateX(${this.getCurrentPositionTrack() + this.fullSpaceItem * this.calcMovingStep(step, 'prev')}px)`;
        }
    }

    getCurrentPositionTrack() {
        let matrix = new WebKitCSSMatrix(window.getComputedStyle(this.carouselTrack).transform);
        return matrix.m41;
    }


    calcMovingStep(step, direction) {
        let { firstActiveIndex, lastActiveIndex } = this.getFirstLastActiveIndex();
        let lastIndex = this.carouselItems[this.carouselItems.length - 1].getAttribute('data-item-index');

        if(direction === 'prev') {
            if(+firstActiveIndex === 0) return 0;
        } else if(direction === 'next') {
            if(+lastActiveIndex === +lastIndex || ((+firstActiveIndex || +lastActiveIndex) > +lastIndex)) return 0;
            this.resetActiveItems();
            this.setActiveItems(++lastActiveIndex, +lastActiveIndex + step);

            if (Math.abs(+lastActiveIndex + step - +lastIndex) < step) {
                debugger
                return step - (+lastActiveIndex + step - +lastIndex);
            }
        }

        return step;
    }

    getActiveItems() {
        return Array.from(this.carouselItems).filter(item => item.classList.contains('active'));
    }

    getFirstLastActiveIndex() {
        let currentActiveItems = this.getActiveItems();
        return {
            firstActiveIndex: currentActiveItems[0].getAttribute('data-item-index'),
            lastActiveIndex: currentActiveItems[currentActiveItems.length - 1].getAttribute('data-item-index')
        };
    }

    setActiveItems(from, to) {
        Array.from(this.carouselItems).forEach((item) => {
            let dataIndex = parseInt(item.getAttribute('data-item-index'));
            if(dataIndex >= from && dataIndex < to) {
                item.classList.add('active');
            }
        });
    }

    resetActiveItems() {
        Array.from(this.carouselItems).forEach(item => item.classList.remove('active'));
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

    setStartSettings() {
        let { trackWidth, marginItem } = this.calcPosition();

        this.carouselTrack.style.width = trackWidth + 'px';
        Array.from(this.carouselItems).forEach((item, index) => {
            item.style.margin = `0 ${marginItem}px`;
            item.setAttribute('data-item-index', index);
        });
        this.setActiveItems(0, this.props.display);
    }

    init() {
        this.setStartSettings();
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
    step: 3,
    display: 3,
    loop: false
});

carousel.init();
//carousel.destroy();
