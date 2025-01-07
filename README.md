# ElFloater

Let [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)'s float around in a container.
Inspired by the original DVD logo screensaver.




## Usage


### 1. Create a container for the floaters

Default id for the container is `elfloater-container`.

```html
<!-- With default id -->
<div id="elfloater-container"></div>

<!-- With custom id -->
<div id="custom-container-id"></div>

```

Add CSS for the container.

```css
/* Option 1: Fullscreen */
#elfloater-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}

/* Option 2: Fixed with but scales for smaller viewport */
#elfloater-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 600px;
    height: 370px;
    max-width: 100%;
    max-height: 100%;
}

/* For option 1 you maybe also want to add this */
body {
    padding: 0;
    margin: 0;
    overflow: hidden;
}
```


### 2. Create one or more elements

The following options can be passed via data attributes:
- `data-vel-x`: *float* Horizontal velocity
- `data-vel-y`: *float* Vertical velocity
- `data-pos-x`: *float* Horizontal start position
- `data-pos-y`: *float* Vertical start position

Default class for the floater elements is `elfloater`.

```html
<img class="elfloater" src="./asset/dvd.png">

<img class="elfloater" src="./asset/test.png" data-vel-x="0.5" data-vel-y="3">

<button class="elfloater" data-vel-x="-1" data-vel-y="0">
    Any HTMLElement<br>
    should work.
</button>

<div class="custom-floater-class" data-vel-x="0" data-pos-x="200" data-pos-y="100">
    Custom selector<br>
    Fixed start position
</div>
```


### 3. Auto-load/start floaters after page is loaded

`ElFloaterLoader` takes two optional (nullable) arguments:
1. Element selector
2. Container selector

```html
<script src="./elfloater.js"></script>
<script>
    window.addEventListener('load', () => {
        new ElFloaterLoader()
        new ElFloaterLoader('.custom-floater-class')
        new ElFloaterLoader(null, '#custom-container-id')
    })
</script>
```
