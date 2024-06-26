resource "aws_api_gateway_rest_api" "electronics-retailer-api" {
  name = "electronics-retailer-api"
  body = templatefile("${path.module}/../api/electronics-retailer-openapi-v0-1-1.yaml", {
    region : local.region
    account : local.account-id
    get-inventory-lambda-arn : aws_lambda_function.lambda["get-inventory-lambda"].arn
    create-order-lambda-arn : aws_lambda_function.lambda["create-order-lambda"].arn
    get-order-lambda-arn : aws_lambda_function.lambda["get-order-lambda"].arn
    delete-order-lambda-arn : aws_lambda_function.lambda["delete-order-lambda"].arn
    create-customer-lambda-arn : aws_lambda_function.lambda["create-customer-lambda"].arn
    get-customer-lambda-arn : aws_lambda_function.lambda["get-customer-lambda"].arn
    update-customer-lambda-arn : aws_lambda_function.lambda["update-customer-lambda"].arn
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