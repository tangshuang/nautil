import { define } from 'nautil/web-component'
import Box from './components/box.jsx'

// 将一个nautil组件转换为一个web component
define('my-box', Box)
// then you can use <my-box></my-box> in html with shadow-dom
