variable "app_name" {
  type = string
}

variable "app_version" {
  type = string
}

variable "domain_name" {
  type = string
}

variable "gcp_project_id" {
  type = string
}

variable "dns_zone_name" {
  type    = string
  default = null
}

variable "image_registry" {
  type    = string
  default = null
}

variable "region" {
  type    = string
  default = "us-east4"
}
