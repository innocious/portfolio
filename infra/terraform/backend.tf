# Remote state in OCI Object Storage via its S3-compatible API.
#
# The concrete bucket/endpoint/credentials are supplied at `terraform init`
# time through -backend-config flags (see .github/workflows/oci-provision.yml
# and docs/oci-bootstrap.md), so no tenancy-specific values live in version
# control. For a purely local run, comment this block out to fall back to
# local state.
terraform {
  backend "s3" {}
}
