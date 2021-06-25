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
  subscribe(subscribe: (value?: any) => void): Function;
}

type AnyObj = { [key: string]: any }

export class Component extends ReactComponent {
  $state: Proxy;
  $attrs: Proxy;
  style: AnyObj;
  className: string | undefined;
  children: ReactChildren;
  css: { [key: string]: AnyObj };

  subscribe(name: string, affect: (stream: Stream) => Stream): Component;
  unsubscribe(name: string, affect: (stream: Stream) => Stream): Component;
  dispatch(name: string, data: AnyObj): Component;
  update(): Promise;
  update(force: true): Promise;
  update(value: AnyObj): Promise;
  update(key: string, value: AnyObj): Promise;
  update(fn: <T>(state: T) => (void | T)): Promise;
  weakUpdate(): Promise;
  forceUpdate(): Promise;
  nextTick(fn: () => void, ...args: any[]): void;

  onInit(): void;
  onMounted(): void;
  shouldUpdate(nextProps: AnyObj, nextState: AnyObj): boolean;
  onNotUpdate(nextProps: AnyObj, nextState: AnyObj): void;
  onUpdated(prevProps: AnyObj, prevState: AnyObj): void;
  onUnmount(): void;
  onCatch(error: ErrorInfo): void;
  onDigested(): void;
  onAffected(): void;
  onParseProps<T>(props: T): T;

  static extend(props: AnyObj): Component;
}
