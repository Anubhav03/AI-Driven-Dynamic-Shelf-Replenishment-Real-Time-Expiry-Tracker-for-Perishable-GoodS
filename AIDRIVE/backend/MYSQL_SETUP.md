# MySQL Setup Guide

## Quick Setup

1. **Install MySQL Server** (if not already installed)
2. **Create the database**:
   ```sql
   CREATE DATABASE shelf_management;
   ```

3. **Create a `.env` file** in the backend directory:
   ```env
   # Database Configuration
   DATABASE_TYPE=mysql
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password_here
   MYSQL_DATABASE=shelf_management

   # Application Settings
   SECRET_KEY=your-secret-key-here
   DEBUG=true
   ```

4. **Run the setup script**:
   ```bash
   python setup_database.py
   ```

5. **Start the backend**:
   ```bash
   uvicorn app.main:app --reload
   ```

## Troubleshooting

- **Connection failed**: Make sure MySQL server is running
- **Access denied**: Check your MySQL username and password
- **Database not found**: Create the `shelf_management` database first
- **Tables not created**: Run `python setup_database.py`

## Testing

Visit `http://localhost:8000/docs` to test the API endpoints. 