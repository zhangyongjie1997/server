import { baseUrl } from "./lib/config.js";
export const loginMinix = {
  data() {
    return {
      baseUrl: baseUrl,
    }
  },
  computed: {
    isLogin(){
      return this.$store.state.user && this.$store.state.user.phone
    }
  },
  filters: {
    dateFormatter(val){
      console.log(new Date(val/1000))
      return new Date(val/1000).format();
    }
  }
}