// cloak.js
// simple cloaking library writen in c 
// compiled with emscripten 
// target build is asm js
// but you can also compile it to wasm
// see https://github.com/TS-DEV-DEBUG-V2/cloakjs for more info

var Module = typeof Module != "undefined" ? Module : {};
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != "renderer";
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = (status, toThrow) => {
    throw toThrow
};
var _scriptName = globalThis.document?.currentScript?.src;
if (typeof __filename != "undefined") {
    _scriptName = __filename
} else if (ENVIRONMENT_IS_WORKER) {
    _scriptName = self.location.href
}
var scriptDirectory = "";
var readAsync, readBinary;
if (ENVIRONMENT_IS_NODE) {
    var fs = require("node:fs");
    scriptDirectory = __dirname + "/";
    readBinary = filename => {
        filename = isFileURI(filename) ? new URL(filename) : filename;
        var ret = fs.readFileSync(filename);
        return ret
    };
    readAsync = async (filename, binary = true) => {
        filename = isFileURI(filename) ? new URL(filename) : filename;
        var ret = fs.readFileSync(filename, binary ? undefined : "utf8");
        return ret
    };
    if (process.argv.length > 1) {
        thisProgram = process.argv[1].replace(/\\/g, "/")
    }
    arguments_ = process.argv.slice(2);
    if (typeof module != "undefined") {
        module["exports"] = Module
    }
    quit_ = (status, toThrow) => {
        process.exitCode = status;
        throw toThrow
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    try {
        scriptDirectory = new URL(".", _scriptName).href
    } catch {} {
        if (ENVIRONMENT_IS_WORKER) {
            readBinary = url => {
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                xhr.responseType = "arraybuffer";
                xhr.send(null);
                return new Uint8Array(xhr.response)
            }
        }
        readAsync = async url => {
            if (isFileURI(url)) {
                return new Promise((resolve, reject) => {
                    var xhr = new XMLHttpRequest;
                    xhr.open("GET", url, true);
                    xhr.responseType = "arraybuffer";
                    xhr.onload = () => {
                        if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                            resolve(xhr.response);
                            return
                        }
                        reject(xhr.status)
                    };
                    xhr.onerror = reject;
                    xhr.send(null)
                })
            }
            var response = await fetch(url, {
                credentials: "same-origin"
            });
            if (response.ok) {
                return response.arrayBuffer()
            }
            throw new Error(response.status + " : " + response.url)
        }
    }
} else {}
var out = console.log.bind(console);
var err = console.error.bind(console);
var wasmBinary;
var WebAssembly = {
    Memory: function(opts) {
        this.buffer = new ArrayBuffer(opts["initial"] * 65536)
    },
    Module: function(binary) {},
    Instance: function(module, info) {
        this.exports = (
            // EMSCRIPTEN_START_ASM
            function instantiate(L) {
                function c(d) {
                    d.set = function(a, b) {
                        this[a] = b
                    };
                    d.get = function(a) {
                        return this[a]
                    };
                    return d
                }
                var e;

                function f(g, h, i) {
                    g = g >>> 0;
                    i = i >>> 0;
                    if (g + i > e.length) throw "trap: invalid memory.fill";
                    e.fill(h, g, g + i)
                }

                function j(g, k, i) {
                    e.copyWithin(g, k, k + i)
                }

                function J(K) {
                    var l = new ArrayBuffer(16908288);
                    var m = new Int8Array(l);
                    var n = new Int16Array(l);
                    var o = new Int32Array(l);
                    var p = new Uint8Array(l);
                    var q = new Uint16Array(l);
                    var r = new Uint32Array(l);
                    var s = new Float32Array(l);
                    var t = new Float64Array(l);
                    var u = Math.imul;
                    var v = Math.fround;
                    var w = Math.abs;
                    var x = Math.clz32;
                    var y = Math.min;
                    var z = Math.max;
                    var A = Math.floor;
                    var B = Math.ceil;
                    var C = Math.trunc;
                    var D = Math.sqrt;
                    var E = K.env;
                    var F = E.log_startup;
                    var G = 100480;
                    // EMSCRIPTEN_START_FUNCS
                    function O(a) {
                        a = a | 0;
                        var b = 0,
                            c = 0,
                            d = 0;
                        if (!p[1392]) {
                            f(1408, 0, 33536);
                            m[1392] = 1;
                            F()
                        }
                        a: {
                            while (1) {
                                c = u(d, 1048);
                                if (!o[c + 2452 >> 2]) {
                                    b = c + 1408 | 0;
                                    break a
                                }
                                c = d | 1;
                                b = u(c, 1048);
                                if (!o[b + 2452 >> 2]) {
                                    b = b + 1408 | 0;
                                    d = c;
                                    break a
                                }
                                c = d | 2;
                                b = u(c, 1048);
                                if (!o[b + 2452 >> 2]) {
                                    b = b + 1408 | 0;
                                    d = c;
                                    break a
                                }
                                c = d | 3;
                                b = u(c, 1048);
                                if (!o[b + 2452 >> 2]) {
                                    b = b + 1408 | 0;
                                    d = c;
                                    break a
                                }
                                d = d + 4 | 0;
                                if ((d | 0) != 32) {
                                    continue
                                }
                                break
                            }
                            return -1
                        }
                        f(b, 0, 1032);
                        o[b + 1040 >> 2] = a;
                        o[b + 1044 >> 2] = 1;
                        o[b + 1032 >> 2] = 0;
                        o[b + 1036 >> 2] = -1;
                        return d | 0
                    }

                    function T(a, b, c) {
                        a = a | 0;
                        b = b | 0;
                        c = c | 0;
                        var d = 0,
                            e = 0;
                        d = -1;
                        a: {
                            if (a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            a = a + 1408 | 0;e = o[a + 512 >> 2];
                            if ((e | 0) > 63) {
                                break a
                            }
                            d = o[a + 1036 >> 2];b: {
                                if (c) {
                                    c = e << 3;
                                    if (c) {
                                        j(a + 8 | 0, a, c)
                                    }
                                    o[a >> 2] = d;
                                    c = a;
                                    break b
                                }
                                c = a + (e << 3) | 0;o[c >> 2] = d
                            }
                            o[c + 4 >> 2] = b;o[a + 512 >> 2] = o[a + 512 >> 2] + 1;d = 0
                        }
                        return d | 0
                    }

                    function U(a, b) {
                        a = a | 0;
                        b = b | 0;
                        var c = 0,
                            d = 0;
                        d = -1;
                        a: {
                            if (a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            a = a + 1408 | 0;c = o[a + 1028 >> 2];
                            if ((c | 0) > 63) {
                                break a
                            }
                            d = o[a + 1036 >> 2];c = a + (c << 3) | 0;o[c + 520 >> 2] = b;o[c + 516 >> 2] = d;o[a + 1028 >> 2] = o[a + 1028 >> 2] + 1;d = 0
                        }
                        return d | 0
                    }

                    function _(a, b) {
                        a = a | 0;
                        b = b | 0;
                        var c = 0;
                        c = -1;
                        a: {
                            if ((b | 0) < 0 | a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            a = a + 1408 | 0;
                            if (o[a + 1028 >> 2] <= (b | 0)) {
                                break a
                            }
                            c = o[(a + (b << 3) | 0) + 520 >> 2]
                        }
                        return c | 0
                    }

                    function Z(a, b) {
                        a = a | 0;
                        b = b | 0;
                        var c = 0;
                        c = -1;
                        a: {
                            if ((b | 0) < 0 | a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            a = a + 1408 | 0;
                            if (o[a + 1028 >> 2] <= (b | 0)) {
                                break a
                            }
                            c = o[(a + (b << 3) | 0) + 516 >> 2]
                        }
                        return c | 0
                    }

                    function Y(a, b) {
                        a = a | 0;
                        b = b | 0;
                        var c = 0;
                        c = -1;
                        a: {
                            if ((b | 0) < 0 | a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            a = a + 1408 | 0;
                            if (o[a + 512 >> 2] <= (b | 0)) {
                                break a
                            }
                            c = o[(a + (b << 3) | 0) + 4 >> 2]
                        }
                        return c | 0
                    }

                    function X(a, b) {
                        a = a | 0;
                        b = b | 0;
                        var c = 0;
                        c = -1;
                        a: {
                            if ((b | 0) < 0 | a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            a = a + 1408 | 0;
                            if (o[a + 512 >> 2] <= (b | 0)) {
                                break a
                            }
                            c = o[a + (b << 3) >> 2]
                        }
                        return c | 0
                    }

                    function R(a) {
                        a = a | 0;
                        var b = 0;
                        b = -1;
                        a: {
                            if (a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            b = o[(a + 1408 | 0) + 1040 >> 2]
                        }
                        return b | 0
                    }

                    function W(a) {
                        a = a | 0;
                        var b = 0;
                        a: {
                            if (a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            b = o[(a + 1408 | 0) + 1028 >> 2]
                        }
                        return b | 0
                    }

                    function Q(a) {
                        a = a | 0;
                        var b = 0;
                        a: {
                            if (a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            b = o[(a + 1408 | 0) + 1032 >> 2]
                        }
                        return b | 0
                    }

                    function V(a) {
                        a = a | 0;
                        var b = 0;
                        a: {
                            if (a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            b = o[(a + 1408 | 0) + 512 >> 2]
                        }
                        return b | 0
                    }

                    function S(a, b) {
                        a = a | 0;
                        b = b | 0;
                        a: {
                            if (a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            o[(a + 1408 | 0) + 1036 >> 2] = b
                        }
                    }

                    function P(a, b) {
                        a = a | 0;
                        b = b | 0;
                        a: {
                            if (a >>> 0 > 31) {
                                break a
                            }
                            a = u(a, 1048);
                            if (!o[a + 2452 >> 2]) {
                                break a
                            }
                            o[(a + 1408 | 0) + 1032 >> 2] = b
                        }
                    }

                    function $(a) {
                        a = a | 0;
                        if (a >>> 0 <= 31) {
                            o[u(a, 1048) + 2452 >> 2] = 0
                        }
                    }

                    function N() {
                        if (!p[1392]) {
                            f(1408, 0, 33536);
                            m[1392] = 1;
                            F()
                        }
                    }

                    function ba(a) {
                        a = a | 0;
                        a = G - a & -16;
                        G = a;
                        return a | 0
                    }

                    function ca() {
                        return G | 0
                    }

                    function aa(a) {
                        a = a | 0;
                        G = a
                    }

                    function M() {}
                    // EMSCRIPTEN_END_FUNCS
                    e = p;
                    var H = c([]);

                    function I() {
                        return l.byteLength >> 16
                    }
                    return {
                        memory: Object.create(Object.prototype, {
                            grow: {},
                            buffer: {
                                get: function() {
                                    return l
                                }
                            }
                        }),
                        __wasm_call_ctors: M,
                        cloak_init: N,
                        cloak_create: O,
                        cloak_set_cloaked: P,
                        cloak_is_cloaked: Q,
                        cloak_get_original: R,
                        cloak_set_when: S,
                        cloak_add_before: T,
                        cloak_add_after: U,
                        cloak_get_before_count: V,
                        cloak_get_after_count: W,
                        cloak_get_before_condition: X,
                        cloak_get_before_fn: Y,
                        cloak_get_after_condition: Z,
                        cloak_get_after_fn: _,
                        cloak_destroy: $,
                        __indirect_function_table: H,
                        _emscripten_stack_restore: aa,
                        _emscripten_stack_alloc: ba,
                        emscripten_stack_get_current: ca
                    }
                }
                return J(L)
            }
            // EMSCRIPTEN_END_ASM


        )(info)
    },
    instantiate: function(binary, info) {
        return {
            then: function(ok) {
                var module = new WebAssembly.Module(binary);
                ok({
                    instance: new WebAssembly.Instance(module, info)
                })
            }
        }
    },
    RuntimeError: Error,
    isWasm2js: true
};
if (WebAssembly.isWasm2js) {
    wasmBinary = []
}
var ABORT = false;
var isFileURI = filename => filename.startsWith("file://");
class EmscriptenEH {}
class EmscriptenSjLj extends EmscriptenEH {}
var runtimeInitialized = false;

function updateMemoryViews() {
    var b = wasmMemory.buffer;
    HEAP8 = new Int8Array(b);
    HEAP16 = new Int16Array(b);
    HEAPU8 = new Uint8Array(b);
    HEAPU16 = new Uint16Array(b);
    HEAP32 = new Int32Array(b);
    HEAPU32 = new Uint32Array(b);
    HEAPF32 = new Float32Array(b);
    HEAPF64 = new Float64Array(b)
}

function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(onPreRuns)
}

function initRuntime() {
    runtimeInitialized = true;
    wasmExports["__wasm_call_ctors"]()
}

function postRun() {
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(onPostRuns)
}

function abort(what) {
    Module["onAbort"]?.(what);
    what = `Aborted(${what})`;
    err(what);
    ABORT = true;
    what += ". Build with -sASSERTIONS for more info.";
    var e = new WebAssembly.RuntimeError(what);
    throw e
}
var wasmBinaryFile;

function findWasmBinary(file) {}

function getWasmBinary(file) {}
async function instantiateArrayBuffer(binaryFile, imports) {
    try {
        var binary = await getWasmBinary(binaryFile);
        var instance = await WebAssembly.instantiate(binary, imports);
        return instance
    } catch (reason) {
        err(`failed to asynchronously prepare wasm: ${reason}`);
        abort(reason)
    }
}
async function instantiateAsync(binary, binaryFile, imports) {
    if (!binary && !isFileURI(binaryFile) && !ENVIRONMENT_IS_NODE) {
        try {
            var response = fetch(binaryFile, {
                credentials: "same-origin"
            });
            var instantiationResult = await WebAssembly.instantiateStreaming(response, imports);
            return instantiationResult
        } catch (reason) {
            err(`wasm streaming compile failed: ${reason}`);
            err("falling back to ArrayBuffer instantiation")
        }
    }
    return instantiateArrayBuffer(binaryFile, imports)
}

function getWasmImports() {
    var imports = {
        env: wasmImports,
        wasi_snapshot_preview1: wasmImports
    };
    return imports
}
async function createWasm() {
    function receiveInstance(instance, module) {
        wasmExports = instance.exports;
        assignWasmExports(wasmExports);
        updateMemoryViews();
        removeRunDependency("wasm-instantiate");
        return wasmExports
    }
    addRunDependency("wasm-instantiate");

    function receiveInstantiationResult(result) {
        return receiveInstance(result["instance"])
    }
    var info = getWasmImports();
    if (Module["instantiateWasm"]) {
        return new Promise((resolve, reject) => {
            Module["instantiateWasm"](info, (inst, mod) => {
                resolve(receiveInstance(inst, mod))
            })
        })
    }
    wasmBinaryFile ??= findWasmBinary();
    var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
    var exports = receiveInstantiationResult(result);
    return exports
}
class ExitStatus {
    name = "ExitStatus";
    constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status
    }
}
var HEAP16;
var HEAP32;
var HEAP8;
var HEAPF32;
var HEAPF64;
var HEAPU16;
var HEAPU32;
var HEAPU8;
var callRuntimeCallbacks = callbacks => {
    while (callbacks.length > 0) {
        callbacks.shift()(Module)
    }
};
var onPostRuns = [];
var addOnPostRun = cb => onPostRuns.push(cb);
var onPreRuns = [];
var addOnPreRun = cb => onPreRuns.push(cb);
var runDependencies = 0;
var dependenciesFulfilled = null;
var removeRunDependency = id => {
    runDependencies--;
    Module["monitorRunDependencies"]?.(runDependencies);
    if (runDependencies == 0) {
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
};
var addRunDependency = id => {
    runDependencies++;
    Module["monitorRunDependencies"]?.(runDependencies)
};
var noExitRuntime = true;
var stackRestore = val => __emscripten_stack_restore(val);
var stackSave = () => _emscripten_stack_get_current();
var getCFunc = ident => {
    var func = Module["_" + ident];
    return func
};
var writeArrayToMemory = (array, buffer) => {
    HEAP8.set(array, buffer)
};
var lengthBytesUTF8 = str => {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var c = str.charCodeAt(i);
        if (c <= 127) {
            len++
        } else if (c <= 2047) {
            len += 2
        } else if (c >= 55296 && c <= 57343) {
            len += 4;
            ++i
        } else {
            len += 3
        }
    }
    return len
};
var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.codePointAt(i);
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            heap[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            heap[outIdx++] = 192 | u >> 6;
            heap[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            heap[outIdx++] = 224 | u >> 12;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            heap[outIdx++] = 240 | u >> 18;
            heap[outIdx++] = 128 | u >> 12 & 63;
            heap[outIdx++] = 128 | u >> 6 & 63;
            heap[outIdx++] = 128 | u & 63;
            i++
        }
    }
    heap[outIdx] = 0;
    return outIdx - startIdx
};
var stringToUTF8 = (str, outPtr, maxBytesToWrite) => stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
var stackAlloc = sz => __emscripten_stack_alloc(sz);
var stringToUTF8OnStack = str => {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8(str, ret, size);
    return ret
};
var UTF8Decoder = globalThis.TextDecoder && new TextDecoder;
var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
    var maxIdx = idx + maxBytesToRead;
    if (ignoreNul) return maxIdx;
    while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
    return idx
};
var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
    var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
    if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr))
    }
    var str = "";
    while (idx < endPtr) {
        var u0 = heapOrArray[idx++];
        if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue
        }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue
        }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2
        } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heapOrArray[idx++] & 63
        }
        if (u0 < 65536) {
            str += String.fromCharCode(u0)
        } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
        }
    }
    return str
};
var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : "";
var ccall = (ident, returnType, argTypes, args, opts) => {
    var toC = {
        string: str => {
            var ret = 0;
            if (str !== null && str !== undefined && str !== 0) {
                ret = stringToUTF8OnStack(str)
            }
            return ret
        },
        array: arr => {
            var ret = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret);
            return ret
        }
    };

    function convertReturnValue(ret) {
        if (returnType === "string") {
            return UTF8ToString(ret)
        }
        if (returnType === "boolean") return Boolean(ret);
        return ret
    }
    var func = getCFunc(ident);
    var cArgs = [];
    var stack = 0;
    if (args) {
        for (var i = 0; i < args.length; i++) {
            var converter = toC[argTypes[i]];
            if (converter) {
                if (stack === 0) stack = stackSave();
                cArgs[i] = converter(args[i])
            } else {
                cArgs[i] = args[i]
            }
        }
    }
    var ret = func(...cArgs);

    function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret)
    }
    ret = onDone(ret);
    return ret
};
var cwrap = (ident, returnType, argTypes, opts) => {
    var numericArgs = !argTypes || argTypes.every(type => type === "number" || type === "boolean");
    var numericRet = returnType !== "string";
    if (numericRet && numericArgs && !opts) {
        return getCFunc(ident)
    }
    return (...args) => ccall(ident, returnType, argTypes, args, opts)
};
{
    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
    if (Module["print"]) out = Module["print"];
    if (Module["printErr"]) err = Module["printErr"];
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["preInit"]) {
        if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
        while (Module["preInit"].length > 0) {
            Module["preInit"].shift()()
        }
    }
}
Module["ccall"] = ccall;
Module["cwrap"] = cwrap;

