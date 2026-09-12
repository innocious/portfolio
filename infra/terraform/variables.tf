# ---------------------------------------------------------------------------
# OCI API-key authentication (sourced from GitHub secrets as TF_VAR_* in CI)
# ---------------------------------------------------------------------------
variable "tenancy_ocid" {
  type        = string
  description = "OCID of the tenancy (OCI_TENANCY_OCID)."
}

variable "user_ocid" {
  type        = string
  description = "OCID of the IAM user whose API key signs requests (OCI_USER_OCID)."
}

variable "fingerprint" {
  type        = string
  description = "Fingerprint of the uploaded API signing key (OCI_FINGERPRINT)."
}

variable "private_key" {
  type        = string
  sensitive   = true
  description = "PEM contents of the API signing key (OCI_PRIVATE_KEY). Prefer the TF_VAR_private_key env var over a tfvars file."
}

variable "compartment_ocid" {
  type        = string
  description = "Compartment the resources are created in (OCI_COMPARTMENT_OCID)."
}

variable "region" {
  type    = string
  default = "uk-london-1"
}

variable "ssh_public_key" {
  type        = string
  description = "Public key injected for the default 'ubuntu' user (SSH_PUBLIC_KEY)."
}

# ---------------------------------------------------------------------------
# Networking
# ---------------------------------------------------------------------------
variable "vcn_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "subnet_cidr" {
  type    = string
  default = "10.0.1.0/24"
}

# ---------------------------------------------------------------------------
# Free-tier guardrails — do NOT raise these without re-checking Always Free
# limits, or the account starts accruing charges.
# ---------------------------------------------------------------------------
variable "boot_volume_gb" {
  type        = number
  default     = 50
  description = "Per-instance boot volume size. Total across every instance must stay <= 200 GB to remain Always Free."

  validation {
    condition     = var.boot_volume_gb >= 47 && var.boot_volume_gb <= 100
    error_message = "Keep boot volumes between 47 and 100 GB so two instances stay under the 200 GB Always Free block-storage ceiling."
  }
}

# ---------------------------------------------------------------------------
# AMD fallback backend — VM.Standard.E2.1.Micro (x86, Always Free, available now)
# ---------------------------------------------------------------------------
variable "create_e2_micro" {
  type    = bool
  default = true
}

# ---------------------------------------------------------------------------
# ARM primary backend — VM.Standard.A1.Flex (aarch64, capacity-constrained)
# The retry workflow steps a1_ad_number and the OCPU/memory tier until the
# placement succeeds.
# ---------------------------------------------------------------------------
variable "create_a1" {
  type    = bool
  default = true
}

variable "a1_ad_number" {
  type        = number
  default     = 1
  description = "1-based availability domain to place the A1.Flex in. Cycled 1..N by the retry workflow on capacity errors."
}

variable "a1_ocpus" {
  type        = number
  default     = 4
  description = "A1.Flex OCPUs. Always Free ceiling is 4 OCPU total. Stepped down by the retry workflow on repeated capacity errors."

  validation {
    condition     = var.a1_ocpus >= 1 && var.a1_ocpus <= 4
    error_message = "A1.Flex OCPUs must be between 1 and 4 to stay within the Always Free allowance."
  }
}

variable "a1_memory_gb" {
  type    = number
  default = 24

  validation {
    condition     = var.a1_memory_gb >= 6 && var.a1_memory_gb <= 24
    error_message = "A1.Flex memory must be between 6 and 24 GB to stay within the Always Free allowance."
  }
}

# ---------------------------------------------------------------------------
# Optional image pins. Leave empty to auto-select the latest Canonical Ubuntu
# 22.04 image for each shape's architecture (recommended — a single image OCID
# cannot be valid for both the x86 E2 and the ARM A1).
# ---------------------------------------------------------------------------
variable "image_ocid_x86" {
  type    = string
  default = ""
}

variable "image_ocid_arm" {
  type    = string
  default = ""
}
