FROM node:5
COPY check.js /opt/resource/check
COPY in.js /opt/resource/in
COPY out.js /opt/resource/out
RUN chmod +x /opt/resource/*
