from flask import Flask, render_template, request, Response
import os
import sys
from flask_sqlalchemy import SQLAlchemy
import click
from tool import read_reading_list
import json
from flask_marshmallow import Marshmallow
import time

WIN = sys.platform.startswith('win')
if WIN:
    prefix = 'sqlite:///'
else:
    prefix = 'sqlite:////'

app = Flask(__name__)
ma = Marshmallow(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL',
                                                  prefix + os.path.join(app.root_path, 'data', 'data.db'))
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# 避免和Vue冲突
app.jinja_env.block_start_string = '(%'  # 修改块开始符号
app.jinja_env.block_end_string = '%)'  # 修改块结束符号
app.jinja_env.variable_start_string = '(('  # 修改变量开始符号
app.jinja_env.variable_end_string = '))'  # 修改变量结束符号
app.jinja_env.comment_start_string = '(#'  # 修改注释开始符号
app.jinja_env.comment_end_string = '#)'  # 修改注释结束符号
app.jinja_env.auto_reload = True  # 热更新


class ReadingItem(db.Model):
    __tablename__ = 'reading_item'

    id = db.Column(db.Integer, primary_key=True)  # 主键
    dateAdded = db.Column(db.String(19), nullable=False, default='')  # 添加事件
    imgUrl = db.Column(db.String(300), nullable=False, default='')  # 图片地址
    preview = db.Column(db.String(200), nullable=False, default='')  # 预览字符
    title = db.Column(db.String(200), nullable=False, default='')  # 标题
    url = db.Column(db.String(200), unique=True, index=True, nullable=False, default='')
    isDeleted = db.Column(db.SMALLINT, default=0, nullable=False)  # 是否已删除, 默认0, 已删除1;


class ReadingItemSchema(ma.Schema):
    class Meta:
        # Fields to expose
        fields = ("id", "dateAdded", "imgUrl", 'preview', 'title', 'url', 'isDeleted')


reading_item_schema = ReadingItemSchema(many=True)


def init_data():
    print('==========初始化数据开始=========')
    tmp_list = read_reading_list()
    for tmp in tmp_list:
        one = ReadingItem.query.filter_by(url=tmp['url']).first()
        if one is None:
            record = ReadingItem(dateAdded=tmp['dateAdded'],
                                 imgUrl=tmp['imgUrl'],
                                 preview=tmp['preview'],
                                 title=tmp['title'],
                                 url=tmp['url'],
                                 isDeleted=0)
            db.session.add(record)
            print('保存: ' + tmp['title'])
        else:
            print('存在: ' + tmp['title'])

    db.session.commit()
    print('==========初始化数据完成=========')


@app.cli.command()  # 注册命令, 执行命令flask initdb 初始化, flask initdb --drop 删除后重建
@click.option('--drop', is_flag=True, help='Create after drop')  # 设置选项
def initdb(drop):
    # if drop:
    # db.drop_all()
    db.create_all()
    click.echo('==========Initialized database==========')
    init_data()


@app.route('/')
def index():
    # app.logger.debug('A value for debugging')
    app.logger.debug('====Welcome !=====')
    return render_template('index.html', time=int(time.time() * 1000))


@app.route('/bookmark/<int:page_num>')
def bookmark(page_num=1):
    page = ReadingItem.query.filter_by(isDeleted=0).paginate(page=page_num, per_page=20)

    item_list = reading_item_schema.dump(page.items)
    result = {
        'pageNum': page.page,
        'pageCount': page.pages,
        'total': page.total,
        'hasPrev': page.has_prev,
        'nextNum': page.next_num,
        'hasNext': page.has_next,
        'items': item_list,
    }
    return json.dumps(result), 200, {"Content-Type": "application/json"}


@app.route('/delete_item', methods=['POST'])
def delete_item():
    app.logger.debug('======Here=====')
    if not request.is_json:
        return '', 400, {"Content-Type": "application/json"}

    tmp_id = request.json['id']
    one = ReadingItem.query.get(tmp_id)
    if not one:
        return '', 404, {"Content-Type": "application/json"}
    else:
        one.isDeleted = 1
        db.session.commit()
        return request.json, 200, {"Content-Type": "application/json"}


# 指定flask run命令启动
if __name__ == '__main__':
    # init_data()
    app.run(host='127.0.0.1', port=5432, debug=True)
    # app.run()
