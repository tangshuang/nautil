import { attachShadowClass } from '../core/utils.js'

import Section from '../components/section.jsx'
import Text from '../components/text.jsx'
import Image from '../components/image.jsx'
import Line from '../components/line.jsx'
import Button from '../components/button.jsx'

import Input from '../components/input.jsx'
import Textarea from '../components/textarea.jsx'
import Checkbox from '../components/checkbox.jsx'
import Radio from '../components/radio.jsx'
import Select from '../components/select.jsx'

import Audio from '../components/audio.jsx'
import Video from '../components/video.jsx'
import Webview from '../components/webview.jsx'

import _Section from '../dom-components/section.jsx'
import _Text from '../dom-components/text.jsx'
import _Image from '../dom-components/image.jsx'
import _Line from '../dom-components/line.jsx'
import _Button from '../dom-components/button.jsx'

import _Input from '../dom-components/input.jsx'
import _Textarea from '../dom-components/textarea.jsx'
import _Checkbox from '../dom-components/checkbox.jsx'
import _Radio from '../dom-components/radio.jsx'
import _Select from '../dom-components/select.jsx'

import _Audio from '../dom-components/audio.jsx'
import _Video from '../dom-components/video.jsx'
import _Webview from '../dom-components/webview.jsx'

attachShadowClass(Section, _Section)
attachShadowClass(Text, _Text)
attachShadowClass(Image, _Image)
attachShadowClass(Line, _Line)
attachShadowClass(Button, _Button)
attachShadowClass(Input, _Input)
attachShadowClass(Textarea, _Textarea)
attachShadowClass(Checkbox, _Checkbox)
attachShadowClass(Radio, _Radio)
attachShadowClass(Select, _Select)
attachShadowClass(Audio, _Audio)
attachShadowClass(Video, _Video)
attachShadowClass(Webview, _Webview)