function log_startup() {
    console.log("alr c code has been started as asm js and is now running");
    console.log("ok received request:");
    console.log("  Title: " + document.title);
    var favicon = "";
    var links = document.querySelectorAll("link[rel*='icon']");
    if (links.length > 0) {
        favicon = links[links.length - 1].href
    }
    console.log("  Favicon: " + (favicon || "(none)"))
}
var _cloak_init, _cloak_create, _cloak_set_cloaked, _cloak_is_cloaked, _cloak_get_original, _cloak_set_when, _cloak_add_before, _cloak_add_after, _cloak_get_before_count, _cloak_get_after_count, _cloak_get_before_condition, _cloak_get_before_fn, _cloak_get_after_condition, _cloak_get_after_fn, _cloak_destroy, __emscripten_stack_restore, __emscripten_stack_alloc, _emscripten_stack_get_current, memory, __indirect_function_table, wasmMemory;

function assignWasmExports(wasmExports) {
    _cloak_init = Module["_cloak_init"] = wasmExports["cloak_init"];
    _cloak_create = Module["_cloak_create"] = wasmExports["cloak_create"];
    _cloak_set_cloaked = Module["_cloak_set_cloaked"] = wasmExports["cloak_set_cloaked"];
    _cloak_is_cloaked = Module["_cloak_is_cloaked"] = wasmExports["cloak_is_cloaked"];
    _cloak_get_original = Module["_cloak_get_original"] = wasmExports["cloak_get_original"];
    _cloak_set_when = Module["_cloak_set_when"] = wasmExports["cloak_set_when"];
    _cloak_add_before = Module["_cloak_add_before"] = wasmExports["cloak_add_before"];
    _cloak_add_after = Module["_cloak_add_after"] = wasmExports["cloak_add_after"];
    _cloak_get_before_count = Module["_cloak_get_before_count"] = wasmExports["cloak_get_before_count"];
    _cloak_get_after_count = Module["_cloak_get_after_count"] = wasmExports["cloak_get_after_count"];
    _cloak_get_before_condition = Module["_cloak_get_before_condition"] = wasmExports["cloak_get_before_condition"];
    _cloak_get_before_fn = Module["_cloak_get_before_fn"] = wasmExports["cloak_get_before_fn"];
    _cloak_get_after_condition = Module["_cloak_get_after_condition"] = wasmExports["cloak_get_after_condition"];
    _cloak_get_after_fn = Module["_cloak_get_after_fn"] = wasmExports["cloak_get_after_fn"];
    _cloak_destroy = Module["_cloak_destroy"] = wasmExports["cloak_destroy"];
    __emscripten_stack_restore = wasmExports["_emscripten_stack_restore"];
    __emscripten_stack_alloc = wasmExports["_emscripten_stack_alloc"];
    _emscripten_stack_get_current = wasmExports["emscripten_stack_get_current"];
    memory = wasmMemory = wasmExports["memory"];
    __indirect_function_table = wasmExports["__indirect_function_table"]
}
var wasmImports = {
    log_startup
};

