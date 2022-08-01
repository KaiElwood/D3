<script>
    import { select, selectAll } from "d3-selection";
    import { axisBottom, axisLeft } from "d3-axis";
    // import { timeFormat } from "d3-time-format";
  
    export let innerHeight;
    export let padding;
    export let position;
    export let scale;
  
    let transform;
    let g;
  
    $: {
      select(g).selectAll("*").remove();
  
      let axis;
      switch (position) {
        case "bottom":
          axis = axisBottom(scale)
            .tickSizeOuter(0).ticks(4).tickFormat((d) => d.toString());
          transform = `translate(0, ${innerHeight})`;
          break;
        case "left":
          axis = axisLeft(scale).tickSizeOuter(0).ticks(5);
          transform = `translate(${padding.left}, 0)`;
      }
  
      select(g).call(axis);
    }
</script>

<g class="axis" bind:this={g} {transform} />
