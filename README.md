# Fullstack Template

## Releasing

### Requirements

- Google Cloud CLI
- GitHub CLI

### Steps

1. Make sure gcloud and gh are installed and initialized
2. Set values in infra/inputs.sh
3. Run `./infra/setup.sh`
4. Add outputted records to DNS provider
5. Add any api environment vars/secrets to the api cloud run revision on GCP
