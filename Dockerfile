FROM nginx:alpine
COPY dist/candlestick-app /usr/share/nginx/html/candlestick-app
