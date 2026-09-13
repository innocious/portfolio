# All inputs. No value here is a secret; real values live in a gitignored
# terraform.tfvars (see terraform.tfvars.example) or in the environment.

variable "tenancy_ocid" { type = string }
variable "user_ocid" { type = string }
variable "fingerprint" { type = string }
variable "private_key_path" {
  type        = string
  description = "Path to the API signing key PEM. Never commit the key itself."
}
variable "region" {
  type    = string
  default = "us-ashburn-1"
}

variable "compartment_ocid" {
  type        = string
  description = "The portfolio compartment. Everything is scoped here, not to the tenancy root (security review item #1)."
}

# ---- SSH exposure (security review item #2) -------------------------------
# SSH is NOT open to the world. This must be a specific address/range, e.g.
# your home IP as "203.0.113.4/32", or a bastion/VPN CIDR. The validation
# rejects 0.0.0.0/0 outright so an open-to-the-world rule cannot be applied
# by accident.
variable "ssh_ingress_cidr" {
  type        = string
  description = "CIDR allowed to reach port 22. A single /32 is ideal. 0.0.0.0/0 is rejected."

  validation {
    condition     = var.ssh_ingress_cidr != "0.0.0.0/0" && can(cidrhost(var.ssh_ingress_cidr, 0))
    error_message = "ssh_ingress_cidr must be a valid CIDR and must not be 0.0.0.0/0. Restrict SSH to your IP or a VPN/bastion range."
  }
}

variable "ssh_public_key" {
  type        = string
  description = "The authorized public key for the opc user. Key-only auth; password auth is disabled by cloud-init."
}

# Serve HTTP/HTTPS only when the demo stack is actually running. Off by default
# so 80/443 are not open when nothing is listening.
variable "serve_web" {
  type    = bool
  default = false
}

# ---- Free-tier guardrails --------------------------------------------------
variable "a1_ocpus" {
  type    = number
  default = 4
  validation {
    condition     = var.a1_ocpus >= 1 && var.a1_ocpus <= 4
    error_message = "Always Free Ampere A1 allowance is 4 OCPUs total; keep this between 1 and 4."
  }
}

variable "a1_memory_gbs" {
  type    = number
  default = 24
  validation {
    condition     = var.a1_memory_gbs >= 6 && var.a1_memory_gbs <= 24
    error_message = "Always Free Ampere A1 allowance is 24 GB total; keep this between 6 and 24."
  }
}

variable "availability_domain" {
  type        = string
  description = "AD to try first. The capacity-retry workflow cycles the others."
}

variable "image_ocid" {
  type        = string
  description = "OS image OCID for the region (an Always-Free-eligible Oracle Linux build)."
}
