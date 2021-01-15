# ScrollSection

A composition component which can be scrolled.

```js
import { ScrollSection } from 'nautil'

<ScrollSection
  direction="up"
  distance={10}
  damping={.5}

  topLoading={this.state.loading}
  topIndicator={{
    activate: 'release',
    deactivate: 'pull',
    release: <Loading />,
    finish: 'finish',
  }}
  onTopRelease={fetchData}
>
  ...
</ScrollSection>
```

## props

- direction: enumerate([UP, DOWN, BOTH, NONE]),
- distance: Number,
- damping: range({ min: 0, max: 1 }),
- topLoading: Boolean,
- topIndicator:
  - [ACTIVATE]: Any,
  - [DEACTIVATE]: Any,
  - [RELEASE]: Any,
  - [FINISH]: Any,
- topIndicatorStyle: enumerate([Object, String]),
- onTopRelease: Function,
- bottomLoading: Boolean,
- bottomIndicator: {
  - [ACTIVATE]: Any,
  - [DEACTIVATE]: Any,
  - [RELEASE]: Any,
  - [FINISH]: Any,
- bottomIndicatorStyle: enumerate([Object, String]),
- onBottomRelease: Function,
- onScroll: Function,
- containerStyle: enumerate([Object, String]),
- contentStyle: enumerate([Object, String]),

```js
const { UP, DOWN, BOTH, NONE, ACTIVATE, DEACTIVATE, RELEASE, FINISH } = ScrollSection
```

Indicators are content to show in top or bottom area.

- DEACTIVATE: when users pull down/up but not reach the `distance`
- ACTIVATE: when users pull down/up and reach the `distance`
- RELEASE: when users pull down/up and reach the `distance` and release their fingers, at the same time, onTopRelase/onBottomRelease will be fired, here, you should must set topLoading/bottomLoading from `false` to `true`
- FINISH: after topLoading/bottomLoading change from `true` to `false`