## An example of running asynchronous task using celery

### Requirements
 - [Python](https://www.python.org/)
 - [Celery](https://docs.celeryproject.org/en/latest/getting-started/first-steps-with-celery.html)
 - [Redis](https://redis.io/)

### Setup the app locally
- `git clone https://github.com/Georgeygigz/notify-me`
- to activate the virtual environment `pipenv shell`
- to install dependencies `pipenv install`


### Introduction
- This is a simple representation of how to run asynchronous tasks using celery and redis blocker
- Asynchronous implementation are used in many real life application ranging from(Email notification apps,
    calling external api and so on)
- In this example I have implemented a simple app where we have a function that is simulating a task
  that takes 20 seconds to execute to completion.

- I have compared two app `synchronous_task` which is running `synchronously` and `task` which runs `asynchronously`

- If you run `synchronous_task.py` using this command `python synchronous_task.py` you will notice that
  this line is printed on the terminal `The begining!`, then after twenty seconds elaps, this line is printed  `... the end of app execution`. This means that we had to wait for 20 second in order to get the response  after a task in our program was executed.

- To solve the above problem, we have used Celery and Redis to ques our task and execute that task that
  is taking too long asynchronously.


### Run the asynchronous task
- `celery -A task worker -l info`
- You will notice  these two lines below, are executed almost the same time

 ``` The begining!```
  ``` ... the end of app execution```

- Finally you will realize that after 20 seconds the task is being executed
```[2020-01-17 22:09:09,294: INFO/ForkPoolWorker-6] Task task.sleep_asynchronously[e683d854-65ad-4a61-a824-13c2a2c58ac0] succeeded in 20.022739520005416s:```


