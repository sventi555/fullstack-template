terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.50.0"
    }
  }

  backend "remote" {
    organization = "sventi555"
    workspaces {
      name = "fullstack-template"
    }
  }
}

provider "google" {
  credentials = file("${path.module}/creds.json")

  project = var.gcp_project_id
}

locals {
  dns_zone_name  = var.dns_zone_name != null ? var.dns_zone_name : replace(var.domain_name, ".", "-")
  image_registry = var.image_registry != null ? var.image_registry : "${var.region}-docker.pkg.dev/${var.gcp_project_id}/${var.app_name}"
}

# SHARED RESOURCES
data "google_iam_policy" "no_auth_policy" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers"
    ]
  }
}

# CLIENT
resource "google_cloud_run_service" "client_run_service" {
  location = var.region
  name     = "${var.app_name}-client"

  template {
    spec {
      containers {
        image = "${local.image_registry}/client:${var.app_version}"
      }
    }
  }
}

resource "google_cloud_run_service_iam_policy" "client_no_auth_policy" {
  location = google_cloud_run_service.client_run_service.location
  service  = google_cloud_run_service.client_run_service.name

  policy_data = data.google_iam_policy.no_auth_policy.policy_data
}

resource "google_cloud_run_domain_mapping" "client_domain_mapping" {
  location = var.region
  name     = var.domain_name
  metadata {
    namespace = var.gcp_project_id
  }
  spec {
    route_name = google_cloud_run_service.client_run_service.name
  }
}

resource "google_dns_record_set" "client_A_record_set" {
  managed_zone = local.dns_zone_name
  name         = "${var.domain_name}."
  type         = "A"
  ttl          = 300
  rrdatas      = [for record in google_cloud_run_domain_mapping.client_domain_mapping.status[0].resource_records : record.rrdata if record.type == "A"]
}

resource "google_dns_record_set" "client_AAAA_record_set" {
  managed_zone = local.dns_zone_name
  name         = "${var.domain_name}."
  type         = "AAAA"
  ttl          = 300
  rrdatas      = [for record in google_cloud_run_domain_mapping.client_domain_mapping.status[0].resource_records : record.rrdata if record.type == "AAAA"]
}

# SERVER
resource "google_cloud_run_service" "server_run_service" {
  location = var.region
  name     = "${var.app_name}-server"

  template {
    spec {
      containers {
        image = "${local.image_registry}/server:${var.app_version}"
      }
    }
  }
}

resource "google_cloud_run_service_iam_policy" "server_no_auth_policy" {
  location = google_cloud_run_service.server_run_service.location
  service  = google_cloud_run_service.server_run_service.name

  policy_data = data.google_iam_policy.no_auth_policy.policy_data
}

resource "google_cloud_run_domain_mapping" "server_domain_mapping" {
  location = var.region
  name     = "api.${var.domain_name}"
  metadata {
    namespace = var.gcp_project_id
  }
  spec {
    route_name = google_cloud_run_service.server_run_service.name
  }
}

resource "google_dns_record_set" "server_CNAME_record_set" {
  managed_zone = local.dns_zone_name
  name         = "api.${var.domain_name}."
  type         = "CNAME"
  ttl          = 300
  rrdatas      = [for record in google_cloud_run_domain_mapping.server_domain_mapping.status[0].resource_records : record.rrdata if record.type == "CNAME"]
}



