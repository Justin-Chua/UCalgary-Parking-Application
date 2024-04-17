# CPSC 471 W2024 Parking Project - Group 14
## Group Members
- Arush Sanghal (30118765)
- Justin Chua (30098941)
- Chiehhan Yang (30110238)
## Project Setup
### Back End
0. Make sure that the latest version of MySQL, XAMPP and Redis are installed
1. After installing, navigate to the back_end folder using `back_end`
2. Install the necessary dependencies using the following commands:
    - 2.1. MySQLClient: `pip install mysqlclient`
    - 2.2. Django REST Framework: `pip install djangorestframework djangorestframework-simplejwt`
    - 2.3. Celery: `pip install celery`
    - 2.4. Redis: `pip install redis`
    - 2.5. Eventlet: `pip install eventlet`
3. Ensure that XAMPP is open, and Apache and MySQL are running on port 3306
4. Ensure that models are updated using the command `python manage.py makemigrations` followed by `python manage.py migrate`
5. Run the seeding script to populate database using the command `python manage.py init_db`
6. Ensure that you have four different command prompts/terminals open, with all of them opened in the `back_end` folder
    - First terminal: Use the command `python manage.py runserver` to start the development server for Django
    - Second terminal: Use the command `redis-server` to start the Redis server
    - Third terminal: Use the command `celery -A parking_api.celery worker --loglevel=info -P eventlet` to start a worker for Celery
    - Fourth terminal: Use the command `celery -A parking_api beat -l info` to create a task scheduler for Celery
7. To view the database, navigate to XAMPP Control Panel and click on 'Admin' beside MySQL. The database will open automatically in `localhost/phpmyadmin/`

### Front End
0. Make sure that the latest version of Node.js is installed on your computer
1. After installing Node.js, navigate to the front_end folder using `cd front_end`
2. Install all the necessary dependencies using the following commands:
    - 2.1. React: `npm install react`
    - 2.2. React Routers: `npm install react-router-dom@latest`
    - 2.3. Bootstrap: `npm install bootstrap react-bootstrap`
    - 2.4. Bootstrap Icons: `npm install react-bootstrap-icons`
    - 2.5. Leaflet: `npm install leaflet react-leaflet`
    - 2.6. Axios: `npm install axios`
 3. To start the React application, use the command `npm start`
 4. The application will automatically open in a new browser window, on `localhost:3000`

 
