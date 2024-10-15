## Naming convention

1. Variable: All variables must follow camel Standard. ex: let productId.
2. Constrant: All contrants must follow all Uppercase, split by underline character. ex: const PRODUCT_TYPE.
3. Function: function name must follow camel standard. ex: const getProduct = ()=>{}.
4. Enum: Follow: NotifyTypeEnum, Pascal format and end with Enum.
5. Component, custom hook.
   _Using sonarlint for keep format and rules_

## Rules of Code

### Must

1. All functions, components must have description at top of function/component.
2. All passing variables to function/component must have specific type, interface.
3. Name of function, component, variable must meaning and clear.
4. All datetime for display must have same format and timezone. Using formatDateGMT function for keep same format display.
5. All format datetime send to server must format is UTC (GMT +0).
6. All console return variable, checking must remove before merge. Except case need for check bug on pro or help for notify action and message must meaning (need comment before console). Don't not allow using obscene language.
7. All debugger must remove before merge for all case.

### Should

1. Need comment for each special function/component inside function/component. And must comment with English.

## Special Functions/Components

### Helper Components

1. RawText: Using for display HTML follow default style of system. _All text render as HTML_ must using this

### Helper Functions

Base at: FunctionBase class

1. formatDateGMT: All date display must using this function for keep same format in system. _Must using_
2. escape, htmlEncode: Convert Html to string - Using for display html as text. Must use for display all title types (Course title, activity title...).

Axios helper functions:

1. axiosPost: Using for post data with manual handle error. -> Pass: errorHandle= false
2. axiosGet: Using for get data with manual hanle error. -> Pass: errorHandle= false
