# Perhaps if selector/dispatcher returns not a function, that means it returned a query/msg to pass to the parent!

# Description

`Sorted` store.

It only sorts the items.

The parent must provide the `items` selector.

So, it will not select that, and therefore pass it to its parent.

It will have its state, like { by, direction }.

It will have `sorted` selector:

(st, _, select) =>
  combineSelectors(
    select('items'),
    select('opts'),
    (items, opts) => sortByOpts(items, opts));

And also `opts` selector:

(st, _) => st.opts

And the whole selector will look like:

(st, query) =>
  case query
    'items' => itemsSelector
    'opts' => optsSelector,
    default => query
