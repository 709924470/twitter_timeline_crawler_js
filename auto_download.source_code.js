javascript:(() => {
    var imgUrl = /https?:\/\/pbs\.twimg.com\/media\/(\S+)\?format=([a-z]+)/g;
    var primCol = null;
    var lastYOff = 0;
    var dlList = [];
    function startUp(){
        document.documentElement.scrollTop = document.body.scrollTop = 1;
        setInterval(scrolling,50);
        Array.prototype.slice.call(document.getElementsByTagName("img")).forEach((inode) => {
            if(imgUrl.test(inode.src)){
                downloadimg(inode.src);
            };
        });
        var change = new MutationObserver(function(muts){
            muts.forEach((mut) => {
                mut.addedNodes.forEach((node) => {
                    Array.prototype.slice.call(node.getElementsByTagName("img")).forEach((inode) => {
                        if(imgUrl.test(inode.src)){
                            downloadimg(inode.src);
                        };
                    });
                });
            });
        });
        Array.prototype.slice.call(document.body.getElementsByTagName("*")).forEach((item) => {
            if(item.dataset.testid == "primaryColumn"){
                primCol = item;
                change.observe(primCol, {
                    attributes: false,
                    characterData: false,
                    childList: true,
                    subtree: true,
                    attributeOldValue: false,
                    characterDataOldValue: false
                });
            };
        });
    };
    function downloadimg(url){
        var rgx = imgUrl.exec(url);
        var rgx = imgUrl.exec(url);
        var oriUrl = rgx[0];
        var fname = rgx[1];
        var ext = rgx[2];
        forceDownload(oriUrl,fname+"."+ext);
        //console.warn(oriUrl,fname+"."+ext);
    };
    function forceDownload(url, fileName){
        if(dlList.includes(fileName)){
            return;
        };
        dlList.push(fileName);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function(){
            var urlCreator = window.URL || window.webkitURL;
            var imageUrl = urlCreator.createObjectURL(this.response);
            var tag = document.createElement('a');
            tag.href = imageUrl;
            tag.download = fileName;
            document.body.appendChild(tag);
            tag.click();
            document.body.removeChild(tag);
        };
        xhr.send();
    };
    function scrolling(){
        var tmp = document.documentElement.scrollTop;
        lastYOff += 20;
        if (tmp != lastYOff){
            document.documentElement.scrollTop = document.body.scrollTop = lastYOff;
        }else{
            primCol.scrollIntoView(true);
        };
    };
    startUp();
})();