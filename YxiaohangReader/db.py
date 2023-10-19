import sqlite3

import click
from flask import current_app, g
from flask.cli import with_appcontext


def get_db():
    """建立数据库连接"""
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)
    """断开数据库连接"""
    if db is not None:
        db.close()


def init_db():
    """初始化数据库"""
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
@with_appcontext
def init_db_command():
    """清空现有数据并创建新表"""
    init_db()
    click.echo('已初始化数据库')


def init_app(app):
    """初始化app应用"""
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)


