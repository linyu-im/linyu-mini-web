FROM nginx:alpine

COPY ./dist /usr/share/nginx/html

COPY ./deploy/nginx.conf /etc/nginx/nginx.conf

COPY ./deploy/set-server-url.sh /usr/local/bin/set-server-url.sh

RUN chmod +x /usr/local/bin/set-server-url.sh

EXPOSE 80 443

CMD ["sh", "-c", "/usr/local/bin/set-server-url.sh && nginx -g 'daemon off;'"]