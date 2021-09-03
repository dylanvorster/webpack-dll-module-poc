import * as React from "react";
import * as ReactDOM from "react-dom";
import {render1} from "@local/module-2";
const render2 = () => {
    const n = document.querySelector("#app");
    ReactDOM.render(<div>Hello world 2</div>,n)
}

document.onload=() => {
    render1();
    render2();
}