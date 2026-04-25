locals {
  name_prefix = "${var.project}-${var.environment}"
}

data "aws_caller_identity" "this" {}

module "static_site" {
  source = "../../modules/static-site"

  name        = "${local.name_prefix}-site"
  bucket_name = "${local.name_prefix}-site-${data.aws_caller_identity.this.account_id}"

  aliases             = [var.domain_name]
  acm_certificate_arn = aws_acm_certificate_validation.site.certificate_arn
}
