# Project Title

## Overview
This project is designed to interact with the OPEN API, which provides a brief training tip for the user. The data returned from the API is formatted in [JSON/XML], and this README outlines the schema design for the relational database that will store the relevant data.

## API Data Format
- **Data Format**: [JSON/XML]
- **Example Response**:

## Schema Design

### Tables
1. **Users**
   - **Description**: Stores user information.
   - **Columns**:
     - `id` (Primary Key, INT, Auto Increment)
     - `username` (VARCHAR(255), Unique)
     - `password_hash` (VARCHAR(255))
     - `email` (VARCHAR(255), Unique)
     - `created_at` (TIMESTAMP, Default: CURRENT_TIMESTAMP)

2. **Skills**
   - **Description**: Stores skills associated with users.
   - **Columns**:
     - `id` (Primary Key, INT, Auto Increment)
     - `user_id` (Foreign Key, INT, References Users(id))
     - `skill_name` (VARCHAR(255), Not Null)
     - `created_at` (TIMESTAMP, Default: CURRENT_TIMESTAMP)

3. **Api_Responses**
   - **Description**: Stores responses from the API.
   - **Columns**:
     - `id` (Primary Key, INT, Auto Increment)
     - `skill_id` (Foreign Key, INT, References Skills(id))
     - `general_response` (TEXT)
     - `beginner_response` (TEXT)
     - `intermediate_response` (TEXT)
     - `created_at` (TIMESTAMP, Default: CURRENT_TIMESTAMP)

### Relationships
- **Users to Skills**: One-to-Many
  - A user can have multiple skills, but each skill belongs to one user.
  
- **Skills to Api_Responses**: One-to-Many
  - A skill can have multiple API responses, but each response is associated with one skill.


## Constraints
- **Primary Keys**: Each table has a primary key defined.
- **Foreign Keys**: Foreign key constraints are established to maintain referential integrity between tables.
- **Unique Constraints**: The `username` and `email` fields in the Users table are unique.

## Conclusion
This schema design provides a structured way to store and manage data retrieved from the API, ensuring that relationships between users, their skills, and the API responses are well-defined. 


