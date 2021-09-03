import * as React from "react";
import * as ReactDOM from "react-dom";
import {HelloWorldWidget} from "@local/module-1";

console.log("hello")

export const render1 = () => {
    const n = document.querySelector("#app");
    ReactDOM.render(<HelloWorldWidget />,n);
}
render1();