# Infrastructure

This directory contains everything needed to deploy this application to GCP as low-cost "Cloud Run" services.

## Bootstrapping

This is literally everything that you need to do in order to get a full production deployment up and running.

1. Create a GCP project (or use a pre-existing one)

2. Copy the _inputs.auto.tfvars.example_ file:
    ```
    cp inputs.auto.tfvars.example inputs.auto.tfvars
    ```

    Fill out `inputs.auto.tfvars` with the appropriate values.

3. Create an "Artifact Registry" in the GCP project.

    Terraform scripts expect the registry to have a name matching the following format:
    ```
    REGION-docker.pkg.dev/GCP_PROJECT_ID/APP_NAME
    ```
    Where:
    - REGION is the default region of the application's resources
    - GCP_PROJECT_ID is what is sounds like, and
    - APP_NAME is the name of this project

    If the registry's name does not follow this convention, then the `IMAGE_REGISTRY` terraform variable will need to be defined in _inputs.auto.tfvars_.

4. Register the domain name being used for the application in  "Cloud Domains".

5. Create a managed DNS zone in "Cloud DNS".

    Terraform scripts expect the DNS zone name to be the domain name with all the dots replaced with dashs.
    For example, if the domain name is _sventi.com_ then the DNS zone should be named _sventi-com_.

    If the DNS zone's name does not follow this convention, then the `DNS_ZONE_NAME` terraform variable will need to be defined in _inputs.auto.tfvars_.

    Set the domain to use Cloud DNS with this zone.

6. Create a service account in GCP (or use a pre-existing one) and obtain a service account key.

    Rename the key to _creds.json_ and put it in this directory (_infrastructure_).

7. If not already completed, go to https://search.google.com/search-console and add the domain as a property.

    Then, go to the property settings and add the service account's email as an owner.

8. Now, we can finally initialize the terraform repository (requires terraform cli to be installed).
    ```
    terraform init
    ```


## Publishing images

Images for the server and client are automatically published to the image registry when a release is made on GitHub.
The repository simply needs to be configured with a GCP service account key and the location of the image registry.

To do this, add a GitHub Actions secret titled `GCP_CREDS` with the contents being a base64 encoded GCP service account key.
Then, add a GitHub Actions variable titled `IMAGE_REGISTRY` with the location of the registry created in the bootstrapping process.

Now, everytime a release is made, two images (one for the client, one for the server) will be published to the artifact registry with the tags being the same as the GitHub release tag.

## Deploying

To deploy a new version of the application, update the `APP_VERSION` variable in _inputs.auto.tfvars_ to a version that has been already been published to the image registry.

Then run:
```
terraform plan
```
then
```
terraform apply
```

Note: for the initial deployment, give it a day or so for the DNS records to kick in.
