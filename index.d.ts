declare module 'tyshemo';

import * as TySheMo from 'tyshemo';
import * as React from 'react';

import { Component as ReactComponent, ReactChildren, ErrorInfo, ReactElement } from 'react';

export { TySheMo, React };

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
} from 'react';

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
} from 'tyshemo';

export declare function produce<T>(fn: (data: T) => (T | void)): T;

export declare class Stream {
  constructor();
  subscribe(subscribe: (value?: any) => void): Function;
  dispatch(): void;
}

type AnyObj = { [key: string]?: any };

interface OverrideProps {
  stylesheet?: string[] | AnyObj[];
  props?: AnyObj;
  deprecated?: string[],
}

export declare class Component<T> extends ReactComponent<T> {
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

  static extend(props: OverrideProps | (nextProps: AnyObj) => OverrideProps): Component;
  static props: AnyObj | () => AnyObj;
  static defaultStylesheet: string[] | AnyObj[];
  static css: { [key: string]: AnyObj }
}

export declare function createTwoWayBinding(data: AnyObj, update?: (next: AnyObj, keyPath: Array<string | symbol>, value: any) => void): Proxy;

export declare function isShallowEqual(obj1: any, obj2: any, isEqual: (obj1: any, obj2: any) => boolean): boolean;

export declare function isRef(value: any): boolean;

export declare function noop(): void;

export declare function useTwoWayBinding(attrs: AnyObj): [AnyObj, Proxy];

export declare function useTwoWayBindingState(state: AnyObj): Proxy;

export declare function useUniqueKeys(items: any[]): string[];

export declare function useModelsReactor<T>(models: any[], compute: (...args: any[]) => T, ...args?: any[]): T;

export declare function useShallowLatest(obj: any): any;

interface ComponentGenerator {
  (C: Component) => Component;
}

export declare function observe(subscription: string | Function | { subscribe: Function }, unsubscription: string | Function | { unsubscribe: Function }): ComponentGenerator;

export declare function evolve(collect: (nextprops: AnyObj) => AnyObj): ComponentGenerator;

export declare function inject(prop: string, define: (props: AnyObj) => AnyObj): ComponentGenerator;

export declare function pollute(component: Component, pollute: AnyObj | (props: AnyObj) => AnyObj): ComponentGenerator;

interface Constructor<T> {
  new (...args: T[]);
}

export declare function initialize<T>(prop: string, Constructor: Constructor<T>, ...args: T[]): ComponentGenerator;

export declare function nest(...args: [Component, AnyObj][]): ComponentGenerator;

export declare function pipe(wrappers: ((C: Component) => ComponentGenerator)[]): ComponentGenerator;

interface AsyncProps {
  await(): Promise;
  then?(data: any): ReactElement | null;
  cacth?(error: Error): ReactElement | null;
  pendding?: ReactElement;
}
export declare class Async extends Component<AsyncProps> {}

interface ForProps {
  start: number;
  end: number;
  step?: number = 1;
  map?(i: number): any;
  render?(data: any): ReactElement | null;
}
export declare class For extends Component<ForProps> {}

interface EachProps {
  of: any[] | AnyObj;
  map?(obj: any[] | AnyObj): any[] | AnyObj;
  render?(obj: any[] | AnyObj): ReactElement | null;
}
export declare class Each extends Component<EachProps> {}

interface IfProps {
  is: boolean;
  render?(): ReactElement | null;
}
export declare class If extends Component<IfProps> {}

interface ElseProps {
  render?(): ReactElement | null;
}
export declare class Else extends Component<ElseProps> {}

export declare class ElseIf extends Component<IfProps> {}

interface ObserverProps {
  subscribe(dispatch: Function): Function | void;
  unsubscribe?(dispatch: Function): void;
  render?(): ReactElement | null;
}
export declare class Observer extends Component<ObserverProps> {}

interface PrepareProps {
  ready: Boolean;
  pending: ReactElement;
  render?(): ReactElement;
}
export declare class Prepare extends Component<PrepareProps> {}

interface StaticProps {
  shouldUpdate(): boolean;
  render?(): ReactElement;
}
export declare class Static extends Component<StaticProps> {}

interface SwitchProps {
  of: any;
}
export declare class Switch extends Component<SwitchProps> {}

interface CaseProps {
  is: any;
  default?: boolean;
  break?: boolean;
  render?(): ReactElement;
}
export declare class Case extends Component<CaseProps> {}

type Handler = Function | Stream | Function[];
interface SectionProps {
  onHit?: Handler;
  onHitStart?: Handler;
  onHitMove?: Handler;
  onHitEnd?: Handler;
  onHitCancel?: Handler;
  onHitOutside?: Handler;
}
export declare class Section extends Component<SectionProps> {}

