# Module

Nautil applications follow a special Module system which split the applications to be modules and which are organized by these modules.

A single Module can be run, preview, debug independently, can be reused in different applications.

In this design, we design a distributed, nested and modular Router system. This Router system is a part of Module system, router code is together with a module not an application. A router can discriminate its position, so you do not need to worry about whether the module is nested in another module.

In this Module system, you should not think about the application, and should think about the module.
