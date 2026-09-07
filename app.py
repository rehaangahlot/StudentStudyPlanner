from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

DATABASE = "study_planner.db"


# =========================
# DATABASE
# =========================

def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_database():

    connection = get_db()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT NOT NULL,
            topic TEXT NOT NULL,
            date TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    """)

    connection.commit()
    connection.close()


# =========================
# HOME
# =========================

@app.route("/")
def home():

    connection = get_db()

    tasks = connection.execute("""
        SELECT *
        FROM tasks
        ORDER BY date ASC, id DESC
    """).fetchall()

    connection.close()

    total_tasks = len(tasks)

    completed_tasks = sum(
        1 for task in tasks
        if task["completed"] == 1
    )

    pending_tasks = total_tasks - completed_tasks

    if total_tasks > 0:
        percentage = int(
            (completed_tasks / total_tasks) * 100
        )
    else:
        percentage = 0

    return render_template(
        "index.html",
        tasks=tasks,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        pending_tasks=pending_tasks,
        percentage=percentage
    )


# =========================
# ADD TASK
# =========================

@app.route("/add", methods=["POST"])
def add_task():

    subject = request.form.get("subject", "").strip()
    topic = request.form.get("topic", "").strip()
    task_date = request.form.get("date", "").strip()

    if not subject or not topic or not task_date:
        return redirect(url_for("home"))

    connection = get_db()

    connection.execute("""
        INSERT INTO tasks
        (subject, topic, date, completed)
        VALUES (?, ?, ?, 0)
    """, (subject, topic, task_date))

    connection.commit()
    connection.close()

    return redirect(url_for("home"))


# =========================
# COMPLETE TASK
# =========================

@app.route("/complete-task/<int:task_id>", methods=["POST"])
def complete_task(task_id):

    connection = get_db()

    connection.execute("""
        UPDATE tasks
        SET completed = 1
        WHERE id = ?
    """, (task_id,))

    connection.commit()
    connection.close()

    return redirect(url_for("home"))


# =========================
# UNDO TASK
# =========================

@app.route("/undo-task/<int:task_id>", methods=["POST"])
def undo_task(task_id):

    connection = get_db()

    connection.execute("""
        UPDATE tasks
        SET completed = 0
        WHERE id = ?
    """, (task_id,))

    connection.commit()
    connection.close()

    return redirect(url_for("home"))


# =========================
# DELETE TASK
# =========================

@app.route("/delete-task/<int:task_id>", methods=["POST"])
def delete_task(task_id):

    connection = get_db()

    connection.execute("""
        DELETE FROM tasks
        WHERE id = ?
    """, (task_id,))

    connection.commit()
    connection.close()

    return redirect(url_for("home"))


# =========================
# EDIT TASK
# =========================

@app.route("/edit-task/<int:task_id>", methods=["GET", "POST"])
def edit_task(task_id):

    connection = get_db()

    task = connection.execute("""
        SELECT *
        FROM tasks
        WHERE id = ?
    """, (task_id,)).fetchone()

    if task is None:
        connection.close()
        return redirect(url_for("home"))

    if request.method == "POST":

        subject = request.form.get("subject", "").strip()
        topic = request.form.get("topic", "").strip()
        task_date = request.form.get("date", "").strip()

        if subject and topic and task_date:

            connection.execute("""
                UPDATE tasks
                SET subject = ?,
                    topic = ?,
                    date = ?
                WHERE id = ?
            """, (
                subject,
                topic,
                task_date,
                task_id
            ))

            connection.commit()

        connection.close()

        return redirect(url_for("home"))

    connection.close()

    return render_template(
        "edit.html",
        task=task
    )


# =========================
# START
# =========================

if __name__ == "__main__":

    create_database()

    app.run(debug=True)