"use strict";
/*!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
ElFloater

Inspired by the original DVD logo screensaver.
Work in progress.

Todo/Ideas:
-
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/
class ElFloaterLoader {
    constructor(ele_selector = '.elfloater', con_selector = '#elfloater-container') {
        const con = document.querySelector(con_selector);
        if (!(con instanceof HTMLElement)) {
            console.error(`Container element '${con_selector} not found.`);
            return;
        }
        document.querySelectorAll(ele_selector).forEach(ele => {
            if (ele instanceof HTMLElement) {
                new ElFloaterElement(ele, con);
            }
        });
    }
}
class ElFloaterElement {
    static #DEFAULT = {
        FPS: 60,
        VEL_X: 1,
        VEL_Y: 1,
    };
    #con_w;
    #con_h;
    #con;
    #ele;
    #ele_w;
    #ele_h;
    #ele_pos_x;
    #ele_pos_y;
    #fps;
    #vel_x;
    #vel_y;
    #raf = {
        now: 0,
        next: 0,
        interval: 0,
        elapsed: 0,
    };
    constructor(ele, con) {
        this.#con = con;
        this.#set_con_size();
        this.#watch_con_size();
        ele.style.display = 'inline-block';
        ele.style.position = 'absolute';
        const ele_rect = ele.getBoundingClientRect();
        this.#ele = ele;
        this.#ele_w = ele_rect.width;
        this.#ele_h = ele_rect.height;
        this.#ele_pos_x = ElFloaterUtil.random_int(0, (this.#con_w * .9) - this.#ele_w);
        this.#ele_pos_y = ElFloaterUtil.random_int(0, (this.#con_h * .9) - this.#ele_h);
        this.#fps = (ele.dataset['fps']) ? ElFloaterUtil.clamp_number(Number(ele.dataset['fps']), 1, 1_000) : ElFloaterElement.#DEFAULT.FPS;
        this.#vel_x = (ele.dataset['velX']) ? ElFloaterUtil.clamp_number(Number(ele.dataset['velX']), 0, 1_000_000) : ElFloaterElement.#DEFAULT.VEL_X;
        this.#vel_y = (ele.dataset['velY']) ? ElFloaterUtil.clamp_number(Number(ele.dataset['velY']), 0, 1_000_000) : ElFloaterElement.#DEFAULT.VEL_Y;
        this.#raf.next = performance.now();
        this.#raf.interval = 1_000 / this.#fps;
        console.debug('[ElFloaterElement]', this.#ele, this.#fps, this.#vel_x, this.#vel_y);
        this.#move_ele();
        this.#animate();
    }
    #set_con_size() {
        const con_rect = this.#con.getBoundingClientRect();
        this.#con_w = con_rect.width;
        this.#con_h = con_rect.height;
        console.debug(this.#con_w, this.#con_h);
    }
    #watch_con_size() {
        let delay;
        const O = new ResizeObserver(() => {
            clearTimeout(delay);
            delay = setTimeout(() => this.#set_con_size(), 500);
        });
        O.observe(this.#con);
    }
    #animate() {
        window.requestAnimationFrame(() => {
            this.#animate();
        });
        this.#raf.now = performance.now();
        this.#raf.elapsed = this.#raf.now - this.#raf.next;
        if (this.#raf.elapsed <= this.#raf.interval)
            return;
        this.#raf.next = this.#raf.now - (this.#raf.elapsed % this.#raf.interval);
        this.#move_ele();
        this.#change_ele_direction_on_collision();
        this.#set_next_ele_position();
    }
    #move_ele() {
        this.#ele.style.transform = `translate(${this.#ele_pos_x}px, ${this.#ele_pos_y}px)`;
    }
    #set_next_ele_position() {
        this.#ele_pos_x += this.#vel_x;
        this.#ele_pos_y += this.#vel_y;
    }
    #change_ele_direction_on_collision() {
        if (this.#ele_pos_x + this.#ele_w > this.#con_w) {
            this.#ele_pos_x = this.#con_w - this.#ele_w;
            this.#vel_x = -this.#vel_x;
        }
        else if (this.#ele_pos_x < 0) {
            this.#ele_pos_x = 0;
            this.#vel_x = -this.#vel_x;
        }
        if (this.#ele_pos_y + this.#ele_h > this.#con_h) {
            this.#ele_pos_y = this.#con_h - this.#ele_h;
            this.#vel_y = -this.#vel_y;
        }
        else if (this.#ele_pos_y < 0) {
            this.#ele_pos_y = 0;
            this.#vel_y = -this.#vel_y;
        }
    }
}
class ElFloaterUtil {
    static random_int(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    static clamp_number(num, min, max) {
        return Math.max(min, Math.min(num, max));
    }
}
