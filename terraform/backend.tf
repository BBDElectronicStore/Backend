terraform {
  backend "s3" {
    bucket         = "-state" #Insert account ID here
    key            = "backend/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "-state" #Insert account ID here
  }
}
