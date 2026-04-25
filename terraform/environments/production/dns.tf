resource "aws_route53_record" "apex_a" {
  provider = aws.shared

  zone_id = data.aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = module.static_site.distribution_domain_name
    zone_id                = module.static_site.distribution_hosted_zone_id
    evaluate_target_health = false
  }

  allow_overwrite = true
}

resource "aws_route53_record" "apex_aaaa" {
  provider = aws.shared

  zone_id = data.aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = module.static_site.distribution_domain_name
    zone_id                = module.static_site.distribution_hosted_zone_id
    evaluate_target_health = false
  }

  allow_overwrite = true
}
