import { proxy } from "valtio";

export const authInfoStore = proxy({
    email: '',
    level: '',
    factorId: '',
    setEmaill(text: string) {
        this.email = text
    },
    setLevel(text: string) {
        this.level = text
    },
    setId(text: string) {
        this.factorId = text
    }
})