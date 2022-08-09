<script>
    import { onMount } from "svelte";
    import { color } from 'd3-color';
    import { select, selectAll } from "d3-selection";
  
    function rgbToHex(r, g, b) {
        const componentToHex = c => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }

    function multiplyColors(color1, color2) {
        const r = Math.round((color(color1)['r'] * color(color2)['r']) / 255);
        const g = Math.round((color(color1)['g'] * color(color2)['g']) / 255);
        const b = Math.round((color(color1)['b'] * color(color2)['b']) / 255);
        return rgbToHex(r, g, b);
    }

    // need to import colorX, colorY, color0, interpolator
    export let colorX;
    export let colorY;
    export let color0;
    export let interpolator;
    export let width;
    export let height;
    export let xTitle;
    export let yTitle;
    let canvas;
    let ctx;
    let colors;
    // export let pos;
    // const { width, height, colorX, colorY, color0, interpolator } = legendConfig;
    const margin = { top: 0, right: 5, bottom: 5, left: 5 };

    const calcColor = (point, bottomLeft, bottomRight, topLeft, topRight) => {
        const top = interpolator(topLeft, topRight)(point.x);
        const bottom = interpolator(bottomLeft, bottomRight)(point.x);
        const result = interpolator(top, bottom)(point.y);
        // console.log(point, result)
        return result;
      };

    const drawCanvas = () => {
      const imageData = ctx.createImageData(width, height);
      for (let y = 0; y < width; y += 1) {
        for (let x = 0; x < height; x += 1) {
          const _color = calcColor(
            { x: x / (width - 1), y: y / (height - 1) },
            ...colors
          );
          imageData.data[(y * width + x) * 4] = color(_color).r;
          imageData.data[(y * width + x) * 4 + 1] = color(_color).g;
          imageData.data[(y * width + x) * 4 + 2] = color(_color).b;
          imageData.data[(y * width + x) * 4 + 3] = 255;
        }
      }
      ctx.putImageData(imageData, margin.left, 0);
    };

    // #region
    const drawLineWithArrows = (x0, y0, x1, y1, aWidth, aLength, arrowStart, arrowEnd) => {
        var dx = x1 - x0;
        var dy = y1 - y0;
        var angle = Math.atan2(dy, dx);
        var length = Math.sqrt(dx * dx + dy * dy);

        ctx.translate(x0, y0);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(length, 0);
        if (arrowStart) {
            ctx.moveTo(aLength, -aWidth);
            ctx.lineTo(0, 0);
            ctx.lineTo(aLength, aWidth);
        }
        if (arrowEnd) {
            ctx.moveTo(length - aLength, -aWidth);
            ctx.lineTo(length, 0);
            ctx.lineTo(length - aLength, aWidth);
        }
        ctx.stroke();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
// #endregion
    const showLegend = () => {
      ctx = canvas.getContext('2d');
      
      colors = [
        color0,
        colorX,
        colorY,
        multiplyColors(colorX, colorY)
      ];
      
      drawCanvas();
    }

    
    onMount(() => {
      showLegend()
        drawLineWithArrows(margin.left, height + margin.top, width + margin.left, height + margin.top, 5, 9, false, true);
        drawLineWithArrows(margin.left, height + margin.top, margin.left, margin.top, 5, 9, false, true);
    });
    
    // const arrowExtension = 3;
    
    // return ctx;
</script>

<div class='canvasLegendContainer'>
  <canvas id='legend' bind:this={canvas} width={width+margin.left+margin.right} height={height + margin.top + margin.bottom} />
  <caption class='legendText'>{xTitle}</caption>
  <caption class='legendText'>{yTitle}</caption>
</div>
