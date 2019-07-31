# Docker
FROM python:3.7
COPY . /app
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt
CMD [ "python", "./app.py" ]


# # google cloud run
# FROM python:3.7
# ENV APP_HOME /app
# WORKDIR $APP_HOME
# COPY . .
# RUN pip install Flask gunicorn
# RUN pip install --no-cache-dir -r requirements.txt
# CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 app:app