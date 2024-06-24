locals {
  dist_dir = "${path.module}/../dist"
  lambda_list = {
    "create-customer-lambda" = {
      name    = "create-order-lambda",
      handler = "create_customer_lambda.handler",
    },
    "create-order-lambda" = {
      name    = "create-order-lambda",
      handler = "create_order_lambda.handler",
    },
    "delete-order-lambda" = {
      name    = "delete-order-lambda",
      handler = "delete_order_lambda.handler",
    },
    "get-customer-lambda" = {
      name    = "get-customer-lambda",
      handler = "get_customer_lambda.handler",
    },
    "get-inventory-lambda" = {
      name    = "get-inventory-lambda",
      handler = "get_inventory_lambda.handler",
    },
    "get-order-lambda" = {
      name    = "get-order-lambda",
      handler = "get_order_lambda.handler",
    },
    "update-customer-lambda" = {
      name    = "update-customer-lambda",
      handler = "update_customer_lambda.handler",
    },
  }
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = local.dist_dir
  output_path = "ts_lambda_bundle.zip"
}



resource "aws_lambda_function" "test_lambda" {
  for_each      = local.lambda_list
  function_name = each.value.name

  memory_size = 256
  filename    = "${locals.dist_dir}/ts_lambda_bundle.zip"
  handler     = each.value.handler



  role             = aws_iam_role.terraform_function_role.arn
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "nodejs18.x"

  environment {
    variables = each.value.environment.variables
  }
}

resource "aws_iam_policy" "lambda-sqs-policy" {
  name = "policy"

  policy = templatefile("${path.module}/policies/lambda-policy.json", {
    REGION     = local.region,
    ACCOUNT    = local.account-id,
    QUEUE_NAME = aws_sqs_queue.electronics-retailer-queue.name,
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
