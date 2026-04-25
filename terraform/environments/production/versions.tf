terraform {
  required_version = "~> 1.14"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.40"
    }
  }

  backend "s3" {
    bucket       = "tfstate-181791527365-ap-northeast-1-an"
    key          = "blog/production/terraform.tfstate"
    region       = "ap-northeast-1"
    encrypt      = true
    use_lockfile = true
  }
}
