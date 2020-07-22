#Grab the latest alpine image
FROM nginx:1.15
COPY ./ /usr/share/nginx/html

# Change permissions
RUN chmod -R 755 /usr/share/nginx/html/

# Generate credentials for basic auth
RUN apt update
RUN apt -y install apache2-utils
RUN htpasswd -b -c /etc/nginx/.htpasswd admin Admin123