#!/usr/bin/env bash

# Add environment script tag to index.html
awk '/<head>/{print;print "    <script type=\"text/javascript\" src=\"/environment.js\"></script>";next}1' /usr/share/nginx/html/index.html > /usr/share/nginx/html/temp.txt && mv /usr/share/nginx/html/temp.txt /usr/share/nginx/html/index.html

# Construct an up to date environment.js file
echo "window.ENV = {
  \"apiHost\": \"$VITE_API_HOST\",
};" > /usr/share/nginx/html/environment.js;

# Create the nginx conf file with the specified port number
envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Transfer control to nginx to begin serving files
nginx -g "daemon off;"
