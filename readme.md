**Must use the transform-class-properties babel plugin**

`Move` and `Merged` are exported from main.js

Import them with

```
import { Move, Merged } from './main.js';
```

A basic demo can be run with `npm start`. Using ASCII art, and extending the Merged class, gameplay
can quickly be visualised.

* * *

I'm pretty happy with my approach. I've taken advantage of some new ES2015 features which should
speed up execution in natively supported environments.





Everything came together pretty clearly for me once I broke down every piece of logic. 

None of the methods have more than 7 lines of code.
