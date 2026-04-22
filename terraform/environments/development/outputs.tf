output "site_bucket_name" {
  value = module.static_site.bucket_name
}

output "site_distribution_id" {
  value = module.static_site.distribution_id
}

output "site_url" {
  value = "https://${module.static_site.distribution_domain_name}"
}

output "github_deploy_role_arn" {
  value = aws_iam_role.github_deploy.arn
}
