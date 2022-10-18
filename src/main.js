import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(far);
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fab);

import App from "./App.vue";
import router from "./router";

import axios from "axios";
import VueAxios from "vue-axios";

const app = createApp(App);

/* add icons to the library */

app
  .use(ElementPlus, { size: "small", zIndex: 3000 })
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(VueAxios, axios)
  .use(router)
  .mount("#app");
