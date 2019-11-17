// https://github.com/spring-media/react-shadow-dom-retarget-events/blob/master/index.js

const reactEvents = [
  "onAbort", "onError", "onLoad", "onLoadEnd", "onLoadStart",
  "onAnimationCancel", "onAnimationEnd", "onAnimationIteration",
  "onAuxClick", "onChange", "onClick", "onClose", "onContextMenu", "onDoubleClick",
  "onFocus", "onFocusOut", "onBlur",
  "onInput", "onKeyDown", "onKeyPress", "onKeyUp",
  "onMouseDown", "onMouseMove", "onMouseOut", "onMouseOver", "onMouseUp",
  "onLostPointerCapture", "onGotPointerCapture", "onPointerCancel", "onPointerDown", "onPointerEnter", "onPointerLeave", "onPointerMove", "onPointerOut", "onPointerOver", "onPointerUp",
  "onReset", "onResize", "onScroll",
  "onSelect", "onSelectionChange", "onSelectStart",
  "onSubmit",
  "onTouchCancel", "onTouchMove", "onTouchStart", "onTouchEnd",
  "onTransitionCancel", "onTransitionEnd",
  "onDrag", "onDragEnd", "onDragEnter", "onDragExit", "onDragLeave", "onDragOver", "onDragStart", "onDrop",
];

const divergentNativeEvents = {
    onDoubleClick: 'dblclick'
};

const mimickedReactEvents = {
    onInput: 'onChange',
    onFocusOut: 'onBlur',
    onSelectionChange: 'onSelect'
};

const captureEvents = [
    'scroll',
    'focus',
    'blur',
]

export default function retargetEvents(shadowRoot) {
    var removeEventListeners = [];

    reactEvents.forEach(function (reactEventName) {

        var nativeEventName = getNativeEventName(reactEventName);

        function retargetEvent(event) {

            var path = event.path || (event.composedPath && event.composedPath()) || composedPath(event.target);

            for (var i = 0; i < path.length; i++) {

                var el = path[i];
                var reactComponent = findReactComponent(el);
                var props = findReactProps(reactComponent);

                if (reactComponent && props) {
                    dispatchEvent(event, reactEventName, props);
                }

                if (reactComponent && props && mimickedReactEvents[reactEventName]) {
                    dispatchEvent(event, mimickedReactEvents[reactEventName], props);
                }

                if (event.cancelBubble) {
                    break;
                }

                if (el === shadowRoot) {
                    break;
                }
            }
        }

        shadowRoot.addEventListener(nativeEventName, retargetEvent, {
            capture: captureEvents.includes(nativeEventName),
            passive: true,
        });

        removeEventListeners.push(function () {
            shadowRoot.removeEventListener(nativeEventName, retargetEvent);
        })
    });

    return function () {

      removeEventListeners.forEach(function (removeEventListener) {

        removeEventListener();
      });
    };
};

function findReactComponent(item) {
    for (var key in item) {
        if (item.hasOwnProperty(key) && key.indexOf('_reactInternal') !== -1) {
            return item[key];
        }
    }
}

function findReactProps(component) {
    if (!component) return undefined;
    if (component.memoizedProps) return component.memoizedProps; // React 16 Fiber
    if (component._currentElement && component._currentElement.props) return component._currentElement.props; // React <=15

}

function dispatchEvent(event, eventType, componentProps) {
    event.persist = function() {
        event.isPersistent = function(){ return true};
    };

    if (componentProps[eventType]) {
        componentProps[eventType](event);
    }
}

function getNativeEventName(reactEventName) {
    if (divergentNativeEvents[reactEventName]) {
        return divergentNativeEvents[reactEventName];
    }
    return reactEventName.replace(/^on/, '').toLowerCase();
}

function composedPath(el) {
  var path = [];
  while (el) {
    path.push(el);
    if (el.tagName === 'HTML') {
      path.push(document);
      path.push(window);
      return path;
    }
    el = el.parentElement;
  }
}
