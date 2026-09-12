# OCI provisioning — bootstrap & secrets

The `oci-provision` workflow provisions the network and both backend hosts, and
keeps retrying the capacity-constrained ARM A1.Flex until Oracle has room for it.
This document covers the one-time setup it depends on.

## Architecture recap

- **Static portfolio** → GitHub Pages, always-on, decoupled from the VMs.
- **AMD `VM.Standard.E2.1.Micro`** (x86, Always Free, available now) → fallback
  backend so there is always a live demo endpoint.
- **ARM `VM.Standard.A1.Flex`** (aarch64, 4 OCPU / 24 GB) → primary backend, kept
  under an automated capacity retry because Ampere is chronically "out of
  capacity" on the free tier.

Everything is sized to stay inside Always Free: two 50 GB boot volumes (100 GB
of the 200 GB free block-storage ceiling) and the A1 capped at 4 OCPU / 24 GB.

## GitHub Actions secrets

### Already set (OCI API-key auth)

| Secret | Purpose |
| --- | --- |
| `OCI_TENANCY_OCID` | Tenancy the API user belongs to |
| `OCI_USER_OCID` | IAM user whose key signs API requests |
| `OCI_FINGERPRINT` | Fingerprint of the uploaded API signing key |
| `OCI_PRIVATE_KEY` | PEM **contents** of the API signing key |
| `OCI_COMPARTMENT_OCID` | Compartment new resources are created in |
| `SSH_PUBLIC_KEY` | Public key injected for the `ubuntu` user |

`OCI_SUBNET_OCID` and `OCI_IMAGE_OCID` from the earlier plan are **not used** by
this configuration:

- Terraform creates its own VCN/subnet, so no pre-existing subnet is needed.
- The image is auto-selected per shape (a single image OCID cannot be valid for
  both the x86 and ARM architectures). `image_ocid_x86` / `image_ocid_arm` exist
  only as optional manual pins.

You can leave those two secrets in place (harmless) or delete them.

### Still needed (remote Terraform state)

A scheduled retry needs Terraform state to persist between runs, which GitHub
Actions does not do on its own. State lives in an OCI Object Storage bucket via
its S3-compatible API. Add these four:

| Secret | Purpose |
| --- | --- |
| `OCI_STATE_BUCKET` | Name of the Object Storage bucket holding the state file |
| `OCI_NAMESPACE` | Your tenancy's Object Storage namespace |
| `OCI_S3_ACCESS_KEY` | Customer Secret Key **access key** (S3 compat) |
| `OCI_S3_SECRET_KEY` | Customer Secret Key **secret** (S3 compat) |

## One-time bootstrap

1. **Find your Object Storage namespace**
   Console → Storage → Buckets (top of the list), or:
   ```bash
   oci os ns get --query data --raw-output
   ```

2. **Create a private state bucket** (Always Free includes 10 GB of Object Storage):
   ```bash
   oci os bucket create --name portfolio-tfstate --compartment-id "$OCI_COMPARTMENT_OCID"
   ```
   Set `OCI_STATE_BUCKET=portfolio-tfstate` and `OCI_NAMESPACE=<namespace>`.

3. **Generate a Customer Secret Key** (this is the S3-compatible credential —
   *not* your API signing key):
   Console → profile → **My profile → Customer secret keys → Generate secret key**.
   Copy the **secret** immediately (shown once) and the generated **access key**.
   Set them as `OCI_S3_SECRET_KEY` and `OCI_S3_ACCESS_KEY`.

Once the bucket exists and all ten secrets are set, run the workflow from the
Actions tab (**Run workflow**), or wait for the 30-minute schedule once this is
on the default branch.

## Local runs

For a laptop run, comment out the `backend "s3"` block in `backend.tf` to use
local state, then:

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars   # fill in your values
export TF_VAR_private_key="$(cat ~/.oci/oci_api_key.pem)"
terraform init
terraform apply
```
