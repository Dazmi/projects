FROM ubuntu:18.04

RUN apt-get update -y && \
    apt-get install -y python-pip python-dev && \
    pip install --upgrade pip

COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
EXPOSE 5000
CMD [ "python", "./app.py" ]


# # google cloud run
# FROM python:3.7
# ENV APP_HOME /app
# WORKDIR $APP_HOME
# COPY . .
# RUN pip install Flask gunicorn
# RUN pip install -r requirements.txt
# CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app