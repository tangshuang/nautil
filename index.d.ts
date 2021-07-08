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

type AnyObj = { [key: string]: any };
type Proxy = AnyObj;

interface OverrideProps {
  stylesheet?: string[] | AnyObj[];
  props?: AnyObj;
  deprecated?: string[];
}

export declare class Component<T = AnyObj> extends ReactComponent<T> {
  $state: Proxy;
  $attrs: Proxy;
  state: AnyObj;
  attrs: AnyObj;
  style: AnyObj;
  className: string | undefined;
  children: ReactChildren;
  css: { [key: string]: AnyObj };

  subscribe(name: string, affect: (stream: Stream) => Stream): Component;
  unsubscribe(name: string, affect: (stream: Stream) => Stream): Component;
  dispatch(name: string, data: AnyObj): Component;
  update(): Promise<undefined>;
  update(force: true): Promise<undefined>;
  update(value: AnyObj): Promise<undefined>;
  update(key: string, value: AnyObj): Promise<undefined>;
  update(fn: <T>(state: T) => (void | T)): Promise<undefined>;
  weakUpdate(): Promise<undefined>;
  forceUpdate(): Promise<undefined>;
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

  static extend(props: OverrideProps | ((nextProps: AnyObj) => OverrideProps)): Component;
  static props: AnyObj | (() => AnyObj);
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

export declare function useModelsReactor<T>(models: any[], compute: (...args: any[]) => T, ...args: any[]): T;

export declare function useShallowLatest(obj: any): any;

export declare function useForceUpdate(): Function;

interface ComponentGenerator {
  (C: Component): Component;
}

export declare function observe(subscription: string | Function | { subscribe: Function }, unsubscription: string | Function | { unsubscribe: Function }): ComponentGenerator;

export declare function evolve(collect: (nextprops: AnyObj) => AnyObj): ComponentGenerator;

export declare function inject(prop: string, define: (props: AnyObj) => AnyObj): ComponentGenerator;

export declare function pollute(component: Component, pollute: AnyObj | ((props: AnyObj) => AnyObj)): ComponentGenerator;

export declare function hoc(HOC: Component, fields: string[], renderProp?: string): ComponentGenerator;

interface Constructor<T> {
  new (...args: T[]);
}

export declare function initialize<T>(prop: string, Constructor: Constructor<T>, ...args: T[]): ComponentGenerator;

export declare function nest(...args: [Component, AnyObj][]): ComponentGenerator;

export declare function pipe(wrappers: ((C: Component) => ComponentGenerator)[]): ComponentGenerator;

interface AsyncProps extends AnyObj {
  await: () => Promise<any>;
  then?: (data: any) => ReactElement | null;
  cacth?: (error: Error) => ReactElement | null;
  pendding?: ReactElement;
}
export declare class Async extends Component<AsyncProps> {}

interface ForProps extends AnyObj {
  start: number;
  end: number;
  step?: number;
  map?: (i: number) => any;
  render?: (data: any) => ReactElement | null;
}
export declare class For extends Component<ForProps> {}

interface EachProps extends AnyObj {
  of: any[] | AnyObj;
  map?: (obj: any[] | AnyObj) => any[] | AnyObj;
  render?: (obj: any[] | AnyObj) => ReactElement | null;
}
export declare class Each extends Component<EachProps> {}

interface IfProps extends AnyObj {
  is: boolean;
  render?: () => ReactElement | null;
}
export declare class If extends Component<IfProps> {}

interface ElseProps extends AnyObj {
  render?: () => ReactElement | null;
}
export declare class Else extends Component<ElseProps> {}

export declare class ElseIf extends Component<IfProps> {}

interface ObserverProps extends AnyObj {
  subscribe: (dispatch: Function) => Function | void;
  unsubscribe?: (dispatch: Function) => void;
  render?: () => ReactElement | null;
}
export declare class Observer extends Component<ObserverProps> {}

interface PrepareProps extends AnyObj {
  ready: Boolean;
  pending: ReactElement;
  render?: () => ReactElement;
}
export declare class Prepare extends Component<PrepareProps> {}

interface StaticProps extends AnyObj {
  shouldUpdate: () => boolean;
  render?: () => ReactElement;
}
export declare class Static extends Component<StaticProps> {}

interface SwitchProps extends AnyObj {
  of: any;
}
export declare class Switch extends Component<SwitchProps> {}

interface CaseProps extends AnyObj {
  is: any;
  default?: boolean;
  break?: boolean;
  render?: () => ReactElement;
}
export declare class Case extends Component<CaseProps> {}

type Handler = Function | Stream | Function[];
interface SectionProps extends AnyObj {
  onHit?: Handler;
  onHitStart?: Handler;
  onHitMove?: Handler;
  onHitEnd?: Handler;
  onHitCancel?: Handler;
  onHitOutside?: Handler;
}
export declare class Section extends Component<SectionProps> {}

export declare class Text extends Component {}

interface ButtonProps extends AnyObj {
  type?: string;
  onHit?: Handler;
  onHitStart?: Handler;
  onHitEnd?: Handler;
}
export declare class Button extends Component<ButtonProps> {}

interface LineProps extends AnyObj {
  width?: number | `${number}%`;
  thick?: number;
  color?: string;
}
export declare class Line extends Component<LineProps> {}

interface FormProps extends AnyObj {
  onChange?: Handler;
  onReset?: Handler;
  onSubmit?: Handler;
}
export declare class Form extends Component<FormProps> {}

interface SelectProps extends AnyObj {
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

interface CheckItemProps extends AnyObj {
  chekced?: boolean;
  onChange?: Handler;
  onCheck?: Handler;
  onUncheck?: Handler;
}
export declare class Checkbox extends Component<CheckItemProps> {}
export declare class Radio extends Component<CheckItemProps> {}

interface InputProps extends AnyObj {
  type: 'text' | 'number' | 'email' | 'tel' | 'url';
  placeholder?: string;
  value: string | number;
  onChange?: Handler;
  onFocus?: Handler;
  onBlur?: Handler;
  onSelect?: Handler;
}
export declare class Input extends Component<InputProps> {}

interface TextareaProps extends AnyObj {
  value: string,
  line: number,
  placeholder?: string,
  onChange?: Handler,
  onFocus?: Handler,
  onBlur?: Handler,
  onSelect?: Handler,
}
export declare class Textarea extends Component<TextareaProps> {}

interface ImageProps extends AnyObj {
  source: string | { uri: string };
  width: string | number;
  height: string | number;
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
  path: '/' | `/${string}`;
  redirect?: '/' | `/${string}`;
  component?: Component | ((props: AnyObj) => ReactElement) | null;
  onEnter?: () => void;
  onLeave?: () => void;
}
interface NavigationOptions {
  maxHistoryLength?: number;
  mode?: '/' | `/${string}` | `#?${string}` | '#' | `#${string}` | `?${string}` | 'storage';
  defaultRoute?: string;
  onNotFound?: () => void;
  routes: NavigationRoute[];
}
interface NavigationState {
  name: string;
  path: `/${string}`;
  params: AnyObj;
  route: NavigationRoute;
}
export enum NavigationStatus {
  Inactive = -1,
  NotFound = 0,
  Ok = 1,
}
export declare class Navigation {
  constructor(options: NavigationOptions);

