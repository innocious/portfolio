data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

# Latest Canonical Ubuntu 22.04 image for the x86 E2.1.Micro shape.
data "oci_core_images" "ubuntu_x86" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = "VM.Standard.E2.1.Micro"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

# Latest Canonical Ubuntu 22.04 image for the aarch64 A1.Flex shape.
data "oci_core_images" "ubuntu_arm" {
  compartment_id           = var.compartment_ocid
  operating_system         = "Canonical Ubuntu"
  operating_system_version = "22.04"
  shape                    = "VM.Standard.A1.Flex"
  sort_by                  = "TIMECREATED"
  sort_order               = "DESC"
}

locals {
  # Honour an explicit pin if provided, else take the newest arch-correct image.
  image_x86 = var.image_ocid_x86 != "" ? var.image_ocid_x86 : data.oci_core_images.ubuntu_x86.images[0].id
  image_arm = var.image_ocid_arm != "" ? var.image_ocid_arm : data.oci_core_images.ubuntu_arm.images[0].id

  # Resolve the 1-based AD number to a concrete AD name, clamped to the region's
  # available domains so an out-of-range retry index wraps instead of erroring.
  ad_count = length(data.oci_identity_availability_domains.ads.availability_domains)
  a1_ad    = data.oci_identity_availability_domains.ads.availability_domains[(var.a1_ad_number - 1) % local.ad_count].name
}
