locals {
  lambda_list = {
    "test-lambda" = {
      name    = "lambda1",
      handler = "index.handler",
      environment = {
        variables = {
          foo = "bar"
        }
      }
    },
  }
}

resource "aws_iam_role" "electronicsretailer-lambda-iam-role" {
  name               = "electronicsretailer-lambda-iam-role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "" # insert path to lambda function directory
  output_path = "ts_lambda_bundle.zip"
}

resource "aws_lambda_function" "test_lambda" {
  for_each      = local.lambda_list
  function_name = each.key

  memory_size = 256
  filename    = "${path.module}/ts_lambda_bundle.zip"
  handler     = each.value.handler

  role             = aws_iam_role.iam_for_lambda.arn
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "nodejs18.x"

  environment {
    variables = each.value.environment.variables
  }
}