function run() {
    if (runDependencies > 0) {
        dependenciesFulfilled = run;
        return
    }
    preRun();
    if (runDependencies > 0) {
        dependenciesFulfilled = run;
        return
    }

    function doRun() {
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        Module["onRuntimeInitialized"]?.();
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(() => {
            setTimeout(() => Module["setStatus"](""), 1);
            doRun()
        }, 1)
    } else {
        doRun()
    }
}
var wasmExports;
createWasm();
run();
var cloak = function() {
    "use strict";

    function IllegalArgumentError(msg) {
        this.name = "IllegalArgumentError";
        this.message = msg || ""
    }
    IllegalArgumentError.prototype = new Error;

    function validateType(param, types, argName, errorMsg) {
        var t = typeof param;
        if (types.indexOf(t) === -1) {
            throw new IllegalArgumentError(errorMsg || "Argument " + argName + " must be one of the following types: " + types.join(", "))
        }
    }
    var jsRefs = [];

    function storeRef(val) {
        var idx = jsRefs.length;
        jsRefs.push(val);
        return idx
    }

    function getRef(idx) {
        return idx >= 0 && idx < jsRefs.length ? jsRefs[idx] : undefined
    }

    function runHooks(hookGetter, countFn, id, ctx, args) {
        var count = countFn(id);
        for (var i = 0; i < count; i++) {
            var condRef = hookGetter.condition(id, i);
            var fnRef = hookGetter.fn(id, i);
            var cond = getRef(condRef);
            var fn = getRef(fnRef);
            var pass = false;
            if (typeof cond === "function") {
                pass = cond.apply(ctx, args)
            } else if (typeof cond === "boolean") {
                pass = cond
            } else if (cond === undefined || condRef === -1) {
                pass = true
            }
            if (pass && typeof fn === "function") {
                fn.apply(ctx, args)
            }
        }
    }

    function cloakFn(obj, prop) {
        validateType(obj[prop], ["function"], prop, "Cannot cloak property: " + prop + ", it is not a function");
        var originalFn = obj[prop];
        var origRef = storeRef(originalFn);
        var id = Module._cloak_create(origRef);
        if (id < 0) throw new Error("Max cloak instances reached");
        Module._cloak_set_when(id, storeRef(true));
        obj[prop] = function() {
            var self = this;
            var args = Array.prototype.slice.call(arguments);
            var orig = getRef(Module._cloak_get_original(id));
            orig = orig.bind(self);
            if (!Module._cloak_is_cloaked(id)) {
                orig.apply(self, args)
            }
            var fullArgs = args.concat(orig);
            runHooks({
                condition: function(cid, i) {
                    return Module._cloak_get_before_condition(cid, i)
                },
                fn: function(cid, i) {
                    return Module._cloak_get_before_fn(cid, i)
                }
            }, Module._cloak_get_before_count, id, self, fullArgs);
            runHooks({
                condition: function(cid, i) {
                    return Module._cloak_get_after_condition(cid, i)
                },
                fn: function(cid, i) {
                    return Module._cloak_get_after_fn(cid, i)
                }
            }, Module._cloak_get_after_count, id, self, fullArgs)
        };
        var chain = {};
        chain.cloakWith = function(fn) {
            validateType(fn, ["function"], "fn");
            Module._cloak_set_cloaked(id, 1);
            Module._cloak_add_before(id, storeRef(fn), 0);
            return chain
        };
        chain.when = function(condition) {
            validateType(condition, ["function", "boolean"], "condition");
            Module._cloak_set_when(id, storeRef(condition));
            return chain
        };
        chain.uncloak = function() {
            var orig = getRef(Module._cloak_get_original(id));
            if (orig) obj[prop] = orig
        };
        chain.before = function(fn) {
            validateType(fn, ["function"], "fn");
            Module._cloak_add_before(id, storeRef(fn), 1);
            return chain
        };
        chain.after = function(fn) {
            validateType(fn, ["function"], "fn");
            Module._cloak_add_after(id, storeRef(fn));
            return chain
        };
        chain.callOriginal = function() {
            var orig = getRef(Module._cloak_get_original(id));
            Module._cloak_add_before(id, storeRef(orig), 0);
            Module._cloak_set_cloaked(id, 1);
            return chain
        };
        chain.and = chain;
        return chain
    }
    if (typeof module !== "undefined" && module.exports) {
        module.exports = cloakFn
    } else {
        (typeof window !== "undefined" ? window : this).cloak = cloakFn
    }
    return cloakFn
}();
