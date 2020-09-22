<template>
  <div id="app">
    <img @click.right="hide" class="bg" src="https://shenzilong.cn/util/redirect_to_bing_daily_picture_address?" alt />
    <div v-show="countdown" class="c-center" :style="{ '--t': countdown }">
      <div>
        <div>编程防沉迷系统</div>
        <div class="c-text">{{ countdown }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./app.ts"></script>

<style scoped>
  #app {
    text-align: center;
    color: #2c3e50;
    user-select: none;
    position: fixed;
    width: 100vw;
    height: 100vh;
  }
  .bg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .c-center {
    font-size: 6vw;
    background: rgba(123, 122, 122, 0.21);
    display: inline-table;
    outline: #ffffffb0 solid 0.3rem;
    width: 150px;
    backdrop-filter: blur(calc(1px * var(--t)));

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: calc(100% - calc(15% - 1% * var(--t)) * 2);
    height: calc(100% - calc(15% - 1% * var(--t)) * 2);

    transition: all 0.3s;

    display: flex;
    justify-content: center;
    align-items: center;
  }
  .c-text {
    color: #fff;
    font-size: 100px;
    font-family: timeText;
  }
  @font-face {
    font-family: "timeText";
    src: url("//fr.wanw.xin/font/generate_fonts_dynamically.ttf?font=优设标题黑&text=0123456789") format("truetype");
    font-style: normal;
    font-weight: normal;
  }
</style>
