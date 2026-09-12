locals {
  cloud_init = base64encode(file("${path.module}/cloud-init/backend.yaml"))
}

# AMD fallback backend — Always Free, provisions immediately. Keeps a live
# demo endpoint up regardless of ARM capacity.
resource "oci_core_instance" "e2_micro" {
  count               = var.create_e2_micro ? 1 : 0
  compartment_id      = var.compartment_ocid
  availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
  display_name        = "portfolio-backend-amd"
  shape               = "VM.Standard.E2.1.Micro" # fixed shape: no shape_config

  create_vnic_details {
    subnet_id        = oci_core_subnet.public.id
    assign_public_ip = true
    hostname_label   = "amd"
  }

  source_details {
    source_type             = "image"
    source_id               = local.image_x86
    boot_volume_size_in_gbs = var.boot_volume_gb
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data           = local.cloud_init
  }
}

# ARM primary backend — subject to Always Free capacity. The retry workflow
# steps a1_ad_number and the OCPU/memory tier until placement succeeds.
resource "oci_core_instance" "a1" {
  count               = var.create_a1 ? 1 : 0
  compartment_id      = var.compartment_ocid
  availability_domain = local.a1_ad
  display_name        = "portfolio-backend-arm"
  shape               = "VM.Standard.A1.Flex"

  shape_config {
    ocpus         = var.a1_ocpus
    memory_in_gbs = var.a1_memory_gb
  }

  create_vnic_details {
    subnet_id        = oci_core_subnet.public.id
    assign_public_ip = true
    hostname_label   = "arm"
  }

  source_details {
    source_type             = "image"
    source_id               = local.image_arm
    boot_volume_size_in_gbs = var.boot_volume_gb
  }

  metadata = {
    ssh_authorized_keys = var.ssh_public_key
    user_data           = local.cloud_init
  }

  # A capacity retry changes availability_domain / OCPUs on a not-yet-created
  # instance; once the box exists we do not want a later plan tearing it down
  # to chase a different tier. The retry workflow guards on state for this, and
  # this keeps a stray bare apply from moving a working instance.
  lifecycle {
    ignore_changes = [availability_domain, shape_config[0].ocpus, shape_config[0].memory_in_gbs]
  }
}
