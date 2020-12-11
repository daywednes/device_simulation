from sqlalchemy import create_engine

user_name = "postgres"
password = "docker"
db_name = "postgres"
port = 5432
host = "localhost"

def create_engine_db():
    db_string = f"postgresql://{user_name}:{password}@{host}:{port}/{db_name}"

    db = create_engine(db_string)
    return db

if __name__ == '__main__':
    db = create_engine_db()

    # Create
    db.execute("DROP TABLE automations_entity")
    db.execute("CREATE TABLE IF NOT EXISTS automations_entity (id Integer, status text, data text, orgid Integer, name text, description text, lastTimeUpdate timestamp, lastTimeStartAutomation timestamp, type Integer)")

    # Delete
    db.execute("DELETE FROM automations_entity")

    # Insert
    db.execute("INSERT INTO automations_entity (id, status, data, orgid, name, description, lastTimeUpdate, lastTimeStartAutomation, type) VALUES (2,'CreatedAutomation', '{\"id\":\"retejs@0.1.0\",\"nodes\":{}}',4, 'sleep', 'automation3', '2020-10-31 17:45:26', '2020-10-29 17:32:35', 0)")
    db.execute(
        "INSERT INTO automations_entity (id, status, data, orgid, name, description, lastTimeUpdate, lastTimeStartAutomation, type) VALUES (1,'CreatedAutomation', '{\"id\":\"retejs@0.1.0\",\"nodes\":{}}',4, 'away', 'automation3', '2020-10-31 17:45:26', '2020-10-29 17:32:35', 0)")
    db.execute("INSERT INTO automations_entity (id, status, data, orgid, name, description, lastTimeUpdate, lastTimeStartAutomation, type) VALUES (3,'CreatedAutomation', '{\"id\":\"retejs@0.1.0\",\"nodes\":{}}',4, 'stay', 'automation3', '2020-10-31 17:45:26', '2020-10-29 17:32:35', 0)")

    db.execute("INSERT INTO automations_entity (id, status, data, orgid, name, description, lastTimeUpdate, lastTimeStartAutomation, type) VALUES (2,'CreatedAutomation', '{\"id\":\"retejs@0.1.0\",\"nodes\":{}}',5, 'sleep', 'automation3', '2020-10-31 17:45:26', '2020-10-29 17:32:35', 0)")
    db.execute(
        "INSERT INTO automations_entity (id, status, data, orgid, name, description, lastTimeUpdate, lastTimeStartAutomation, type) VALUES (1,'CreatedAutomation', '{\"id\":\"retejs@0.1.0\",\"nodes\":{}}',5, 'away', 'automation3', '2020-10-31 17:45:26', '2020-10-29 17:32:35', 0)")


    # Read
    result_set = db.execute("SELECT * FROM automations_entity")
    for r in result_set:
        print(r)

    # Update
    #db.execute("UPDATE films SET title='Some2016Film' WHERE year='2016'")

