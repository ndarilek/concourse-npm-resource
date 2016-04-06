FROM node:5
COPY package.json /opt/resource/package.json
RUN cd /opt/resource && \
  npm install
COPY check.js /opt/resource/check
COPY in.js /opt/resource/in
COPY out.js /opt/resource/out
RUN chmod +x /opt/resource/check /opt/resource/in /opt/resource/out
