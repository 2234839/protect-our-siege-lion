import Vue from "vue";
import { ipcRenderer } from 'electron';
import { Event_Name } from './EventName';

let time=Date.now()

export default Vue.extend({
    methods: {
        hide() {
            if(Date.now()-time<500){
                ipcRenderer.send(Event_Name.main_hide_window)
            }
            time = Date.now()
        }
    }
});