<template>
  <div class="main-container">
    <div class="photo hidden-md-and-down">
      <img src="@/assets/img/player.jpg" />
      <a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@benearlweber?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Ben Weber"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Ben Weber</span></a>
    </div>
    <div class="main-content">
      <transition name="fade" appear>
        <div class="main-form">

          <div class="logo-wrapper">
            <img src="http://via.placeholder.com/100x100">
          </div>

          <slot />

        </div>
      </transition>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'startup-layout',
    data(){
      return{
        isLoading: false
      }
    }
  }
</script>

<style>
  html{
    overflow-y: hidden;
  }
</style>


<style lang="scss" scoped>
  .main-container{
    display: flex;
    height: 100vh;
  }

  .photo{
    height: 100%;
    position: relative;

    & img{
      height: 100%;
      max-width: 100%;
    }

    & a{
      position: absolute;
      left: 10px;
      bottom: 10px;
      z-index: 10;
    }
  }

  .main-content {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    overflow-y: scroll;
    min-height: 100vh;
    max-height: 200vh;
    flex-shrink: 0;
  }

  .main-form {
    width: 250px;
    display: inline-block;
    flex-shrink: 0;

    @media(max-width: 600px){
      width: 70%;
      padding: 30px 0;
    }

  }

  .logo-wrapper{
    display: inline-block;
    margin-bottom: 30px;
    width: 100%;
    text-align: center;
    min-height: 0;
    box-sizing: content-box;

    & img{
      width: 100px;
      height: 100px;
    }
  }
</style>
