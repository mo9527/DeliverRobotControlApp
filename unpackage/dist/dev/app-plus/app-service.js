if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function requireNativePlugin(name) {
    return weex.requireModule(name);
  }
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$3 = {
    data() {
      return {
        grids: [
          { name: "货仓门控制", path: "/pages/index/gate" },
          { name: "丝杆控制", path: "/pages/index/screwRod" }
        ]
      };
    },
    onLoad() {
    },
    methods: {
      //子页面
      goToSubPage(index, name, itemPath) {
        formatAppLog("log", "at pages/index/index.vue:33", index, name, itemPath);
        if (name == "N/A") {
          uni.showToast({
            title: "功能未开放"
          });
          return;
        }
        uni.navigateTo({
          url: itemPath + `?id=${index}&name=${encodeURIComponent(name)}`
        });
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "grid" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.grids, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              class: "grid-item",
              onClick: ($event) => $options.goToSubPage(index + 1, item.name, item.path)
            }, [
              vue.createElementVNode(
                "text",
                { class: "menu-text" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "E:/02_code/05_uniapp_project/demoapp/demoapp/pages/index/index.vue"]]);
  var wanyiPlugin$1 = requireNativePlugin("WanyiUniappPlugins");
  const _sfc_main$2 = {
    data() {
      return {
        gridId: "",
        menuName: "",
        doorStatus: ""
        //仓门状态
      };
    },
    mounted() {
    },
    created() {
      this.updateGateStatus();
    },
    onLoad(options) {
      this.gridId = options.id || "未知";
      this.menuName = decodeURIComponent(options.name || "未知");
      uni.setNavigationBarTitle({
        title: this.menuName
      });
    },
    methods: {
      openGate() {
        wanyiPlugin$1.openGate({
          "gate": 1
        }, (res) => {
          uni.showToast({
            title: res.message
          });
          if (res.data === "open") {
            this.doorStatus = "开启";
          } else {
            this.doorStatus = "关闭";
          }
        });
      },
      updateGateStatus() {
        wanyiPlugin$1.gateStatus({}, (res) => {
          formatAppLog("log", "at pages/index/gate.vue:58", "查询门状态：", res);
          if (res.status == 0) {
            this.doorStatus = res.data === "open" ? "开启" : "关闭";
          } else {
            this.doorStatus = res.message;
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "subpage" }, [
      vue.createCommentVNode(" 仓门状态 "),
      vue.createElementVNode("view", null, [
        vue.createElementVNode(
          "view",
          { class: "status-label" },
          "仓门状态：" + vue.toDisplayString($data.doorStatus),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", {
          class: "center-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.openGate && $options.openGate(...args))
        }, "开仓门")
      ])
    ]);
  }
  const PagesIndexGate = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "E:/02_code/05_uniapp_project/demoapp/demoapp/pages/index/gate.vue"]]);
  var wanyiPlugin = requireNativePlugin("WanyiUniappPlugins");
  const _sfc_main$1 = {
    data() {
      return {
        floor: 0
      };
    },
    mounted() {
    },
    onLoad(options) {
      this.gridId = options.id || "未知";
      this.menuName = decodeURIComponent(options.name || "未知");
      uni.setNavigationBarTitle({
        title: this.menuName
      });
    },
    methods: {
      moveTo(floor) {
        wanyiPlugin.screwRodMoveTo({
          "floor": this.floor
        }, (res) => {
          uni.showToast({
            title: res.message
          });
        });
      },
      cargoMove(floor) {
        wanyiPlugin.cargoMove({
          "floor": this.floor
        }, (res) => {
          uni.showToast({
            title: res.message
          });
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "subpage" }, [
      vue.createElementVNode("view", { class: "uni-form-item uni-column" }, [
        vue.createElementVNode("view", { class: "title" }, "去往的层数"),
        vue.createElementVNode("view", null, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "uni-input",
              type: "number",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.floor = $event),
              placeholder: "输入要去往的层数"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $data.floor]
          ])
        ]),
        vue.createElementVNode("view", {
          class: "center-button",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.moveTo && $options.moveTo(...args))
        }, "Go"),
        vue.createElementVNode("view", { class: "title" }, "去往的层数"),
        vue.createElementVNode("view", {
          class: "center-button",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.cargoMove && $options.cargoMove(...args))
        }, "货道1开始移动")
      ])
    ]);
  }
  const PagesIndexScrewRod = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "E:/02_code/05_uniapp_project/demoapp/demoapp/pages/index/screwRod.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/index/gate", PagesIndexGate);
  __definePage("pages/index/screwRod", PagesIndexScrewRod);
  requireNativePlugin("WanyiUniappPlugins");
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:9", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:12", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "E:/02_code/05_uniapp_project/demoapp/demoapp/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
