resource "aws_api_gateway_rest_api" "electronics-retailer-api" {
  name = "electronics-retailer-api"
  body = templatefile("${path.module}/../api/service-electronics-retailer-openapi.yaml", {
    region : local.region
    account : local.account-id
    get-price-lambda-arn : aws_lambda_function.lambda["get-price-lambda"].arn
    create-order-lambda-arn : aws_lambda_function.lambda["create-order-lambda"].arn
    zeus-control-lambda-arn : aws_lambda_function.lambda["zeus_control_lambda"].arn
  })
  depends_on = [aws_lambda_function.lambda]
}
resource "aws_api_gateway_deployment" "electronics-retailer-api-deployment" {
  rest_api_id = aws_api_gateway_rest_api.electronics-retailer-api.id


  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.electronics-retailer-api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "electronics-retailer-api-stage-prd" {
  deployment_id = aws_api_gateway_deployment.electronics-retailer-api-deployment.id
  rest_api_id   = aws_api_gateway_rest_api.electronics-retailer-api.id
  stage_name    = "prd"
}

data "aws_acm_certificate" "issued" {
  domain   = "service.electronics.projects.bbdgrad.com"
  statuses = ["ISSUED"]
}

resource "aws_api_gateway_domain_name" "electronics-retailer-api-gw-domain-name" {
  domain_name = "service.electronics.projects.bbdgrad.com"

  regional_certificate_arn = data.aws_acm_certificate.issued.arn
  security_policy          = "TLS_1_2"
  mutual_tls_authentication {
    truststore_uri = "s3://miniconomy-trust-store-bucket/truststore.pem"
  }
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}