  state: NavigationState;
  status: NavigationStatus;

  is(match: string | RegExp | Function, exact?: boolean): boolean;
  on(match: string | RegExp | Function, callback: Function, exact?: boolean): Navigation;
  off(match: string | RegExp | Function, callback: Function): Navigation;
  go(name: string, params: AnyObj, replace?: boolean): void;
  open(url: string, params: AnyObj): void;
  back(count: number): void;
  push(state: NavigationState, changeLocation?: boolean): void;
  replace(state: NavigationState, changeLocation?: boolean): void;
  makeUrl(to: string, params: AnyObj): string;
  changeLocation(nextState: NavigationState, replace?: boolean): void;

  static defaultOptions: NavigationOptions;
}

interface NavigatorProps extends AnyObj {
  navigation?: Navigation;
  dispatch?: Function;
  inside?: boolean;
}
export declare class Navigator extends Component<NavigatorProps> {}

interface RouteProps extends AnyObj {
  navigation?: Navigation;
  match: string | RegExp | Function;
  exact?: boolean;
  animation?: number;
}
export declare class Route extends Component<RouteProps> {}

interface LinkProps extends AnyObj {
  navigation?: Navigation;
  to: string | number;
  params?: AnyObj;
  replace?: boolean;
  open?: boolean;
}
export declare class Link extends Component<LinkProps> {}

interface NavigateProps extends AnyObj {
  navigation?: Navigation;
  map?: (navigation: Navigation) => AnyObj;
  render?: (data: AnyObj) => ReactElement | null;
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

interface ConsumerProps extends AnyObj {
  store: Store;
  map?: (store: Store) => AnyObj;
  watch?: string | string[];
  render?: (data: AnyObj | Store) => ReactElement | null;
}
export declare class Consumer extends Component<ConsumerProps> {}

export declare function connect(mapToProps: (store: Store) => AnyObj, watch: string | string[]): ComponentGenerator;

export declare function useStore(store: Store, watch: string | string[]): Store;

export declare function applyStore(store: Store): {
  useStore: (store: Store, watch: string | string[]) => Store,
  connect: (mapToProps: (store: Store) => AnyObj, watch: string | string[]) => ComponentGenerator,
};

export declare function createStream(fn: (stream: Stream) => Stream): Stream;

interface ValidatorOptions {
  determine?: boolean | ((value: any) => boolean);
  validate: (value: any, key: string) => boolean | Error;
  message: string;
  break?: boolean;
  async?: boolean;
}
export declare class Validator {
  constructor(options: ValidatorOptions);
  static readonly required: (message: string, emptyFn: Function) => Validator;
  static readonly maxLen: (len: number, message: string) => Validator;
  static readonly minLen: (len: number, message: string) => Validator;
  static readonly integer: (len: number, message: string) => Validator;
  static readonly decimal: (len: number, message: string) => Validator;
  static readonly max: (num: number, message: string) => Validator;
  static readonly min: (num: number, message: string) => Validator;
  static readonly email: (message: string) => Validator;
  static readonly url: (message: string) => Validator;
  static readonly date: (message: string) => Validator;
  static readonly match: (validator: RegExp | string | number | boolean | Function | any, message: string) => Validator;
  static readonly allOf: (validators: (Function & ThisType<Model>)[], message: string) => Validator;
  static readonly anyOf: (validators: (Function & ThisType<Model>)[], message: string) => Validator;
}

interface MetaOptions {
  default: any;
  compute?: () => any;
  type?: any;
  message?: string;
  force?: boolean;
  validators?: ValidatorOptions[];
  create?: (value: any, key: string, data: AnyObj) => any;
  save?: (value: any, key: string, data: AnyObj) => AnyObj | any;
  asset?: string;
  drop?: (value: any, key: string, data: AnyObj) => boolean;
  map?: (value: any, key: string, data: AnyObj) => any;
  flat?: (value: any, key: string, data: AnyObj) => AnyObj;
  to?: string;
  setter?: (value: any, key: string) => any;
  getter?: (value: any, key: string) => any;
  formatter?: (value: any, key: string) => any;
  readonly?: boolean | ((value: any, key: string) => boolean);
  disabled?: boolean | ((value: any, key: string) => boolean);
  hidden?: boolean | ((value: any, key: string) => boolean);
  required?: boolean | ((value: any, key: string) => boolean);
  empty: (value: any, key: string) => boolean;
  watch: (e: { value: any }) => void;
  state: () => AnyObj;
  deps: () => { [key: string]: Meta };
  catch: (error: Error) => void;
  [key: string]: any;
}
export declare class Meta {
  constructor(options: MetaOptions);
}

interface View {
  key: string;
  value: any;
  data: any;
  text: string;
  state: AnyObj;
  absKeyPath: string[];
  errors: any[];
  empty: boolean;
  readonly: boolean;
  disabled: boolean;
  hidden: boolean;
  required: boolean;
}

export declare class Model {
  constructor(data: AnyObj, parent: [Model, string]);

