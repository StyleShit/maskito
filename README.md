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

### Example with React

Here's an example of how you can use Maskito with React:

```TSX
import { useState } from 'react';
import { createMask } from 'maskito';

const { format, unformat, mask } = createMask('(000) 000-0000');

const App = () => {
    const [value, setValue] = useState('');

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(unformat(e.target.value));
    };

    return (
        <input
            placeholder={mask}
            value={format(value)}
            onChange={onChange}
        />
    );
};
```

We initialize a mask outside of React's context using the `createMask` function. Then, inside React,
we render a controlled input that shows the formatted value using the `format` function. Each time
the user changes the input value, we `unformat` it and set it as the new state's value, resulting in
a formatted input for the user, but an unformatted value for the application.
