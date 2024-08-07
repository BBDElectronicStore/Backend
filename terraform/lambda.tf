locals {
  dist_dir = "../dist"

  certificate_bucket_name = "268644478934-miniconomy-creds"
  username                = module.rds.db_instance_username
  password                = jsondecode(data.aws_secretsmanager_secret_version.db-details.secret_string)["password"]
  port                    = module.rds.db_instance_port
  dbname                  = local.db-name
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
    "update_price_lambda" = {
      handler = "update_price_lambda.handler",
    },

    "get-customer-orders-lambda" = {
      handler = "get_customer_orders_lambda.handler",
    },
    "get-price-lambda" = {
      handler = "get_price_lambda.handler",
    },
    "handle_stocks_lambda" = {
      handler = "handle_stocks_lambda.handler",
    },
    "pay_tax_lambda" = {
      handler = "pay_tax_lambda.handler",
    },
    "zeus_control_lambda" = {
      handler = "zeus_control_lambda.handler",
    },

  }
}

data "aws_secretsmanager_secret_version" "db-details" {
  secret_id = module.rds.db_instance_master_user_secret_arn
}

resource "aws_lambda_function" "lambda" {
  for_each      = local.lambda_list
  function_name = each.key
  timeout       = 60

  # vpc_config {
  #   subnet_ids         = module.vpc.public_subnets
  #   security_group_ids = [module.vpc.default_security_group_id, aws_security_group.rds.id]
  # }
  memory_size = 256
  filename    = "ts_lambda_bundle.zip"
  handler     = "handlers/${each.value.handler}"

  role             = aws_iam_role.terraform_function_role.arn
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "nodejs18.x"

  environment {
    variables = {
      CERT_BUCKET = local.certificate_bucket_name
      DBUSER      = local.username
      DBPASSWORD  = local.password
      DBPORT      = local.port
      DBNAME      = local.dbname
      DBHOST      = module.rds.db_instance_address
    }
  }
}

data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = local.dist_dir
  output_path = "ts_lambda_bundle.zip"
}

resource "aws_lambda_permission" "service-apigw" {
  for_each     = local.lambda_list
  statement_id = "AllowServiceAPIGatewayInvoke"

  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  # source_arn    = "${aws_apigatewayv2_api.electronics-retailer-api.execution_arn}/*/*" // FYI /*/*/* = PER API, /*/* = PER STAGE
  source_arn = "${aws_api_gateway_rest_api.electronics-retailer-api.execution_arn}/*/*" // FYI /*/*/* = PER API, /*/* = PER STAGE
}
resource "aws_lambda_permission" "fe-apigw" {
  for_each      = local.lambda_list
  statement_id  = "AllowFEAPIGatewayInvoke"
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
