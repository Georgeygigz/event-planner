# task.py
import time

def sleep_asynchronously():
    """
    This function simulates a task that takes 20 seconds to
    execute to completion.
    """
    time.sleep(20)


print("The begining!")


# invoking the synchronous task
sleep_asynchronously()
print("... the end of app execution")
