## Safari Bookmarks Editor
这个项目用于编辑Mac OS下, Safari书签的简单应用. 基于Python3.8,  Flask1.1.1, Vue2.6

## 参考:
```
读取Safari Bookmark
https://sspai.com/post/53996

Python 读取plist
https://docs.python.org/zh-cn/3.6/library/plistlib.html
```


## 启动流程
```
1, 读取~/Library/Safari/Bookmarks.plist到本地目录;
2, 初始化数据到本地: sqlite DB;
3, 读取数据到Web页面;
4, 页面操作: Like or delete !
```