import psycopg2


def connect_db():
    connection = psycopg2.connect(database="postgres", user='postgres', password='docker', host="localhost", port=5432)
    return connection


def create_table(connection):
    try:
        cursor = connection.cursor()
        create_table_query = '''CREATE TABLE mobile
              (ID INT PRIMARY KEY     NOT NULL,
              MODEL           TEXT    NOT NULL,
              PRICE         REAL); '''

        cursor.execute(create_table_query)
        connection.commit()
        print("Table created successfully in PostgreSQL ")

    except (Exception, psycopg2.DatabaseError) as error:
        print("Error while creating PostgreSQL table", error)


def close_connection(connection):
    # closing database connection.
    if (connection):
        connection.cursor().close()
        connection.close()
        print("PostgreSQL connection is closed")


def insert_table(connection):
    cursor = connection.cursor()

    for item in range(1, 5):
        id = item
        price = item
        model = f"Model {price}"

        query = "INSERT INTO mobile (ID, MODEL, PRICE) VALUES (%s, %s, %s);"
        data = (id, model, price)

        cursor.execute(query, data)
    connection.commit()


def select_table(connection):
    cursor = connection.cursor()

    sql_context = """
    select 
        *
    from 
        mobile
    """

    cursor.execute(sql_context)

    # Fetch all rows from database
    record = cursor.fetchall()

    print("Data from Database:- ", record)


if __name__ == '__main__':
    connection = connect_db()
    insert_table(connection)
    select_table(connection)
    close_connection(connection)


