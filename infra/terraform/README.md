# infra/terraform

Terraform for the OCI backend hosts of the portfolio project.

| File | Contents |
| --- | --- |
| `versions.tf` | Terraform (1.5.x) and OCI provider version pins |
| `backend.tf` | Remote state in OCI Object Storage (configured at init) |
| `providers.tf` | OCI provider (API-key auth) |
| `variables.tf` | Inputs + Always-Free guardrails (validated) |
| `images.tf` | AD lookup + per-shape Ubuntu 22.04 image selection |
| `network.tf` | VCN, internet gateway, route table, security list, subnet |
| `compute.tf` | AMD E2.1.Micro + ARM A1.Flex instances |
| `outputs.tf` | Public IPs and A1 placement summary |
| `cloud-init/backend.yaml` | Docker install + host firewall bring-up |

## What it builds

- A public VCN/subnet with SSH + HTTP/HTTPS ingress.
- `portfolio-backend-amd` — the always-available x86 fallback backend.
- `portfolio-backend-arm` — the ARM primary backend, provisioned by the retry
  workflow once Ampere capacity is available.

## Provisioning order

The `oci-provision` workflow applies in phases with `-target` so a capacity
failure on the ARM box never blocks or destroys the rest:

1. `-target=oci_core_instance.e2_micro` → network + AMD backend.
2. `-target=oci_core_instance.a1` in a loop across ADs and OCPU tiers.

See [`../../docs/oci-bootstrap.md`](../../docs/oci-bootstrap.md) for the secrets
and the one-time remote-state bootstrap.

## Free-tier guardrails

Variable validations refuse anything that would leave Always Free: boot volumes
are held to 47–100 GB (two instances stay under the 200 GB ceiling) and the A1
to 1–4 OCPU / 6–24 GB. Do not relax these without re-checking current limits.
