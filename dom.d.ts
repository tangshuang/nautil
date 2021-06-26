import { Component, DOMElement, ReactElement } from "react";

export declare function mount(el: string | DOMElement, C: Component, props?: any): any;

export declare function unmount(el: string | DOMElement): any;

export declare function update(el: string | DOMElement, C: Component, props?: any): any;

export declare function render(el: string | DOMElement, vdom: ReactElement): any;
