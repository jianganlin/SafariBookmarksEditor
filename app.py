from flask import Flask, render_template

app = Flask(__name__)

# 避免和Vue冲突
app.jinja_env.block_start_string = '(%'  # 修改块开始符号
app.jinja_env.block_end_string = '%)'  # 修改块结束符号
app.jinja_env.variable_start_string = '(('  # 修改变量开始符号
app.jinja_env.variable_end_string = '))'  # 修改变量结束符号
app.jinja_env.comment_start_string = '(#'  # 修改注释开始符号
app.jinja_env.comment_end_string = '#)'  # 修改注释结束符号


@app.route('/')
def index():
    # app.logger.debug('A value for debugging')
    app.logger.debug('====Welcome !=====')
    return render_template('index.html')


@app.route('/hello')
def hello():
    return 'Hello'


@app.route('/bookmark/<int:page_num>')
def bookmark(page_num=1):
    return 'Bookmark page %d' % page_num


if __name__ == '__main__':
    # app.run(host='127.0.0.1', port=8000, debug=True)
    app.run()
