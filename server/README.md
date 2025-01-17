# Logistics Backend

Welcome to the Logistics backend application! This backend is built using Node.js, Express, MongoDB, TypeScript, and Docker.

## Table of Contents
- [Introduction](#introduction)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Web Scraping](#web-scraping)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Logistics is a backend application designed to manage three levels of users: Plugo admin, Lami admin, and Lami courier. It provides API endpoints for various operations related to logistics management.

The application utilizes web scraping to extract email data and generate tickets, which are then stored in MongoDB for further processing.

## Getting Started

### Prerequisites

Before running the application, make sure you have the following installed:

- Node.js v18
- Docker
- MongoDB

### Installation

1. Clone this repository:

```bash
git clone -b dev https://gitlab.com/fx-logistics/server.git
cd server
```
### Running the Application
1. Install Dependency
    - npm i
2. To run
    - npm run dev

## Deployment
```dockerfile
docker build --tag "docker.qaaro" . && docker compose up -d
```