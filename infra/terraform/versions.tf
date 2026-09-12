terraform {
  # Pinned to the 1.5.x line: the last release whose built-in S3 backend accepts
  # the classic flag set used to point Terraform state at OCI Object Storage.
  required_version = ">= 1.5.0, < 1.6.0"

  required_providers {
    oci = {
      source  = "oracle/oci"
      version = "~> 5.0"
    }
  }
}
