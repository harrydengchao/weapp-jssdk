const share = {
    title: '分享标题',
    desc: '分享内容',
    image_url: '图片URL',
    share_url: '分享链接'
};
const isiOS = /(iPhone|iPad|iPod)/.test(navigator.userAgent);  // 判断应用平台
if (isiOS) {
    if (ucbrowser.web_shareEX) {
        ucbrowser.web_shareEX(
            JSON.stringify({
                title: share.title,
                content: share.desc,
                sourceUrl: share.share_url,
                imageUrl: share.image_url,
                source: '掌上理工大',
                target: platform
            })
        )
    } else {
        ucbrowser.web_share(share.title, share.desc, share.share_url, platform, '', '掌上理工大', share.image_url);
    }
}
else ucweb.startRequest('shell.page_share', [share.title, share.desc, share.share_url, platform, '', '掌上理工大', share.image_url]);