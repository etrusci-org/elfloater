/*!
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
ElFloater

Inspired by the original DVD logo screensaver.
Work in progress.

Todo/Ideas:
-
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

class ElFloaterLoader
{
    constructor(ele_selector: string = '.elfloater', con_selector: string = '#elfloater-container')
    {
        const con = document.querySelector(con_selector)

        if (!(con instanceof HTMLElement)) {
            console.error(`Container element '${con_selector} not found.`)
            return
        }

        document.querySelectorAll(ele_selector).forEach(ele => {
            if (ele instanceof HTMLElement) {
                new ElFloaterElement(ele, con)
            }
        })
    }
}


class ElFloaterElement
{
    static #DEFAULT: {FPS: number, VEL_X: number, VEL_Y: number} = {
        FPS: 60,
        VEL_X: 1,
        VEL_Y: 1,
    }

    #con_w!: number
    #con_h!: number

    #con: HTMLElement

    #ele: HTMLElement
    #ele_w: number
    #ele_h: number
    #ele_pos_x: number
    #ele_pos_y: number

    #fps: number

    #vel_x: number
    #vel_y: number

    #raf: {now: number, next: number, interval: number, elapsed: number} = {
        now: 0,
        next: 0,
        interval: 0,
        elapsed: 0,
    }


    constructor(ele: HTMLElement, con: HTMLElement)
    {
        this.#con = con

        this.#set_con_size()
        this.#watch_con_size()

        ele.style.display = 'inline-block'
        ele.style.position = 'absolute'
        const ele_rect: DOMRect = ele.getBoundingClientRect()

        this.#ele = ele
        this.#ele_w = ele_rect.width
        this.#ele_h = ele_rect.height
        this.#ele_pos_x = ElFloaterUtil.random_int(0, (this.#con_w * .9) - this.#ele_w)
        this.#ele_pos_y = ElFloaterUtil.random_int(0, (this.#con_h * .9) - this.#ele_h)

        this.#fps = (ele.dataset['fps']) ? ElFloaterUtil.clamp_number(Number(ele.dataset['fps']), 1, 1_000) : ElFloaterElement.#DEFAULT.FPS

        this.#vel_x = (ele.dataset['velX']) ? ElFloaterUtil.clamp_number(Number(ele.dataset['velX']), 0, 1_000_000) : ElFloaterElement.#DEFAULT.VEL_X
        this.#vel_y = (ele.dataset['velY']) ? ElFloaterUtil.clamp_number(Number(ele.dataset['velY']), 0, 1_000_000) : ElFloaterElement.#DEFAULT.VEL_Y

        this.#raf.next = performance.now()
        this.#raf.interval = 1_000 / this.#fps

        console.debug('[ElFloaterElement]', this.#ele, this.#fps, this.#vel_x, this.#vel_y)

        this.#move_ele()
        this.#animate()
    }


    #set_con_size(): void
    {
        const con_rect: DOMRect = this.#con.getBoundingClientRect()

        this.#con_w = con_rect.width
        this.#con_h = con_rect.height

        console.debug(this.#con_w, this.#con_h)
    }


    #watch_con_size(): void
    {
        let delay: number | undefined

        const O: ResizeObserver = new ResizeObserver(() => {
            clearTimeout(delay)
            delay = setTimeout(() => this.#set_con_size(), 500)
        })

        O.observe(this.#con)
    }


    #animate(): void
    {
        window.requestAnimationFrame(() => {
            this.#animate()
        })

        this.#raf.now = performance.now()
        this.#raf.elapsed = this.#raf.now - this.#raf.next

        if (this.#raf.elapsed <= this.#raf.interval) return

        this.#raf.next = this.#raf.now - (this.#raf.elapsed % this.#raf.interval)

        this.#move_ele()
        this.#change_ele_direction_on_collision()
        this.#set_next_ele_position()
    }


    #move_ele(): void
    {
        this.#ele.style.transform = `translate(${this.#ele_pos_x}px, ${this.#ele_pos_y}px)`
    }


    #set_next_ele_position(): void
    {
        this.#ele_pos_x += this.#vel_x
        this.#ele_pos_y += this.#vel_y
    }


    #change_ele_direction_on_collision(): void
    {
        if (this.#ele_pos_x + this.#ele_w > this.#con_w) {
            this.#ele_pos_x = this.#con_w - this.#ele_w
            this.#vel_x = -this.#vel_x
        }
        else if (this.#ele_pos_x < 0) {
            this.#ele_pos_x = 0
            this.#vel_x = -this.#vel_x
        }

        if (this.#ele_pos_y + this.#ele_h > this.#con_h) {
            this.#ele_pos_y = this.#con_h - this.#ele_h
            this.#vel_y = -this.#vel_y
        }
        else if (this.#ele_pos_y < 0) {
            this.#ele_pos_y = 0
            this.#vel_y = -this.#vel_y
        }
    }
}


class ElFloaterUtil
{
    // static random_float(min: number, max: number): number
    // {
    //     return Math.random() * (max - min) + min
    // }


    static random_int(min: number, max: number): number
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min)
    }


    static clamp_number(num: number, min: number, max: number): number
    {
        return Math.max(min, Math.min(num, max))
    }
}
