# Animation

```js
import { Animation } from 'nautil'

<Animation show={this.state.show} enter="fade:in move:left,top/right,bottom 100 easeInCubic" leave="fade:out move:right/left 100">
  ...
</Animation>
```

## props

- show: Boolean,
- enter: String,
- leave: String,
- loop: ifexist(Boolean), // when you pass loop=true, you should pass $show instead
- onEnterStart
- onEnterUpdate
- onEnterStop
- onLeaveStart
- onLeaveUpdate
- onLeaveStop


`enter` and `leave` is a description for enter animation `...effect:params duration ease`.

- fade:(from)/(to): in,out,
- move:(from)/(to): left,right,top,bottom,(x,y)/(x,y)
- rotate:(from)deg/(to)deg
- scale:(from)/(to)