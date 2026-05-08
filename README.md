# cloak.c

C implementation of the `cloak` JS library, compiled to asm.js via Emscripten.
Same API, same usage.

## Prerequisites

- [Emscripten SDK](https://emscripten.org/docs/getting_started/downloads.html)

## Build

```bash
chmod +x build.sh
./build.sh
```

Produces `cloak.js` (asm.js output with the JS glue baked in).

## Usage (identical to the original)

```html
<script src="cloak.js"></script>
<script>
    var myObj = {
        greet: function(name) {
            console.log("Hello, " + name);
        }
    };

    // Replace a method
    cloak(myObj, "greet").cloakWith(function(name, original) {
        console.log("Before greeting");
        original(name);
        console.log("After greeting");
    });

    myObj.greet("World");

    // Conditional hooks
    cloak(myObj, "greet")
        .when(function() { return true; })
        .before(function(name) {
            console.log("Pre-hook for " + name);
        })
        .and
        .after(function(name) {
            console.log("Post-hook for " + name);
        });

    // Restore original
    var c = cloak(myObj, "greet");
    c.cloakWith(function() { console.log("cloaked"); });
    c.uncloak();

    // callOriginal with hooks
    cloak(myObj, "greet")
        .callOriginal()
        .before(function(name) { console.log("before: " + name); })
        .after(function(name) { console.log("after: " + name); });
</script>
```

## Node.js

```js
var Module = require("./cloak.js");
Module.onRuntimeInitialized = function() {
    var cloak = Module.exports || window.cloak;
    // use cloak(obj, prop) as normal
};
```

## Architecture

- **cloak.c** — State management in C: hook arrays (before/after), condition tracking,
  cloaked flag, instance lifecycle. Compiled to asm.js.
- **cloak_post.js** — JS glue injected via `--post-js`. Holds a JS reference table
  (functions/booleans can't live in C memory), wraps the C exports into the
  chainable `cloak(obj, prop)` API matching the original library exactly.

## Limits

- 32 concurrent cloak instances (bump `MAX_INSTANCES` in cloak.c)
- 64 hooks per direction per instance (bump `MAX_HOOKS` in cloak.c)