export declare class Text extends Component {}

interface ButtonProps {
  type?: string;
  onHit?: Handler;
  onHitStart?: Handler;
  onHitEnd?: Handler;
}
export declare class Button extends Component<ButtonProps> {}

interface LineProps {
  width?: number | `${number}%` = '100%';
  thick?: number = 1;
  color?: string = '#888888';
}
export declare class Line extends Component<LineProps> {}

interface FormProps {
  onChange?: Handler;
  onReset?: Handler;
  onSubmit?: Handler;
}
export declare class Form extends Component<FormProps> {}

interface SelectProps {
  options: Array<{
    text: string;
    value: any;
    disabled?: boolean;
  }>;
  placeholder?: string;
  value?: any;
  onChange?: Handler;
}
export declare class Select extends Component<SelectProps> {}

interface CheckItemProps {
  chekced?: boolean = false;
  onChange?: Handler;
  onCheck?: Handler;
  onUncheck?: Handler;
}
export declare class Checkbox extends Component<CheckItemProps> {}
export declare class Radio extends Component<CheckItemProps> {}

interface InputProps {
  type: 'text' | 'number' | 'email' | 'tel' | 'url' = 'text';
  placeholder?: string;
  value: string | number;
  onChange?: Handler;
  onFocus?: Handler;
  onBlur?: Handler;
  onSelect?: Handler;
}
export declare class Input extends Component<InputProps> {}

interface TextareaProps {
  value: string,
  line: number = 3,
  placeholder?: string,
  onChange?: Handler,
  onFocus?: Handler,
  onBlur?: Handler,
  onSelect?: Handler,
}
export declare class Textarea extends Component<TextareaProps> {}

interface ImageProps {
  source: string | { uri: string };
  width: string | number = '100%';
  height: string | number = '100%';
  maxWidth?: string | number;
  maxHeight?: string | number;
  onLoad?: Handler;
}
export declare class Image extends Component<ImageProps> {}

export declare class Audio extends Component {}
export declare class Video extends Component {}
export declare class Webview extends Component {}

export declare class ListSection extends Component {}
export declare class ScrollSection extends Component {}
export declare class SwipeSection extends Component {}

interface NavigationRoute {
  name: string;
  path: `/${string?}`;
  redirect?: `/${string?}`;
  component?: Component | (props: AnyObj) => ReactElement | null;
  onEnter?(): void;
  onLeave?(): void;
}
interface NavigationOptions {
  maxHistoryLength?: number = 20;
  mode?: `/${string?}` | `#?${string}` | `#${string?}` | `?${string}` | 'storage';
  defaultRoute?: string;
  onNotFound?(): void;
  routes: NavigationRoute[];
}
interface NavigationState {
  name: string;
  path: `/${string}`;
  params: AnyObj;
  route: NavigationRoute;
}
export enum NavigationStatus {
  Inactive = -1;
  NotFound = 0;
  Ok = 1;
}
export declare class Navigation {
  constructor(options: NamespaceOptions);

  state: NavigationState;
  status: NavigationStatus;

  is(match: string | RegExp | Function, exact?: boolean = false): boolean;
  on(match: string | RegExp | Function, callback: Function, exact?: boolean = false): Navigation;
  off(match: string | RegExp | Function, callback: Function): Navigation;
  go(name: string, params: AnyObj, replace?: boolean = false): void;
  open(url: string, params: AnyObj): void;
  back(count: number = -1): void;
  push(state: NavigationState, changeLocation?: boolean = true): void;
  replace(state: NavigationState, changeLocation?: boolean = true): void;
  makeUrl(to: string, params: AnyObj): string;
  changeLocation(nextState: NavigationState, replace?: boolean = false): void;

  static defaultOptions: NavigationOptions;
}

interface NavigatorProps {
  navigation?: Navigation;
  dispatch?: Function;
  inside?: boolean = false;
}
export declare class Navigator extends Component<NavigatorProps> {}

interface RouteProps {
  navigation?: Navigation;
  match: string | RegExp | Function;
  exact?: boolean;
  animation?: number;
}
export declare class Route extends Component<RouteProps> {}

interface LinkProps {
  navigation?: Navigation;
  to: string | number;
  params?: AnyObj = {};
  replace?: boolean = false;
  open?: boolean = false;
}
export declare class Link extends Component<LinkProps> {}

interface NavigateProps {
  navigation?: Navigation;
  map?(navigation: Navigation): AnyObj;
  render?(data: AnyObj): ReactElement | null;
}
export declare class Navigate extends Component<NavigateProps> {}

export declare class Store {
  constructor(initState: AnyObj);

  state: AnyObj;

