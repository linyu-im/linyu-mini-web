import Http from "@/utils/axios";

export default {
    group() {
        return Http.get("/api/v1/chat-list/group");
    },
    privateList() {
        return Http.get("/api/v1/chat-list/private/list");
    },
    create(param) {
        return Http.post("/api/v1/chat-list/create", param);
    },
};