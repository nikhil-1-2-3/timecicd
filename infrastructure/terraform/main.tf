terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

# -------------------------
# Latest Amazon Linux 2023 AMI
# -------------------------

data "aws_ssm_parameter" "al2023_ami" {
  name = "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
}

# -------------------------
# VPC
# -------------------------

resource "aws_vpc" "timecheck" {
  cidr_block           = "10.20.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "timecheck-vpc"
  }
}

# -------------------------
# Public Subnet 1
# -------------------------

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.timecheck.id
  cidr_block              = "10.20.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "timecheck-public-a"
  }
}

# -------------------------
# Public Subnet 2
# -------------------------

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.timecheck.id
  cidr_block              = "10.20.2.0/24"
  availability_zone       = "ap-south-1b"
  map_public_ip_on_launch = true

  tags = {
    Name = "timecheck-public-b"
  }
}

# -------------------------
# Internet Gateway
# -------------------------

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.timecheck.id

  tags = {
    Name = "timecheck-igw"
  }
}

# -------------------------
# Public Route Table
# -------------------------

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.timecheck.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "timecheck-public-rt"
  }
}

resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

# -------------------------
# ALB Security Group
# -------------------------

resource "aws_security_group" "alb" {
  name   = "timecheck-alb-sg"
  vpc_id = aws_vpc.timecheck.id

  ingress {
    description = "HTTP from Internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "timecheck-alb-sg"
  }
}

# -------------------------
# Backend Security Group
# -------------------------

resource "aws_security_group" "backend" {
  name   = "timecheck-backend-sg"
  vpc_id = aws_vpc.timecheck.id

  ingress {
    description     = "Backend from ALB"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "timecheck-backend-sg"
  }
}

# -------------------------
# IAM Role for EC2
# -------------------------

resource "aws_iam_role" "ec2" {
  name = "timecheck-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Service = "ec2.amazonaws.com"
      }

      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2" {
  name = "timecheck-ec2-profile"
  role = aws_iam_role.ec2.name
}

# -------------------------
# EC2 Backend
# -------------------------

resource "aws_instance" "backend" {
  ami           = data.aws_ssm_parameter.al2023_ami.value
  instance_type = "t3.micro"

  subnet_id = aws_subnet.public_a.id

  vpc_security_group_ids = [
    aws_security_group.backend.id
  ]

  iam_instance_profile = aws_iam_instance_profile.ec2.name

  user_data = <<-EOF
    #!/bin/bash
    dnf update -y
    dnf install -y docker
    systemctl enable docker
    systemctl start docker
    usermod -aG docker ec2-user
  EOF

  tags = {
    Name = "timecheck-backend"
  }
}

# -------------------------
# Application Load Balancer
# -------------------------

resource "aws_lb" "backend" {
  name               = "timecheck-alb"
  load_balancer_type = "application"
  internal           = false

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = [
    aws_subnet.public_a.id,
    aws_subnet.public_b.id
  ]

  tags = {
    Name = "timecheck-alb"
  }
}

# -------------------------
# Target Group
# -------------------------

resource "aws_lb_target_group" "backend" {
  name     = "timecheck-backend-tg"
  port     = 5000
  protocol = "HTTP"
  vpc_id   = aws_vpc.timecheck.id

  health_check {
    path     = "/api/health"
    protocol = "HTTP"
    port     = "5000"

    healthy_threshold   = 2
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
  }

  tags = {
    Name = "timecheck-backend-tg"
  }
}

resource "aws_lb_target_group_attachment" "backend" {
  target_group_arn = aws_lb_target_group.backend.arn
  target_id        = aws_instance.backend.id
  port             = 5000
}

# -------------------------
# ALB Listener
# -------------------------

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.backend.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }
}

# -------------------------
# S3 Frontend
# -------------------------

resource "aws_s3_bucket" "frontend" {
  bucket_prefix = "timecheck-frontend-"

  tags = {
    Name = "timecheck-frontend"
  }
}

# -------------------------
# ECR Backend
# -------------------------

resource "aws_ecr_repository" "backend" {
  name                 = "timecheck-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "timecheck-backend"
  }
}

# -------------------------
# ECR Frontend
# -------------------------

resource "aws_ecr_repository" "frontend" {
  name                 = "timecheck-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "timecheck-frontend"
  }
}

# -------------------------
# Outputs
# -------------------------

output "vpc_id" {
  value = aws_vpc.timecheck.id
}

output "backend_instance_id" {
  value = aws_instance.backend.id
}

output "alb_dns_name" {
  value = aws_lb.backend.dns_name
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "backend_ecr_url" {
  value = aws_ecr_repository.backend.repository_url
}

output "frontend_ecr_url" {
  value = aws_ecr_repository.frontend.repository_url
}
