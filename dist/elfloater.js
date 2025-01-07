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
    static #DEFAULT = {
        ELE_SELECTOR: '.elfloater',
        CON_SELECTOR: '#elfloater-container',
    };
    constructor(ele_selector, con_selector) {
        if (!ele_selector)
            ele_selector = ElFloaterLoader.#DEFAULT.ELE_SELECTOR;
        if (!con_selector)
            con_selector = ElFloaterLoader.#DEFAULT.CON_SELECTOR;
        const con = document.querySelector(con_selector);
        if (!(con instanceof HTMLElement)) {
            console.warn(`Container element '${con_selector} not found.`);
            return;
        }
        console.debug(`[ElFloaterLoader] ele_selector=${ele_selector} con_selector=${con_selector}`);
        document.querySelectorAll(ele_selector).forEach(ele => {
            if (!(ele instanceof HTMLElement))
                return;
            new ElFloaterElement(ele, con);
        });
    }
}
class ElFloaterElement {
    static #DEFAULT = {
        ELE_VEL_X: 0.5,
        ELE_VEL_Y: 0.5,
    };
    #fps = 60;
    #con;
    #con_w;
    #con_h;
    #ele;
    #ele_w;
    #ele_h;
    #ele_pos_x;
    #ele_pos_y;
    #ele_vel_x;
    #ele_vel_y;
    #raf;
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
        this.#ele_pos_x = (ele.dataset['posX']) ? Math.max(0, Number(ele.dataset['posX'])) : ElFloaterUtil.random_int(0, (this.#con_w * .9) - this.#ele_w);
        this.#ele_pos_y = (ele.dataset['posY']) ? Math.max(0, Number(ele.dataset['posY'])) : ElFloaterUtil.random_int(0, (this.#con_h * .9) - this.#ele_h);
        this.#ele_vel_x = (ele.dataset['velX']) ? Number(ele.dataset['velX']) : ElFloaterElement.#DEFAULT.ELE_VEL_X;
        this.#ele_vel_y = (ele.dataset['velY']) ? Number(ele.dataset['velY']) : ElFloaterElement.#DEFAULT.ELE_VEL_Y;
        this.#raf = {
            previous_time: performance.now(),
            frame_interval: 1_000 / this.#fps,
            elapsed_time_multiplier: 1,
            elapsed_time: 0,
        };
        console.debug(`[ElFloaterElement] vel_x=${this.#ele_vel_x} vel_y=${this.#ele_vel_y} pos_x=${this.#ele_pos_x} pos_y=${this.#ele_pos_y} ele=${this.#ele}`);
        this.#move_ele();
        this.#float();
    }
    #set_con_size() {
        const con_rect = this.#con.getBoundingClientRect();
        this.#con_w = con_rect.width;
        this.#con_h = con_rect.height;
    }
    #watch_con_size() {
        let delay;
        const O = new ResizeObserver(() => {
            clearTimeout(delay);
            delay = setTimeout(() => this.#set_con_size(), 500);
        });
        O.observe(this.#con);
    }
    #float() {
        const tick = (timestamp = 0) => {
            this.#raf.elapsed_time = timestamp - this.#raf.previous_time;
            this.#raf.elapsed_time_multiplier = this.#raf.elapsed_time / this.#raf.frame_interval;
            this.#move_ele();
            this.#handle_ele_collision();
            this.#set_next_ele_position();
            this.#raf.previous_time = timestamp;
            window.requestAnimationFrame(tick);
        };
        tick(0);
    }
    #move_ele() {
        this.#ele.style.setProperty('transform', `translate(${this.#ele_pos_x}px, ${this.#ele_pos_y}px)`);
    }
    #set_next_ele_position() {
        this.#ele_pos_x += this.#ele_vel_x * this.#raf.elapsed_time_multiplier;
        this.#ele_pos_y += this.#ele_vel_y * this.#raf.elapsed_time_multiplier;
    }
    #handle_ele_collision() {
        if (this.#ele_pos_x + this.#ele_w > this.#con_w) {
            this.#ele_pos_x = this.#con_w - this.#ele_w;
            this.#ele_vel_x = -this.#ele_vel_x;
        }
        else if (this.#ele_pos_x < 0) {
            this.#ele_pos_x = 0;
            this.#ele_vel_x = -this.#ele_vel_x;
        }
        if (this.#ele_pos_y + this.#ele_h > this.#con_h) {
            this.#ele_pos_y = this.#con_h - this.#ele_h;
            this.#ele_vel_y = -this.#ele_vel_y;
        }
        else if (this.#ele_pos_y < 0) {
            this.#ele_pos_y = 0;
            this.#ele_vel_y = -this.#ele_vel_y;
        }
    }
}
class ElFloaterUtil {
    static random_int(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
