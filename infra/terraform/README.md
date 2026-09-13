# Portfolio infrastructure (OCI, Terraform)

The self-hosted backend for the portfolio: an Always-Free OCI footprint with an
always-available x86 fallback and the scarce Ampere A1 provisioned when capacity
allows. The static site never depends on any of this being up.

Security posture is baked into the code, not left to console clicks:

| Risk (see `planning/SECURITY-REVIEW.md`) | How it is enforced here |
|---|---|
| #1 Over-scoped automation user | `iam.tf` puts the CI user in a compartment-scoped group + policy, never tenancy admin |
| #2 SSH open to the world | `ssh_ingress_cidr` validation refuses `0.0.0.0/0`; `cloud-init` disables password/root auth and runs fail2ban |
| #2 Web ports open when idle | `serve_web = false` keeps 80/443 closed until the demo is actually serving |
| #5 Sensitive state in the open | `versions.tf` uses a **private** OCI Object Storage bucket for remote state |
| Free-tier overspend | OCPU/memory validations cap A1 at the Always-Free ceiling |

## Usage

```bash
cp terraform.tfvars.example terraform.tfvars   # gitignored; fill in real values
terraform init      # uncomment the backend block first for remote state
terraform plan
terraform apply
```

The API signing key is referenced by path (`private_key_path`) and is never
committed. In CI, supply every input as `TF_VAR_*` from GitHub Actions secrets.

## Notes

- `iam.tf` writes tenancy-level policy; run it once with an admin principal (or
  as a separate bootstrap), then use the scoped automation user for everything
  else.
- The Ampere A1 host is expected to fail with "Out of host capacity" often; that
  is normal. The capacity-retry workflow re-applies while cycling availability
  domains and stepping OCPUs down.
