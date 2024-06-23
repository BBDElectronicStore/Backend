resource "aws_mq_configuration" "electronics-retailer-config" {
  description    = "Electronics Retailer Config"
  name           = "electronics-retailer-config"
  engine_type    = "RabbitMQ"
  engine_version = "3.11.20"

 #TODO Update this to the correct config
  data = <<DATA
# Default RabbitMQ delivery acknowledgement timeout is 30 minutes in milliseconds
consumer_timeout = 1800000
DATA
}

resource "aws_mq_broker" "electronics-retailer-broker" {
  broker_name = "electronics-retailer-broker"

  configuration {
    id       = aws_mq_configuration.electronics-retailer-config.id
    revision = aws_mq_configuration.electronics-retailer-config.latest_revision
  }

  engine_type        = "RabbitMQ"
  engine_version     = "3.11.20"
  host_instance_type = "mq.t2.micro"
  security_groups    = [aws_security_group.electronics-retailer-rabbitmq-sg.id]

  user {
    username = "ElectronicsRetailerUser"
    password = aws_secretsmanager_secret_version.rabbit-mq-password.secret_string
  }
}

data "aws_secretsmanager_random_password" "rabbit-mq-random-password" {
  password_length = 50
  require_each_included_type = true
}

resource "aws_secretsmanager_secret" "rabbit-mq-password" {
    name = "electronics-retailer-rabbitmq-password"
    description = "Electronics Retailer RabbitMQ Secret"

}

resource "aws_secretsmanager_secret_version" "rabbit-mq-password" {
    secret_id = aws_secretsmanager_secret.rabbit-mq-password.id
    secret_string = data.aws_secretsmanager_random_password.rabbit-mq-random-password.random_password
}

# TODO: Correct this security group
resource "aws_security_group" "electronics-retailer-rabbitmq-sg" {
  name        = "electronics-retailer-rabbitmq-sg"
  description = "Allow all inbound traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = 0
    }
    egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = 0
    }
}