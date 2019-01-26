// <script src="//jsapi.qq.com/get?api=app.share"></script>

browser.app.share({
    title: share.title,
    description: share.desc,
    url: share.share_url,
    img_url: share.image_url,
    from: '掌上理工大',
    to_app: platform
})