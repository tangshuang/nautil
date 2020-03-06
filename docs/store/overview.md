# Store/State

We provide a much smart and much smaller store in Nautil. We do not follow flux but follow Observer Pattern, so we give up redux, it is too heavy.

Now let's look into our Store. What is a store? A store is a container which keeps a state object and has APIs to watch and change state. State is the basic info of UI, when state changes, the UI changes. So we can use store to controll the UI with its APIs.
