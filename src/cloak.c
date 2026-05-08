#include <emscripten.h>
#include <stdlib.h>
#include <string.h>

#define MAX_HOOKS 64
#define MAX_INSTANCES 32

EM_JS(void, log_startup, (), {
    console.log("alr c code has been started as asm js and is now running");
    console.log("ok received request:");
    console.log("  Title: " + document.title);
    var favicon = "";
    var links = document.querySelectorAll("link[rel*='icon']");
    if (links.length > 0) {
        favicon = links[links.length - 1].href;
    }
    console.log("  Favicon: " + (favicon || "(none)"));
});

typedef struct {
    int condition_js_ref;
    int replacement_fn_ref;
} Hook;

typedef struct {
    Hook before_hooks[MAX_HOOKS];
    int before_count;
    Hook after_hooks[MAX_HOOKS];
    int after_count;
    int cloaked;
    int last_when_condition_ref;
    int original_fn_ref;
    int active;
} CloakInstance;

static CloakInstance instances[MAX_INSTANCES];
static int initialized = 0;

EMSCRIPTEN_KEEPALIVE
void cloak_init(void) {
    if (initialized) return;
    memset(instances, 0, sizeof(instances));
    initialized = 1;
    log_startup();
}

EMSCRIPTEN_KEEPALIVE
int cloak_create(int original_fn_ref) {
    if (!initialized) cloak_init();
    for (int i = 0; i < MAX_INSTANCES; i++) {
        if (!instances[i].active) {
            memset(&instances[i], 0, sizeof(CloakInstance));
            instances[i].active = 1;
            instances[i].original_fn_ref = original_fn_ref;
            instances[i].last_when_condition_ref = -1;
            instances[i].cloaked = 0;
            return i;
        }
    }
    return -1;
}

EMSCRIPTEN_KEEPALIVE
void cloak_set_cloaked(int id, int val) {
    if (id >= 0 && id < MAX_INSTANCES && instances[id].active)
        instances[id].cloaked = val;
}

EMSCRIPTEN_KEEPALIVE
int cloak_is_cloaked(int id) {
    if (id >= 0 && id < MAX_INSTANCES && instances[id].active)
        return instances[id].cloaked;
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int cloak_get_original(int id) {
    if (id >= 0 && id < MAX_INSTANCES && instances[id].active)
        return instances[id].original_fn_ref;
    return -1;
}

EMSCRIPTEN_KEEPALIVE
void cloak_set_when(int id, int condition_ref) {
    if (id >= 0 && id < MAX_INSTANCES && instances[id].active)
        instances[id].last_when_condition_ref = condition_ref;
}

EMSCRIPTEN_KEEPALIVE
int cloak_add_before(int id, int replacement_fn_ref, int at_start) {
    if (id < 0 || id >= MAX_INSTANCES || !instances[id].active) return -1;
    CloakInstance *inst = &instances[id];
    if (inst->before_count >= MAX_HOOKS) return -1;

    Hook h;
    h.condition_js_ref = inst->last_when_condition_ref;
    h.replacement_fn_ref = replacement_fn_ref;

    if (at_start) {
        memmove(&inst->before_hooks[1], &inst->before_hooks[0],
                inst->before_count * sizeof(Hook));
        inst->before_hooks[0] = h;
    } else {
        inst->before_hooks[inst->before_count] = h;
    }
    inst->before_count++;
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int cloak_add_after(int id, int replacement_fn_ref) {
    if (id < 0 || id >= MAX_INSTANCES || !instances[id].active) return -1;
    CloakInstance *inst = &instances[id];
    if (inst->after_count >= MAX_HOOKS) return -1;

    Hook h;
    h.condition_js_ref = inst->last_when_condition_ref;
    h.replacement_fn_ref = replacement_fn_ref;

    inst->after_hooks[inst->after_count] = h;
    inst->after_count++;
    return 0;
}

EMSCRIPTEN_KEEPALIVE
int cloak_get_before_count(int id) {
    if (id < 0 || id >= MAX_INSTANCES || !instances[id].active) return 0;
    return instances[id].before_count;
}

EMSCRIPTEN_KEEPALIVE
int cloak_get_after_count(int id) {
    if (id < 0 || id >= MAX_INSTANCES || !instances[id].active) return 0;
    return instances[id].after_count;
}

EMSCRIPTEN_KEEPALIVE
int cloak_get_before_condition(int id, int idx) {
    if (id < 0 || id >= MAX_INSTANCES || !instances[id].active) return -1;
    if (idx < 0 || idx >= instances[id].before_count) return -1;
    return instances[id].before_hooks[idx].condition_js_ref;
}

EMSCRIPTEN_KEEPALIVE
int cloak_get_before_fn(int id, int idx) {
    if (id < 0 || id >= MAX_INSTANCES || !instances[id].active) return -1;
    if (idx < 0 || idx >= instances[id].before_count) return -1;
    return instances[id].before_hooks[idx].replacement_fn_ref;
}

EMSCRIPTEN_KEEPALIVE
int cloak_get_after_condition(int id, int idx) {
    if (id < 0 || id >= MAX_INSTANCES || !instances[id].active) return -1;
    if (idx < 0 || idx >= instances[id].after_count) return -1;
    return instances[id].after_hooks[idx].condition_js_ref;
}

EMSCRIPTEN_KEEPALIVE
int cloak_get_after_fn(int id, int idx) {
    if (id < 0 || id >= MAX_INSTANCES || !instances[id].active) return -1;
    if (idx < 0 || idx >= instances[id].after_count) return -1;
    return instances[id].after_hooks[idx].replacement_fn_ref;
}

EMSCRIPTEN_KEEPALIVE
void cloak_destroy(int id) {
    if (id >= 0 && id < MAX_INSTANCES)
        instances[id].active = 0;
}
