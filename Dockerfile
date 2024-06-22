# Use Amazon Linux 2 as the base image
FROM amazonlinux:2

# Install necessary tools
RUN yum update -y && \
    yum install -y python3 python3-pip zip unzip tar gzip gcc make git

# Install Node.js
RUN curl -sL https://rpm.nodesource.com/setup_14.x | bash - && \
    yum install -y nodejs

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf aws awscliv2.zip

# Install AWS SAM CLI
RUN pip3 install --upgrade pip && \
    pip3 install aws-sam-cli

# Install TypeScript globally
RUN npm install -g typescript

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 3000 for SAM local API
EXPOSE 3000

# Set the default command to run SAM local API
CMD ["sam", "local", "start-api", "--host", "0.0.0.0"]