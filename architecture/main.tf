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

# SHARED RESOURCES
data "google_iam_policy" "no_auth_policy" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers"
    ]
  }
}

resource "google_dns_managed_zone" "dns_zone" {
  name     = var.app_name
  dns_name = "${var.domain_name}."
}

# CLIENT
resource "google_cloud_run_service" "client_run_service" {
  location = "us-east4"
  name     = "${var.app_name}-client"

  template {
    spec {
      containers {
        image = "${var.image_registry}/client:${var.app_version}"
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
  location = "us-east4"
  name     = var.domain_name
  metadata {
    namespace = var.gcp_project_id
  }
  spec {
    route_name = google_cloud_run_service.client_run_service.name
  }
}

locals {
  client_dns_types = toset([for record in google_cloud_run_domain_mapping.client_domain_mapping.status[0].resource_records : record.type])
}

locals {
  client_dns_records = {
    for type in local.client_dns_types : type => [for record in google_cloud_run_domain_mapping.client_domain_mapping.status[0].resource_records : record.rrdata if record.type == type]
  }
}

resource "google_dns_record_set" "client_dns_record_set" {
  for_each     = local.client_dns_records
  managed_zone = google_dns_managed_zone.dns_zone.name
  name         = google_dns_managed_zone.dns_zone.dns_name
  type         = each.key
  ttl          = 300
  rrdatas      = each.value
}

# SERVER
resource "google_cloud_run_service" "server_run_service" {
  location = "us-east4"
  name     = "${var.app_name}-server"

  template {
    spec {
      containers {
        image = "${var.image_registry}/server:${var.app_version}"
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
  location = "us-east4"
  name     = "api.${var.domain_name}"
  metadata {
    namespace = var.gcp_project_id
  }
  spec {
    route_name = google_cloud_run_service.server_run_service.name
  }
}

locals {
  server_dns_types = toset([for record in google_cloud_run_domain_mapping.server_domain_mapping.status[0].resource_records : record.type])
}

locals {
  server_dns_records = {
    for type in local.server_dns_types : type => [for record in google_cloud_run_domain_mapping.server_domain_mapping.status[0].resource_records : record.rrdata if record.type == type]
  }
}

resource "google_dns_record_set" "server_dns_record_set" {
  for_each     = local.server_dns_records
  managed_zone = google_dns_managed_zone.dns_zone.name
  name         = "api.${google_dns_managed_zone.dns_zone.dns_name}"
  type         = each.key
  ttl          = 300
  rrdatas      = each.value
}



