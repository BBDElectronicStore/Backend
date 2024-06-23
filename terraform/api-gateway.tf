resource "aws_api_gateway_rest_api" "electronics-retailer-api" {
  name = "electronics-retailer-api"
  body = templatefile("${path.module}/../api/electronics-retailer-openapi-v0-1-1.yaml", {
    region = local.region
    account = local.account-id
    get-inventory-lambda-arn = # insert lambda arn here
    create-order-lambda-arn = # insert lambda arn here
    get-order-lambda-arn = # insert lambda arn here
    delete-order-lambda-arn = # insert lambda arn here 
    create-customer-lambda-arn = # insert lambda arn here
    get-customer-lambda-arn = # insert lambda arn here
    update-customer-lambda-arn = # insert lambda arn here
  })
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