  $views: {
    $changed: boolean,
    readonly $errors: any[],
    readonly $state: AnyObj,
  } & {
    readonly [key: string]: View,
  };

  $root: Model | null;
  $parent: Model | null;
  $keyPath: string[];
  $absKeyPath: string[];

  schema(Schema?: any): AnyObj;
  state(): AnyObj;
  attrs(): AnyObj;

  restore(data: AnyObj, keysPatchToThis: string[]): Model;
  get(keyPath: string | string[]): any;
  use(keyPath: string | string[]): View;
  set(keyPath: string | string[], next: any, force: boolean): Model;
  update(data: AnyObj): Model;
  reset(key: string): Model;
  define(key: string, value: Function | any): any;
  lock(): void;
  unlock(): void;
  setParent(parent: [Model, string]): Model;
  setAttr(key: string): (attr: string, value: any) => void & ThisType<Model>;

  watch(key: string, fn: (e: { target: string, key: string[], value: any, next: any, prev: any, active: any, invalid: any }) => void & ThisType<Model>): Model;
  unwatch(key: string, fn: Function): Model;

  fromJSON(data: AnyObj, keysPatchToThis: string[]): Model;
  fromJSONPatch(data: AnyObj, onlyKeys: string[]): Model;
  toJSON(): AnyObj;
  toData(): AnyObj;
  toParams(determine: (vale: any) => boolean): AnyObj;
  toFormData(determine: (vale: any) => boolean): FormData;
  validate(key: string): Error[] | any[];
  validateAsync(key: string): Promise<Error[] | any[]>;

