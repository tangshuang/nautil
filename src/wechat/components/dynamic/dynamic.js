import { isShallowEqual } from 'ts-fns'

const componentConfig = {
  properties: {
    data: {
      type: Object,
    },
  },
  data: {
    type: '',
    props: {},
    children: [],
    content: '',
    pageId: '',
    nodeId: '',
  },
  observers: {
    data(data) {
      if (!data) {
        return
      }

      const { type, props, children = [] } = this.data
      if (type !== data.type) {
        const { type, props = {}, children = [], content = '' } = data
        this.setData({ type, props, children, content })
      }
      else {
        const next = {}
        let flag = false

        if (!isShallowEqual(props, data.props)) {
          next.props = data.props || {}
          flag = true
        }

        if (type === '#text') {
          if (this.data.content !== data.content) {
            next.content = data.content
            flag = true
          }
        }
        else if (!isShallowEqual(children.map(item => item.type), data.children.map(item => item.type))) {
          next.children = data.children
          flag = true
        }

        if (flag) {
          this.setData(next)
        }
      }
    },
  },
  lifetimes: {
    attached() {
      if (!this.properties.data) {
        return
      }
      const { id: nodeId, type, props = {}, children = [], content = '' } = this.properties.data
      const pageId = this.getPageId()
      this.setData({ type, props, children, pageId, nodeId, content })
    },
  },
  methods: {},
}

// createHandlers
function createHandle(name) {
  return function(e) {
    const { props } = this.data
    if (typeof props[name] === 'function') {
      props[name](e)
    }
  }
}
const handlers = [
  'bindtap',
  'bindtapstart',
  'bindtapmove',
  'bindtapend',
  'bindtapcancel',
  'bindlongpress',
  'bindgetuserinfo',
  'bindcontact',
  'bindgetphonenumber',
  'binderror',
  'bindopensetting',
  'bindlaunchapp',
  'bindplay',
  'bindpause',
  'bindtimeupdate',
  'bindended',
  'bindchange',
  'bindsubmit',
  'bindreset',
  'bindload',
  'bindinput',
  'bindfocus',
  'bindblur',
  'bindconfirm',
  'bindkeyboardheightchange',
  'bindselect',
  'bindcancel',
  'bindfullscreenchange',
  'bindwaiting',
  'bindprogress',
  'bindloadedmetadata',
  'bindcontrolstoggle',
  'bindenterpictureinpicture',
  'bindleavepictureinpicture',
  'bindseekcomplete',
  'bindmessage'
]
handlers.forEach((name) => {
  componentConfig.methods[name] = createHandle(name)
})

Component(componentConfig)