  dispatch(update: AnyObj): void;
  dispatch(update: (prevState: AnyObj) => (AnyObj | void)): void;
  getState(): AnyObj;
  resetState(): void;
  setState(state: AnyObj): void;
  subscribe(callback: (next: AnyObj, prev: AnyObj) => void): void;
  unsubscribe(callback: Function): void;
}

export declare class Provider extends Component<{ store: Store }> {}

interface ConsumerProps {
  store: Store;
  map?(store: Store): AnyObj;
  watch?: string | string[];
  render?(data: AnyObj | Store): ReactElement | null;
}
export declare class Consumer extends Component<ConsumerProps> {}

export declare function connect(mapToProps: (store: Store) => AnyObj, watch: string | string[]): ComponentGenerator;

export declare function useStore(store: Store, watch: string | string[]): Store;

export declare function applyStore(store: Store): {
  useStore(store: Store, watch: string | string[]): Store;
  connect(mapToProps: (store: Store) => AnyObj, watch: string | string[]): ComponentGenerator;
};

export declare function createStream(fn: (stream: Stream) => Stream): Stream;

export declare class Service {
  [stream$: `${string}$`]: Stream;
  [key: string]: Model | Service;

  new(): Service;
  destroy(): void;

  static [stream$: `${string}$`](stream: Stream): void;
  static [key: string]: Model | Service;

  static getService(): Service;
}

export declare class Controller {
  constructor();

  [stream$: `${string}$`]: Stream;
  [key: string]: Store | Model | Service;

  update(): void;

  turn(component: Component, collect: (nextprops: AnyObj) => AnyObj): Component | {
    $$type: 'turner',
    component: Component,
    collect: (nextprops: AnyObj) => AnyObj,
  };

  onStart(): void;
  onUpdate(): void;
  onEnd(): void;

  static [stream$: `${string}$`](stream: Stream): void;
  static [key: string]: Store | Model | Service;
}

interface Source {
  $$type: symbol;
  [key: string]: any;
}
export declare class DataService extends Service {
  source(get: () => any, value: any): Source;
  compose(get: () => any): Source;
  query(source: Source, ...params: any[]): [any, Function];

  subscribe(fn: (source: Source, params: any[], value: any) => void): void;
  unsubscribe(fn: Function): void;

  setup(run: Function): Function;

  affect(invoke: Function, deps?: any[]): void;
  select(compute: Function, deps: any[]): any;
  apply(get: Function, value: any): Function;
  ref(value: any): { value: any };
}

export declare class QueueService extends Service {
  options(): AnyObj;
  push(defer: Function, callback?: Function, fallback?: Function, cancel?: Function): Promise;
  stop(err?: Error): QueueService;
  clear(): QueueService;
  cancel(defer: Function): QueueService;
  end(): QueueService;
  start(): QueueService;
  destroy(): void;

  on(type: string, fn: (err: Error) => void): QueueService;
  off(type: string, fn: (err: Error) => void): QueueService;
}

export declare class SerialQueueService extends QueueService {}
export declare class ParallelQueueService extends QueueService {}
export declare class ShiftQueueService extends QueueService {}
export declare class SwitchQueueService extends QueueService {}

export declare class Storage {
  static async getItem(key: string): any;
  static async setItem(key: string, value: any): void;
  static async delItem(key: string): void;
  static async clear(): void;
}

interface I18nOptions {
  use?: any[];
  [key: string]: any;
}
export declare class I18n {
  constructor(options: I18nOptions);
  setLang(lang): any;
  getLang(): string;
  on(key: string, fn: Function): I18n;
  off(key: string, fn: Function): I18n;
  has(key: string, params: AnyObj): boolean;
  t(key: string | string[], params: AnyObj): string;
  text(key: string | string[], params: AnyObj): string;
  number(num: number, options?: any): string;
  date(date: Date, options?: any): string;
  currency(num: number, currency: string, options?: any): string;
}

interface LanguageProps {
  i18n?: I18n;
  dispatch?: Function,
  lng?: string;
}
export declare class Language extends Component<LanguageProps> {}

interface LocaleProps {
  i18n?: I18n;
  map?(i18n: I18n): any;
  render?(data: any): ReactElement | null;
}
export declare class Locale extends Component<LocaleProps> {}

interface TProps {
  i18n?: I18n;
  t?: string | (i18n: I18n, children: ReactChildren) => string;
  s?: string;
}
export declare class T extends Component<TProps> {}

export declare class LanguageDetector {
  getDetector(): AnyObj;
}

interface AppOptions {
  navigation: Navigation;
  store?: Store;
  i18n?: I18n;
}
export declare function createApp(options: AppOptions): Component;

export declare function createAsyncComponent(fn: () => Promise<{ [Symbol.toStringTag]: 'Module', default: Component } | Component>): Component;
