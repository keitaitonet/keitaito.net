data "aws_iam_policy_document" "blog_prod_route53_writer_assume" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${var.blog_prod_account_id}:root"]
    }
  }
}

data "aws_iam_policy_document" "blog_prod_route53_writer" {
  statement {
    actions = [
      "route53:GetHostedZone",
      "route53:ListResourceRecordSets",
      "route53:ListTagsForResource",
      "route53:ChangeResourceRecordSets",
    ]
    resources = ["arn:aws:route53:::hostedzone/${var.dns_zone_id}"]
  }

  statement {
    actions   = ["route53:GetChange"]
    resources = ["arn:aws:route53:::change/*"]
  }
}

resource "aws_iam_role" "blog_prod_route53_writer" {
  name               = "blog-prod-route53-writer"
  assume_role_policy = data.aws_iam_policy_document.blog_prod_route53_writer_assume.json
}

resource "aws_iam_role_policy" "blog_prod_route53_writer" {
  name   = "route53-write"
  role   = aws_iam_role.blog_prod_route53_writer.id
  policy = data.aws_iam_policy_document.blog_prod_route53_writer.json
}
