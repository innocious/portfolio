# Two hosts, both Always-Free eligible:
#   - an always-available x86 fallback (E2.1.Micro)
#   - the coveted Ampere A1 (created when capacity allows; the retry workflow
#     drives this by re-running apply while cycling ADs / stepping OCPUs down)
#
# Both boot with the same hardening cloud-init and key-only SSH.

locals {
  hardening = file("${path.module}/cloud-init/hardening.cloud-config.yaml")
}

# Always-available x86 fallback.
resource "oci_core_instance" "fallback_x86" {
  compartment_id      = var.compartment_ocid
  availability_domain = var.availability_domain
  display_name        = "portfolio-fallback-x86"
  shape               = "VM.Standard.E2.1.Micro"

  create_vnic_details {
    subnet_id        = oci_core_subnet.portfolio.id
    assign_public_ip = true
  }

  source_details {
    source_type = "image"
    source_id   = var.image_ocid
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data           = base64encode(local.hardening)
  }
}

# Ampere A1. Capacity is scarce; the GitHub Actions retry workflow re-applies
# this while cycling availability_domain and stepping a1_ocpus down until
# Oracle has room. Free-tier ceilings are enforced by the variable validations.
resource "oci_core_instance" "ampere_a1" {
  count               = var.a1_ocpus > 0 ? 1 : 0
  compartment_id      = var.compartment_ocid
  availability_domain = var.availability_domain
  display_name        = "portfolio-ampere-a1"
  shape               = "VM.Standard.A1.Flex"

  shape_config {
    ocpus         = var.a1_ocpus
    memory_in_gbs = var.a1_memory_gbs
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.portfolio.id
    assign_public_ip = true
  }

  source_details {
    source_type = "image"
    source_id   = var.image_ocid
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data           = base64encode(local.hardening)
  }

  # Capacity errors ("Out of host capacity") should fail fast so the retry
  # workflow can cycle to the next AD rather than hanging.
  timeouts {
    create = "10m"
  }
}

output "fallback_public_ip" {
  value = oci_core_instance.fallback_x86.public_ip
}

output "ampere_public_ip" {
  value = try(oci_core_instance.ampere_a1[0].public_ip, null)
}
