declare module 'tyshemo'
declare module 'immer'
declare module 'rxjs'
declare module 'ts-fns'

import type { Component as ReactComponent, ReactChildren, ErrorInfo } from 'react'

export {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  Fragment,
  createElement,
  cloneElement,
  Children,
  createRef,
  isValidElement,
  PureComponent,
  createContext,
  Suspense,
  lazy,
} from 'react'

export {
  Ty,
  Dict,
  Tuple,
  List,
  Enum,
  Range,
  Mapping,
  SelfRef,
  ifexist,
  nonable,
  Any,
  None,
  Numeric,
  Int,
  Float,
  Zero,
} from 'tyshemo'

export interface produce<T> {
  (fn: (data: T) => (T | void)): T;
}

interface Stream {
  subscribe(subscribe: (value: any) => void): Function;
}

export interface Component extends ReactComponent {
  $state: Proxy;
  $attrs: Proxy;
  style: object;
  className: string | undefined;
  children: ReactChildren;
  css: { [key: string]: object };

  subscribe(name: string, affect: (stream: Stream) => Stream): Component;
  unsubscribe(name: string, affect: (stream: Stream) => Stream): Component;
  dispatch(name: string, data: any): Component;
  update(): Promise;
  update(force: true): Promise;
  update(value: object): Promise;
  update(key: string, value: any): Promise;
  update(fn: <T>(state: T) => (void | T)): Promise;
  weakUpdate(): Promise;
  forceUpdate(): Promise;
  nextTick(fn: () => void, ...args: any[]): void;

  onInit(): void;
  onMounted(): void;
  shouldUpdate(): boolean;
  onNotUpdate(): void;
  onUpdated(): void;
  onUnmount(): void;
  onCatch(error: ErrorInfo): void;
  onDigested(): void;
  onAffected(): void;
  onParseProps<T>(props: T): T;

  static extend(props: object): Component;
}
