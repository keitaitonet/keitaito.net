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

resource "aws_route53_record" "apex_txt" {
  provider = aws.shared

  zone_id = data.aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "TXT"
  ttl     = 300

  records = [
    "v=spf1 include:_spf.google.com ~all",
    "google-site-verification=B9IZkEkZVHp4ngYNJDOpcYX_y4qrv2J3ez1SzWKSuD0",
  ]

  allow_overwrite = true
}
