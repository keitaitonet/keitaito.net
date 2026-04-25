provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Environment = "shared"
      ManagedBy   = "terraform"
    }
  }
}
