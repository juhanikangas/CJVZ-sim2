import mysql.connector as mc
import hashlib

connection = mc.connect(
        host="mysql.metropolia.fi",
        port=3306,
        database="luukal",
        user="luukal",
        password="F3DtKzAp1",
        autocommit=True
    )
cursor = connection.cursor()

def get_airport_data():
    query = "SELECT name, ident, latitude_deg, longitude_deg FROM airport WHERE (type='medium_airport' OR type='large_airport')"
    cursor.execute(query)
    results = cursor.fetchall()

    return results


def create_user(username, password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    query = "SELECT * FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    user_exists = cursor.fetchone()
    
    if user_exists:
        return False
    
    
    
    insert_query = "INSERT INTO users (username, password) VALUES (%s, %s)"
    cursor.execute(insert_query, (username, hashed_password))

    return True


def authenticate_user(username, password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    query = f"SELECT * FROM users WHERE username = %s AND password = %s"
    cursor.execute(query, (username, hashed_password))
    user = cursor.fetchone()

    if user:
        return True

    return False


def get_user_data_db(username):
    query = f"SELECT * FROM users WHERE username = %s"
    cursor.execute(query, (username,))
    user_data = cursor.fetchone()

    if user_data:
        columns = [column[0] for column in cursor.description]
        response = dict(zip(columns, user_data))
        return response
    
    return False


def save_user_data_db(user_data):
    username = user_data.pop("username")

    update_parts = ', '.join([f"{key} = %s" for key in user_data.keys()])

    update_query = f"UPDATE users SET {update_parts} WHERE username = %s"

    values = tuple(user_data.values()) + (username,)
    try: 
        cursor.execute(update_query, values)
        connection.commit()
        return True
    except Exception as e:
        return False
    
def update_stat_db(username, stat, new_value):
    update_query = f"UPDATE users SET {stat} = %s WHERE username = %s"
    try:
        cursor.execute(update_query, (new_value, username))
        connection.commit()
        return True
    except Exception as e:
        print(e)
        return False

    
    






    