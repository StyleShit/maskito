# Maskito

Tiny, zero-dependency, and extensible string masking library.

## Usage

To make things simple, Maskito only has 2 built-in masking patterns - `0` and `A`:

- `0` will match any digit
- `A` will match any English letter

To format a string using Maskito, use the `createMask` function:

```TS
import { createMask } from 'maskito';

const { format } = createMask('AAA (000)-000-000');

console.log(format('USA123456789')); // 'USA (123)-456-789'
```

You can also create your own mask patterns by passing a dictionary to the `createMask` function.
For example, let's create a mask pattern `D` that will match the dollar sign:

```TS
import { createMask } from 'maskito';

const { format } = createMask('D00.0', {
    D: /^\$$/,
});

console.log(format('$123')); // '$12.3'
```

In addition, you can revert a masked string back to its original form using the `unformat` function:

```TS
import { createMask } from 'maskito';

const { unformat } = createMask('AAA (000)-000-000');

console.log(unformat('USA (123)-456-789')); // 'USA123456789'
```

For convenience, Maskito also exposes the mask string you passed in under the `mask` property:

```TS
import { createMask } from 'maskito';

const { mask } = createMask('AAA (000)-000-000');

console.log(mask); // 'AAA (000)-000-000'
```
