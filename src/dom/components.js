import {
  Audio,
  Checkbox,
  Image,
  Input,
  Line,
  Radio,
  Section,
  Text,
  Textarea,
  Video,
  Webview,
} from '../components'

Object.assign(Section.prototype, {
  render() {
    const {
      onHintEnter$,
      onHintStart$,
      onHintMove$,
      onHintEnd$,
      onHintLeave$,

      className,
      style,
      attrs,
      children,
    } = this

    return <div
      onMouseEnter={e => onHintEnter$.next(e)}
      onMouseDown={e => onHintStart$.next(e)}
      onMouseMove={e => onHintMove$.next(e)}
      onMouseUp={e => onHintEnd$.next(e)}
      onMouseLeave={e => onHintLeave$.next(e)}

      onTouchStart={e => onHintStart$.next(e)}
      onTouchMove={e => onHintMove$.next(e)}
      onTouchEnd={e => onHintEnd$.next(e)}

      className={className}
      style={style}

      {...attrs}>{children}</div>
  },
})

Object.assign(Text.prototype, {
  render() {
    const {
      onHintEnter$,
      onHintStart$,
      onHintMove$,
      onHintEnd$,
      onHintLeave$,

      className,
      style,
      attrs,
      children,
    } = this

    return <span
      onMouseEnter={e => onHintEnter$.next(e)}
      onMouseDown={e => onHintStart$.next(e)}
      onMouseMove={e => onHintMove$.next(e)}
      onMouseUp={e => onHintEnd$.next(e)}
      onMouseLeave={e => onHintLeave$.next(e)}

      onTouchStart={e => onHintStart$.next(e)}
      onTouchMove={e => onHintMove$.next(e)}
      onTouchEnd={e => onHintEnd$.next(e)}

      className={className}
      style={style}

      {...attrs}>{children}</span>
  }
})
