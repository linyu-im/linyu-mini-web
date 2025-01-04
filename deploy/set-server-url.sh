#!/bin/sh
# 替换Vue打包后的API URL地址
echo "Replacing API URL in dist"
sed -i "s|http://127.0.0.1:9200|$SERVER_HTTP_URL|g" /usr/share/nginx/html/assets/*.js
sed -i "s|ws://127.0.0.1:9100|$SERVER_WS_URL|g" /usr/share/nginx/html/assets/*.js
exec "$@"
