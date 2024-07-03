locals {
  // using cron(minutes hours day-of-month month day-of-week year)
  // make it run every 2 minutes starting on the hour
  frequent_expression = "cron(0/2 * * * ? *)"
  // using cron(minutes hours day-of-month month day-of-week year)
  // make it run every 1 hour starting on the hour
  now_and_then_expression = "cron(0 0/1 * * ? *)"


  frequent_lambda_targets = {
    "update-price-lambda" = {
      body = ""
    }
  }

  now_and_then_lambda_targets = {
    "handle-stocks-lambda" = {
      body = ""
    }
  }
}


resource "aws_scheduler_schedule" "frequent-scheduler" {
  name = "frequent-scheduler"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = local.frequent_expression

  dynamic "target" {
    for_each = local.frequent_lambda_targets
    content {
      arn      = aws_lambda_function.lambda[target.key].arn
      role_arn = aws_iam_role.scheduler_role.arn

      input = target.value.body
    }

  }
}

resource "aws_scheduler_schedule" "stocks-scheduler" {
  name = "stocks-scheduler"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = local.now_and_then_expression

  target {
    arn      = aws_lambda_function.lambda["handle-stocks-lambda"].arn
    role_arn = aws_iam_role.scheduler_role.arn
    input    = ""
  }
}

resource "aws_scheduler_schedule" "pay-tax-scheduler" {
  name = "pay-tax-scheduler"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = local.now_and_then_expression

  target {
    arn      = aws_lambda_function.lambda["pay-tax-lambda"].arn
    role_arn = aws_iam_role.scheduler_role.arn
    input    = ""
  }

}

resource "aws_iam_role" "scheduler_role" {
  name = "EventBridgeSchedulerRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "eventbridge_invoke_policy" {
  name = "EventBridgeInvokeLambdaPolicy"
  role = aws_iam_role.scheduler_role.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AllowEventBridgeToInvokeLambda",
        "Action" : [
          "lambda:InvokeFunction"
        ],
        "Effect" : "Allow",
        "Resource" : "*"
      }
    ]
  })
}
