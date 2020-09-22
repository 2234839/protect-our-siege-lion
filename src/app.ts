import { computed, defineComponent, ref } from "@vue/composition-api";
import { ipcRenderer } from "electron";
import { Event_Name } from "./EventName";

export default defineComponent({
  setup() {
    const showTime = ref(Date.now());
    const currentTime = ref(Date.now());
    setInterval(() => {
      currentTime.value = Date.now();
    }, 26);

    let old = Date.now();

    function hide() {
      if (Date.now() - old < 500) {
        ipcRenderer.send(Event_Name.main_hide_window);
      }
      old = Date.now();
    }

    const countdown = computed(() => {
      const s = Math.floor((currentTime.value - showTime.value) / 1000);
      const t = 15 - s;
      if (t < 0) {
        return 0;
      }
      return t;
    });

    ipcRenderer.on(Event_Name.main_show_window, () => {
      showTime.value = Date.now();
    });
    return { hide, countdown };
  },
});
