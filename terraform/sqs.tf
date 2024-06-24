resource "aws_sqs_queue" "electronics-retailer-queue" {
  name                      = "electronics-retailer-queue"
  delay_seconds             = 90
  max_message_size          = 2048
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  fifo_queue                  = true
  content_based_deduplication = true # Confirm this is correct

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.electronics-retailer-deadletter-queue.arn
    maxReceiveCount     = 4
  })
}

resource "aws_sqs_queue" "electronics-retailer-deadletter-queue" {
  name = "electronics-retailer-deadletter-queue"
}

resource "aws_sqs_queue_redrive_allow_policy" "electronics-retailer-queue-redrive-allow-policy" {
  queue_url = aws_sqs_queue.electronics-retailer-deadletter-queue.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.electronics-retailer-queue.arn]
  })
}
