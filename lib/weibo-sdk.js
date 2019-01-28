export default class WBSDK {
  constructor() {

  }
  
  share(shareInfo) {
    window.location.replace(`https://service.weibo.com/share/share.php?url=${shareInfo.url}&title=${shareInfo.title}&ralateUid=${shareInfo.ralateUid}&pic=${shareInfo.imgUrl}&searchPic=false`)
  }
}
