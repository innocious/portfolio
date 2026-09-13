# Least-privilege automation identity (security review item #1).
#
# The CI/CD user that holds OCI_PRIVATE_KEY must NOT be a tenancy admin. It
# belongs to this group, whose policy is scoped to the portfolio compartment
# and only the resource families it needs: compute, networking, and object
# storage for state. A leaked key is then bounded to this compartment, never a
# whole-tenancy compromise.
#
# NOTE: policies that reference a compartment by name are written at the
# tenancy level; apply this file with a principal that can manage IAM, or lift
# it into a separate bootstrap stack run once by an admin.

variable "automation_group_name" {
  type    = string
  default = "portfolio-automation"
}

variable "compartment_name" {
  type        = string
  description = "Human name of the portfolio compartment, used in the policy statements."
}

resource "oci_identity_group" "automation" {
  compartment_id = var.tenancy_ocid
  name           = var.automation_group_name
  description    = "CI/CD automation for the portfolio backend. Compartment-scoped, not admin."
}

resource "oci_identity_policy" "automation" {
  compartment_id = var.tenancy_ocid
  name           = "portfolio-automation-policy"
  description    = "Least-privilege access for the portfolio automation group."

  statements = [
    "Allow group ${var.automation_group_name} to manage instance-family in compartment ${var.compartment_name}",
    "Allow group ${var.automation_group_name} to manage virtual-network-family in compartment ${var.compartment_name}",
    "Allow group ${var.automation_group_name} to manage object-family in compartment ${var.compartment_name}",
    "Allow group ${var.automation_group_name} to read all-resources in compartment ${var.compartment_name}",
  ]
}
