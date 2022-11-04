import { mount } from '@vue/test-utils'
import FileTitle from '@/components/navbar/FileTitle.vue'
import mixinGlobal from '@/utils/mixins.js'

describe('FileTitle.vue', () => {
  it('renders props.title when passed', () => {
    const title = 'Testing Title props'
    const wrapper = mount(FileTitle, {
      propsData: { title },
      mixins: [mixinGlobal]
    })
    expect(wrapper.props().title).toBe('Testing Title props')
  })
})

// const title = 'Testing Title props'
// const wrapper = mount(FileTitle, {
//   propsData: { title: title },
//   mixins: [mixinGlobal]
// })
// expect(wrapper.props().title).toBe('Testing Title props')
// expect(wrapper.props().title).toBe('abc')
