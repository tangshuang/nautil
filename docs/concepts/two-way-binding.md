# Two-Way-Binding

There is no strict defination of **Two Way Binding**. In short, it is about a reactive proposal between view and model, which describes [when changing model changes the view and changing the view changes the model](https://medium.com/front-end-weekly/what-is-2-way-data-binding-44dd8082e48e).

In react, data only goes one way, from parent component to child component by passing props. And the main vioce in community is immutable data. However, it is not comfortable when we are going to build a intertwined application. In fact, redux is not good enough to solve the problem, it is to complex to write many non-business codes. We want an easy way.

In Nautil, we can use Two Way Binding. Let's have a look:

```js
const $some = useState(some)
<Input $value={$some} />
```

The previous code is very simple, however it is very powerful. You do not need to care about what it will do inside `Input`. It will give you right UI response when value of input changed. In the document of Two Way Binding, I will introduce the whole face of it.
