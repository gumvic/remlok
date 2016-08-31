# Perhaps if selector/dispatcher returns not a function, that means it returned a query/msg to pass to the parent!

# Let's have dispatchers (will have access to `dispatch`) and reducers (just `(st, msg) -> st*`)?

# Description

`Sorted` store.

It only sorts the items.

The parent must provide the `items` selector.

So, it will not select that, and therefore pass it to its parent.

It will have its state, like { by, direction }.

It will have `items` selector:

(st, _, select) =>
  combineSelectors(
    select('_items'),
    select('opts'),
    (items, opts) => sortByOpts(items, opts));

And also `opts` selector:

(st, _) => st.opts

And the whole selector will look like:

(st, query, select) =>
  case query
    'items' => itemsSelector(st, query, select)
    '_items' => 'items', // for the parent
    'opts' => optsSelector(st, query, select)
