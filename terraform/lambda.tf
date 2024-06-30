locals {
  dist_dir = "../dist"
  lambda_list = {
    "create-order-lambda" = {
      handler = "create_order_lambda.handler",
    },
    "get-all-customers-lambda" = {
      handler = "get_all_customers_lambda.handler",
    },
    "get-all-orders-lambda" = {
      handler = "get_all_orders_lambda.handler",
    },

    "get-customer-orders-lambda" = {
      handler = "get_customer_orders_lambda.handler",
    },
    "get-price-lambda" = {
      handler = "get_item_price_lambda.handler",
    }
  }
}

resource "aws_lambda_function" "lambda" {
  for_each      = local.lambda_list
  function_name = each.key

  vpc_config {
    subnet_ids         = module.vpc.public_subnets
    security_group_ids = [module.vpc.default_security_group_id]
  }
  memory_size = 256
  filename    = "ts_lambda_bundle.zip"
  handler     = "handlers/${each.value.handler}"

  role             = aws_iam_role.terraform_function_role.arn
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "nodejs18.x"
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = local.dist_dir
  output_path = "ts_lambda_bundle.zip"
}

resource "aws_lambda_permission" "service-apigw" {
  for_each      = local.lambda_list
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  # source_arn    = "${aws_apigatewayv2_api.electronics-retailer-api.execution_arn}/*/*" // FYI /*/*/* = PER API, /*/* = PER STAGE
  source_arn = "${aws_api_gateway_rest_api.electronics-retailer-api.execution_arn}/*/*" // FYI /*/*/* = PER API, /*/* = PER STAGE
}
resource "aws_lambda_permission" "fe-apigw" {
  for_each      = local.lambda_list
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  # source_arn    = "${aws_apigatewayv2_api.electronics-retailer-api.execution_arn}/*/*" // FYI /*/*/* = PER API, /*/* = PER STAGE
  source_arn = "${aws_api_gateway_rest_api.frontend-electronics-retailer-api.execution_arn}/*/*" // FYI /*/*/* = PER API, /*/* = PER STAGE
}

resource "aws_iam_policy" "lambda-sqs-policy" {
  name = "policy"

  policy = templatefile("${path.module}/policies/lambda-policy.json", {
    region  = local.region,
    account = local.account-id,
  })
}

data "aws_iam_policy_document" "AWSLambdaTrustPolicy" {
  statement {
    actions = ["sts:AssumeRole"]
    effect  = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "terraform_function_role" {
  name               = "terraform_function_role"
  assume_role_policy = data.aws_iam_policy_document.AWSLambdaTrustPolicy.json
}

resource "aws_iam_role_policy_attachment" "test-attach" {
  role       = aws_iam_role.terraform_function_role.name
  policy_arn = aws_iam_policy.lambda-sqs-policy.arn
  depends_on = [
    aws_iam_role.terraform_function_role
  ]
}
