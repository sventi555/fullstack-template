# SETUP ------------------------------------------------------------------------

dir=$(dirname "$0")

source $dir/inputs.sh

set -o pipefail

# colours
NC='\033[0m'
HL='\033[0;36m'


# CONSTANTS ------------------------------------------------------------------------

gcp_org=360426331249
region=us-east4


# PROJECT ----------------------------------------------------------------------

# create project
echo "Creating project with name $project_name"
gcloud projects create --name=$project_name --organization=$gcp_org --quiet

# get project id
project_id=""

echo "Looking for project id"
while [[ -z "$project_id" ]]; do
  project_id=$(gcloud projects list | grep "$project_name" | awk '{print $1;}')

  if [[ -n "$project_id" ]]; then
    echo "Found project_id: $project_id"
    break
  fi

  echo "Project not found yet... retrying in 5s"
  sleep 5
done

# set default project for cli
echo "Setting default project to $project_id"
gcloud config set project $project_id

# link billing account
echo "Linking billing account"
gcloud billing projects link $project_id --billing-account=$gcp_billing_account


# ARTIFACT REPOSITORIES --------------------------------------------------------

# enable the service
echo "Enabling artifact registry"
gcloud services enable artifactregistry.googleapis.com

# create artifact repository
echo "Creating artifact repository"
gcloud artifacts repositories create $project_name \
  --repository-format=docker --location=$region
gcloud artifacts repositories set-cleanup-policies $project_name \
  --policy=$dir/artifact-policy.json --location=$region


# CLOUD RUN --------------------------------------------------------------------

# enable the service
echo "Enabling cloud run"
gcloud services enable run.googleapis.com

# create client service
echo "Creating client service"
gcloud run deploy client --image=us-docker.pkg.dev/cloudrun/container/hello \
  --region=$region --allow-unauthenticated

# create api service
echo "Creating api service"
gcloud run deploy api --image=us-docker.pkg.dev/cloudrun/container/hello \
  --region=$region --allow-unauthenticated

# create domain mappings
echo "Creating domain mappings"
client_record=$(gcloud beta run domain-mappings create --service=client --domain=$domain \
  --region=us-east4 | grep CNAME)
api_record=$(gcloud beta run domain-mappings create --service=api --domain="api.$domain" \
  --region=us-east4 | grep CNAME)


# SERVICE ACCOUNT --------------------------------------------------------------

echo "Creating service account"
gcloud iam service-accounts create github-actions \
            --display-name="github actions"

service_account=github-actions@$project_id.iam.gserviceaccount.com

echo "Adding roles to service account"
gcloud projects add-iam-policy-binding $project_id \
  --member=serviceAccount:$service_account \
  --role=roles/iam.serviceAccountUser

gcloud projects add-iam-policy-binding $project_id \
  --member=serviceAccount:$service_account \
  --role=roles/artifactregistry.writer

gcloud projects add-iam-policy-binding $project_id \
  --member=serviceAccount:$service_account \
  --role=roles/run.admin

echo "Creating service account key"
gcloud iam service-accounts keys create $dir/key.json --iam-account=$service_account

# GITHUB -----------------------------------------------------------------------

echo "Adding secrets and vars to repository"
gh secret set GCP_CREDS --body "$(cat $dir/key.json | base64)"
gh variable set IMAGE_REGISTRY --body "$region-docker.pkg.dev/$project_id/$project_name"

echo "Creating a release"
gh release create v1.0.0 --title "Version 1.0.0" --notes "Initial release"

# POST-SETUP -------------------------------------------------------------------

echo "\n${HL}ACTION REQUIRED${NC} - Add the following records to your domain:"
echo $client_record
echo $api_record
