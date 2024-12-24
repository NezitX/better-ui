import plugin from "../plugin.json";
import Styles from './styles/index.js';

const appSettings = acode.require("settings");
const fs = acode.require("fs");
const EditorFile = acode.require("EditorFile");
const actionStack = acode.require("actionStack");

// api
const BetterUI = {};

//// constants
BetterUI.UiPath = `${window.DATA_STORAGE}/ui`;
BetterUI.CustomCssPath = `${BetterUI.UiPath}/BetterUI.custom.css`;
BetterUI.UiTypes = Object.keys(Styles);

class BetterUi {
  constructor() {
    if (!this.settings) {
      appSettings.value[plugin.id] = {
        activeTypes: BetterUI.UiTypes
      };

      appSettings.update(false);
    }
  }

  get settings() {
    return appSettings.value[plugin.id];
  }

  async init() {
    // check if ui dir exist or not create one
    const isUiDirExist = await fs(BetterUI.UiPath).exists();
    if (!isUiDirExist) {
      await fs(window.DATA_STORAGE).createDirectory("ui");
    }

    // check if custom css file exist or not create one
    const isCustomCssExist = await fs(BetterUI.CustomCssPath).exists();
    if (!isCustomCssExist) {
      await fs(BetterUI.UiPath).createFile(
        "BetterUI.custom.css",
        '/* A custom css file for "Better UI" plugin */' +
          "\n/* WARNING: Use carefully this might broke app */"
      );
    }

    this.$style = tag("style");
    this.$custom = tag("link", {
      rel: "stylesheet",
      href:
        (await acode.toInternalUrl(
          `${window.DATA_STORAGE}/ui/BetterUI.custom.css`
        )) +
        "?v=" +
        new Date().getTime() // avoid broswer cache
    });

    const activeTypes = this.settings.activeTypes;
    for (const type of activeTypes)
      this.$style.textContent += Styles[type?.toLowerCase()] ?? "";

    document.head.append(this.$style, this.$custom);
  }

  destroy() {
    this.$style.remove();
    this.$custom.remove();

    delete appSettings.value[plugin.id];
    appSettings.update(true);
  }

  getSettingsList() {
    return [
      {
        key: "customCss",
        text: "Add Custom Css",
        info: "Make your imaginations real.\nPlease edit content in sprate place and paste it here for better control.\n(NOTE: be careful this may broke the app)"
      },
      ...BetterUI.UiTypes.map(type => ({
        key: type,
        text: firstUpperCase(type),
        checkbox: this.settings.activeTypes.includes(type)
      }))
    ];
  }

  async onSettingsChange(key, value) {
    if (key === "customCss") {
      const editorFile = new EditorFile("BetterUI.custom.css", {
        uri: `${window.DATA_STORAGE}/ui/BetterUI.custom.css`
      });

      editorFile.on("save", async () => {
        console.log("[DEBUG][BETTER_UI]\nCustom css file has been saved");
        await this.resetUi();
      });

      actionStack.pop(actionStack.length);
    } else if (value) {
      this.settings.activeTypes.push(key);
    } else {
      this.settings.activeTypes.splice(
        this.settings.activeTypes.indexOf(key),
        1
      );
    }

    await this.resetUi();
    appSettings.update(true);
  }

  async resetUi() {
    this.$style.remove();
    this.$custom.remove();

    await this.init();
    console.log("[DEBUG][BETTER_UI]\nPlugin has been reset");
  }
}

function firstUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

if (window.acode) {
  const betterUI = new BetterUi();

  BetterUi.resetUi = async () => await betterUI.resetUi();
  acode.define("@better/ui", BetterUI);

  acode.setPluginInit(
    plugin.id,
    async (baseUrl, $page, cache) => {
      betterUI.baseUrl = !baseUrl.endsWith("/") ? (baseUrl += "/") : baseUrl;
      await betterUI.init($page, cache.cacheFile, cache.cacheFileUrl);
    },
    {
      list: betterUI.getSettingsList(),
      cb: betterUI.onSettingsChange.bind(betterUI)
    }
  );

  acode.setPluginUnmount(plugin.id, async () => await betterUI.destroy());
}
