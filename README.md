# ElFloater

Let [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)'s float around in a container.
Inspired by the original DVD screensaver from the early 2000s.




## Usage

The following shows you how to create your own HTML page with one or more floating elements.
For a working demo/starter template open **[dist/demo.html](./dist/demo.html)** in your webbrowser. Works from the filesystem and does not have to be put on a webserver.

Advanced users could also use the individual classes directly. Please see [./src/elfloater.ts](./src/elfloater.ts) for more.
- `ElFloaterLoader`
- `ElFloaterElement`
- `ElFloaterUtil`


### 1. Create a container for the floaters

Default selector for the container is an **id** named `elfloater-container`. There can only be one container.

```html
<!-- With default id -->
<div id="elfloater-container"></div>

<!-- With custom id -->
<div id="custom-container-id"></div>
```

Add CSS for the container.

```css
/* Option 1:
Use whole viewport
*/
#elfloater-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}

/* Option 2:
Fixed width/height but scales down for smaller viewport
*/
#elfloater-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 600px;
    height: 370px;
    max-width: 100%;
    max-height: 100%;
}

/* For option 1:
You maybe also want to add this to prevent automatic scrollbars on collison
*/
body {
    padding: 0;
    margin: 0;
    overflow: hidden;
}
```


### 2. Create one or more elements

Default selector for the floater elements is a **class** named `elfloater`.

The following options can be passed via data attributes. The order does not matter. If they are omitted, default values will be used:
- *float* `data-vel-x`: Horizontal velocity
- *float* `data-vel-y`: Vertical velocity
- *float* `data-pos-x`: Horizontal start position
- *float* `data-pos-y`: Vertical start position
- *boolean* `data-flip-x`: Flip horizontal axis on collision
- *boolean* `data-flip-y`: Flip vertical axis on collision
- *boolean* `data-random-color`: Randomize text color of element on collision

```html
<img class="elfloater" src="./asset/dvd.png">

<img class="elfloater" src="./asset/test.png" data-vel-x="1" data-vel-y="1.5" data-flip-x="true" data-flip-y="true">

<span class="elfloater" data-random-color="true">
    Any HTMLElement<br>
    should work
</span>

<div class="custom-floater-class" data-vel-x="0" data-pos-x="200" data-pos-y="100">
    Custom selector
</div>

```


### 3. Include script and auto-load/start floaters after page is loaded

`ElFloaterLoader` takes two optional (nullable) arguments:
1. *string* `ele_selector`: Floater element class
2. *string* `con_selector`: Container element id

```html
<script src="./elfloater.js"></script>
<script>
    window.addEventListener('load', () => {
        // Load elements with default floater class and default container id
        new ElFloaterLoader()

        // Load elements with custom floater class and default container id
        new ElFloaterLoader('.custom-floater-class')

        // Load elements with default floater class and custom container id
        new ElFloaterLoader(null, '#custom-container-id')

        // Load elements with custom floater class and custom container id
        new ElFloaterLoader('.custom-floater-class', '#custom-container-id')
    })
</script>
```
