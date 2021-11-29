FROM node:gallium-alpine3.12

# Copy the contents of the repo into the /app folder inside the container
COPY . /app
# Update the current working directory to the /app folder
WORKDIR /app

# Add your CLI's installation setups here
RUN npm install
RUN npm link

ENTRYPOINT ["/usr/local/bin/ms-notify"]
