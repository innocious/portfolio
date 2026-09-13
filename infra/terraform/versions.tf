# Terraform + provider pinning, and remote state.
#
# State is kept in an OCI Object Storage bucket via the S3-compatible endpoint.
# The bucket MUST be private (security review item #5): state can contain
# sensitive values in plaintext. Nothing here is a secret; the S3 credentials
# are supplied out-of-band (env: AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY set
# to your OCI Customer Secret Key) and never committed.

terraform {
  required_version = ">= 1.6.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 6.0"
    }
  }

  # Uncomment and fill in once the private bucket exists. Left commented so a
  # fresh clone can `terraform init` locally without the remote backend.
  #
  # backend "s3" {
  #   bucket                      = "portfolio-tfstate"          # a PRIVATE bucket
  #   key                         = "portfolio/terraform.tfstate"
  #   region                      = "us-ashburn-1"
  #   endpoints                   = { s3 = "https://<namespace>.compat.objectstorage.us-ashburn-1.oraclecloud.com" }
  #   skip_region_validation      = true
  #   skip_credentials_validation = true
  #   skip_requesting_account_id  = true
  #   skip_s3_checksum            = true
  #   use_path_style              = true
  # }
}
