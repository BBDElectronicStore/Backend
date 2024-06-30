resource "aws_api_gateway_rest_api" "frontend-electronics-retailer-api" {
  name = "frontend-electronics-retailer-api"
  body = templatefile("${path.module}/../api/fe-electronics-retailer-openapi.yaml", {
    region : local.region
    account : local.account-id
    get-price-lambda-arn : aws_lambda_function.lambda["get-price-lambda"].arn
    get-all-customers-lambda-arn : aws_lambda_function.lambda["get-all-customers-lambda"].arn
    get-all-orders-lambda-arn : aws_lambda_function.lambda["get-all-orders-lambda"].arn
    cognito_user_pool_arn : tolist(data.aws_cognito_user_pools.selected.arns)[0]
  })
  depends_on = [aws_lambda_function.lambda]
}

data "aws_cognito_user_pools" "selected" {
  name = "byte-bazaar"
}


resource "aws_api_gateway_deployment" "frontend-electronics-retailer-api-deployment" {
  rest_api_id = aws_api_gateway_rest_api.frontend-electronics-retailer-api.id


  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.frontend-electronics-retailer-api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "frontend-electronics-retailer-api-stage-prd" {
  deployment_id = aws_api_gateway_deployment.frontend-electronics-retailer-api-deployment.id
  rest_api_id   = aws_api_gateway_rest_api.frontend-electronics-retailer-api.id
  stage_name    = "prd"
}

data "aws_acm_certificate" "fe-cert" {
  domain   = "api.electronics.projects.bbdgrad.com"
  statuses = ["ISSUED"]
}

resource "aws_api_gateway_domain_name" "frontend-electronics-retailer-api-gw-domain-name" {
  domain_name = "api.electronics.projects.bbdgrad.com"

  regional_certificate_arn = data.aws_acm_certificate.fe-cert.arn
  security_policy          = "TLS_1_2"
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}