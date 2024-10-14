import plugin from '../plugin.json';

import sidebarStyle from './components/sidebar.scss';
import settingsStyle from './components/settings.scss';
import checkboxStyle from './components/checkbox.scss';
import dialogStyle from './components/dialog.scss';
import menuStyle from './components/menu.scss';
import pageStyle from './components/page.scss';
import pallettesStyle from './components/pallettes.scss';
import hintsStyle from './components/hints.scss';

const appSettings = acode.require('settings');

class BetterUi {
  static UI_TYPES = ['sidebar', 'settings', 'checkbox', 'dialog', 'menu', 'page', 'pallettes', 'hints'];
  constructor() {
    if (!this.settings) {
      appSettings.value[plugin.id] = {
        activeTypes: BetterUi.UI_TYPES,
        customCss: ''
      };

      appSettings.update(false);
    };
  };

  get settings() {
    return appSettings.value[plugin.id];
  }

  init() {
    this.$style = tag('style');

    if (this.settings.customCss.trim() !== '') {
      this.$style.textContent += this.settings.customCss.trim();
    };

    if (this.settings.activeTypes.includes('sidebar')) {
      this.$style.textContent += sidebarStyle;
    };

    if (this.settings.activeTypes.includes('settings')) {
      this.$style.textContent += settingsStyle;
    };

    if (this.settings.activeTypes.includes('checkbox')) {
      this.$style.textContent += checkboxStyle;
    };

    if (this.settings.activeTypes.includes('dialog')) {
      this.$style.textContent += dialogStyle;
    };

    if (this.settings.activeTypes.includes('menu')) {
      this.$style.textContent += menuStyle;
    };

    if (this.settings.activeTypes.includes('page')) {
      this.$style.textContent += pageStyle;
    };

    if (this.settings.activeTypes.includes('pallettes')) {
      this.$style.textContent += pallettesStyle;
    };
    
    if (this.settings.activeTypes.includes('hints')) {
      this.$style.textContent += hintsStyle;
    };
    

    document.head.append(this.$style);
  };

  destroy() {
    this.$style.remove();

    delete appSettings.value[plugin.id];
    appSettings.update(true);
  };

  getSettingsList() {
    return [{
      key: 'customCss',
      text: 'Add Custom Css',
      value: this.settings.customCss,
      info: 'Make your imaginations real.\nPlease edit content in sprate place and paste it here for better control.\n(NOTE: be careful this may broke the app)',
      prompt: 'Add Custom Css',
      promptType: 'textarea',
      promptOptions: {
        placeholder: '* {\n color: red \n}; \n\n...',
      }
    }, ...BetterUi.UI_TYPES.map(type => ({
      key: type,
      text: this.#firstUpperCase(type),
      checkbox: this.settings.activeTypes.includes(type)
    }))];
  };

  #firstUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  onSettingsChange(key, value) {
    if (key === 'customCss') {
      this.settings.customCss = value;
    } else if (value) {
      this.settings.activeTypes.push(key);
    } else {
      this.settings.activeTypes.splice(this.settings.activeTypes.indexOf(key), 1);
    };

    this.resetUi();
    appSettings.update(true);
  };

  resetUi() {
    this.$style.remove();
    this.init();
  };
};

if (window.acode) {
  const acodePlugin = new BetterUi();
  acode.setPluginInit(
    plugin.id,
    async (baseUrl, $page, cache) => {
      acodePlugin.baseUrl = !baseUrl.endsWith('/') ? baseUrl += '/' : baseUrl;
      await acodePlugin.init($page, cache.cacheFile, cache.cacheFileUrl);
    },
    {
      list: acodePlugin.getSettingsList(),
      cb: acodePlugin.onSettingsChange.bind(acodePlugin)
    }
  );

  acode.setPluginUnmount(plugin.id, () => acodePlugin.destroy());
};