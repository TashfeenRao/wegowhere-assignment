provider "docker" {
  host = "tcp://localhost:2375"  # Docker daemon address
}

# Define your NestJS application Docker image
resource "docker_image" "nestjs_app" {
  name         = "chat-service-chat-service:latest"  # Replace with your image name
  build {
    context    = "./"  # Path to your NestJS app
    dockerfile = "./"  # Path to your Dockerfile
  }
}

# Define your NestJS application Docker container
resource "docker_container" "nestjs_app_container" {
  name  = "nestjs_app"
  image = docker_image.nestjs_app.latest

  ports {
    internal = 3000
    external = 3000
  }

  depends_on = [
    docker_container.rabbitmq  # Ensure NestJS app starts after RabbitMQ
  ]

  restart = "always"
}
