# VCN, subnet, and a security list that keeps SSH off the public internet.

resource "oci_core_vcn" "portfolio" {
  compartment_id = var.compartment_ocid
  cidr_blocks    = ["10.0.0.0/16"]
  display_name   = "portfolio-vcn"
  dns_label      = "portfolio"
}

resource "oci_core_internet_gateway" "portfolio" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio.id
  display_name   = "portfolio-igw"
}

resource "oci_core_route_table" "portfolio" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio.id
  display_name   = "portfolio-rt"

  route_rules {
    destination       = "0.0.0.0/0"
    network_entity_id = oci_core_internet_gateway.portfolio.id
  }
}

resource "oci_core_security_list" "portfolio" {
  compartment_id = var.compartment_ocid
  vcn_id         = oci_core_vcn.portfolio.id
  display_name   = "portfolio-sl"

  egress_security_rules {
    protocol    = "all"
    destination = "0.0.0.0/0"
  }

  # SSH: restricted to a single admin CIDR, never 0.0.0.0/0 (item #2). The
  # variable validation refuses an open rule, so this cannot regress silently.
  ingress_security_rules {
    protocol    = "6" # TCP
    source      = var.ssh_ingress_cidr
    description = "SSH from the admin range only"
    tcp_options {
      min = 22
      max = 22
    }
  }

  # HTTP/HTTPS from the world, but only when the demo stack is actually
  # serving. `serve_web = false` (the default) leaves these ports closed.
  dynamic "ingress_security_rules" {
    for_each = var.serve_web ? [80, 443] : []
    content {
      protocol    = "6"
      source      = "0.0.0.0/0"
      description = "Public web (only while the demo is up)"
      tcp_options {
        min = ingress_security_rules.value
        max = ingress_security_rules.value
      }
    }
  }
}

resource "oci_core_subnet" "portfolio" {
  compartment_id             = var.compartment_ocid
  vcn_id                     = oci_core_vcn.portfolio.id
  cidr_block                 = "10.0.1.0/24"
  display_name               = "portfolio-subnet"
  route_table_id             = oci_core_route_table.portfolio.id
  security_list_ids          = [oci_core_security_list.portfolio.id]
  prohibit_public_ip_on_vnic = false
  dns_label                  = "app"
}
