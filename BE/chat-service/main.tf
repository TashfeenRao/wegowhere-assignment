provider "docker" {
  host = "tcp://localhost:2375"
}

resource "docker_image" "nestjs_app" {
  name         = "chat-service-chat-service:latest"
  build {
    context    = "./"  
    dockerfile = "./"  
  }
}

resource "docker_container" "nestjs_app_container" {
  name  = "nestjs_app"
  image = docker_image.nestjs_app.latest

  ports {
    internal = 3000
    external = 3000
  }

  depends_on = [
    docker_container.rabbitmq 
  ]

  restart = "always"
}
