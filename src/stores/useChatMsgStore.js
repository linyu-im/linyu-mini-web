import {defineStore} from 'pinia';

export const useChatMsgStore = defineStore('chat-msg', {
    state: () => ({
        referenceMsg: null, //要引用的消息
    }),
    actions: {
        setReferenceMsg(msg) {
            this.referenceMsg = msg;
        },
    },
});
