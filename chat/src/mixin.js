export const loginMinix = {
  computed: {
    isLogin(){
      return this.$store.state.user && this.$store.state.user.phone
    }
  }
}