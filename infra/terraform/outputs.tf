output "amd_backend_public_ip" {
  value       = var.create_e2_micro ? oci_core_instance.e2_micro[0].public_ip : null
  description = "Public IP of the AMD E2.1.Micro fallback backend."
}

output "arm_backend_public_ip" {
  value       = var.create_a1 && length(oci_core_instance.a1) > 0 ? oci_core_instance.a1[0].public_ip : null
  description = "Public IP of the ARM A1.Flex primary backend (null until capacity is secured)."
}

output "a1_placement" {
  value       = var.create_a1 ? "${local.a1_ad} @ ${var.a1_ocpus} OCPU / ${var.a1_memory_gb} GB" : "disabled"
  description = "Availability domain and size the A1.Flex apply is targeting."
}
