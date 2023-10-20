import functools

from flask import (
    Blueprint, render_template, url_for, redirect, flash, request, session, g,
)

from YxiaohangReader.db import get_db


bp = Blueprint('index', __name__)


@bp.before_app_request
def load_logged_in_archive():
    """判断存档id以决定是否提供连接"""
    archive_id = session.get('archive_id')

    if archive_id is None:
        g.archive = None
    else:
        g.archive = get_db().execute(
            'SELECT * FROM archive WHERE id = ?', (archive_id,)
        ).fetchone()


def selectArchive_required(view):
    """定义检查存档状态的装饰器"""
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.archive is None:
            return redirect(url_for('index.selectArchive'))
        return view(**kwargs)

    return wrapped_view


@bp.route('/logout')
def logout():
    """注销操作"""
    session.clear()
    return redirect(url_for('selectArchive'))


@bp.route('/createArchive', methods=('GET', 'POST'))
def createArchive():
    """创建存档视图"""
    if request.method == 'POST':
        archivename = request.form['archivename']
        db = get_db()
        error = None

        if not archivename:
            error = '请输入存档名'
        elif db.execute(
            'SELECT id FROM archive WHERE archivename = ?', (archivename,)
        ).fetchone() is not None:
            error = '{}存档名已存在'.format(archivename)

        if error is None:
            db.execute(
                'INSERT INTO archive (archivename)'
                'VALUES (?)',
                (archivename)
            )
            db.commit()
            return redirect(url_for('index.selectArchive'))

        flash(error)

    return render_template('index/createarchive.html')


@bp.route('/', methods=('GET', 'POST'))
def selectArchive():
    """选择存档视图"""
    if request.method == 'POST':
        archivename = request.form['archivename']
        db = get_db()
        error = None
        archive = db.execute(
            'SELECT * FROM archive WHERE archivename = ?', (archivename,)
        ).fetchone()

        if archive is None:
            error = '该存档不存在'

        if error is None:
            session.clear()
            session['archive_id'] = archive['id']
            return redirect(url_for('index.selectArchive'))

        flash(error)

    return render_template('index/selectArchive.html')

