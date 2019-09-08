// https://github.com/react-component/m-pull-to-refresh

import { Component } from '../core/component.js'
import Static from '../core-components/static.jsx'
import Section from '../components/section.jsx'

const isWebView = typeof navigator !== 'undefined' && /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
const DOWN = 'down'
const UP = 'up'
const INDICATOR = {
  activate: 'release',
  deactivate: 'pull',
  release: 'loading',
  finish: 'finish',
}

export class PullToRefresh extends Component {
  static defaultProps = {
    direction: DOWN,
    distance: 25,
    damping: 100,
    indicator: INDICATOR,
  }

  constructor(props) {
    super(props)

    this.state = {
      status: 'deactivate',
      dragOnEdge: false,
    }

    this.containerRef = null
    this.contentRef = null

    this._to = null
    this._currentY = 0
    this._startY = 0
    this._latestY = 0
    this._timer = null
    this._isMounted = false

    this.shouldUpdateChildren = false;
  }

  shouldComponentUpdate(nextProps) {
    this.shouldUpdateChildren = this.props.children !== nextProps.children
    return true
  }

  componentDidUpdate(prevProps) {
    if (prevProps === this.props || prevProps.refreshing === this.props.refreshing) {
      return
    }
    this.triggerPullToRefresh()
  }

  componentDidMount() {
    // `getScrollContainer` most likely return React.Node at the next tick. Need setTimeout
    setTimeout(() => {
      this.init()
      this.triggerPullToRefresh()
      this._isMounted = true
    })
  }

  componentWillUnmount() {
    // Should have no setTimeout here!
    this.destroy()
  }

  triggerPullToRefresh = () => {
    // 在初始化时、用代码 自动 触发 pullToRefresh
    // 注意：当 direction 为 up 时，当 visible length < content length 时、则看不到效果
    // 添加this._isMounted的判断，否则组建一实例化，status就会是finish
    if (!this.state.dragOnEdge && this._isMounted) {
      if (this.props.refreshing) {
        if (this.props.direction === UP) {
          this._latestY = - this.props.distance - 1
        }
        if (this.props.direction === DOWN) {
          this._latestY = this.props.distance + 1
        }
        // change dom need after setState
        this.setState({ status: 'release' }, () => {
          this.setContentY(this._latestY)
        })
      }
      else {
        this.setState({ status: 'finish' }, () => {
          this.reset()
        })
      }
    }
  }

  init() {
    const { containerRef } = this
    if (!containerRef) {
      // like return in destroy fn ???!!
      return;
    }

    this._to = {
      touchstart: this.onTouchStart,
      touchmove: this.onTouchMove,
      touchend: this.onTouchEnd,
      touchcancel: this.onTouchEnd,
    }

    Object.keys(this._to).forEach((key) => {
      containerRef.addEventListener(key, this._to[key], { passive: false })
    })
  }

  destroy() {
    const { containerRef, _to } = this
    if (!_to || !containerRef) {
      // componentWillUnmount fire before componentDidMount, like forceUpdate ???!!
      return
    }

    Object.keys(this._to).forEach(key => {
      containerRef.removeEventListener(key, this._to[key])
    })
  }

  onTouchStart(e) {
    this._currentY = this._startY = e.touches[0].clientY
    // 一开始 refreshing 为 true 时 this._latestY 有值
    this._latestY = this._latestY || 0
  }

  onTouchMove(e) {
    // 使用 pageY 对比有问题
    const _currentY = e.touches[0].screenY;
    const { direction } = this.props;

    // 拖动方向不符合的不处理
    if (direction === UP && this._startY < _currentY ||
      direction === DOWN && this._startY > _currentY) {
      return;
    }

    if (this.isEdge(ele, direction)) {
      if (!this.state.dragOnEdge) {
        // 当用户开始往上滑的时候isEdge还是false的话，会导致this._currentY不是想要的，只有当isEdge为true时，再上滑，才有意义
        // 下面这行代码解决了上面这个问题
        this._currentY = this._startY = e.touches[0].screenY;

        this.setState({ dragOnEdge: true });
      }
      e.preventDefault();
      // add stopPropagation with fastclick will trigger content onClick event. why?
      // ref https://github.com/ant-design/ant-design-mobile/issues/2141
      // e.stopPropagation();

      const _diff = Math.round(_currentY - this._currentY);
      this._currentY = _currentY;
      this._latestY += this.damping(_diff);

      this.setContentY(this._latestY);

      if (Math.abs(this._latestY) < this.props.distance) {
        if (this.state.status !== 'deactivate') {
          // console.log('back to the distance');
          this.setState({ status: 'deactivate' });
        }
      } else {
        if (this.state.status === 'deactivate') {
          // console.log('reach to the distance');
          this.setState({ status: 'activate' });
        }
      }

      // https://github.com/ant-design/ant-design-mobile/issues/573#issuecomment-339560829
      // iOS UIWebView issue, It seems no problem in WKWebView
      if (isWebView && e.changedTouches[0].clientY < 0) {
        this.onTouchEnd();
      }
    }
  }

  onTouchEnd() {
    if (this.state.dragOnEdge) {
      this.setState({ dragOnEdge: false });
    }
    if (this.state.status === 'activate') {
      this.setState({ status: 'release' });
      this._timer = setTimeout(() => {
        if (!this.props.refreshing) {
          this.setState({ status: 'finish' }, () => this.reset());
        }
        this._timer = undefined;
      }, 1000);
      this.props.onRefresh();
    } else {
      this.reset();
    }
  }

  isEdge(direction) {
    const { containerRef } = this
    if (direction === UP) {
      return containerRef.scrollHeight - containerRef.scrollTop === containerRef.clientHeight;
    }
    if (direction === DOWN) {
      return containerRef.scrollTop <= 0;
    }
  }

  damping(dy) {
    if (Math.abs(this._latestY) > this.props.damping) {
      return 0
    }

    const ratio = Math.abs(this._currentY - this._startY) / window.clientHeight
    dy *= (1 - ratio) * 0.6

    return dy
  }

  reset() {
    this._latestY = 0;
    this.setContentY(0);
  }

  setContentY(ty) {
    // todos: Why sometimes do not have `this.contentRef` ?
    if (this.contentRef) {
      this.contentRef.style.transform = `translate3d(0px,${ty}px,0)`
    }
  }

  render() {
    const { indicator, containerStyle = {}, contentStyle = {}, indicatorStyle = {} } = this.attrs
    const { status } = this.state
    const childrenComponent = <Static shouldUpdate={this.shouldUpdateChildren}>{() => this.children}</Static>

    return (
      <Section ref={el => this.containerRef = el} stylesheet={containerStyle}>
        <Section ref={el => this.contentRef = el} stylesheet={contentStyle}>
          {direction === UP ? childrenComponent : null}
          <Section ref={el => this.indicatorRef = el} stylesheet={indicatorStyle}>
            {indicator[status]}
          </Section>
          {direction === DOWN ? childrenComponent : null}
        </Section>
      </Section>
    )
  }
}
