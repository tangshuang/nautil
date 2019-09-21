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

import ScrollSection from '../mobile-components/scroll-section.jsx'

import _Section from '../native-components/section.jsx'
import _Text from '../native-components/text.jsx'
import _Image from '../native-components/image.jsx'
import _Line from '../native-components/line.jsx'
import _Button from '../native-components/button.jsx'

import _Input from '../native-components/input.jsx'
import _Textarea from '../native-components/textarea.jsx'
import _Checkbox from '../native-components/checkbox.jsx'
import _Radio from '../native-components/radio.jsx'
import _Select from '../native-components/select.jsx'

import _Audio from '../native-components/audio.jsx'
import _Video from '../native-components/video.jsx'
import _Webview from '../native-components/webview.jsx'

import _ScrollSection from '../native-components/scroll-section.jsx'

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
attachShadowClass(ScrollSection, _ScrollSection)