  on(hook: string, fn: Function): Model;
  off(hook: string, fn: Function): Model;
  emit(hook: string, ...args: any[]): void;

  toEdit(next: AnyObj): Model;
  reflect<T>(Meta: Meta, fn: (key: string) => T & ThisType<Model>): View | T;

  onInit(): void;
  onSwitch(params: AnyObj): AnyObj;
  onParse(data: AnyObj): AnyObj;
  onRecord(data: AnyObj): AnyObj;
  onExport(data: AnyObj): AnyObj;
  onCheck(): void;
  onError(): void;
  onEnsure(): void;
  onRestore(): void;
  onRegress(): void;
  onChange(key: string): void;
  onEdit(): void;

  static extend(next: AnyObj): Model;
  static toEdit: Model;
}

export declare function AsyncGetter(defaultValue: any, getter: Function): {
  $$type: 'asyncRef',
  [key: string]: any;
};

export declare class Factory {
  entry(entries: Model | Model[]): Model | Model[];
  instance(model: Model, ctx: Model): Model;
  default(fn: Function): Function;
  type(type: any): any;
  validators(validators: Validator[]): Validator[];
  create(fn: (value: any, key: string) => any | any[]): (value: any, key: string) => any | any[];
  save(fn: (value: any, key: string) => any | any[]): (value: any, key: string) => any | any[];
  map(fn: (value: any, key: string) => any | any[]): (value: any, key: string) => any | any[];
  setter(fn: (value: any, key: string) => any | any[]): (value: any, key: string) => any | any[];
  getMeta(): Meta;
  static useAttrs(Model: Model, attrs: [string, string, Function][]): Model;
  static getMeta(entries: Model | Model[]): Meta;
}

export declare class Service {
  new(): Service;
  destroy(): void;

  static getService(): Service;
}

export declare class Controller {
  constructor();

  update(): void;

  turn(component: Component, collect: (nextprops: AnyObj) => AnyObj): Component | {
    $$type: 'turner',
    component: Component,
    collect: (nextprops: AnyObj) => AnyObj,
  };

  onStart(): void;
  onUpdate(): void;
  onEnd(): void;
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
  push(defer: Function, callback?: Function, fallback?: Function, cancel?: Function): Promise<any>;
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
  static getItem(key: string): Promise<any>;
  static setItem(key: string, value: any): Promise<undefined>;
  static delItem(key: string): Promise<undefined>;
  static clear(): Promise<undefined>;
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

interface LanguageProps extends AnyObj {
  i18n?: I18n;
  dispatch?: Function,
  lng?: string;
}
export declare class Language extends Component<LanguageProps> {}

interface LocaleProps extends AnyObj {
  i18n?: I18n;
  map?(i18n: I18n): any;
  render?(data: any): ReactElement | null;
}
export declare class Locale extends Component<LocaleProps> {}

interface TProps extends AnyObj {
  i18n?: I18n;
  t?: string | ((i18n: I18n, children: ReactChildren) => string);
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
