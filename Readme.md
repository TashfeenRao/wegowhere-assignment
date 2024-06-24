# React Native Payment app

## Setup

Clone the repository:

```bash
git clone https://github.com/TashfeenRao/wegowhere-assignment.git

cd FE

npm install

npm run start

```

press a and open the android emulator or scan QR code in your mobile's expo go app which can downloaded from app store

# Chat Service

## Setup

Clone the repository:

```bash
git clone <repository-url>

cd BE/chat-service

npm install

npm run start:dev
```

Make sure this is running locally RABBITMQ_URL=amqp://localhost:5672 # RabbitMQ connection URL

Run it using Docker Compose:

```bash
docker-compose up --build
```

Run it using Terraform

First make sure the Terraform is setup on your local system

```bash
docker run -it --rm -v $(pwd):/workspace -w /workspace hashicorp/terraform:latest init
docker run -it --rm -v $(pwd):/workspace -w /workspace hashicorp/terraform:latest apply
```
