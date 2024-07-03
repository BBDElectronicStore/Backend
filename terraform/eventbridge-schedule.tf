locals {
  // using cron(minutes hours day-of-month month day-of-week year)
  // make it run every 2 minutes starting on the hour
  two_minute_schedule = "cron(0/2 * * * ? *)"
  // using cron(minutes hours day-of-month month day-of-week year)
  // make it run every 1 hour starting on the hour
  hourly_schedule = "cron(0 0/1 * * ? *)"

}


resource "aws_scheduler_schedule" "frequent-scheduler" {
  name = "frequent-scheduler"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = local.two_minute_schedule

  target {
    arn      = aws_lambda_function.lambda["update_price_lambda"].arn
    role_arn = aws_iam_role.scheduler_role.arn
  }
}

resource "aws_scheduler_schedule" "stocks-scheduler" {
  name = "stocks-scheduler"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = local.hourly_schedule

  target {
    arn      = aws_lambda_function.lambda["handle_stocks_lambda"].arn
    role_arn = aws_iam_role.scheduler_role.arn
  }
}

resource "aws_scheduler_schedule" "pay-tax-scheduler" {
  name = "pay-tax-scheduler"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression = local.hourly_schedule

  target {
    arn      = aws_lambda_function.lambda["pay_tax_lambda"].arn
    role_arn = aws_iam_role.scheduler_role.arn
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
