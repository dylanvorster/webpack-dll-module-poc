import * as React from "react";
import * as ReactDOM from "react-dom";
import {render1} from "@local/module-2";
const render2 = () => {
    const n = document.querySelector("#app2");
    ReactDOM.render(<div>Hello world 2</div>,n)
}

window.addEventListener('DOMContentLoaded', (event) => {
    render1();
    render2();
});