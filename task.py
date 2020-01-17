# task.py
import time
from celery import Celery


app = Celery("task", broker="redis://localhost:6379/0")

# extract the time consuming portion of code and place it into
# a separate block
@app.task
def sleep_asynchronously():
    """
    This function simulates a task that takes 20 seconds to
    execute to completion.
    """
    time.sleep(20)
    print("Finally!! I have been executed")
    


print("The begining!")


# invoking the asynchronous task
sleep_asynchronously.delay()
print("... the end of app execution")
