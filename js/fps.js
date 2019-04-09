const times = [];
let fps;
let el = document.querySelector("#fps");

function refreshLoop() {

    window.requestAnimationFrame(() => {
        const now = performance.now();
        while (times.length > 0 && times[0] <= now - 1000) {
            times.shift();
        }
        times.push(now);
        fps = times.length;
        el.innerHTML = "FPS: " + fps;
        refreshLoop();
    });

}
refreshLoop();