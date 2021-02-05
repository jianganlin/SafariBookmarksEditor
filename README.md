## Safari Bookmarks Editor
这个项目用于编辑Mac OS下, Safari书签的简单应用. 基于Python3.8,  Flask1.1.1, Vue2.6

## 参考:
```
读取Safari Bookmark
https://sspai.com/post/53996

Python 读取plist
https://docs.python.org/zh-cn/3.6/library/plistlib.html

flask入门:
https://zhuanlan.zhihu.com/p/94617478
```


## 启动流程
```
1, 读取~/Library/Safari/Bookmarks.plist到本地目录;
2, 初始化数据到本地: sqlite DB;
3, 读取数据到Web页面;
4, 页面操作: Like or delete !
```

## 安装
```
创建虚拟环境:
python3 -m venv venv

激活环境:
venv/bin/activate

安装flask:
pip install flask

安装数据库依赖:
pip install flask_sqlalchemy

安装数据映射
pip install flask-marshmallow

启动: 
flask run
```