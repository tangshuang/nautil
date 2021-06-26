import { Component } from "react";

export declare function registerApp(register: (context: any) => any): void;
export declare function registerPage(register: (context: any) => any, dataKey: string, C: Component, props?: any): void;
export declare function createBehavior(dataKey: string, C: Component, props?: any): any;
export declare function runApp(App: Component, regApp: (context: any) => any, regPage: (context: any) => any): (isApp: boolean) => void;
