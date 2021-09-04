import * as React from "react";
import * as ReactDOM from "react-dom";
import {HelloWorldWidget} from "@local/module-1";

export const render1 = () => {
    const n = document.querySelector("#app1");
    ReactDOM.render(<HelloWorldWidget />,n);
}