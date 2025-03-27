# Project Name

## Description

A brief description of your project.

## Prerequisites
### 1. node.js / npm
### 2. docker / docker-compose


## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/beatmasta/spinanda-api.git
    cd spinanda-api
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
   - Copy .env.example:
       ```bash
       cp .env.example .env
       ```
   - Update the .env values with your own configuration.

## Running the Project

1. Start the MySQL database using Docker (see: /docker-compose.yml):
    ```bash
    npm run db:start
    ```

2. Run the project:
    ```bash
    npm run start
    ```
   
3. API documentation is accessible via URL: [http://localhost:3000/api](http://localhost:3000/api)


4. To stop the database:
    ```bash
    npm run db:kill
    ```
