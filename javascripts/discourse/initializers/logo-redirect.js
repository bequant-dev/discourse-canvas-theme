import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "logo-redirect",
  initialize() {
    withPluginApi("0.8.31", api => {
      // Use the recommended Discourse API to change logo href
      api.changeWidgetSetting('home-logo', 'href', 'https://bequant.dev');
    });
  }
}; 